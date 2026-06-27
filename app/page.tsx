"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  X,
  ArrowRight,
  Lock,
  FileSpreadsheet,
  Layers,
  Settings,
  Shield,
  Edit3,
  Clock,
  ArrowUpRight,
  Download,
  User,
  Cpu,
  History,
  RotateCcw,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Eye,
  RefreshCw,
  Bell,
  LogOut,
  ChevronDown,
  ChevronUp,
  Folder,
  BookOpen,
  BarChart2,
  Calendar,
  AlertOctagon,
  Sparkles,
  ArrowLeft,
  MessageSquare
} from "lucide-react"

import { cn } from "@/lib/utils"

// Data structure for the interactive Document Review sections
interface ReviewSection {
  id: string;
  sectionNum: string;
  sectionTitle: string;
  paraTitle?: string;
  content: string;
  confidence: string;
  evidenceCount: string;
  flag: string | null;
  reasoning: string;
  evidence: { title: string; meta: string }[];
  sources: { title: string; type: string; conf: string }[];
  similar: { id: string; title: string; match: string; outcome: string }[];
  comments: { initials: string; author: string; time: string; text: string; bg: string }[];
  confBars: { label: string; pct: string }[];
}

const reviewSectionsData: ReviewSection[] = [
  {
    id: "exec1",
    sectionNum: "01",
    sectionTitle: "Executive summary",
    paraTitle: "Opening summary paragraph",
    content: "On 14 June 2026, cold-chain unit 3 logged a temperature excursion during the overnight hold of Batch PX-2041, a refrigerated drug product. The temperature rose above the validated 8.0 °C limit for approximately 38 minutes, peaking at 10.4 °C at 01:05 IST. Stability testing confirms the batch remains within assay and impurity specifications; the deviation is therefore classified as a storage-condition excursion of high severity, pending disposition.",
    confidence: "96%",
    evidenceCount: "8 documents",
    flag: null,
    reasoning: "I summarised the deviation from the batch record, the sensor trace, and the stability result, then classified severity. I called it high because the excursion breached a validated storage limit - while noting the batch still met specification, the two facts that most shape disposition.",
    evidence: [
      { title: "Deviation report DV-24081", meta: "Quality system · filed 14 Jun" },
      { title: "Sensor temperature trace", meta: "Cold unit 3 · 22:00-02:00" },
      { title: "Stability retest summary", meta: "LIMS · 16 Jun" }
    ],
    sources: [
      { title: "Batch record PX-2041", type: "MES", conf: "96%" },
      { title: "Excursion alarm log", type: "BMS", conf: "95%" },
      { title: "Stability report SR-0612", type: "LIMS", conf: "92%" }
    ],
    similar: [
      { id: "DV-23110", title: "Cold-chain excursion, Line 4", match: "91%", outcome: "Released with deviation" }
    ],
    comments: [
      { initials: "AR", author: "Dr. Anita Rao", time: "8 min ago", text: "Severity classification looks right. Confirm the peak timestamp against BMS before sign-off.", bg: "#2C52F5" }
    ],
    confBars: [
      { label: "Evidence quality", pct: "96%" },
      { label: "Source agreement", pct: "94%" },
      { label: "Data completeness", pct: "92%" }
    ]
  },
  {
    id: "root1",
    sectionNum: "02",
    sectionTitle: "Root cause analysis",
    paraTitle: "Primary root cause",
    content: "The primary root cause is a mechanical failure of the refrigeration valve on cold-chain unit 3, which did not fully close during the compressor cycle and admitted intermittent warm-air ingress. Sensor telemetry shows a 2.4 °C drift consistent with periodic warm-air entry rather than a sustained compressor loss, and the maintenance record confirms the valve assembly was last serviced outside its scheduled interval.",
    confidence: "94%",
    evidenceCount: "6 documents",
    flag: "Maintenance records from 14 June log the valve service at both 14:02 and 16:40. Confirm the correct time before approving this root cause.",
    reasoning: "I weighted the valve-malfunction hypothesis above compressor failure because the sensor pattern shows intermittent warm-air spikes, not a monotonic rise. The CMMS service record and three historical precedents on this line reinforce the mechanical-valve conclusion.",
    evidence: [
      { title: "Valve maintenance record", meta: "CMMS · last service 14 Jun" },
      { title: "Sensor drift analysis", meta: "AI-derived · 2.4 °C intermittent" },
      { title: "Compressor cycle log", meta: "BMS · cycles normal" }
    ],
    sources: [
      { title: "CMMS work order WO-8841", type: "Maintenance", conf: "78%" },
      { title: "Sensor trace (raw)", type: "BMS", conf: "94%" },
      { title: "CAPA-2208 closure", type: "Quality", conf: "89%" }
    ],
    similar: [
      { id: "CAPA-2208", title: "Valve seal intermittent failure", match: "93%", outcome: "Root cause confirmed mechanical" },
      { id: "CAPA-1602", title: "Door-seal drift, cold store 2", match: "81%", outcome: "Preventive interval shortened" }
    ],
    comments: [
      { initials: "AR", author: "Dr. Anita Rao", time: "5 min ago", text: "Agree on the valve. The service-record timestamp conflict needs resolving - see flag.", bg: "#2C52F5" },
      { initials: "JK", author: "J. Kapoor · Eng", time: "2 min ago", text: "Pulling the original work order now.", bg: "#0F766E" }
    ],
    confBars: [
      { label: "Evidence quality", pct: "95%" },
      { label: "Precedent match", pct: "88%" },
      { label: "Cross-source agreement", pct: "96%" },
      { label: "Data completeness", pct: "91%" }
    ]
  },
  {
    id: "root2",
    sectionNum: "02",
    sectionTitle: "Root cause analysis",
    paraTitle: "Contributing factor",
    content: "A contributing factor is the unit's preventive-maintenance cadence, which lagged the revised schedule by 11 days at the time of the event. No operator or process error was identified; alarm acknowledgement followed SOP-114 within the permitted response window.",
    confidence: "88%",
    evidenceCount: "4 documents",
    flag: null,
    reasoning: "Maintenance cadence is a contributing factor, not the proximate cause. I separated it so the CAPA can address the systemic scheduling gap without overstating its role in this specific event.",
    evidence: [
      { title: "PM schedule SCH-114", meta: "11 days overdue at event" },
      { title: "SOP-114 alarm response", meta: "Operator action compliant" }
    ],
    sources: [
      { title: "PM Cadence logs", type: "Calibration", conf: "88%" },
      { title: "Alarm response record", type: "BMS", conf: "90%" }
    ],
    similar: [],
    comments: [],
    confBars: [
      { label: "Evidence quality", pct: "86%" },
      { label: "Schedule data", pct: "90%" },
      { label: "Cross-source agreement", pct: "88%" }
    ]
  },
  {
    id: "impact1",
    sectionNum: "03",
    sectionTitle: "Impact assessment",
    paraTitle: "Product & quality impact",
    content: "Product impact is assessed as low. The affected batch met all release criteria on retest, and accelerated-stability modelling predicts no measurable reduction in shelf life from a single 38-minute excursion at 10.4 °C. Quality impact is contained to Batch PX-2041; no adjacent batches shared the affected unit during the hold window.",
    confidence: "91%",
    evidenceCount: "5 documents",
    flag: null,
    reasoning: "Product impact is low based on direct laboratory validation. I cross-referenced the batch queue to confirm zero bleed-over or adjacent risk in Cold Unit 3.",
    evidence: [
      { title: "Retest assay records", meta: "LIMS · 15 Jun" },
      { title: "Stability chamber records", meta: "QA Vault · 16 Jun" }
    ],
    sources: [
      { title: "Assay verification", type: "LIMS", conf: "95%" },
      { title: "Queue sequence log", type: "MES", conf: "88%" }
    ],
    similar: [],
    comments: [],
    confBars: [
      { label: "Spec completeness", pct: "92%" },
      { label: "Lab alignment", pct: "90%" }
    ]
  },
  {
    id: "capa1",
    sectionNum: "04",
    sectionTitle: "Corrective & preventive actions",
    paraTitle: "Corrective action",
    content: "Replace the refrigeration valve assembly on cold-chain unit 3 and requalify the unit against the validated temperature profile before returning it to GxP service.",
    confidence: "90%",
    evidenceCount: "4 documents",
    flag: null,
    reasoning: "Immediate restoration of compliance boundaries is the primary corrective action. Standard requalification protocols apply.",
    evidence: [
      { title: "Requalification SOP-204", meta: "GxP standard · v4.1" }
    ],
    sources: [
      { title: "Equipment requalification schema", type: "QA", conf: "90%" }
    ],
    similar: [],
    comments: [],
    confBars: [
      { label: "SOP alignment", pct: "95%" }
    ]
  },
  {
    id: "capa2",
    sectionNum: "04",
    sectionTitle: "Corrective & preventive actions",
    paraTitle: "Preventive action",
    content: "Shorten the preventive-maintenance interval for all cold-chain valves on this line and add an automated overdue-calibration alert to the maintenance system to prevent recurrence.",
    confidence: "85%",
    evidenceCount: "3 documents",
    flag: null,
    reasoning: "Addressing the calibration gap prevents recurrence. Overdue alert alerts the team immediately upon 24h lag.",
    evidence: [
      { title: "Alert rule configuration", meta: "CMMS sysadmin · 17 Jun" }
    ],
    sources: [
      { title: "Calibration interval schedule", type: "Maintenance", conf: "85%" }
    ],
    similar: [],
    comments: [],
    confBars: [
      { label: "Prevention factor", pct: "85%" }
    ]
  },
  {
    id: "rec1",
    sectionNum: "05",
    sectionTitle: "Final recommendation",
    paraTitle: "Disposition & sign-off",
    content: "Disposition Batch PX-2041 as released with deviation documented, on the basis that all product-quality specifications were met. Approve the CAPA plan above and schedule an effectiveness review at 90 days. This investigation is ready for Quality Assurance sign-off.",
    confidence: "93%",
    evidenceCount: "7 documents",
    flag: null,
    reasoning: "Release disposition is recommended since active specs remain unimpaired. 90-day review guarantees the valve maintenance holds under operational conditions.",
    evidence: [
      { title: "Deviation release checklist", meta: "CFR-11 validation" }
    ],
    sources: [
      { title: "Disposition guidelines", type: "FDA GxP", conf: "93%" }
    ],
    similar: [],
    comments: [],
    confBars: [
      { label: "Compliance audit rating", pct: "94%" }
    ]
  }
]

export default function Page() {
  // Navigation View Toggle: 
  // "home"             -> Concept B (Command Center Detailed Excursion Chart view)
  // "review"           -> Canvas 4 (Document Review - Klarixa Review.dc.html)
  // "timeline"         -> Canvas 5 (Investigation Timeline - Klarixa Timeline.dc.html)
  // "reconcile"        -> Reconciliation Workspace Screen
  // "revision-summary" -> AI Revision Summary Screen
  // "complete"         -> Investigation Approved & Inspection Package (Final Complete Screen)
  const [viewMode, setViewMode] = useState<"home" | "review" | "timeline" | "reconcile" | "revision-summary" | "complete" | "evidence" | "knowledge" | "reports" | "settings">("home")

  const [activeCaseId, setActiveCaseId] = useState<string>("case-1")
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("MES_Bioreactor_Logs.csv")
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<string>("mech-1")
  const [activeSettingsTab, setActiveSettingsTab] = useState<"profile" | "ai" | "compliance" | "security" | "integrations" | "audit">("profile")
  
  // Interactive states
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>("risk-1")
  const [isConflictResolved, setIsConflictResolved] = useState<boolean>(false)

  // Reconciliation choice state: null, "A", "B", "inconclusive", "evidence"
  const [reconciliationChoice, setReconciliationChoice] = useState<"A" | "B" | "inconclusive" | "evidence" | null>(null)
  const [reconciliationComment, setReconciliationComment] = useState<string>("")

  // Modal / Detailed viewer states
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<any>(null)
  const [showSignModal, setShowSignModal] = useState<boolean>(false)
  const [signatureHash, setSignatureHash] = useState<string>("")
  const [credentials, setCredentials] = useState({ username: "dr.rao@klarixa.ai", pin: "" })
  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [activeChartTab, setActiveChartTab] = useState<"temperature" | "evidence">("temperature")

  // Contextual AI Assistant state
  const [assistantQuery, setAssistantQuery] = useState<string>("")
  const [assistantResponse, setAssistantResponse] = useState<{
    text: string;
    confidence: string;
    evidence: { doc: string; source: string; content: string; }[];
  } | null>(null)

  const handleAskAssistant = (query: string) => {
    setAssistantQuery(query);
    const q = query.toLowerCase();
    
    let text = "";
    let confidence = "";
    let evidence: { doc: string; source: string; content: string; }[] = [];

    if (q.includes("why") || q.includes("choose") || q.includes("reason")) {
      text = "The AI attributed the overnight hold excursion to a faulty refrigeration valve because telemetry data showed a slow, linear temperature increase (from 6.0°C to 10.4°C) starting at 23:45, characteristic of ambient warm air leaking into the chamber rather than a power failure. This is corroborated by the maintenance log showing a worn gasket warning in May.";
      confidence = "94% Confidence";
      evidence = [
        { doc: "Manufacturing Log", source: "Cold Unit 3 Telemetry", content: "Timestamp,Sensor,Reading,Status\n23:45:00,TEMP-B4,6.1°C,NORMAL\n00:30:00,TEMP-B4,8.2°C,WARNING\n01:05:00,TEMP-B4,10.4°C,OUT-OF-SPEC" },
        { doc: "Maintenance Log", source: "Equipment Log", content: "Date,Equipment,Action,Status\n12-May-2026,Cold Unit 3,Gasket Wear Warning,Flagged" }
      ];
    } else if (q.includes("evidence") || q.includes("support")) {
      text = "The core evidence spans three sources: 1) Telemetry showing a 4.4°C deviation over 38 minutes. 2) The maintenance log showing the gasket was flagged for service. 3) The audit checklist showing a missing GxP confirmation signature for the valve inspection on June 14.";
      confidence = "High Certainty";
      evidence = [
        { doc: "Manufacturing Log", source: "Cold Unit 3 Telemetry", content: "Timestamp,Sensor,Reading,Status\n23:45:00,TEMP-B4,6.1°C,NORMAL\n00:30:00,TEMP-B4,8.2°C,WARNING\n01:05:00,TEMP-B4,10.4°C,OUT-OF-SPEC" },
        { doc: "Maintenance Log", source: "Equipment Log", content: "Date,Equipment,Action,Status\n12-May-2026,Cold Unit 3,Gasket Wear Warning,Flagged" },
        { doc: "SOP-882 Audit Checklist", source: "Compliance Folder", content: "Inspection,Status,Inspector,Signed\nValve Seal Check,Incomplete,J. Rao,Unsigned" }
      ];
    } else if (q.includes("missing") || q.includes("information")) {
      text = "The critical missing piece is the validation signature on the valve maintenance sign-off log for June 14. We have a conflicting manual log at 14:02 and an automated sensor log at 16:40. Resolving this discrepancy is required to finalize compliance package closure.";
      confidence = "Action Required";
      evidence = [
        { doc: "Maintenance Log", source: "Equipment Log", content: "Manual Log: Valve maintenance completed at 14:02 (J. Rao)\nSensor Log: Valve cycle calibration completed at 16:40 (Auto)" }
      ];
    } else if (q.includes("graph") || q.includes("explain")) {
      text = "The graph shows a GxP safe storage range highlighted in green (2.0°C - 8.0°C). The temperature stayed normal until 23:45, then spiked above the 8.0°C validated limit, peaking at 10.4°C at 01:05 (red segment). The red shaded vertical area indicates the 38 minutes spent in deviation.";
      confidence = "Telemetry Trace";
      evidence = [
        { doc: "Manufacturing Log", source: "Cold Unit 3 Telemetry", content: "Timestamp,Sensor,Reading,Status\n23:45:00,TEMP-B4,6.1°C,NORMAL\n00:30:00,TEMP-B4,8.2°C,WARNING\n01:05:00,TEMP-B4,10.4°C,OUT-OF-SPEC" }
      ];
    } else if (q.includes("similar") || q.includes("compare") || q.includes("past")) {
      text = "A search of the historical knowledge library identified 2 similar deviations in Q1. Deviation DV-23910 also involved a cold unit temperature excursion caused by worn gaskets, which resolved with a gasket replacement and resulted in zero batch rejection after QA stability testing.";
      confidence = "Historical Match";
      evidence = [
        { doc: "Deviation Record DV-23910", source: "QMS Archive", content: "Deviation Type: Temperature Excursion\nRoot Cause: Gasket Seal Failure\nDisposition: Batch Released" },
        { doc: "Gasket Stability QA Study", source: "QA Library", content: "Product stability maintained for up to 90 minutes at 12°C." }
      ];
    } else {
      if (q.includes("valve") || q.includes("temp") || q.includes("gasket") || q.includes("maintenance") || q.includes("audit") || q.includes("batch")) {
        text = "Regarding the open investigation (DV-24081): The primary issue is a refrigeration valve gasket on Cold Unit 3 that failed to seal properly during the overnight hold on June 14, causing the batch temperature to exceed 8.0°C for 38 minutes. You can reconcile the manual and sensor timestamps via the 'Reconcile' queue.";
        confidence = "Contextual Fit";
        evidence = [
          { doc: "Manufacturing Log", source: "Cold Unit 3 Telemetry", content: "Timestamp,Sensor,Reading,Status\n23:45:00,TEMP-B4,6.1°C,NORMAL\n00:30:00,TEMP-B4,8.2°C,WARNING\n01:05:00,TEMP-B4,10.4°C,OUT-OF-SPEC" }
        ];
      } else {
        text = "This contextual AI assistant only answers questions related to the active deviation investigation (DV-24081). Please ask about the temperature trace, supporting documents, or gasket maintenance.";
        confidence = "Scope Restriction";
        evidence = [];
      }
    }

    setAssistantResponse({ text, confidence, evidence });
  };

  // --- Document Review States (Canvas 4) ---
  const [selectedReviewId, setSelectedReviewId] = useState<string>("root1")
  const [reviewSections, setReviewSections] = useState<ReviewSection[]>(reviewSectionsData)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [newCommentText, setNewCommentText] = useState<string>("")

  // --- Timeline States (Canvas 5) ---
  const [labOpen, setLabOpen] = useState<boolean>(false)

  // Dynamically load Google Fonts (Newsreader for Serif timeline, Geist for UI elements)
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Sync state on case switch
  useEffect(() => {
    setExpandedRiskId(activeCaseId === "case-1" ? "risk-1" : "risk-4")
    setIsConflictResolved(false)
    setSelectedPreviewDoc(null)
    setSignatureHash("")
    setSelectedReviewId("root1")
    setReconciliationChoice(null)
    setReconciliationComment("")
  }, [activeCaseId])

  // Reset simulation
  const handleReset = () => {
    setSignatureHash("")
    setExpandedRiskId("risk-1")
    setSelectedPreviewDoc(null)
    setIsConflictResolved(false)
    setReviewSections(JSON.parse(JSON.stringify(reviewSectionsData)))
    setSelectedReviewId("root1")
    setEditingReviewId(null)
    setLabOpen(false)
    setViewMode("home")
    setReconciliationChoice(null)
    setReconciliationComment("")
  }

  // Handle case approval / signature
  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigning(true)
    setTimeout(() => {
      const generatedHash = "SHA256-VAULT-" + Math.random().toString(36).substring(2, 10).toUpperCase()
      setSignatureHash(generatedHash)
      setIsSigning(false)
      setShowSignModal(false)
      // Switch directly to the final completed inspection package screen!
      setViewMode("complete")
    }, 1000)
  }

  // Handle conflict resolution click
  const resolveConflict = () => {
    setIsConflictResolved(true)
  }

  // Calculate dynamic confidence based on conflict resolution
  const dynamicConfidence = useMemo(() => {
    if (activeCaseId === "case-1" && isConflictResolved) return "98%"
    return "94%"
  }, [activeCaseId, isConflictResolved])

  // Get active review section details
  const activeReviewSection = useMemo(() => {
    return reviewSections.find(s => s.id === selectedReviewId) || reviewSections[0]
  }, [reviewSections, selectedReviewId])

  // Handle comment submit (Document Review Pane)
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentText.trim()) return

    setReviewSections(prev => prev.map(sec => {
      if (sec.id === selectedReviewId) {
        return {
          ...sec,
          comments: [
            ...sec.comments,
            {
              initials: "AR",
              author: "Dr. Anita Rao",
              time: "Just Now",
              text: newCommentText,
              bg: "#2C52F5"
            }
          ]
        }
      }
      return sec
    }))
    setNewCommentText("")
  }

  // Handle inline content editable saves
  const handleSaveText = (id: string, text: string) => {
    setReviewSections(prev => prev.map(sec => {
      if (sec.id === id) {
        return { ...sec, content: text }
      }
      return sec
    }))
    setEditingReviewId(null)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#111827] font-sans antialiased text-[11.5px] select-none">
      
      {/* LEFT COLUMN: Sidebar Navigation (Exact Brand match style) */}
      <aside className="w-[18%] border-r border-neutral-200/40 bg-[#F9FAFB] flex flex-col justify-between flex-shrink-0 select-none">
        <div>
          {/* Logo Header */}
          <div className="h-[90px] pl-2 pr-5 flex items-center select-none">
            <img src="/logo.png" alt="Karixa Logo" className="w-full max-w-[180px] h-auto object-contain object-left" />
          </div>

          {/* Navigation Links */}
          <div className="px-5 py-5 space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#94A3B8] px-3.5 mb-4">
                Workspace
              </div>
              <div className="space-y-2">
                {[
                  { label: "Investigations", active: viewMode !== "evidence" && viewMode !== "knowledge" && viewMode !== "reports" && viewMode !== "settings", count: 3, icon: Search },
                  { label: "Evidence", active: viewMode === "evidence", icon: Folder },
                  { label: "Knowledge", active: viewMode === "knowledge", icon: BookOpen },
                  { label: "Reports", active: viewMode === "reports", icon: BarChart2 },
                  { label: "Settings", active: viewMode === "settings", icon: Settings }
                ].map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.label === "Investigations") {
                          if (viewMode === "evidence" || viewMode === "knowledge" || viewMode === "reports" || viewMode === "settings") {
                            setViewMode("home")
                          } else {
                            const nextCase = activeCaseId === "case-1" ? "case-2" : "case-1"
                            setActiveCaseId(nextCase)
                          }
                        } else if (item.label === "Evidence") {
                          setViewMode("evidence")
                        } else if (item.label === "Knowledge") {
                          setViewMode("knowledge")
                        } else if (item.label === "Reports") {
                          setViewMode("reports")
                        } else if (item.label === "Settings") {
                          setViewMode("settings")
                        }
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 transition-all flex items-center justify-between text-[10px] duration-150 relative",
                        item.active
                          ? "bg-[#EFF2FF] text-[#2C52F5] font-bold border-l-[3px] border-[#2C52F5] rounded-r-xl rounded-l-none shadow-xs"
                          : "text-[#475569] hover:text-neutral-900 hover:bg-neutral-100/50 rounded-xl"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <IconComponent className={cn(
                          "w-3 h-3",
                          item.active ? "text-[#2C52F5]" : "text-[#64748B]"
                        )} />
                        <span className="text-[11.5px]">{item.label}</span>
                      </div>
                      {item.count && (
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border",
                          item.active
                            ? "bg-[#2C52F5] border-transparent text-white"
                            : "bg-white border-[#E2E8F0] text-[#475569]"
                        )}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 space-y-4 border-t border-neutral-100">
          {/* GxP audit mode */}
          <div className="p-4.5 bg-[#F8FAFC]/75 border border-[#E2E8F0]/40 rounded-[14px] space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-[#1E293B]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>GxP audit mode</span>
            </div>
            <p className="text-[11.5px] text-[#64748B] leading-relaxed">
              Every AI step is logged and inspection-ready.
            </p>
          </div>

          {/* User profile and Exit */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#090D1A] flex items-center justify-center font-bold text-[10.5px] text-white tracking-wider">
                AR
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[11.5px] text-[#0F172A] truncate">Dr. Anita Rao</div>
                <div className="text-[11.5px] text-[#94A3B8] truncate">Quality investigator</div>
              </div>
            </div>
            
            <button
              onClick={handleReset}
              className="p-2 text-[#94A3B8] hover:text-[#475569] hover:bg-neutral-50 rounded-xl transition-all"
              title="Reset View"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW CONTROLLER WITH FRAMER MOTION TRANSITIONS */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
        {/* GLOBAL STATIC HEADER */}
        <header className="h-[58px] border-b border-neutral-200 flex-shrink-0 flex items-center justify-between px-6 bg-white z-30 select-none">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-5">
            {viewMode === "home" || viewMode === "review" || viewMode === "timeline" || viewMode === "reconcile" || viewMode === "revision-summary" ? (
              <div className="flex items-center gap-3">
                <span className="font-bold text-[14px] text-neutral-850">
                  {activeCaseId === "case-1" ? "DV-24081" : "DV-24082"}
                </span>
                <div className="w-1 h-1 rounded-full bg-neutral-300" />
                <span className="font-semibold text-[11px] text-neutral-500 uppercase tracking-wider font-mono">
                  Batch {activeCaseId === "case-1" ? "PX-2041" : "PX-9022"}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                <span className="font-bold text-[10px] text-red-650 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-200/40">
                  High Severity
                </span>
                <div className="flex items-center gap-2 bg-[#EFF2FF] border border-[#C0D1FF]/50 rounded-full px-2.5 py-0.5 font-bold text-[#2C52F5] text-[9.5px] ml-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B94FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2C52F5]"></span>
                  </span>
                  <span>AI agent active</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="font-bold text-[14.5px] text-neutral-850">
                  {viewMode === "complete" && "Inspection Deliverables"}
                  {viewMode === "evidence" && "Evidence Library"}
                  {viewMode === "knowledge" && "Knowledge Base"}
                  {viewMode === "reports" && "Executive Reports"}
                  {viewMode === "settings" && "System Settings"}
                </span>
              </div>
            )}
          </div>

          {/* CENTER TABS SWITCHER */}
          <div className="flex bg-[#F4F4F5] border border-neutral-200/40 rounded-xl p-0.5 shadow-xs relative">
            <button
              onClick={() => setViewMode("home")}
              className={cn(
                "px-3.5 py-1 rounded-lg font-bold text-[9.5px] transition-colors relative z-10",
                viewMode === "home" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-850"
              )}
            >
              Command Center
            </button>
            <button
              onClick={() => setViewMode("review")}
              className={cn(
                "px-3.5 py-1 rounded-lg font-bold text-[9.5px] transition-colors relative z-10",
                viewMode === "review" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-850"
              )}
            >
              Document Review
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={cn(
                "px-3.5 py-1 rounded-lg font-bold text-[9.5px] transition-colors relative z-10",
                viewMode === "timeline" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-850"
              )}
            >
              Timeline Story
            </button>
            {isConflictResolved && (
              <button
                onClick={() => setViewMode("revision-summary")}
                className={cn(
                  "px-3.5 py-1 rounded-lg font-bold text-[9.5px] transition-colors relative z-10",
                  viewMode === "revision-summary" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-850"
                )}
              >
                AI Revision Summary
              </button>
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {viewMode === "home" || viewMode === "review" || viewMode === "timeline" || viewMode === "reconcile" || viewMode === "revision-summary" ? (
              <div className="flex items-center gap-2.5">
                <button className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl font-bold text-[11.5px] text-neutral-700 transition-colors shadow-xs flex items-center gap-2 select-none">
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setShowSignModal(true)}
                  className="px-5 py-2 bg-[#2C52F5] hover:bg-[#1E40AF] text-white font-bold rounded-xl text-[11.5px] transition-colors shadow-sm flex items-center gap-2 select-none"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                  <span>Approve investigation</span>
                </button>
              </div>
            ) : viewMode === "complete" ? (
              <div className="flex items-center gap-2">
                <button className="px-3.5 py-1 bg-[#2C52F5] hover:bg-[#1E40AF] text-white font-bold rounded-lg text-[9.5px] shadow-xs">
                  Inspection Mode
                </button>
                <button className="px-3.5 py-1 border border-[#E2E8F0] hover:bg-neutral-50 rounded-lg font-bold text-[9.5px] text-neutral-700 transition-colors shadow-xs">
                  Print Package
                </button>
              </div>
            ) : viewMode === "evidence" ? (
              <div className="flex items-center gap-2">
                <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-lg px-3 py-1 text-[9.5px] font-semibold shadow-xs">
                  Upload evidence
                </button>
              </div>
            ) : viewMode === "knowledge" ? (
              <div className="flex items-center gap-2">
                <button className="bg-[#2C52F5] hover:bg-[#1E40AF] text-white rounded-lg px-4 py-1 text-[9.5px] font-bold shadow-xs">
                  Add Knowledge
                </button>
              </div>
            ) : viewMode === "reports" ? (
              <div className="flex items-center gap-2">
                <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-lg px-3.5 py-1 text-[9.5px] font-bold shadow-xs">
                  Export Report
                </button>
              </div>
            ) : (
              <span className="text-[9.5px] font-mono font-bold text-neutral-400">v1.2.0</span>
            )}
          </div>
        </header>
        <AnimatePresence mode="wait">
          {viewMode === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col min-w-0 overflow-y-auto"
            >
              {/* ============================================================================== */}
              {/* 1. HOME SCREEN: COMMAND CENTER (Detailed telemetry chart view)                 */}
              {/* ============================================================================== */}
              
              

              {/* 5-Card Metrics Row */}
              <div className="px-12 pt-6 grid grid-cols-5 gap-5">
                {/* Card 1: Confidence */}
                <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-5 hover:shadow-xs transition-shadow min-h-[114px] flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-bold tracking-widest text-[#64748B] font-mono">Confidence</div>
                    <div className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">{dynamicConfidence}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold font-mono text-[#64748B]">
                      <span>Strong evidence</span>
                      <span>{dynamicConfidence}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#7B94FF] to-[#2C52F5] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: dynamicConfidence === "98%" ? "98%" : "94%" }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2: Excursion */}
                <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-5 hover:shadow-xs transition-shadow min-h-[114px] flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-bold tracking-widest text-[#64748B] font-mono">Excursion</div>
                    <div className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">38 min</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold font-mono text-red-500">
                      <span>Exceedance duration</span>
                      <span>01:05 Peak</span>
                    </div>
                    <div className="h-5 w-full relative overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="excursionCardSparkline" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 18 Q 20 18, 40 15 Q 60 2, 70 12 Q 80 18, 90 17 L 100 12 L 100 20 L 0 20 Z"
                          fill="url(#excursionCardSparkline)"
                        />
                        <motion.path
                          d="M 0 18 Q 20 18, 40 15 Q 60 2, 70 12 Q 80 18, 90 17 L 100 12"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: "easeInOut" }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Card 3: Peak Temp */}
                <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-5 hover:shadow-xs transition-shadow min-h-[114px] flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-bold tracking-widest text-[#64748B] font-mono">Peak Temp</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">
                        {activeCaseId === "case-1" ? "10.4°C" : "42.0 psi"}
                      </span>
                      <span className="text-[10px] font-bold text-[#EF4444] font-mono">
                        {activeCaseId === "case-1" ? "+2.4°C" : "+2.0 psi"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold font-mono text-[#64748B]">
                      <span>Limit {activeCaseId === "case-1" ? "8.0°C" : "40.0 psi"}</span>
                      <span className="text-red-500 font-extrabold">Exceeded</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden relative">
                      <div className="absolute left-0 top-0 h-full bg-[#2C52F5]" style={{ width: "75%" }} />
                      <div className="absolute left-[75%] top-0 h-full bg-[#EF4444]" style={{ width: "25%" }} />
                    </div>
                  </div>
                </div>

                {/* Card 4: Evidence */}
                <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-5 hover:shadow-xs transition-shadow min-h-[114px] flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-bold tracking-widest text-[#64748B] font-mono">Evidence</div>
                    <div className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">18 docs</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold font-mono text-[#64748B]">
                      <span>5 Sources Sync</span>
                      <span>82% Confidence</span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-full">
                      <div className="flex-1 bg-[#2C52F5] rounded-l-full" />
                      <div className="flex-1 bg-[#2C52F5]" />
                      <div className="flex-1 bg-[#7B94FF]" />
                      <div className="flex-1 bg-[#A3B8FF]" />
                      <div className="flex-1 bg-[#E2E8F0] rounded-r-full" />
                    </div>
                  </div>
                </div>

                {/* Card 5: Progress */}
                <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-5 hover:shadow-xs transition-shadow min-h-[114px] flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase font-bold tracking-widest text-[#64748B] font-mono">Progress</div>
                    <div className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">5 / 6</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold font-mono text-[#64748B]">
                      <span>Checklist Done</span>
                      <span>83%</span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-full">
                      <div className="flex-1 bg-[#0F172A] rounded-l-full" />
                      <div className="flex-1 bg-[#0F172A]" />
                      <div className="flex-1 bg-[#0F172A]" />
                      <div className="flex-1 bg-[#0F172A]" />
                      <div className="flex-1 bg-[#0F172A]" />
                      <div className="flex-1 bg-[#E2E8F0] rounded-r-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Split Content layout */}
              <div className="px-12 py-8 grid grid-cols-12 gap-6 items-start">
                
                {/* Left Main (70%) */}
                <div className="col-span-8 space-y-4">
                  <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5 select-none">
                      <div>
                        <h3 className="text-[11.5px] font-extrabold text-[#0F172A] uppercase tracking-wider">
                          {activeCaseId === "case-1" ? "Sensor temperature - overnight hold" : "Skid Bubble Point Telemetry"}
                        </h3>
                        <span className="text-[11.5px] font-mono text-[#94A3B8] uppercase tracking-tight block mt-1">
                          {activeCaseId === "case-1" ? "Cold unit 3 · Batch PX-2041 · 14 Jun · 22:00-02:00 IST" : "Sterilization Skid FL-9022 · 18 Jun"}
                        </span>
                      </div>
                      <div className="flex border border-neutral-200/50 rounded-xl p-0.5 bg-neutral-50/50 shadow-xs">
                        <button
                          onClick={() => setActiveChartTab("temperature")}
                          className={cn(
                            "px-3.5 py-1.5 text-[10px] font-semibold rounded-lg transition-colors",
                            activeChartTab === "temperature" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-850"
                          )}
                        >
                          Temperature
                        </button>
                        <button
                          onClick={() => setActiveChartTab("evidence")}
                          className={cn(
                            "px-3.5 py-1.5 text-[10px] font-semibold rounded-lg transition-colors",
                            activeChartTab === "evidence" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-850"
                          )}
                        >
                          Evidence confidence
                        </button>
                      </div>
                    </div>

                    <div className="relative pt-6 h-80 select-none">
                      <div className="absolute inset-x-0 top-0 border-t border-neutral-100 flex justify-between text-[10px] text-neutral-400 font-mono pt-1">
                        <span>10°</span>
                      </div>
                      <div className="absolute inset-x-0 top-1/3 border-t border-neutral-100 flex justify-between text-[10px] text-neutral-400 font-mono pt-1">
                        <span>8°</span>
                      </div>
                      <div className="absolute inset-x-0 top-2/3 border-t border-neutral-100 flex justify-between text-[10px] text-neutral-400 font-mono pt-1">
                        <span>6°</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-8 border-b border-neutral-200 flex justify-between text-[10px] text-neutral-400 font-mono pb-1.5">
                        <span>4°</span>
                      </div>

                      <svg className="absolute inset-0 w-full h-[272px]" viewBox="0 0 500 200" preserveAspectRatio="none">
                        {/* 1. GxP Safe Operating Range Background Band (2°C - 8°C) */}
                        <rect x="0" y="67" width="500" height="133" fill="rgba(16, 185, 129, 0.025)" />
                        
                        {/* 2. Excursion Duration Shaded Vertical Band */}
                        <motion.rect
                          x="313"
                          y="67"
                          width="44"
                          height="133"
                          fill="#FEF2F2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.8 }}
                          transition={{ delay: 1, duration: 0.8 }}
                        />

                        {/* 3. Excursion Boundary Guidelines */}
                        <line x1="313" y1="67" x2="313" y2="200" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
                        <line x1="357" y1="67" x2="357" y2="200" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />

                        {/* 4. Validated Limit Line (aligned with Y-Axis 8°C tick) */}
                        <line x1="0" y1="67" x2="500" y2="67" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,3" />

                        {/* 5. Normal Temperature Curve (Blue) */}
                        <motion.path
                          d="M 0 160 Q 50 162, 100 160 Q 150 157, 200 162 Q 250 155, 313 67"
                          fill="none"
                          stroke="#2C52F5"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                        />
                        <motion.path
                          d="M 357 67 Q 380 100, 420 135 L 500 170"
                          fill="none"
                          stroke="#2C52F5"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                        />

                        {/* 6. Excursion Temperature Curve (Red) */}
                        <motion.path
                          d="M 313 67 Q 324 50, 335 40 Q 346 50, 357 67"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.6, duration: 0.6, ease: "easeInOut" }}
                        />

                        {/* 7. Peak Value Indicator Dot */}
                        <motion.circle
                          cx="335"
                          cy="40"
                          r="5"
                          fill="white"
                          stroke="#EF4444"
                          strokeWidth="3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: 1.4 }}
                        />
                      </svg>

                      {/* Labels and Tooltips */}
                      <div className="absolute right-4 top-[56px] text-[10px] font-mono font-bold text-[#EF4444] select-none">
                        VALIDATED MAX 8.0°C
                      </div>
                      
                      <div className="absolute left-4 bottom-[36px] text-[9px] font-mono font-bold text-emerald-600/75 select-none uppercase tracking-wider">
                        Safe GxP Storage Zone (2.0°C - 8.0°C)
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.6 }}
                        className="absolute left-[262px] top-[74px] text-[10px] font-mono font-bold text-[#EF4444] text-center w-32 bg-[#FEF2F2] border border-[#FEE2E2]/60 px-1 py-0.5 rounded shadow-xs"
                      >
                        38 MIN ABOVE LIMIT
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                        className="absolute left-[302px] top-[12px] z-20 flex flex-col items-center select-none"
                      >
                        <div className="bg-[#0F172A] text-white rounded-md px-3 py-1.5 text-[10px] font-mono font-bold shadow-md tracking-tight">
                          10.4°C · 01:05
                        </div>
                      </motion.div>
                      <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 font-mono text-[10px] text-[#94A3B8] pt-2 select-none border-t border-neutral-100">
                        <span>22:00</span>
                        <span>23:00</span>
                        <span>00:00</span>
                        <span>01:00</span>
                        <span>02:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Linked Evidence Table */}
                  <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between select-none">
                      <h3 className="text-[11.5px] font-extrabold text-[#0F172A] uppercase tracking-wider">
                        Linked evidence
                      </h3>
                      <span className="text-[10.5px] font-mono text-neutral-455">
                        18 documents · 5 sources
                      </span>
                    </div>
                    <div className="overflow-hidden border border-neutral-200/60 rounded-xl">
                      <table className="w-full text-[10px] font-mono text-left">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 text-[10.5px] uppercase font-bold">
                            <th className="p-4">Document</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Captured</th>
                            <th className="p-4 text-right">Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-[10.5px] text-neutral-600">
                          {[
                            { doc: "MES_Bioreactor_4_Logs.csv", source: "MES Automation Skid B4", time: "14 Jun 22:15", conf: "96%" },
                            { doc: "LIMS_pH_Verification.pdf", source: "Quality Control Lab #4", time: "14 Jun 22:30", conf: "94%" },
                            { doc: "SOP-204-v5.pdf", source: "Operations Policy Vault", time: "25 May 2025", conf: "91%" },
                            { doc: "DEV-2025-112.pdf", source: "Historical Incidents Log", time: "14 Nov 2025", conf: "89%" }
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                              <td className="p-4 font-semibold text-neutral-808 flex items-center gap-2">
                                <FileText className="w-3 h-3 text-neutral-400" />
                                <span>{row.doc}</span>
                              </td>
                              <td className="p-4">{row.source}</td>
                              <td className="p-4 text-neutral-455">{row.time}</td>
                              <td className="p-4 text-right font-bold text-neutral-900">{row.conf}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-span-4 space-y-4">
                  <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold tracking-widest text-[#64748B] font-mono">
                        AI Proposed Root Cause
                      </span>
                      <p className="text-[11.5px] text-[#0F172A] leading-relaxed mt-4 font-medium">
                        A refrigeration valve failed to fully close during the overnight hold, allowing intermittent warm-air ingress. The resulting instability pushed Batch PX-2041 outside its validated range for ≈38 minutes, producing the specification deviation.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 pt-5 text-center">
                      <div className="space-y-0.5">
                        <div className="text-lg font-bold text-[#0F172A]">Strong</div>
                        <div className="text-[10.5px] text-neutral-400 font-mono">Evidence</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-lg font-bold text-amber-600">Medium</div>
                        <div className="text-[10.5px] text-neutral-400 font-mono">Residual risk</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-lg font-bold text-[#0F172A]">{dynamicConfidence}</div>
                        <div className="text-[10.5px] text-neutral-400 font-mono">Confidence</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-450 font-mono">
                      Investigation Steps
                    </span>
                    <div className="space-y-4 pl-1">
                      {[
                        "Gathered manufacturing logs",
                        "Retrieved laboratory reports",
                        "Reviewed historical deviations",
                        "Compared SOP compliance",
                        "Proposed root cause"
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3.5">
                          <Check className="w-3 h-3 text-[#0F172A] stroke-[2.5]" />
                          <span className="text-[11.5px] font-semibold text-neutral-750">{step}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-3.5">
                        <span className="w-2 h-2 rounded-full bg-[#2C52F5] animate-ping ml-1 mr-1.5" />
                        <span className="text-[11.5px] font-bold text-[#0F172A]">
                          {signatureHash ? "Verification Closed" : "Waiting for investigator approval"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isConflictResolved && (
                    <div className="border border-neutral-200/60 bg-amber-50/15 rounded-2xl p-5 space-y-4 shadow-xs select-none">
                      <div className="flex gap-3.5 items-start">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-neutral-900 leading-none">
                            Action Required: Timestamp Conflict
                          </div>
                          <p className="text-[10px] text-neutral-500 leading-relaxed font-sans mt-1">
                            Maintenance records from 14 June contain conflicting timestamps that should be confirmed before sign-off.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          onClick={() => setViewMode("reconcile")}
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors text-[9.5px] shadow-xs flex items-center gap-1.5 select-none"
                        >
                          <span>Reconcile conflict</span>
                          <ArrowRight className="w-3 h-3 text-white/90" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPreviewDoc({
                              title: "Manufacturing Log",
                              subtitle: "PX-2041 · 14 Jun",
                              content: "Timestamp,Sensor,Reading,Status\n14:00:00,TEMP-B4,37.2°C,NORMAL\n14:15:00,TEMP-B4,38.9°C,WARNING\n14:30:00,TEMP-B4,39.5°C,OUT-OF-SPEC\n14:45:00,TEMP-B4,37.1°C,NORMAL"
                            })
                          }}
                          className="px-4 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold rounded-lg transition-colors text-[9.5px] shadow-xs select-none"
                        >
                          Review logs
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Contextual AI Assistant Card */}
                  <div className="bg-white border border-[#E5E7EB]/80 rounded-2xl p-5 shadow-xs space-y-4 select-none">
                    <div className="flex items-center gap-2">
                      
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] font-mono">
                        Need clarification?
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Input field */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (assistantQuery.trim()) {
                            handleAskAssistant(assistantQuery);
                          }
                        }}
                        className="relative"
                      >
                        <input
                          type="text"
                          value={assistantQuery}
                          onChange={(e) => setAssistantQuery(e.target.value)}
                          placeholder="Ask about this investigation..."
                          className="w-full bg-[#F8FAFC] border border-neutral-200/70 rounded-xl pl-3 pr-8 py-2 text-[10.5px] text-neutral-850 placeholder-neutral-450 focus:outline-none focus:border-[#2C52F5] transition-colors"
                        />
                        <button
                          type="submit"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#2C52F5]"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>

                      {/* Expandable Inline Response Panel */}
                      {assistantResponse && (
                        <div className="bg-[#EFF2FF]/40 border border-[#C0D1FF]/40 border-l-[3px] border-l-[#2C52F5] rounded-r-xl rounded-l-none p-4 space-y-3 text-[10px] relative">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[9px] font-bold font-mono text-[#2C52F5]">
                              
                              <span>AI EXPLANATION</span>
                              <span>·</span>
                              <span className="text-neutral-500 font-normal">{assistantResponse.confidence}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAssistantResponse(null);
                                setAssistantQuery("");
                              }}
                              className="text-neutral-400 hover:text-neutral-600 p-0.5 rounded-full hover:bg-neutral-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <p className="text-neutral-700 leading-relaxed font-sans">{assistantResponse.text}</p>
                          
                          {/* Supporting Evidence List */}
                          {assistantResponse.evidence.length > 0 && (
                            <div className="space-y-1.5 pt-1.5 border-t border-[#C0D1FF]/30">
                              <div className="text-[8.5px] uppercase font-bold tracking-wider text-neutral-450 font-mono">
                                Supporting Evidence
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {assistantResponse.evidence.map((ev) => (
                                  <button
                                    type="button"
                                    key={ev.doc}
                                    onClick={() => {
                                      setSelectedPreviewDoc({
                                        title: ev.doc,
                                        subtitle: ev.source,
                                        content: ev.content
                                      })
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#C0D1FF]/35 rounded text-[9px] text-[#2C52F5] hover:bg-[#EFF2FF] transition-colors font-bold font-mono shadow-2xs"
                                  >
                                    <FileText className="w-2.5 h-2.5" />
                                    <span>{ev.doc}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Suggested Prompts List */}
                      <div className="space-y-1">
                        {[
                          "Why did the AI choose this root cause?",
                          "Show supporting evidence.",
                          "What information is missing?",
                          "Explain this graph.",
                          "Compare with similar investigations."
                        ].map((promptText) => (
                          <button
                            type="button"
                            key={promptText}
                            onClick={() => handleAskAssistant(promptText)}
                            className="w-full text-left text-[9.5px] text-neutral-500 hover:text-[#2C52F5] hover:bg-neutral-50 px-2 py-1 rounded transition-colors flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-neutral-300 flex-shrink-0" />
                            <span>{promptText}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-white select-text overflow-hidden"
            >
              {/* ============================================================================== */}
              {/* 2. DOCUMENT REVIEW: CANVAS 4 (`Klarixa Review.dc.html` replica)               */}
              {/* ============================================================================== */}
              
              

              <div className="flex-1 flex overflow-hidden">
                {/* Left Outline Panel */}
                <nav className="w-[260px] border-r border-neutral-200/40 flex-shrink-0 p-6 overflow-y-auto bg-[#F9FAFB] select-none">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-455 mb-4.5 font-mono">
                    Report contents
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: "exec", key: "exec1", num: "01", label: "Executive summary" },
                      { id: "root", key: "root1", num: "02", label: "Root cause analysis" },
                      { id: "impact", key: "impact1", num: "03", label: "Impact assessment" },
                      { id: "capa", key: "capa1", num: "04", label: "Corrective & preventive" },
                      { id: "rec", key: "rec1", num: "05", label: "Final recommendation" }
                    ].map((item) => {
                      const isActive = activeReviewSection.id.startsWith(item.id) || (item.id === "root" && selectedReviewId.startsWith("root")) || (item.id === "capa" && selectedReviewId.startsWith("capa"))
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedReviewId(item.key)
                            setEditingReviewId(null)
                          }}
                          className={cn(
                            "w-full flex items-baseline gap-3 text-left p-2.5 rounded-lg text-[10px] transition-all",
                            isActive ? "bg-neutral-100 text-neutral-900 font-bold" : "text-neutral-505 hover:text-neutral-909 hover:bg-neutral-50/50"
                          )}
                        >
                          <span className={cn(
                            "font-bold font-mono text-[11.5px]",
                            isActive ? "text-[#2C52F5]" : "text-neutral-300"
                          )}>
                            {item.num}
                          </span>
                          <span className="leading-tight">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="h-px bg-neutral-105 my-6" />

                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-455 mb-4 font-mono">
                    Draft health
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-[10.5px] mb-2">
                        <span className="text-neutral-500">Overall confidence</span>
                        <span className="font-bold text-neutral-900">{dynamicConfidence}</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2C52F5] h-full rounded-full transition-all duration-500"
                          style={{ width: dynamicConfidence }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-[10.5px] font-semibold">
                      <span className="text-neutral-500">Sections approved</span>
                      <span className="text-neutral-900">{signatureHash ? "5 / 5" : "0 / 5"}</span>
                    </div>
                    <div className="flex justify-between text-[10.5px] font-semibold">
                      <span className="text-neutral-500">Needs review</span>
                      <span className={cn("font-bold", isConflictResolved || signatureHash ? "text-emerald-600" : "text-[#B45309]")}>
                        {isConflictResolved || signatureHash ? "0 items" : "1 item"}
                      </span>
                    </div>
                  </div>
                </nav>

                {/* Center Document pane */}
                <main className="flex-1 overflow-y-auto bg-[#F8F9FC] border-r border-neutral-200/40">
                  <div className="max-w-[800px] mx-auto px-12 py-14 space-y-12 pb-32 my-8 bg-white border border-neutral-200/35 rounded-3xl shadow-lg">
                    <div className="space-y-5">
                      <div className="inline-flex items-center gap-2 bg-[#F5F3FF] border border-[#E0E7FF] rounded-full px-3.5 py-1 text-[10px] font-semibold text-[#2C52F5] select-none">
                        
                        <span>{signatureHash ? "Approved & Locked" : "Drafted by Klarixa AI"}</span>
                      </div>
                      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                        Temperature excursion - Batch PX-2041
                      </h1>
                      <p className="text-[10.5px] text-neutral-400 leading-relaxed select-none">
                        Investigation report · Approved 14 June 2026, 17:30 IST · Version 4 · Signed by Dr. Anita Rao
                      </p>
                    </div>

                    <div className="h-px bg-neutral-200/80 my-4" />

                    {reviewSections.map((sec, idx) => {
                      const isSelected = selectedReviewId === sec.id
                      const isEditing = editingReviewId === sec.id
                      const showHeader = idx === 0 || reviewSections[idx - 1].sectionNum !== sec.sectionNum

                      // Dynamic resolved values for Root Cause
                      let contentToRender = sec.content;
                      if ((isConflictResolved || signatureHash) && sec.id === "root1") {
                        contentToRender = "The primary root cause is a mechanical failure of the refrigeration valve on cold-chain unit 3, which did not fully close during the compressor cycle and admitted intermittent warm-air ingress. Sensor telemetry shows a 2.4 °C drift consistent with periodic warm-air entry, and CMMS maintenance work order WO-8841 confirms the valve assembly service was completed at 14:02 IST, prior to the temperature peak."
                      }

                      return (
                        <div key={sec.id} className="space-y-4">
                          {showHeader && (
                            <div className="flex items-baseline gap-3.5 pt-6 select-none">
                              <span className="font-mono text-[10px] font-bold text-neutral-300">{sec.sectionNum}</span>
                              <h2 className="text-[19px] font-bold text-neutral-900 tracking-tight">{sec.sectionTitle}</h2>
                            </div>
                          )}

                          <motion.div
                            layout="position"
                            onClick={() => setSelectedReviewId(sec.id)}
                            className={cn(
                              "group rounded-r-xl border-l-2 p-4 transition-all duration-200 cursor-pointer -mx-5 px-5 relative",
                              isSelected ? "border-[#2C52F5] bg-[#FAFAFE] shadow-xs" : "border-transparent hover:bg-neutral-50/50"
                            )}
                          >
                            {sec.paraTitle && (
                              <div className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-2 font-mono select-none">
                                {sec.paraTitle}
                              </div>
                            )}

                            {isEditing ? (
                              <textarea
                                defaultValue={contentToRender}
                                onBlur={(e) => handleSaveText(sec.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    handleSaveText(sec.id, e.currentTarget.value)
                                  }
                                }}
                                className="w-full text-[10px] leading-relaxed text-neutral-805 bg-white border border-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#2C52F5] font-sans"
                                autoFocus
                              />
                            ) : (
                              <p className={cn(
                                "leading-relaxed text-neutral-850 font-medium",
                                sec.id === "rec1" ? "text-[19.5px] text-neutral-900 font-normal" : "text-[17px]"
                              )}>
                                {contentToRender}
                                <span className="inline-flex items-center justify-center font-bold text-[10.5px] text-[#2C52F5] bg-[#EEF2FF] rounded px-1 ml-1.5 cursor-pointer font-sans select-none vertical-super">
                                  {idx + 1}
                                </span>
                              </p>
                            )}

                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex items-center gap-4 mt-4 select-none text-[10px] text-neutral-400 overflow-hidden"
                                >
                                  <span className="inline-flex items-center gap-1 text-[#2C52F5] font-semibold">
                                    
                                    <span>AI generated</span>
                                  </span>
                                  <span>{dynamicConfidence} confidence</span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                                  <span>{sec.evidenceCount}</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      )
                    })}

                    <div className="border-t border-neutral-200 pt-8 mt-12 flex items-center gap-4 select-none">
                      {signatureHash ? (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4 w-full">
                          <Shield className="w-5 h-5 text-emerald-600" />
                          <div className="text-[10px]">
                            <div className="font-bold text-emerald-800">Approved & Locked via 21 CFR Part 11 electronic signature.</div>
                            <div className="text-[10px] text-emerald-600 mt-0.5 font-mono truncate">{signatureHash}</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              if (signatureHash) return
                              setShowSignModal(true)
                            }}
                            className="bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl px-6 py-2 text-[11.5px] font-bold shadow-xs transition-colors"
                          >
                            Approve Final Investigation
                          </button>
                          <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-705 rounded-xl px-5 py-2 text-[11.5px] font-semibold shadow-xs transition-colors">
                            Request AI revision
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </main>

                {/* Right Context Rail */}
                <aside className="w-[420px] border-l border-neutral-200 flex-shrink-0 overflow-y-auto bg-[#FCFCFD]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedReviewId}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="divide-y divide-neutral-200/60"
                    >
                      <div className="p-6 select-none">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-455 mb-2 font-mono">
                          Reviewing
                        </div>
                        <div className="font-bold text-neutral-900 text-lg tracking-tight mb-1">
                          {activeReviewSection.sectionNum} · {activeReviewSection.sectionTitle}
                        </div>
                        <div className="text-[10.5px] text-neutral-455 font-mono">
                          {activeReviewSection.paraTitle}
                        </div>
                      </div>

                      <div className="p-6 space-y-4 select-none">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-neutral-455 font-mono">
                          <span>Confidence breakdown</span>
                          <span className="text-neutral-900 text-xl font-extrabold normal-case">
                            {dynamicConfidence}
                          </span>
                        </div>
                        <div className="space-y-3.5 font-mono">
                          {activeReviewSection.confBars.map((bar, i) => (
                            <div key={i} className="text-[10px]">
                              <div className="flex justify-between mb-1.5 text-neutral-600 text-[10.5px]">
                                <span>{bar.label}</span>
                                <span className="font-semibold text-neutral-400">{bar.pct}</span>
                              </div>
                              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="bg-[#2C52F5] h-full rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: i === 0 && (isConflictResolved || signatureHash) ? "98%" : bar.pct }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-455 font-mono select-none">
                          
                          <span>AI reasoning</span>
                        </div>
                        <p className="text-[11.5px] leading-relaxed text-neutral-700 font-sans">
                          {(isConflictResolved || signatureHash) && activeReviewSection.id === "root1"
                            ? "I confirmed the corrected maintenance timestamp from CMMS Work Order WO-8841 (14:02 IST) after reconciliation, indicating service took place before the temperature excursion. Residual uncertainty decreased from 6% to 2%."
                            : activeReviewSection.reasoning
                          }
                        </p>
                      </div>

                      {activeReviewSection.evidence.length > 0 && (
                        <div className="p-6 space-y-5">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-neutral-455 font-mono select-none">
                            <span>Supporting evidence</span>
                            <span className="text-neutral-500 font-bold">
                              {isConflictResolved || signatureHash ? "9 documents" : activeReviewSection.evidenceCount}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {activeReviewSection.evidence.map((ev, i) => (
                              <div
                                key={i}
                                onClick={() => {
                                  setSelectedPreviewDoc({
                                    title: ev.title,
                                    subtitle: ev.meta,
                                    content: "Raw GxP compliant document record. Reference: " + ev.title + "\nTimestamp checked. Verification confirmed."
                                  })
                                }}
                                className="flex items-start gap-3.5 p-2.5 hover:bg-neutral-100/50 rounded-xl cursor-pointer transition-colors"
                              >
                                <FileText className="w-3 h-3 text-neutral-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0 font-sans">
                                  <div className="font-semibold text-neutral-855 text-[10.5px] truncate leading-tight">{ev.title}</div>
                                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{ev.meta}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </aside>
              </div>
            </motion.div>
          )}

          {viewMode === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-[#F8F9FC] select-text overflow-y-auto"
            >
              {/* ============================================================================== */}
              {/* 3. TIMELINE STORY VIEW: CANVAS 5 (`Klarixa Timeline.dc.html` replica)          */}
              {/* ============================================================================== */}
              
              

              <div className="flex-1 flex justify-center px-12 py-14 gap-20">
                <motion.article
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.15 } }
                  }}
                  className="max-w-[800px] flex-1 pb-32"
                >
                  <div className="mb-16 select-none">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono mb-4">
                      Deviation investigation · DV-24081
                    </div>
                    <h1 className="text-neutral-905 font-medium tracking-tight leading-tight mb-6" style={{ fontFamily: "Newsreader, serif", fontSize: "46px" }}>
                      A temperature excursion during the overnight hold of Batch PX-2041.
                    </h1>
                    <p className="text-[#4B5563] leading-relaxed mb-7 font-normal" style={{ fontFamily: "Newsreader, serif", fontSize: "21px" }}>
                      Over four hours, the AI agent reconstructed what happened - gathering logs, tracing the sensor record, weighing historical precedent, and proposing a root cause. Here is the investigation, in order.
                    </p>
                    
                    <div className="flex items-center gap-4 flex-wrap text-[10px] text-neutral-455 font-mono">
                      <span className="text-[#B91C1C] font-semibold">High severity</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                      <span>{dynamicConfidence} confidence</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                      <span>{isConflictResolved || signatureHash ? "19" : "18"} linked documents</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                      <span>Opened 2 hours ago</span>
                    </div>
                  </div>

                  <div className="relative border-l border-neutral-200/70 ml-24 pl-12 space-y-14">
                    {/* Event 1 */}
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="relative">
                      <div className="absolute left-[-184px] top-1 text-right w-28 select-none font-mono">
                        <div className="font-bold text-neutral-900 text-[11.5px]">23:58</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">14 Jun</div>
                      </div>
                      <span className="absolute left-[-60px] top-0 w-6 h-6 rounded-full bg-white border border-[#DC2626] flex items-center justify-center shadow-xs">
                        <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
                      </span>
                      <div className="space-y-4">
                        <h2 className="text-neutral-955 font-medium tracking-tight" style={{ fontFamily: "Newsreader, serif", fontSize: "26px" }}>
                          Excursion detected
                        </h2>
                        <p className="text-[11.5px] leading-relaxed text-neutral-700">
                          Cold unit 3 reported temperatures rising past the validated 8.0°C ceiling. The reading peaked at 10.4°C at 01:05 and stayed above limit for roughly 38 minutes before recovering.
                        </p>
                        <div className="border border-neutral-200 rounded-2xl p-6 bg-white shadow-xs">
                          <div className="flex justify-between items-center text-[10px] font-semibold mb-4 select-none">
                            <span className="text-neutral-900">Sensor temperature trace</span>
                            <span className="text-neutral-400 font-mono">22:00 - 02:00 IST</span>
                          </div>
                          
                          <div className="relative pt-4 h-48">
                            <svg className="w-full h-[150px]" viewBox="0 0 500 120" preserveAspectRatio="none">
                              <rect x="0" y="20" width="500" height="50" fill="#FCF4F4" />
                              <line x1="0" y1="110" x2="500" y2="110" stroke="#E5E7EB" strokeWidth="1" />
                              <line x1="0" y1="70" x2="500" y2="70" stroke="#DC2626" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
                              <path d="M 320 70 Q 350 40, 375 20 Q 400 40, 410 70 Z" fill="#DC2626" opacity="0.08" />
                              <motion.path
                                d="M 0 100 Q 50 101, 100 99 Q 150 96, 200 100 Q 250 95, 290 85 Q 320 70, 350 40 Q 375 20, 400 40 Q 410 70 Q 430 85, 460 98 L 500 102"
                                fill="none"
                                stroke="#2C52F5"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.2, ease: "easeInOut" }}
                              />
                              <circle cx="375" cy="20" r="3.5" fill="white" stroke="#DC2626" strokeWidth="2.2" />
                            </svg>
                            <div className="absolute right-2 top-[80px] text-[10px] font-mono font-bold text-[#EF4444] select-none">
                              VALIDATED MAX 8.0°
                            </div>
                            <div className="absolute left-[370px] top-1 bg-neutral-900 text-white rounded px-2 py-0.5 text-[10px] font-mono font-bold shadow select-none">
                              10.4° · 01:05
                            </div>
                            <div className="flex justify-between border-t border-neutral-100 pt-1 text-[10.5px] font-mono text-neutral-400 select-none mt-1">
                              <span>22:00</span>
                              <span>00:00</span>
                              <span>02:00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Event 2 */}
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="relative">
                      <div className="absolute left-[-184px] top-1 text-right w-28 select-none font-mono">
                        <div className="font-bold text-neutral-905 text-[11.5px]">00:05</div>
                      </div>
                      <span className="absolute left-[-60px] top-0 w-6 h-6 rounded-full bg-[#090D1A] flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <div className="space-y-4">
                        <h2 className="text-neutral-905 font-medium tracking-tight" style={{ fontFamily: "Newsreader, serif", fontSize: "26px" }}>
                          Gathered manufacturing logs
                        </h2>
                        <p className="text-[11.5px] leading-relaxed text-neutral-700 font-sans">
                          Pulled the batch record and equipment activity for the hold window from the MES and maintenance systems, then aligned them to the sensor timeline.
                        </p>
                      </div>
                    </motion.div>

                    {/* Event 3 */}
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="relative">
                      <div className="absolute left-[-184px] top-1 text-right w-28 select-none font-mono">
                        <div className="font-bold text-neutral-905 text-[11.5px]">00:12</div>
                      </div>
                      <span className="absolute left-[-60px] top-0 w-6 h-6 rounded-full bg-[#090D1A] flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <div className="space-y-4">
                        <h2 className="text-neutral-905 font-medium tracking-tight" style={{ fontFamily: "Newsreader, serif", fontSize: "26px" }}>
                          Retrieved laboratory reports
                        </h2>
                        <p className="text-[11.5px] leading-relaxed text-neutral-700">
                          The stability report confirms the batch remained within assay and impurity limits, but flags the storage-condition deviation for formal investigation.
                        </p>
                      </div>
                    </motion.div>

                    {/* Event 4 */}
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="relative">
                      <div className="absolute left-[-184px] top-1 text-right w-28 select-none font-mono">
                        <div className="font-bold text-neutral-905 text-[11.5px]">00:20</div>
                      </div>
                      <span className="absolute left-[-60px] top-0 w-6 h-6 rounded-full bg-[#090D1A] flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <div className="space-y-4 font-sans">
                        <h2 className="text-neutral-905 font-medium tracking-tight" style={{ fontFamily: "Newsreader, serif", fontSize: "26px" }}>
                          Reviewed historical deviations
                        </h2>
                        <p className="text-[11.5px] leading-relaxed text-neutral-700 font-sans">
                          Three prior cold-chain events on this line resolved to mechanical valve faults. The closest precedent, CAPA-2208, describes the same intermittent-seal failure mode.
                        </p>
                      </div>
                    </motion.div>

                    {/* Event 5 */}
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="relative">
                      <div className="absolute left-[-184px] top-1 text-right w-28 select-none font-mono">
                        <div className="font-bold text-neutral-905 text-[11.5px]">00:41</div>
                      </div>
                      <span className="absolute left-[-60px] top-0 w-6 h-6 rounded-full bg-[#2C52F5] flex items-center justify-center shadow-xs">
                        <Cpu className="w-3 h-3 text-white" />
                      </span>
                      <div className="space-y-5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#2C52F5] font-mono select-none">
                          AI proposed root cause
                        </div>
                        <p className="text-neutral-900 font-normal leading-relaxed text-wrap:pretty" style={{ fontFamily: "Newsreader, serif", fontSize: "27.5px" }}>
                          A refrigeration valve failed to fully close during the overnight hold, allowing intermittent warm-air ingress. The CMMS logs (WO-8841) confirm valve service completion at 14:02 IST. The resulting instability pushed Batch PX-2041 outside its validated range for ≈38 minutes - producing the specification deviation.
                        </p>
                      </div>
                    </motion.div>

                    {/* Event 6 */}
                    <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="relative">
                      <div className="absolute left-[-184px] top-1 text-right w-28 select-none font-mono">
                        <div className="font-bold text-neutral-905 text-[11.5px]">Now</div>
                      </div>
                      <span className={cn(
                        "absolute left-[-60px] top-0 w-6 h-6 rounded-full flex items-center justify-center shadow-xs",
                        signatureHash ? "bg-emerald-600" : "bg-amber-50 border border-amber-600 animate-pulse"
                      )}>
                        {signatureHash ? <Check className="w-3 h-3 text-white" /> : <AlertOctagon className="w-3 h-3 text-amber-600" />}
                      </span>
                      <div className="space-y-4">
                        <h2 className="text-neutral-905 font-medium tracking-tight" style={{ fontFamily: "Newsreader, serif", fontSize: "26px" }}>
                          {signatureHash ? "Investigation Approved & Closed" : "Waiting for final approval"}
                        </h2>
                        <p className="text-[11.5px] leading-relaxed text-neutral-700 font-sans">
                          {signatureHash
                            ? "This investigation has been locked and certified in accordance with electronic audit compliance regulations."
                            : "All timestamp conflicts have been reconciled. The report has been updated with 98% confidence and is ready for QA sign-off."
                          }
                        </p>
                        <div className="flex gap-3 pt-2 select-none">
                          {signatureHash ? (
                            <button
                              onClick={() => setViewMode("complete")}
                              className="bg-neutral-900 hover:bg-neutral-850 text-white rounded-xl px-6 py-2 text-[10px] font-bold shadow-xs"
                            >
                              Open Inspection Package
                            </button>
                          ) : (
                            <button
                              onClick={() => setShowSignModal(true)}
                              className="bg-neutral-900 hover:bg-neutral-855 text-white rounded-xl px-6 py-2 text-[10px] font-bold shadow-xs"
                            >
                              Approve Final Investigation
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.article>

                <aside className="w-[260px] flex-shrink-0 select-none">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 mb-4.5 font-mono">
                    At a glance
                  </div>
                  <div className="divide-y divide-neutral-100 border-b border-neutral-100 text-[10.5px] mb-10">
                    {[
                      { label: "Confidence", val: dynamicConfidence },
                      { label: "Evidence strength", val: "Strong" },
                      { label: "Residual risk", val: "Negligible", color: "text-emerald-600" },
                      { label: "Linked documents", val: "19" }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between py-3 font-sans font-semibold">
                        <span className="text-neutral-500">{item.label}</span>
                        <span className={cn("text-neutral-900 font-mono", item.color)}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {viewMode === "reconcile" && (
            <motion.div
              key="reconcile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-white select-text overflow-y-auto"
            >
              {/* ============================================================================== */}
              {/* 4. RECONCILIATION WORKSPACE: SIDE-BY-SIDE RESOLUTION WORKSPACE                 */}
              {/* ============================================================================== */}
              
              

              <div className="px-6 py-10 max-w-[1360px] mx-auto w-full space-y-10 pb-36">
                <div className="space-y-3">
                  <span className="text-[10.5px] uppercase font-bold tracking-widest text-[#2C52F5] font-mono">Reconciliation Queue</span>
                  <h1 className="text-[24px] font-extrabold text-neutral-900 tracking-tight">
                    Confirm Cold Unit 3 valve maintenance completion time
                  </h1>
                  <p className="text-[10px] text-neutral-600 max-w-[850px] leading-relaxed">
                    Klarixa detected conflicting timestamps between the digital work log and automatic event triggers. Review the raw logs, select the correct record, or request additional evidence to resolve this block.
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Record A */}
                  <div className="col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-3 select-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Record A</span>
                        <span className="inline-flex items-center gap-1 bg-[#EEF2FF] text-[#2C52F5] text-[10.5px] font-bold uppercase px-2 py-0.5 rounded font-mono">CMMS Work Order</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-neutral-200/50 rounded-xl p-4.5 font-mono text-[11.5px] text-neutral-655 space-y-2 select-text whitespace-pre-line leading-relaxed">
                        <span className="text-neutral-400 font-bold block mb-1">--- CMMS EXPORT ---</span>
                        {"WO-8841: Preventive Valve Replacement\nAsset ID: "}
                        <span className="bg-neutral-200/70 px-1 py-0.2 rounded font-bold text-neutral-900">VALVE-03-PM</span>
                        {"\nTechnician: J. Kapoor\nStatus: Closed/Completed\nCompletion time: "}
                        <span className="bg-[#EEF2FF] border border-[#C7D2FE] px-1 py-0.2 rounded font-bold text-[#2C52F5]">14:02:18 IST</span>
                        {"\nSign-off verified: Verified by Calib-Operator"}
                      </div>
                      <div className="space-y-3 pt-3">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-neutral-500">Timestamp</span>
                          <span className="text-neutral-900 font-mono">14:02:18 IST</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-neutral-500">Technician</span>
                          <span className="text-neutral-900">J. Kapoor (Tech-402)</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-neutral-500">Equipment ID</span>
                          <span className="text-neutral-900 font-mono">VALVE-03-PM</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-neutral-100 select-none">
                      <button
                        onClick={() => setReconciliationChoice("A")}
                        className={cn(
                          "w-full py-2 rounded-xl font-bold text-[10px] transition-all shadow-xs flex items-center justify-center gap-2",
                          reconciliationChoice === "A"
                            ? "bg-[#2C52F5] text-white shadow-xs"
                            : "bg-white hover:bg-neutral-50 border border-neutral-205 text-neutral-700"
                        )}
                      >
                        {reconciliationChoice === "A" && <Check className="w-3 h-3" />}
                        <span>Choose Record A</span>
                      </button>
                    </div>
                  </div>

                  {/* Center comparison summary */}
                  <div className="col-span-4 bg-[#FCFCFD] border border-neutral-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs select-none">
                    <div className="space-y-4">
                      <div className="pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono">Side-by-Side Comparison</span>
                      </div>
                      <div className="space-y-5">
                        <div className="border border-amber-100 bg-amber-50/20 rounded-xl p-3.5 space-y-2">
                          <div className="flex justify-between items-center text-[10.5px] uppercase font-bold tracking-widest text-[#B45309] font-mono">
                            <span>Service Time</span>
                            <span className="inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Conflict</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center font-mono text-[10px] font-bold text-neutral-900 pt-1">
                            <span className="text-[#2C52F5]">14:02</span>
                            <span className="text-neutral-400 font-normal">vs</span>
                            <span className="text-amber-700">16:40</span>
                          </div>
                        </div>

                        <div className="border border-neutral-200/60 bg-white rounded-xl p-3.5 flex justify-between items-center">
                          <div>
                            <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">Technician</div>
                            <div className="font-semibold text-neutral-808 text-[10.5px] mt-0.5">J. Kapoor</div>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Same</span>
                          </div>
                        </div>

                        <div className="border border-neutral-200/60 bg-white rounded-xl p-3.5 flex justify-between items-center">
                          <div>
                            <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">Equipment ID</div>
                            <div className="font-semibold text-neutral-808 text-[10.5px] mt-0.5 font-mono">VALVE-03-PM</div>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Same</span>
                          </div>
                        </div>

                        <div className="border border-neutral-205 bg-white rounded-xl p-3.5 space-y-1">
                          <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">Difference detected</div>
                          <p className="font-semibold text-neutral-808 text-[10.5px] leading-tight">
                            Maintenance completion time (158-minute discrepancy)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-neutral-100/60">
                      <div className="text-[10.5px] text-neutral-455 leading-relaxed font-mono">
                        *Comparison aligned automatically by GxP document parser.
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Record B */}
                  <div className="col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 select-none">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono">Record B</span>
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10.5px] font-bold uppercase px-2 py-0.5 rounded font-mono">MES Log</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-neutral-200/50 rounded-xl p-4.5 font-mono text-[11.5px] text-neutral-650 space-y-2 select-text whitespace-pre-line leading-relaxed">
                        <span className="text-neutral-400 font-bold block mb-1">--- MES AUTOMATION LOG ---</span>
                        {"Line 4 Batch Hold sequence started: 22:00\nValve system override triggered: 14:02\nMaintenance action registered: "}
                        <span className="bg-neutral-200/70 px-1 py-0.2 rounded font-bold text-neutral-900">VALVE-03-PM</span>
                        {"\nValve calibration completion time: "}
                        <span className="bg-amber-50 border border-amber-200 px-1 py-0.2 rounded font-bold text-[#B45309]">16:40:02 IST</span>
                        {"\nOperator comment: 'Valve assembly replaced.'"}
                      </div>
                      <div className="space-y-3 pt-3">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-neutral-500">Timestamp</span>
                          <span className="text-neutral-900 font-mono">16:40:02 IST</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-neutral-500">Technician</span>
                          <span className="text-neutral-900">J. Kapoor (Tech-402)</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-neutral-500">Equipment ID</span>
                          <span className="text-neutral-900 font-mono">VALVE-03-PM</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-neutral-100 select-none">
                      <button
                        onClick={() => setReconciliationChoice("B")}
                        className={cn(
                          "w-full py-2 rounded-xl font-bold text-[10px] transition-all shadow-xs flex items-center justify-center gap-2",
                          reconciliationChoice === "B"
                            ? "bg-[#2C52F5] text-white shadow-xs"
                            : "bg-white hover:bg-neutral-50 border border-neutral-205 text-neutral-705"
                        )}
                      >
                        {reconciliationChoice === "B" && <Check className="w-3 h-3" />}
                        <span>Choose Record B</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation & Matrix */}
                <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4 grid grid-cols-12 gap-6 items-start select-none">
                  <div className="col-span-7 space-y-3">
                    <div className="flex items-center gap-2 text-[#2C52F5]">
                      
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono">AI Recommendation & Assessment</span>
                    </div>
                    <p className="text-[10px] text-neutral-700 leading-relaxed font-sans font-medium text-[10px]">
                      "I found inconsistent timestamps between two maintenance systems. Both records reference the same valve and technician, but the completion time differs. I cannot confidently determine which record is correct."
                    </p>
                    <p className="text-[10px] text-neutral-550 leading-relaxed font-sans text-[10px]">
                      *Note: Record A (14:02) correlates with the stability LIMS assay sampling window, suggesting the calibration was verified prior to the batch temperature excursion peak.
                    </p>
                  </div>
                  <div className="col-span-5 border-l border-neutral-200 pl-8 space-y-4">
                    <div className="text-[10.5px] uppercase font-bold tracking-wider text-[#94A3B8] font-mono">Confidence Impact analysis</div>
                    <div className="space-y-3 font-mono text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">Current confidence:</span>
                        <span className="font-bold text-neutral-900 bg-white border border-neutral-200 px-2.5 py-0.5 rounded shadow-xs">94%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">Confidence if Record A accepted:</span>
                        <span className="font-bold text-emerald-600 bg-white border border-neutral-200 px-2.5 py-0.5 rounded shadow-xs">98% (Recommended)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-500">Confidence if Record B accepted:</span>
                        <span className="font-bold text-rose-600 bg-white border border-neutral-200 px-2.5 py-0.5 rounded shadow-xs">90% (Low agreement)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional decision actions */}
                <div className="border-t border-neutral-200 pt-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 select-none">
                    <button
                      onClick={() => setReconciliationChoice("inconclusive")}
                      className={cn(
                        "px-4.5 py-1.5 rounded-xl font-bold text-[10px] transition-colors border shadow-xs",
                        reconciliationChoice === "inconclusive"
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "bg-white hover:bg-neutral-50 border-neutral-205 text-neutral-600"
                      )}
                    >
                      Mark as inconclusive
                    </button>
                    
                    <button
                      onClick={() => setReconciliationChoice("evidence")}
                      className={cn(
                        "px-4.5 py-1.5 rounded-xl font-bold text-[10px] transition-colors border shadow-xs",
                        reconciliationChoice === "evidence"
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "bg-white hover:bg-neutral-50 border-neutral-205 text-neutral-600"
                      )}
                    >
                      Request additional evidence
                    </button>

                    <span className="text-neutral-300">|</span>

                    <div className="flex-1 min-w-[300px] flex items-center gap-2.5 border border-neutral-200 rounded-xl bg-white px-3.5 py-1 shadow-xs">
                      <MessageSquare className="w-3 h-3 text-neutral-450" />
                      <input
                        type="text"
                        placeholder="Leave a review comment regarding this decision…"
                        value={reconciliationComment}
                        onChange={(e) => setReconciliationComment(e.target.value)}
                        className="w-full text-[10px] text-neutral-700 placeholder-neutral-400 focus:outline-none py-1.5"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {reconciliationChoice !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-6 flex items-center justify-between shadow-xs select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold text-[11.5px]">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Conflict Resolved successfully</span>
                          </div>
                          <p className="text-[10px] text-emerald-755 leading-relaxed font-sans pl-7 text-[10.5px]">
                            Thank you. Klarixa will update the investigation draft and audit trail based on your decision to accept{" "}
                            <span className="font-bold uppercase font-mono">
                              {reconciliationChoice === "A"
                                ? "Record A (CMMS Work Order)"
                                : reconciliationChoice === "B"
                                ? "Record B (MES Log)"
                                : reconciliationChoice}
                            </span>
                            .
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            resolveConflict();
                            setViewMode("revision-summary");
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-5 py-3 text-[10px] transition-colors shadow-xs flex items-center gap-1.5 font-sans animate-pulse"
                        >
                          <span>Accept & View AI Revision Summary</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === "revision-summary" && (
            <motion.div
              key="revision-summary"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-white select-text overflow-y-auto"
            >
              {/* ============================================================================== */}
              {/* 5. AI REVISION SUMMARY SCREEN (Final Screen)                                   */}
              {/* ============================================================================== */}
              
              

              <div className="px-6 py-10 max-w-[1360px] mx-auto w-full grid grid-cols-12 gap-7 pb-36">
                
                {/* Left Side: Summary & Diff Comparison (70%) */}
                <div className="col-span-8 space-y-10">
                  <div className="space-y-3.5 select-none">
                    <div className="inline-flex items-center gap-2 bg-[#ECFDF5] border border-emerald-200 rounded-full px-3.5 py-1 text-[10px] font-semibold text-emerald-800">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Revision Complete</span>
                    </div>
                    <h1 className="text-[24px] font-extrabold text-neutral-900 tracking-tight leading-tight">
                      AI re-analysis and report updates complete
                    </h1>
                    <p className="text-[10px] text-neutral-600 max-w-[800px] leading-relaxed">
                      Based on your reconciliation inputs (Accepting CMMS Record A), Klarixa AI completed a second review cycle, updating corresponding report chapters, aligning calibration logs, and resolving GxP validation blocks.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-4 select-none">
                    <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4 hover:shadow-xs transition-shadow">
                      <div className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Feedback status</div>
                      <div className="text-lg font-extrabold text-neutral-900 mt-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Accepted A</span>
                      </div>
                      <span className="text-[10px] text-neutral-450 block mt-1">CMMS timestamp fixed</span>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4 hover:shadow-xs transition-shadow">
                      <div className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Confidence Score</div>
                      <div className="text-xl font-extrabold text-[#2C52F5] mt-2 flex items-baseline gap-1 font-mono">
                        <span>98%</span>
                        <span className="text-[10px] text-neutral-455 font-normal">from 94%</span>
                      </div>
                      <span className="text-[10px] text-emerald-655 font-semibold block mt-1">+4% improvement</span>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4 hover:shadow-xs transition-shadow">
                      <div className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Affected Sections</div>
                      <div className="text-lg font-extrabold text-neutral-900 mt-2">
                        2 Updated
                      </div>
                      <span className="text-[10px] text-neutral-450 block mt-1">Chapters 02 & 04 modified</span>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4 hover:shadow-xs transition-shadow">
                      <div className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-450 font-mono">Supporting Evidence</div>
                      <div className="text-lg font-extrabold text-neutral-900 mt-2">
                        +1 Log Added
                      </div>
                      <span className="text-[10px] text-neutral-455 block mt-1">Reconciliation Certificate</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 select-none">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Document Diffs (What's Changed)</span>
                      <span className="text-[10px] text-neutral-455 font-mono">Only modified blocks displayed</span>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-neutral-200/60 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-100 flex items-center justify-between select-none">
                          <span className="font-bold text-neutral-800 text-[10.5px]">Chapter 02 · Root Cause Analysis (Primary root cause)</span>
                          <span className="text-[10.5px] font-mono text-neutral-400">Section Diff</span>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-neutral-100 text-[10px]">
                          <div className="p-4 space-y-2 bg-rose-50/20">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono block select-none">Previous text</span>
                            <p className="text-neutral-600 leading-relaxed font-medium">
                              ...the maintenance record confirms the valve assembly was last serviced outside its scheduled interval <span className="bg-rose-105 text-rose-800 px-1 py-0.5 rounded font-bold line-through">[at an unconfirmed time].</span>
                            </p>
                          </div>
                          <div className="p-4 space-y-2 bg-emerald-50/20">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-850 font-mono block select-none">Updated text</span>
                            <p className="text-neutral-900 leading-relaxed font-medium">
                              ...and <span className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-bold">CMMS maintenance work order WO-8841 confirms the valve assembly service was completed at 14:02 IST, prior to the temperature peak.</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-neutral-200/60 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-100 flex items-center justify-between select-none">
                          <span className="font-bold text-neutral-808 text-[10.5px]">Chapter 04 · Corrective & Preventive Action</span>
                          <span className="text-[10.5px] font-mono text-neutral-400">Section Diff</span>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-neutral-100 text-[10px]">
                          <div className="p-4 space-y-2 bg-rose-50/20">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 font-mono block select-none">Previous text</span>
                            <p className="text-neutral-600 leading-relaxed font-medium">
                              Replace refrigeration valve assembly on cold-chain unit 3 and requalify.
                            </p>
                          </div>
                          <div className="p-4 space-y-2 bg-emerald-50/20">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-850 font-mono block select-none">Updated text</span>
                            <p className="text-neutral-900 leading-relaxed font-medium">
                              Replace refrigeration valve assembly on cold-chain unit 3 <span className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-bold">and enforce the 14:02 IST service completion window in calibration logs.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: AI Explanation & Audit Trail (30%) */}
                <div className="col-span-4 space-y-4 select-none">
                  <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center gap-2 text-[#2C52F5]">
                      
                      <span className="text-[10.5px] uppercase font-bold tracking-wider font-mono">AI re-analysis explanation</span>
                    </div>
                    <p className="text-[10px] text-neutral-700 leading-relaxed font-sans font-medium text-[10px]">
                      "I reviewed the BMS logs, confirmed the corrected maintenance timestamp, updated the root cause analysis, and increased confidence from 94% to 98%."
                    </p>
                    <div className="flex items-center justify-between border-t border-neutral-200/60 pt-4.5">
                      <div className="text-[10px] text-neutral-450 font-mono">Confidence boost:</div>
                      <div className="flex items-center gap-2 font-mono font-bold text-[10px]">
                        <span className="text-neutral-450 line-through">94%</span>
                        <ArrowRight className="w-3 h-3 text-neutral-400" />
                        <span className="text-[#2C52F5] text-[11.5px]">98%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 space-y-5">
                    <div className="pb-3 flex justify-between items-center">
                      <span className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Audit trail timeline</span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-455">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>GxP Log</span>
                      </span>
                    </div>

                    <div className="relative border-l border-neutral-200 ml-3 pl-6 space-y-4 text-[10px]">
                      <div className="relative">
                        <span className="absolute left-[-29px] top-0 w-2.5 h-2.5 rounded-full bg-neutral-300" />
                        <div className="font-semibold text-neutral-850">Investigator requested review</div>
                        <div className="text-[10.5px] text-neutral-400 font-mono mt-0.5">Today · 17:25</div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-[-29px] top-0 w-2.5 h-2.5 rounded-full bg-neutral-300" />
                        <div className="font-semibold text-neutral-855">Reconciliation Workspace resolved</div>
                        <div className="text-[10.5px] text-neutral-400 font-mono mt-0.5">Today · 17:28</div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-[-29px] top-0 w-2.5 h-2.5 rounded-full bg-neutral-300" />
                        <div className="font-semibold text-neutral-855">AI re-analyzed additional evidence</div>
                        <div className="text-[10.5px] text-neutral-400 font-mono mt-0.5">Today · 17:28</div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-[-29px] top-0 w-2.5 h-2.5 rounded-full bg-[#2C52F5]" />
                        <div className="font-bold text-neutral-909">Report updated & validated</div>
                        <div className="text-[10.5px] text-[#64748B] font-mono font-bold mt-0.5">Today · 17:29</div>
                      </div>
                      <div className="relative">
                        <span className="absolute left-[-29px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-655 animate-pulse" />
                        <div className="font-bold text-emerald-800">Investigation ready for approval</div>
                        <div className="text-[10.5px] text-emerald-600 font-mono font-bold mt-0.5">Now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-white select-text overflow-y-auto"
            >
              {/* ============================================================================== */}
              {/* 6. APPROVED & Locked Screen: Investigation Complete & Inspection Package      */}
              {/* ============================================================================== */}
              
              {/* Header */}
              

              <div className="px-6 py-10 max-w-[1360px] mx-auto w-full space-y-10 pb-36 bg-white border border-neutral-200/45 rounded-3xl shadow-md my-6">
                
                {/* Success Header (Calm FDA inspection-ready style) */}
                <div className="bg-[#ECFDF5]/60 border border-emerald-250 rounded-3xl p-6 flex items-start gap-6 select-none shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="space-y-3.5">
                    <div className="flex items-baseline gap-2.5">
                      <h1 className="text-[24px] font-extrabold text-emerald-950 tracking-tight">✓ Investigation Successfully Closed</h1>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">GxP SECURED</span>
                    </div>
                    <p className="text-[10px] text-emerald-900 leading-relaxed font-sans max-w-[900px] font-medium">
                      Batch PX-2041 has been investigated, reviewed, approved, and archived. Completed in <span className="font-bold">3 hours</span> instead of the traditional 6-week manual investigation process.
                    </p>
                    
                    <div className="grid grid-cols-5 gap-6 pt-3 border-t border-emerald-200/50 text-[10px] font-mono text-emerald-800">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Investigation ID</div>
                        <div className="font-bold mt-0.5">DV-24081</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Approval Date & Time</div>
                        <div className="font-bold mt-0.5">14 Jun 2026, 17:30 IST</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Approved By</div>
                        <div className="font-bold mt-0.5">Dr. Anita Rao (QA)</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">AI Agent Version</div>
                        <div className="font-bold mt-0.5">v4.2-compliance</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Investigation Status</div>
                        <div className="font-bold mt-0.5 uppercase tracking-wider text-emerald-700">Archived & Locked</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two-Column split */}
                <div className="grid grid-cols-12 gap-7 items-start">
                  
                  {/* Left Column: deliverables checklist & export actions (70%) */}
                  <div className="col-span-8 space-y-10">
                    
                    {/* Inspection Package Deliverables */}
                    <div className="space-y-5">
                      <div className="pb-3 select-none flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 font-mono">Regulator inspection package</span>
                        <span className="text-[10px] text-emerald-600 font-bold font-mono">All files signed, hashed & ready</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { title: "Final Investigation Report", desc: "FDA CFR Part 11 compliant validated PDF report.", size: "1.2 MB", hash: "SHA256-DF89..8A" },
                          { title: "Supporting Evidence Bundle", desc: "19 linked MES calibration and LIMS lab CSV logs.", size: "4.8 MB", hash: "SHA256-7E1A..F3" },
                          { title: "AI Reasoning Log", desc: "Traceable decision trees and sensor telemetry models.", size: "640 KB", hash: "SHA256-D31E..E6" },
                          { title: "Human Review History", desc: "Anita Rao & J. Kapoor comments and editing log.", size: "140 KB", hash: "SHA256-C09A..F9" },
                          { title: "Complete Audit Trail", desc: "Continuous time-locked logs of all investigator events.", size: "85 KB", hash: "SHA256-E33A..9E" },
                          { title: "CAPA Documentation", desc: "Corrective refrigeration valve PM intervals calibration rules.", size: "320 KB", hash: "SHA256-A8E2..88" },
                          { title: "Electronic Signature Record", desc: "Cryptographic credentials validation ledger logs.", size: "45 KB", hash: "SHA256-B8D1..CC" },
                          { title: "Version History", desc: "Complete tracking of report drafts V1 to V4.", size: "110 KB", hash: "SHA256-559B..D1" },
                          { title: "Regulatory Metadata", desc: "GxP compliance checklist validation certificate.", size: "65 KB", hash: "SHA256-F982..32" }
                        ].map((item, i) => (
                          <div key={i} className="border border-neutral-200/60 rounded-2xl p-4 bg-white hover:shadow-xs transition-shadow flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-neutral-450" />
                            </div>
                            <div className="min-w-0 space-y-1 w-full">
                              <div className="flex items-center justify-between select-none">
                                <span className="font-bold text-neutral-900 text-[10px] truncate pr-2">{item.title}</span>
                                <span className="flex items-center gap-0.5 text-emerald-600 text-[10.5px] font-bold font-mono">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                  <span>Ready</span>
                                </span>
                              </div>
                              <p className="text-[10px] text-neutral-500 leading-normal font-sans">{item.desc}</p>
                              <div className="flex justify-between items-center text-[10.5px] font-mono text-neutral-400 pt-1 select-none">
                                <span>{item.size}</span>
                                <span>{item.hash}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Knowledge Captured Panel (How it improves future cases) */}
                    <div className="space-y-4 bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-[#2C52F5] select-none">
                        
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Knowledge Captured (Continuous Improvement)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4.5 text-[10px] text-neutral-700">
                        <div className="flex gap-2.5 items-start">
                          <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                          <p><strong>Added as historical case:</strong> DV-24081 is now indexed to recommend parameters for future cold-chain deviations.</p>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                          <p><strong>Root cause indexed:</strong> Valve-malfunction sensor drift pattern mapped to improve future AI telemetry scans.</p>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                          <p><strong>CAPA database updated:</strong> Enforcing Service-Log windows in calibration schedules shared organization-wide.</p>
                        </div>
                        <div className="flex gap-2.5 items-start">
                          <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                          <p><strong>Equipment history logged:</strong> Cold Unit 3 maintenance ledger updated with WO-8841 verification.</p>
                        </div>
                      </div>
                    </div>

                    {/* Export Action Controls */}
                    <div className="border-t border-neutral-200/60 pt-6.5 select-none space-y-4">
                      <div className="text-[10.5px] uppercase font-bold tracking-wider text-neutral-400 font-mono">Package Actions</div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button className="bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl px-5 py-2 text-[10px] font-bold shadow-xs transition-colors flex items-center gap-2">
                          <Download className="w-3 h-3" />
                          <span>Download Inspection Package</span>
                        </button>
                        <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl px-4 py-2 text-[10px] font-semibold shadow-xs">
                          Export PDF Report
                        </button>
                        <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl px-4 py-2 text-[10px] font-semibold shadow-xs">
                          Export Audit Trail
                        </button>
                        <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-705 rounded-xl px-4 py-2 text-[10px] font-semibold shadow-xs">
                          Share with Quality Assurance
                        </button>
                        <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-705 rounded-xl px-4 py-2 text-[10px] font-semibold shadow-xs">
                          Open Investigation Archive
                        </button>
                        <button
                          onClick={handleReset}
                          className="bg-[#2C52F5] hover:bg-[#2C52F5] text-white rounded-xl px-5 py-2 text-[10px] font-bold shadow-xs transition-colors"
                        >
                          Start New Investigation
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Investigation summary & timeline (30%) */}
                  <div className="col-span-4 space-y-4 select-none">
                    
                    {/* Investigation Summary Card (Elegant Typography instead of large block KPI cards) */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
                      <div className="border-b border-neutral-100 pb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 font-mono">Investigation Summary</span>
                      </div>

                      <div className="space-y-4 text-[10px] font-sans">
                        <div className="space-y-1">
                          <div className="text-[10.5px] uppercase font-bold text-neutral-400 font-mono">Final root cause</div>
                          <p className="font-semibold text-neutral-850 leading-normal text-[10.5px]">
                            Mechanical failure of refrigeration valve VALVE-03-PM on Cold Store Unit 3.
                          </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-neutral-100 font-medium text-neutral-700">
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">Final confidence</span>
                            <span className="font-bold text-[#2C52F5] font-mono text-[10.5px]">{dynamicConfidence}</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">Residual risk</span>
                            <span className="font-bold text-emerald-600 font-mono text-[10.5px]">Negligible</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">Total evidence reviewed</span>
                            <span className="font-bold text-neutral-900 font-mono">19 records</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">Human review cycles</span>
                            <span className="font-bold text-neutral-900 font-mono">1 cycle</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">AI revision cycles</span>
                            <span className="font-bold text-neutral-900 font-mono">2 cycles</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="text-neutral-500">Investigation duration</span>
                            <span className="font-bold text-neutral-900 font-mono">3 hours</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Spine */}
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-4 space-y-4">
                      <div className="border-b border-neutral-100 pb-3 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 font-mono">Audit Timeline Spine</span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400">
                          <Clock className="w-3 h-3" />
                          <span>GxP log</span>
                        </span>
                      </div>

                      <div className="relative border-l border-neutral-200 ml-3 pl-6 space-y-4 text-[10px]">
                        {[
                          { title: "Deviation detected", time: "14 Jun · 23:58" },
                          { title: "AI investigation started", time: "15 Jun · 00:01" },
                          { title: "Evidence collected", time: "15 Jun · 00:05" },
                          { title: "Draft generated", time: "15 Jun · 00:41" },
                          { title: "Human review completed", time: "Today · 17:25" },
                          { title: "AI updated investigation", time: "Today · 17:28" },
                          { title: "Final approval completed", time: "Today · 17:30", bold: true, color: "bg-[#2C52F5]" },
                          { title: "Investigation archived", time: "Today · 17:30", bold: true },
                          { title: "Inspection package generated", time: "Now", bold: true, color: "bg-[#10B981]" }
                        ].map((evt, i) => (
                          <div key={i} className="relative">
                            <span className={cn(
                              "absolute left-[-29px] top-0 w-2.5 h-2.5 rounded-full",
                              evt.color ? evt.color : "bg-neutral-300"
                            )} />
                            <div className={cn("text-neutral-800", evt.bold && "font-bold text-neutral-900")}>{evt.title}</div>
                            <div className="text-[10px] text-neutral-405 font-mono mt-0.5">{evt.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {viewMode === "evidence" && (
            <motion.div
              key="evidence"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-[#F8F9FC] select-text overflow-hidden"
            >
              {/* Header */}
              

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left Filter Panel (240px) */}
                <aside className="w-[240px] border-r border-neutral-200/40 bg-[#F9FAFB] p-5.5 flex-shrink-0 overflow-y-auto select-none space-y-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] font-mono mb-4">
                    Filter Evidence
                  </div>

                  <div className="space-y-5">
                    {/* Filter Group 1: Doc Type */}
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#64748B] block font-mono">Document Type</label>
                      <div className="relative">
                        <select className="w-full bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg pl-2.5 pr-8 py-1.5 text-[11.5px] font-medium text-neutral-800 focus:outline-none focus:border-[#2C52F5] transition-colors cursor-pointer shadow-2xs appearance-none">
                          <option>All Types</option>
                          <option>CSV Spreadsheets</option>
                          <option>PDF Documents</option>
                          <option>JSON Data</option>
                          <option>Word DOCX</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Filter Group 2: Investigation */}
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#64748B] block font-mono">Investigation</label>
                      <div className="relative">
                        <select className="w-full bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg pl-2.5 pr-8 py-1.5 text-[11.5px] font-medium text-neutral-800 focus:outline-none focus:border-[#2C52F5] transition-colors cursor-pointer shadow-2xs appearance-none">
                          <option>All Cases</option>
                          <option>DV-24081 (PX-2041)</option>
                          <option>DV-24082 (PX-9022)</option>
                          <option>DV-23110 (Line 4)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Filter Group 3: Source */}
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#64748B] block font-mono">Evidence Source</label>
                      <div className="relative">
                        <select className="w-full bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg pl-2.5 pr-8 py-1.5 text-[11.5px] font-medium text-neutral-800 focus:outline-none focus:border-[#2C52F5] transition-colors cursor-pointer shadow-2xs appearance-none">
                          <option>All Sources</option>
                          <option>MES Automation</option>
                          <option>LIMS QC Lab</option>
                          <option>CMMS Maintenance</option>
                          <option>SOP Vault</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Filter Group 4: Verified */}
                    <div className="space-y-2">
                      <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#64748B] block font-mono">Verification Status</label>
                      <div className="space-y-2 pt-0.5">
                        <label className="flex items-center gap-2.5 text-[11.5px] text-neutral-700 font-medium cursor-pointer hover:text-neutral-900 transition-colors">
                          <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-neutral-300 text-[#2C52F5] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer" />
                          <span>Verified</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-[11.5px] text-neutral-700 font-medium cursor-pointer hover:text-neutral-900 transition-colors">
                          <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-neutral-300 text-[#2C52F5] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer" />
                          <span>Flagged</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-[11.5px] text-neutral-700 font-medium cursor-pointer hover:text-neutral-900 transition-colors">
                          <input type="checkbox" className="w-3.5 h-3.5 rounded border-neutral-300 text-[#2C52F5] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer" />
                          <span>Pending Review</span>
                        </label>
                      </div>
                    </div>

                    {/* Filter Group 5: AI Confidence */}
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] uppercase font-bold tracking-wider text-[#64748B] block font-mono">AI Confidence Threshold</label>
                      <div className="relative">
                        <select className="w-full bg-white border border-neutral-200 hover:border-neutral-300 rounded-lg pl-2.5 pr-8 py-1.5 text-[11.5px] font-medium text-neutral-800 focus:outline-none focus:border-[#2C52F5] transition-colors cursor-pointer shadow-2xs appearance-none">
                          <option>All Levels</option>
                          <option>&gt; 95% High Confidence</option>
                          <option>&gt; 90% Moderate</option>
                          <option>&gt; 80% Baseline</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Center Content Workspace */}
                <main className="flex-1 overflow-y-auto bg-[#F8F9FC] p-6 space-y-4">
                  {/* Evidence Library Title & Actions row */}
                  <div className="flex justify-between items-start select-none">
                    <div className="space-y-1">
                      <h1 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">Evidence Library</h1>
                      <p className="text-[11.5px] text-[#64748B] leading-relaxed">
                        Browse, search, and review all evidence collected across investigations.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      {/* AI Synced Badge */}
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/50 rounded-full px-2.5 py-1.5 text-[10px] font-bold text-emerald-800 whitespace-nowrap select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="whitespace-nowrap">AI Synced</span>
                      </div>

                      {/* Upload Button */}
                      <button className="bg-[#2C52F5] hover:bg-[#1E40AF] text-white rounded-xl px-4 py-2 text-[10.5px] font-bold shadow-xs transition-colors select-none whitespace-nowrap">
                        Upload evidence
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters Utility Row */}
                  <div className="flex items-center gap-2.5 select-none pt-1">
                    <div className="flex items-center gap-2 border border-neutral-200 rounded-xl bg-white px-3 py-1.5 shadow-2xs w-72">
                      <Search className="w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        className="bg-transparent border-none text-[11px] focus:outline-none w-full text-neutral-800 placeholder-neutral-400"
                      />
                    </div>

                    <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl px-4 py-1.5 text-[10.5px] font-bold shadow-2xs flex items-center gap-2 transition-colors">
                      <Layers className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Filter</span>
                    </button>
                  </div>

                  {/* 4 Summary Cards */}
                  <div className="grid grid-cols-4 gap-4 select-none">
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                      <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">Total Documents</div>
                      <div className="text-[18px] font-extrabold text-[#0F172A] mt-1.5 font-mono">124 files</div>
                      <span className="text-[10px] text-[#64748B] block mt-1">Telemetry, log & SOP index</span>
                    </div>
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                      <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">Evidence Sources</div>
                      <div className="text-[18px] font-extrabold text-[#0F172A] mt-1.5 font-mono">8 systems</div>
                      <span className="text-[10px] text-[#64748B] block mt-1">MES, LIMS, CMMS connected</span>
                    </div>
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                      <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">AI Indexed</div>
                      <div className="text-[18px] font-extrabold text-[#2C52F5] mt-1.5 font-mono">98.4%</div>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Audit-ready validation</span>
                    </div>
                    <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                      <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">Recently Added</div>
                      <div className="text-[18px] font-extrabold text-[#0F172A] mt-1.5 font-mono">12 new</div>
                      <span className="text-[10px] text-[#64748B] block mt-1">Last sync 4 min ago</span>
                    </div>
                  </div>

                  {/* Evidence Table Sheet (Notion-style elevated container) */}
                  <div className="bg-white border border-neutral-200/35 rounded-2xl p-5 shadow-xs overflow-x-auto">
                    <table className="w-full text-[11px] text-left table-fixed min-w-[700px]">
                      <thead>
                        <tr className="border-b border-neutral-100 text-[#64748B] text-[9.5px] uppercase font-bold font-mono select-none">
                          <th className="pb-3.5 pl-2 w-[28%]">Document</th>
                          <th className="pb-3.5 w-[16%]">Source System</th>
                          <th className="pb-3.5 w-[14%]">Investigation ID</th>
                          <th className="pb-3.5 w-[14%]">Category</th>
                          <th className="pb-3.5 w-[12%]">Uploaded By</th>
                          <th className="pb-3.5 w-[8%]">AI Conf.</th>
                          <th className="pb-3.5 pr-2 w-[8%] text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-600 font-medium select-text">
                        {[
                          { file: "MES_Bioreactor_Logs.csv", sys: "MES Automation", inv: "DV-24081", cat: "Telemetry", user: "AI System", conf: "96%", status: "Verified" },
                          { file: "Sensor_Temperature_Trace.pdf", sys: "BMS Alarms", inv: "DV-24081", cat: "Telemetry", user: "AI System", conf: "98%", status: "Verified" },
                          { file: "Batch_Record_PX2041.pdf", sys: "MES Vault", inv: "DV-24081", cat: "Batch Record", user: "AI System", conf: "96%", status: "Verified" },
                          { file: "Valve_Maintenance_Log.pdf", sys: "CMMS System", inv: "DV-24081", cat: "Service Log", user: "J. Kapoor", conf: "94%", status: "Verified" },
                          { file: "Laboratory_Result.pdf", sys: "LIMS Lab", inv: "DV-24081", cat: "Lab Result", user: "Anita Rao", conf: "91%", status: "Verified" },
                          { file: "SOP_204_v5.pdf", sys: "SOP Vault", inv: "DV-24081", cat: "Standard Policy", user: "QA Admin", conf: "95%", status: "Verified" },
                          { file: "CAPA_2208.pdf", sys: "Quality System", inv: "DV-24081", cat: "Case Precedent", user: "QA Admin", conf: "93%", status: "Verified" },
                          { file: "Equipment_Calibration.pdf", sys: "Calibration Log", inv: "DV-24081", cat: "Calibration", user: "J. Kapoor", conf: "89%", status: "Verified" }
                        ].map((row, idx) => {
                          const isSelected = selectedEvidenceId === row.file;
                          return (
                            <tr
                              key={idx}
                              onClick={() => setSelectedEvidenceId(row.file)}
                              className={cn(
                                "hover:bg-neutral-50/50 cursor-pointer transition-colors",
                                isSelected ? "bg-[#F8FAFC] text-neutral-900" : ""
                              )}
                            >
                              <td className="py-3.5 pl-2 font-semibold text-neutral-850 truncate max-w-[220px]">
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-3.5 h-3.5 text-neutral-450 flex-shrink-0" />
                                  <span className="truncate" title={row.file}>{row.file}</span>
                                </div>
                              </td>
                              <td className="py-3.5 font-mono text-[10.5px] text-neutral-500 truncate" title={row.sys}>{row.sys}</td>
                              <td className="py-3.5 font-mono text-[10.5px] text-neutral-500">{row.inv}</td>
                              <td className="py-3.5 text-neutral-500 truncate" title={row.cat}>{row.cat}</td>
                              <td className="py-3.5 text-neutral-500 truncate" title={row.user}>{row.user}</td>
                              <td className="py-3.5 font-mono text-neutral-450 font-semibold">{row.conf}</td>
                              <td className="py-3.5 pr-2 text-right">
                                <span className="inline-flex items-center gap-1 text-emerald-600 text-[10.5px] font-bold font-mono">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                  <span>{row.status}</span>
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </main>

                {/* Right Preview Panel (340px) */}
                <aside className="w-[340px] border-l border-neutral-200 flex-shrink-0 overflow-y-auto bg-[#FCFCFD] p-6 space-y-4">
                  <div className="border-b border-neutral-100 pb-3 flex justify-between items-center select-none">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-450 font-mono font-bold">Document Preview</span>
                    <span className="text-[11px] text-neutral-455 font-mono">Metadata</span>
                  </div>

                  <div className="space-y-4">
                    {/* Doc Title & Type */}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-neutral-400" />
                        <h3 className="font-bold text-neutral-900 text-lg leading-tight truncate">
                          {selectedEvidenceId}
                        </h3>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-mono mt-1.5">
                        Size: 1.2 MB · Type: {selectedEvidenceId.endsWith(".csv") ? "CSV Spreadsheet" : "PDF Document"}
                      </p>
                    </div>

                    {/* Miniature Raw Preview */}
                    <div className="border border-neutral-200/60 rounded-xl bg-neutral-50 p-4 font-mono text-[10.5px] text-neutral-600 leading-relaxed max-h-40 overflow-y-auto whitespace-pre select-text">
                      {selectedEvidenceId.endsWith(".csv")
                        ? "Timestamp,Sensor,Value,Status\n22:15:00,TEMP-B4,6.4C,NORMAL\n22:30:00,TEMP-B4,6.6C,NORMAL\n22:45:00,TEMP-B4,6.8C,NORMAL\n23:00:00,TEMP-B4,6.9C,NORMAL\n23:15:00,TEMP-B4,7.1C,NORMAL\n23:30:00,TEMP-B4,7.4C,NORMAL"
                        : "%PDF-1.4\n%•••••\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 124 >>\nstream\nBT /F1 12 Tf 72 712 Td (Investigation Report: Excursion validated range summary...) Tj ET\nendstream\nendobj"}
                    </div>

                    {/* AI Summary */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-455 font-mono select-none">
                        
                        <span>AI Document Summary</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-neutral-700 font-medium">
                        {selectedEvidenceId === "MES_Bioreactor_Logs.csv" && "Continuous temperature logs parsed from Line 4 bioreactor hold. Correlates with LIMS pH records, proving the hold was stabilized before raw sensor drift occurred."}
                        {selectedEvidenceId === "Sensor_Temperature_Trace.pdf" && "Automated alarm logger data for VALVE-03-PM. Confirms deviation breach timing at exactly 14:02 IST."}
                        {selectedEvidenceId === "Batch_Record_PX2041.pdf" && "Validated electronic batch record copy. Marks the run timeline, technician sign-offs, and critical process parameters."}
                        {selectedEvidenceId === "Valve_Maintenance_Log.pdf" && "Service ticket for corrective calibration of cold storage valve. Completed on 14 Jun by J. Kapoor."}
                        {selectedEvidenceId === "Laboratory_Result.pdf" && "Sterility assay and particle density results. Confirming the batch is safe and complies with specifications."}
                        {selectedEvidenceId === "SOP_204_v5.pdf" && "Standard operating procedure for environmental monitoring and action limits on cooling unit operations."}
                        {selectedEvidenceId === "CAPA_2208.pdf" && "Historical CAPA case reference outlining similar valve replacement solutions from November 2025."}
                        {selectedEvidenceId === "Equipment_Calibration.pdf" && "Annual physical calibration certification record for VALVE-03-PM sensors."}
                      </p>
                    </div>

                    {/* Connections / References */}
                    <div className="space-y-3.5 pt-3 border-t border-neutral-100 text-[10px] font-medium text-neutral-600">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Related Case:</span>
                        <span className="font-mono text-neutral-900 font-bold">DV-24081</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Linked Evidence:</span>
                        <span className="text-neutral-900 font-semibold">3 files</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Referenced in:</span>
                        <span className="text-[#2C52F5] font-semibold">02 · Root Cause</span>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="space-y-2.5 pt-3 border-t border-neutral-100 select-none">
                      <button
                        onClick={() => {
                          setSelectedPreviewDoc({
                            title: selectedEvidenceId,
                            subtitle: selectedEvidenceId.endsWith(".csv") ? "Telemetry" : "PDF Document",
                            content: selectedEvidenceId.endsWith(".csv")
                              ? "Timestamp,Sensor,Value,Status\n22:15:00,TEMP-B4,6.4C,NORMAL\n22:30:00,TEMP-B4,6.6C,NORMAL\n22:45:00,TEMP-B4,6.8C,NORMAL\n23:00:00,TEMP-B4,6.9C,NORMAL\n23:15:00,TEMP-B4,7.1C,NORMAL\n23:30:00,TEMP-B4,7.4C,NORMAL"
                              : "[PDF Content Excerpt: Validation protocol and temperature limits summary...]"
                          })
                        }}
                        className="w-full bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl py-3 text-[10px] font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Open Document</span>
                      </button>

                      <button className="w-full bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl py-3 text-[10px] font-bold shadow-xs transition-colors flex items-center justify-center gap-2">
                        <Download className="w-3 h-3 text-neutral-500" />
                        <span>Download File</span>
                      </button>

                      <button
                        onClick={() => setViewMode("review")}
                        className="w-full bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-755 rounded-xl py-3 text-[10px] font-bold shadow-xs transition-colors"
                      >
                        View Investigation
                      </button>
                    </div>

                  </div>
                </aside>

              </div>
            </motion.div>
          )}
          {viewMode === "knowledge" && (
            <motion.div
              key="knowledge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-[#F8F9FC] select-text overflow-hidden"
            >
              {/* Header */}
              

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left Knowledge Library Panel */}
                <aside className="w-[360px] border-r border-neutral-200/40 bg-[#F9FAFB] p-6 flex-shrink-0 overflow-y-auto select-none space-y-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-450 font-mono">
                    Knowledge Library
                  </div>

                  <div className="space-y-4">
                    {/* Failure Patterns */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Recurring Failure Patterns</div>
                      <div className="space-y-2">
                        {[
                          { id: "mech-1", label: "Mechanical Failures", count: 14, time: "2d ago", conf: "98%" },
                          { id: "temp-1", label: "Temperature Excursions", count: 28, time: "Today", conf: "96%" },
                          { id: "cal-1", label: "Calibration Issues", count: 8, time: "12d ago", conf: "91%" },
                          { id: "op-1", label: "Operator Errors", count: 4, time: "1m ago", conf: "85%" }
                        ].map(item => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedKnowledgeId(item.id)}
                            className={cn(
                              "p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1",
                              selectedKnowledgeId === item.id
                                ? "bg-white border-[#2C52F5] shadow-xs text-neutral-900"
                                : "bg-white/40 border-neutral-200/50 hover:bg-white text-neutral-600"
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[10px]">{item.label}</span>
                              <span className="font-mono text-[11px] text-[#2C52F5] font-bold">{item.conf}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] text-neutral-400">
                              <span>{item.count} cases linked</span>
                              <span>{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SOP Library */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">SOP Library Mappings</div>
                      <div className="space-y-2">
                        {[
                          { id: "sop-204", label: "SOP-204 Cold Chain Monitoring", count: 42, time: "12 Jun 2026", conf: "95%" },
                          { id: "sop-78", label: "SOP-108 Autoclave Sterility", count: 19, time: "01 May 2026", conf: "92%" }
                        ].map(item => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedKnowledgeId(item.id)}
                            className={cn(
                              "p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1",
                              selectedKnowledgeId === item.id
                                ? "bg-white border-[#2C52F5] shadow-xs text-neutral-900"
                                : "bg-white/40 border-neutral-200/50 hover:bg-white text-neutral-600"
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[10px] truncate">{item.label}</span>
                              <span className="font-mono text-[11px] text-[#2C52F5] font-bold">{item.conf}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] text-neutral-400">
                              <span>{item.count} runs linked</span>
                              <span>{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CAPA Library */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">CAPA Library</div>
                      <div className="space-y-2">
                        {[
                          { id: "capa-2208", label: "CAPA-2208 Valve Calibration", count: 12, time: "Today", conf: "98%" },
                          { id: "capa-1941", label: "CAPA-1941 pH Recovery Protocol", count: 6, time: "Nov 2025", conf: "93%" }
                        ].map(item => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedKnowledgeId(item.id)}
                            className={cn(
                              "p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1",
                              selectedKnowledgeId === item.id
                                ? "bg-white border-[#2C52F5] shadow-xs text-neutral-900"
                                : "bg-white/40 border-neutral-200/50 hover:bg-white text-neutral-600"
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[10px] truncate">{item.label}</span>
                              <span className="font-mono text-[11px] text-[#2C52F5] font-bold">{item.conf}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] text-neutral-400">
                              <span>{item.count} cases linked</span>
                              <span>{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Equipment History */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Equipment History</div>
                      <div className="space-y-2">
                        {[
                          { id: "valve-03", label: "VALVE-03-PM Maintenance Log", count: 8, time: "Today", conf: "98%" },
                          { id: "sensor-09", label: "SENSOR-09-T Drift Analysis", count: 3, time: "Yesterday", conf: "94%" }
                        ].map(item => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedKnowledgeId(item.id)}
                            className={cn(
                              "p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1",
                              selectedKnowledgeId === item.id
                                ? "bg-white border-[#2C52F5] shadow-xs text-neutral-900"
                                : "bg-white/40 border-neutral-200/50 hover:bg-white text-neutral-600"
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[10px] truncate">{item.label}</span>
                              <span className="font-mono text-[11px] text-[#2C52F5] font-bold">{item.conf}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] text-neutral-400">
                              <span>{item.count} logs linked</span>
                              <span>{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Center / Right Content Workspace */}
                <main className="flex-1 overflow-y-auto bg-[#F8F9FC] p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header Title & Actions row */}
                    <div className="flex justify-between items-start select-none">
                      <div className="space-y-1">
                        <h1 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">Knowledge Base</h1>
                        <p className="text-[11.5px] text-[#64748B] leading-relaxed">
                          Validated organizational knowledge used to improve future AI investigations.
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        {/* AI Semantic Search Status Badge */}
                        <div className="flex items-center gap-1.5 bg-[#EFF2FF] border border-[#C0D1FF]/50 rounded-full px-2.5 py-1 text-[10px] font-bold text-[#2C52F5] whitespace-nowrap select-none">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B94FF] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2C52F5]"></span>
                          </span>
                          <span>Semantic Search Active</span>
                        </div>

                        {/* Add Knowledge Button */}
                        <button className="bg-[#2C52F5] hover:bg-[#1E40AF] text-white rounded-xl px-4 py-1.5 text-[10.5px] font-bold shadow-xs transition-colors select-none whitespace-nowrap">
                          Add Knowledge
                        </button>
                      </div>
                    </div>

                    {/* Search and Filters Utility Row */}
                    <div className="flex items-center gap-2.5 select-none pt-1">
                      <div className="flex items-center gap-2 border border-neutral-200 rounded-xl bg-white px-3 py-1.5 shadow-2xs w-72">
                        <Search className="w-3.5 h-3.5 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search Knowledge..."
                          className="bg-transparent border-none text-[11px] focus:outline-none w-full text-neutral-800 placeholder-neutral-400"
                        />
                      </div>

                      <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl px-4 py-1.5 text-[10.5px] font-bold shadow-2xs flex items-center gap-2 transition-colors select-none whitespace-nowrap">
                        <Layers className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Filter</span>
                      </button>
                    </div>

                    {/* 4 Summary Cards */}
                    <div className="grid grid-cols-4 gap-4 select-none">
                      <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                        <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">Validated Cases</div>
                        <div className="text-[18px] font-extrabold text-[#0F172A] mt-1.5 font-mono">318 cases</div>
                        <span className="text-[10px] text-[#64748B] block mt-1">SOP & CAPA cross-linked</span>
                      </div>
                      <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                        <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">Root Cause Patterns</div>
                        <div className="text-[18px] font-extrabold text-[#0F172A] mt-1.5 font-mono">14 patterns</div>
                        <span className="text-[10px] text-[#64748B] block mt-1">Mapped to thermal anomalies</span>
                      </div>
                      <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                        <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">SOP References</div>
                        <div className="text-[18px] font-extrabold text-[#2C52F5] mt-1.5 font-mono">48 SOPs</div>
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Active vault compliance</span>
                      </div>
                      <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs">
                        <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">AI Knowledge Coverage</div>
                        <div className="text-[18px] font-extrabold text-[#0F172A] mt-1.5 font-mono">94.2%</div>
                        <span className="text-[10px] text-[#64748B] block mt-1">Accuracy rate on intake files</span>
                      </div>
                    </div>

                    {/* Two-Column Detail Block */}
                    <div className="grid grid-cols-5 gap-6 select-text">
                      {/* Left 3/5: Knowledge Detail Sheet */}
                      <div className="col-span-3 bg-white border border-neutral-200/35 rounded-3xl p-6 shadow-md space-y-4">
                        <div className="flex justify-between items-start border-b border-neutral-100 pb-4 select-none">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 bg-[#F1F5F9] border border-neutral-200/70 rounded-full px-3 py-1 text-[11px] font-bold text-[#2C52F5]">
                              
                              <span>Used in 42 investigations</span>
                            </span>
                            <h2 className="text-[19px] font-extrabold text-neutral-900 mt-2">
                              {selectedKnowledgeId.startsWith("mech") || selectedKnowledgeId.startsWith("valve") || selectedKnowledgeId.startsWith("capa-2208") || selectedKnowledgeId.startsWith("sop-204")
                                ? "Valve Malfunction & Temperature Excursions"
                                : "Sensor Calibration drift & Drift Telemetry Analysis"}
                            </h2>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-[11.5px] uppercase font-bold text-neutral-400 font-mono select-none">Summary</h4>
                            <p className="text-[11.5px] text-neutral-800 font-medium leading-relaxed mt-1">
                              {selectedKnowledgeId.startsWith("mech") || selectedKnowledgeId.startsWith("valve") || selectedKnowledgeId.startsWith("capa-2208") || selectedKnowledgeId.startsWith("sop-204")
                                ? "Slow temperature hold drift during overnight warehouse sequences caused by refrigeration valve seal degradation."
                                : "Environmental alarm logs flagging false temperature fluctuations due to thermocouple drift on Line 4 bioreactors."}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-[11.5px] uppercase font-bold text-neutral-400 font-mono select-none">AI Explanation</h4>
                            <p className="text-[10.5px] text-neutral-650 leading-relaxed mt-1">
                              {selectedKnowledgeId.startsWith("mech") || selectedKnowledgeId.startsWith("valve") || selectedKnowledgeId.startsWith("capa-2208") || selectedKnowledgeId.startsWith("sop-204")
                                ? "Overnight hold cycles display a characteristic 0.4°C/hour drift curve when the CMMS valve maintenance intervals exceed 180 days. AI models map this thermal profile to automate root cause analysis."
                                : "Bioreactor sensors show high signal noise after continuous runs. Mappings recognize these electrical traces and suggest cleaning-in-place before formal maintenance tickets are triggered."}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-[11.5px] uppercase font-bold text-neutral-400 font-mono select-none">Recommended Preventive Actions</h4>
                            <p className="text-[10.5px] text-neutral-650 leading-relaxed mt-1 font-semibold text-[#2C52F5]">
                              {selectedKnowledgeId.startsWith("mech") || selectedKnowledgeId.startsWith("valve") || selectedKnowledgeId.startsWith("capa-2208") || selectedKnowledgeId.startsWith("sop-204")
                                ? "Adjust CMMS calendar triggers to schedule automatic valve seal replacement upon 150 days elapsed or when valve seal telemetry shows >12% offset."
                                : "Recalibrate Line 4 thermocouples every 90 days. Update the local SOP to force validation steps after clean-in-place operations."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right 2/5: Connections & What the AI Learned */}
                      <div className="col-span-2 space-y-4">
                        {/* Mapped Connections Panel */}
                        <div className="bg-white border border-neutral-200/35 rounded-3xl p-6 shadow-md space-y-4">
                          <div className="border-b border-neutral-100 pb-2 select-none">
                            <h3 className="font-bold text-[10.5px] text-neutral-900">Connections Map</h3>
                          </div>
                          <div className="space-y-3.5 text-[10px] font-medium text-neutral-600">
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Linked SOPs:</span>
                              <span className="text-neutral-900 font-bold">SOP-204 Cold Chain, SOP-311</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Related CAPAs:</span>
                              <span className="text-neutral-900 font-semibold">CAPA-2208 Valve Calibration</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Similar Investigations:</span>
                              <span className="text-[#2C52F5] font-bold">DV-24081, DV-24082, DV-23091</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-500">Equipment Affected:</span>
                              <span className="text-neutral-900 font-semibold">Cold Store Unit 3, Line 4</span>
                            </div>
                          </div>
                        </div>

                        {/* What the AI Learned (Smart Insights) */}
                        <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-3xl p-6 space-y-4">
                          <div className="flex items-center gap-2 text-[#2C52F5] select-none">
                            
                            <h3 className="font-bold text-[10.5px] font-mono uppercase tracking-wider">What the AI learned</h3>
                          </div>

                          <div className="space-y-3.5 text-[10px] text-neutral-700 leading-relaxed font-medium">
                            <div className="flex gap-2.5">
                              <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                              <p>This failure pattern has appeared 8 times in the last 18 months.</p>
                            </div>
                            <div className="flex gap-2.5">
                              <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                              <p>92% of similar cases were caused by refrigeration valve degradation.</p>
                            </div>
                            <div className="flex gap-2.5">
                              <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                              <p>This SOP reduced recurrence by 63% since calibration enforcement.</p>
                            </div>
                            <div className="flex gap-2.5">
                              <Check className="w-3 h-3 text-[#2C52F5] flex-shrink-0 mt-0.5" />
                              <p>Future investigations will automatically reference this knowledge.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Related Investigation Timeline */}
                    <div className="space-y-4 select-none">
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Related Investigation Timeline</div>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { id: "DV-24081", date: "14 Jun 2026", cause: "Valve Failure", sev: "Major", status: "CAPA Created" },
                          { id: "DV-24082", date: "12 Jun 2026", cause: "Calibration Drift", sev: "Minor", status: "Closed" },
                          { id: "DV-23091", date: "15 Nov 2025", cause: "Valve Seal Leak", sev: "Major", status: "Archived" },
                          { id: "DV-22904", date: "02 Sep 2025", cause: "Coolant Loss", sev: "Critical", status: "Equipment Replaced" }
                        ].map((timelineCase, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedKnowledgeId(timelineCase.cause.toLowerCase().includes("valve") ? "mech-1" : "cal-1");
                            }}
                            className="bg-white border border-neutral-200/50 hover:border-[#2C52F5] hover:shadow-xs transition-all rounded-2xl p-4 cursor-pointer space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[11px] text-neutral-400 font-bold">{timelineCase.id}</span>
                              <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">{timelineCase.date}</span>
                            </div>
                            <div>
                              <div className="font-bold text-[10px] text-neutral-900">{timelineCase.cause}</div>
                              <div className="text-[11px] text-neutral-500 mt-0.5">Severity: {timelineCase.sev}</div>
                            </div>
                            <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-[11.5px]">
                              <span className="text-neutral-400">Outcome:</span>
                              <span className="font-bold text-[#2C52F5]">{timelineCase.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </main>

              </div>
            </motion.div>
          )}

          {viewMode === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-[#F8F9FC] select-text overflow-y-auto"
            >
              {/* Header */}
              

              {/* Main Content Dashboard */}
              <div className="px-6 py-10 max-w-[1360px] mx-auto w-full space-y-10 pb-36 bg-white border border-neutral-200/45 rounded-3xl shadow-md my-6">
                
                {/* Reports Header Title & Actions Row */}
                <div className="flex justify-between items-end select-none">
                  <div className="space-y-2">
                    <h1 className="text-[24px] font-extrabold text-neutral-900 tracking-tight">Reports Portal</h1>
                    <p className="text-[11.5px] text-neutral-500 leading-normal">
                      Monitor investigation trends, compliance metrics, and AI performance across your quality operations.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl px-4 py-1.5 text-[10px] font-bold shadow-xs flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>Last 30 Days</span>
                    </button>

                    <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-750 rounded-xl px-4 py-1.5 text-[10px] font-bold shadow-xs flex items-center gap-2">
                      <Download className="w-3 h-3 text-neutral-500" />
                      <span>Export Report</span>
                    </button>

                    <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-755 rounded-xl px-4 py-1.5 text-[10px] font-bold shadow-xs">
                      Schedule Report
                    </button>

                    <button className="bg-[#2C52F5] hover:bg-[#1E40AF] text-white rounded-xl px-5 py-1.5 text-[10px] font-bold shadow-xs">
                      Share Dashboard
                    </button>
                  </div>
                </div>

                {/* 4 Premium Executive Summary Cards */}
                <div className="grid grid-cols-4 gap-4 select-none">
                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between min-h-[100px]">
                    <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">Open Investigations</div>
                    <div className="flex justify-between items-baseline mt-1.5">
                      <div className="text-[18px] font-extrabold text-[#0F172A] font-mono">18 active</div>
                      <span className="text-[10.5px] text-amber-600 font-bold whitespace-nowrap">+3 vs last month</span>
                    </div>
                  </div>
                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between min-h-[100px]">
                    <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">Average Investigation Time</div>
                    <div className="flex justify-between items-baseline mt-1.5">
                      <div className="text-[18px] font-extrabold text-[#0F172A] font-mono">3.2 hours</div>
                      <span className="text-[10.5px] text-emerald-600 font-bold whitespace-nowrap">-72% vs last month</span>
                    </div>
                  </div>
                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between min-h-[100px]">
                    <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">FDA Inspection Readiness</div>
                    <div className="flex justify-between items-baseline mt-1.5">
                      <div className="text-[18px] font-extrabold text-[#0F172A] font-mono">99.8% score</div>
                      <span className="text-[10.5px] text-emerald-600 font-bold whitespace-nowrap">+0.4% vs last month</span>
                    </div>
                  </div>
                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-4.5 shadow-2xs flex flex-col justify-between min-h-[100px]">
                    <div className="text-[9px] font-mono tracking-widest text-[#64748B] uppercase font-bold">AI Time Saved</div>
                    <div className="flex justify-between items-baseline mt-1.5">
                      <div className="text-[18px] font-extrabold text-[#2C52F5] font-mono">1,420 hours</div>
                      <span className="text-[10.5px] text-[#2C52F5] font-bold whitespace-nowrap">+12% vs last month</span>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Visualizations Row 1 */}
                <div className="grid grid-cols-5 gap-6 select-none">
                  {/* Donut Chart Block (2/5) */}
                  <div className="col-span-2 border border-neutral-100 rounded-2xl p-4.5 space-y-4 shadow-2xs bg-white">
                    <h3 className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-widest font-mono">Investigation Status</h3>
                    <div className="flex items-center gap-6 justify-center h-44">
                      {/* Donut Chart Illustration */}
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          {/* Completed: 46% (dasharray 46 100, offset 0) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0F172A" strokeWidth="4.2" strokeDasharray="46 100" strokeDashoffset="0" />
                          {/* In Review: 24% (dasharray 24 100, offset -46) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2C52F5" strokeWidth="4.2" strokeDasharray="24 100" strokeDashoffset="-46" />
                          {/* Open: 18% (dasharray 18 100, offset -70) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.2" strokeDasharray="18 100" strokeDashoffset="-70" />
                          {/* Awaiting Sign-off: 12% (dasharray 12 100, offset -88) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#818CF8" strokeWidth="4.2" strokeDasharray="12 100" strokeDashoffset="-88" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-[20px] font-extrabold text-neutral-900 font-mono">124</span>
                          <span className="text-[8.5px] text-neutral-400 font-bold uppercase mt-0.5 tracking-wider">Total Cases</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[11px] font-semibold text-neutral-600">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-[#0F172A]" />
                          <span>Completed: 46%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-[#2C52F5]" />
                          <span>In Review: 24%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-[#E2E8F0] border border-neutral-300/40" />
                          <span>Open: 18%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-[#818CF8]" />
                          <span>Sign-off: 12%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Trend Chart Block (3/5) */}
                  <div className="col-span-3 border border-neutral-100 rounded-2xl p-4.5 space-y-4 shadow-2xs bg-white">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-widest font-mono">Monthly Investigation Trend</h3>
                      <span className="text-[10px] text-amber-600 font-bold">⚠️ Seasonal summer spikes detected</span>
                    </div>
                    <div className="h-44 w-full relative pt-2">
                      <svg className="w-full h-[140px]" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2C52F5" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#2C52F5" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <path d="M 0 58 C 25 55, 50 35, 75 35 C 100 35, 125 62, 150 62 C 175 62, 200 22, 225 22 C 250 22, 275 48, 300 48 L 300 80 L 0 80 Z" fill="url(#trendGrad)" />
                        {/* Smooth Line */}
                        <path d="M 0 58 C 25 55, 50 35, 75 35 C 100 35, 125 62, 150 62 C 175 62, 200 22, 225 22 C 250 22, 275 48, 300 48" fill="none" stroke="#2C52F5" strokeWidth="2" strokeLinecap="round" />
                        {/* Highlighting Spikes */}
                        <circle cx="75" cy="35" r="3" fill="#EF4444" />
                        <circle cx="225" cy="22" r="3" fill="#EF4444" />
                      </svg>
                      {/* Months Labels */}
                      <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1.5 uppercase tracking-wide px-1.5">
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Visualizations Row 2 */}
                <div className="grid grid-cols-5 gap-6 select-text">
                  {/* Section 3: Most Common Root Causes (3/5) */}
                  <div className="col-span-3 border border-neutral-100 rounded-2xl p-4 space-y-4">
                    <h3 className="text-[10.5px] font-bold text-neutral-905 uppercase tracking-wider font-mono select-none">Most Common Root Causes</h3>
                    <div className="space-y-3.5 pt-1">
                      {[
                        { label: "Equipment Failure", count: 84, pct: "90%" },
                        { label: "Temperature Excursion", count: 62, pct: "72%" },
                        { label: "Calibration Drift", count: 41, pct: "50%" },
                        { label: "Operator Error", count: 18, pct: "25%" },
                        { label: "Documentation Issue", count: 8, pct: "10%" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-[11.5px] font-semibold text-neutral-700">
                            <span>{item.label}</span>
                            <span className="font-mono text-neutral-400">{item.count} cases</span>
                          </div>
                          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div className="bg-[#2C52F5] h-full rounded-full" style={{ width: item.pct }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Compliance Overview Progress Indicators (2/5) */}
                  <div className="col-span-2 border border-neutral-100 rounded-2xl p-4 space-y-4">
                    <h3 className="text-[10.5px] font-bold text-neutral-905 uppercase tracking-wider font-mono select-none">Compliance Overview</h3>
                    <div className="space-y-4 pt-1">
                      {[
                        { label: "Investigation Completion Rate", val: "98%", pct: "98%" },
                        { label: "On-time CAPA Completion", val: "94%", pct: "94%" },
                        { label: "Audit Readiness Score", val: "100%", pct: "100%" },
                        { label: "Evidence Completeness", val: "97%", pct: "97%" },
                        { label: "Human Review Compliance", val: "100%", pct: "100%" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-neutral-700">
                            <span>{item.label}</span>
                            <span className="font-mono text-[#2C52F5] font-bold">{item.val}</span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: item.pct }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 6: Recurring Risk Areas (5 Cards Row) */}
                <div className="space-y-4 select-none">
                  <h3 className="text-[10.5px] font-bold text-neutral-900 uppercase tracking-wider font-mono">Recurring Risk Areas</h3>
                  <div className="grid grid-cols-5 gap-4">
                    {[
                      { area: "Cold Storage", cases: 42, trend: "+4%", risk: "High", color: "text-red-600 bg-red-50 border-red-200/50" },
                      { area: "Packaging Line 2", cases: 18, trend: "-2%", risk: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-250/30" },
                      { area: "Manufacturing Line 3", cases: 29, trend: "+8%", risk: "Medium", color: "text-amber-700 bg-amber-50 border-amber-250/30" },
                      { area: "Sterile Filling", cases: 12, trend: "0%", risk: "Low", color: "text-emerald-600 bg-emerald-50 border-emerald-250/30" },
                      { area: "Raw Warehouse", cases: 31, trend: "+1%", risk: "Medium", color: "text-amber-700 bg-amber-50 border-amber-250/30" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white border border-neutral-200/55 rounded-2xl p-4 hover:shadow-xs transition-shadow space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[10.5px] text-neutral-900">{item.area}</span>
                          <span className={cn("text-[10px] px-2 py-0.5 border rounded-full font-bold font-mono", item.color)}>{item.risk}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <div className="text-[19px] font-extrabold font-mono text-neutral-850">{item.cases} incidents</div>
                          <span className={cn("text-[11px] font-semibold", item.trend.includes("+") ? "text-red-500" : "text-emerald-500")}>
                            {item.trend}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Section: Recent Investigation Activity Table */}
                <div className="space-y-4">
                  <h3 className="text-[10.5px] font-bold text-neutral-900 uppercase tracking-wider font-mono select-none">Recent Investigation Activity</h3>
                  <div className="bg-white border border-neutral-250/30 rounded-3xl p-4 shadow-md">
                    <table className="w-full text-[10px] text-left">
                      <thead>
                        <tr className="border-b border-neutral-100 text-neutral-400 text-[11px] uppercase font-bold font-mono select-none">
                          <th className="pb-4">Investigation ID</th>
                          <th className="pb-4">Root Cause</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Owner</th>
                          <th className="pb-4">Risk Level</th>
                          <th className="pb-4 text-right">Completed Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-neutral-600 font-medium">
                        {[
                          { id: "DV-24081", cause: "VALVE-03-PM Mechanical Failure", status: "Approved", owner: "Anita Rao", risk: "Major", date: "Today" },
                          { id: "DV-24082", cause: "Filter integrity test failure", status: "In Review", owner: "Anita Rao", risk: "Minor", date: "Yesterday" },
                          { id: "DV-23091", cause: "Temp Sensor Drift on Cold Unit 4", status: "Approved", owner: "J. Kapoor", risk: "Major", date: "15 Nov 2025" },
                          { id: "DV-22904", cause: "Refrigerant Coolant Leakage", status: "Closed", owner: "QA Admin", risk: "Critical", date: "02 Sep 2025" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="py-4 font-mono font-bold text-[#2C52F5] select-text">{row.id}</td>
                            <td className="py-4 font-semibold text-neutral-850 select-text">{row.cause}</td>
                            <td className="py-4">
                              <span className="inline-flex items-center gap-1.5 bg-[#F1F5F9] border border-neutral-200/70 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-[#2C52F5] select-none">
                                <span>{row.status}</span>
                              </span>
                            </td>
                            <td className="py-4">{row.owner}</td>
                            <td className="py-4 select-none">
                              <span className={cn(
                                "text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-md",
                                row.risk === "Critical" ? "text-red-700 bg-red-50" : row.risk === "Major" ? "text-amber-700 bg-amber-50" : "text-emerald-700 bg-emerald-50"
                              )}>
                                {row.risk}
                              </span>
                            </td>
                            <td className="py-4 text-right font-mono text-[11px] select-none">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {viewMode === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col bg-[#F8F9FC] select-text overflow-hidden"
            >
              {/* Header */}
              

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left Tabs Sidebar (240px) */}
                <aside className="w-[240px] border-r border-neutral-200/40 bg-[#F9FAFB] p-6 flex-shrink-0 select-none space-y-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-450 font-mono">
                    Settings Menu
                  </div>

                  <div className="space-y-1">
                    {[
                      { id: "profile", label: "Profile Details" },
                      { id: "ai", label: "AI Preferences" },
                      { id: "compliance", label: "Compliance & GxP" },
                      { id: "security", label: "Security & MFA" },
                      { id: "integrations", label: "Integrations (LIMS)" },
                      { id: "audit", label: "Audit Logs" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSettingsTab(tab.id as any)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl transition-all text-[10px] font-semibold",
                          activeSettingsTab === tab.id
                            ? "bg-[#F1F5F9] text-[#0F172A]"
                            : "text-neutral-505 hover:bg-neutral-100 hover:text-neutral-800"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </aside>

                {/* Right Content Workspace */}
                <main className="flex-1 overflow-y-auto bg-[#F8F9FC] p-7 select-text">
                  <div className="max-w-[720px] bg-white border border-neutral-200/35 rounded-3xl p-7 shadow-md space-y-4">
                    
                    {/* Header Details */}
                    <div className="pb-5 select-none">
                      <h2 className="text-[19px] font-extrabold text-neutral-900 tracking-tight">
                        {activeSettingsTab === "profile" && "User Profile"}
                        {activeSettingsTab === "ai" && "AI Preferences & Thresholds"}
                        {activeSettingsTab === "compliance" && "Compliance & FDA 21 CFR Part 11"}
                        {activeSettingsTab === "security" && "Security Protocols"}
                        {activeSettingsTab === "integrations" && "Connected Systems & Integrations"}
                        {activeSettingsTab === "audit" && "System Audit Logs"}
                      </h2>
                      <p className="text-[10.5px] text-neutral-500 mt-1.5 leading-normal">
                        {activeSettingsTab === "profile" && "Manage your professional identity and QA digital signature access."}
                        {activeSettingsTab === "ai" && "Set active confidence scores, automatic CMMS sync policies, and ingestion filters."}
                        {activeSettingsTab === "compliance" && "Manage cryptographic sign-off rules, audit logs, and electronic trace retention."}
                        {activeSettingsTab === "security" && "Configure single sign-on (SSO), session timeout durations, and credentials verification."}
                        {activeSettingsTab === "integrations" && "Review live connections to manufacturing automation platforms and databases."}
                        {activeSettingsTab === "audit" && "Read-only history of system configurations and electronic authorization events."}
                      </p>
                    </div>

                    {/* Tab Sub-views */}
                    {activeSettingsTab === "profile" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Full Name</label>
                            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold text-neutral-750 text-[10px]">
                              Dr. Anita Rao
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">Email Address</label>
                            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-[11.5px] text-neutral-750">
                              dr.rao@klarixa.ai
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">System Role</label>
                            <div className="p-3 bg-[#EFF2FF] border border-[#C0D1FF] rounded-xl font-bold text-[#2C52F5] text-[11.5px] font-mono">
                              QA Director / Sign-off Lead
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">License Scope</label>
                            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl font-semibold text-neutral-750 text-[10px]">
                              Site-Wide GxP Compliance Auth
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === "ai" && (
                      <div className="space-y-4">
                        <div className="space-y-3.5">
                          <div className="flex justify-between items-center select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">Auto-Drafting Investigations</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Automatically ingest new deviations and write analysis drafts.</p>
                            </div>
                            <span className="w-11 h-6 bg-[#2C52F5] rounded-full flex items-center px-1 cursor-pointer">
                              <span className="w-3 h-3 bg-white rounded-full translate-x-5" />
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-t border-neutral-100 pt-3.5 select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">AI Confidence Threshold</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Confidence percentage required to propose a root cause without warnings.</p>
                            </div>
                            <span className="font-mono text-[#2C52F5] font-bold text-[11.5px] bg-[#F1F5F9] px-3.5 py-1.5 rounded-xl border border-neutral-200/50">
                              90% Minimum
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-t border-neutral-100 pt-3.5 select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">Reasoning Verbosity</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Toggle detailed annotation steps and references in draft logs.</p>
                            </div>
                            <select className="bg-white border border-neutral-200 rounded-xl px-3.5 py-2 font-semibold text-neutral-700 text-[14px]">
                              <option>Detailed Annotation</option>
                              <option>Minimal Insights</option>
                              <option>Raw Logs Only</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === "compliance" && (
                      <div className="space-y-4">
                        <div className="space-y-3.5">
                          <div className="flex justify-between items-center select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">FDA 21 CFR Part 11 Protocol</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Forces cryptographic sign-off with username and pin triggers.</p>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-250/30 rounded-full px-3 py-1 text-[11px] font-bold text-emerald-800 font-mono">
                              Enforced
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-t border-neutral-100 pt-3.5 select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">Secure Audit Trail Locking</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Locks chronological updates from deletion or edit once approved.</p>
                            </div>
                            <span className="w-11 h-6 bg-[#2C52F5] rounded-full flex items-center px-1">
                              <span className="w-3 h-3 bg-white rounded-full translate-x-5" />
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-t border-neutral-100 pt-3.5 select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">Archive Retention Span</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">FDA compliant digital record preservation settings.</p>
                            </div>
                            <div className="p-3 bg-[#F1F5F9] border border-neutral-200/50 rounded-xl text-neutral-750 font-bold text-[11.5px] font-mono">
                              10 Years (GxP Standard)
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === "security" && (
                      <div className="space-y-4">
                        <div className="space-y-3.5">
                          <div className="flex justify-between items-center select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">Single Sign-On (SSO)</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Manage credentials using Active Directory (ADFS / Entra ID).</p>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-[#EFF2FF] border border-[#C0D1FF] rounded-full px-3 py-1 text-[11px] font-bold text-[#2C52F5] font-mono">
                              Connected
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-t border-neutral-100 pt-3.5 select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">Multi-Factor Authentication (MFA)</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Forces secondary authenticator codes during profile logins.</p>
                            </div>
                            <span className="w-11 h-6 bg-[#2C52F5] rounded-full flex items-center px-1">
                              <span className="w-3 h-3 bg-white rounded-full translate-x-5" />
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-t border-neutral-100 pt-3.5 select-none">
                            <div>
                              <h4 className="font-bold text-[10.5px] text-neutral-800">Session Timeout limit</h4>
                              <p className="text-[11.5px] text-neutral-450 mt-0.5">Auto-logout duration when the workstation is left unattended.</p>
                            </div>
                            <select className="bg-white border border-neutral-200 rounded-xl px-3.5 py-2 font-semibold text-neutral-700 text-[14px]">
                              <option>15 Minutes (FDA)</option>
                              <option>30 Minutes</option>
                              <option>5 Minutes</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === "integrations" && (
                      <div className="space-y-4 select-none">
                        {[
                          { name: "MES Automation Vault", desc: "Digital batch recording logs", status: "Live", time: "4m ago" },
                          { name: "LIMS Quality Control Lab", desc: "Chemical & purity assay results", status: "Live", time: "12m ago" },
                          { name: "CMMS Maintenance Database", desc: "Equipment log repair tickets", status: "Live", time: "2m ago" },
                          { name: "SAP ERP Enterprise Server", desc: "Material batch tracking codes", status: "Live", time: "1h ago" }
                        ].map((intg, i) => (
                          <div key={i} className="flex justify-between items-center p-4 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-colors">
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-[10.5px] text-neutral-800">{intg.name}</h4>
                              <p className="text-[11px] text-neutral-400">{intg.desc}</p>
                            </div>
                            <div className="flex items-center gap-3.5">
                              <span className="text-[11px] text-neutral-400 font-mono">Sync: {intg.time}</span>
                              <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-bold font-mono">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                <span>{intg.status}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeSettingsTab === "audit" && (
                      <div className="space-y-4">
                        <div className="relative border-l border-neutral-200 ml-3 pl-6 space-y-4.5 text-[14px] font-medium text-neutral-600">
                          {[
                            { log: "User Dr. Anita Rao signed off Deviation DV-24081 (FDA Protocol)", time: "Today · 17:30 IST" },
                            { log: "AI revised draft summary compiled for Case DV-24081", time: "Today · 17:28 IST" },
                            { log: "User Dr. Anita Rao reconciled valve maintenance timestamps", time: "Today · 17:25 IST" },
                            { log: "Automatic LIMS database sync completed for cold storage run", time: "Today · 14:02 IST" }
                          ].map((log, i) => (
                            <div key={i} className="relative">
                              <span className="absolute left-[-29px] top-1 w-2 h-2 rounded-full bg-neutral-300" />
                              <div className="text-neutral-800 leading-normal">{log.log}</div>
                              <div className="text-[11px] text-neutral-400 font-mono mt-0.5">{log.time}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </main>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* EVIDENCE DRAWER MODAL */}
      <AnimatePresence>
        {selectedPreviewDoc && (
          <div className="fixed inset-0 z-50 bg-[#090D1A]/20 backdrop-blur-xs flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-neutral-150 overflow-hidden flex flex-col max-h-[500px]"
            >
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5 font-mono text-[10px] text-neutral-505">
                  <FileText className="w-3 h-3 text-neutral-455" />
                  <span>{selectedPreviewDoc.title} ({selectedPreviewDoc.subtitle})</span>
                </div>
                <button
                  onClick={() => setSelectedPreviewDoc(null)}
                  className="p-1.5 text-neutral-400 hover:bg-neutral-50 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto font-mono text-[10px] text-neutral-650 leading-relaxed whitespace-pre bg-neutral-50 border-t border-neutral-50">
                {selectedPreviewDoc.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 21 CFR PART 11 SIGNATURE MODAL */}
      <AnimatePresence>
        {showSignModal && (
          <div className="fixed inset-0 z-50 bg-[#090D1A]/25 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.form
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onSubmit={handleSignOff}
              className="w-full max-w-xs border border-neutral-150 bg-white rounded-xl shadow-xl p-4 space-y-4 font-mono text-[10px] text-neutral-850"
            >
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <Shield className="w-3 h-3 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-neutral-905 leading-none text-[10px]">Electronic Signature</h3>
                  <span className="text-[10px] text-[#94A3B8] uppercase block mt-0.5">FDA 21 CFR Part 11 Protocol</span>
                </div>
              </div>

              <p className="text-[10px] text-neutral-550 leading-relaxed font-sans">
                Enter credentials to sign and approve investigation.
              </p>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 uppercase font-bold block">User ID</label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials((c) => ({ ...c, username: e.target.value }))}
                    className="w-full p-2 border border-[#E2E8F0] rounded focus:outline-none focus:ring-1 focus:ring-[#2C52F5] text-[10px] font-mono bg-white"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-400 uppercase font-bold block">Pin Code</label>
                  <input
                    type="password"
                    placeholder="••••"
                    value={credentials.pin}
                    onChange={(e) => setCredentials((c) => ({ ...c, pin: e.target.value }))}
                    className="w-full p-2 border border-[#E2E8F0] rounded focus:outline-none focus:ring-1 focus:ring-[#2C52F5] text-[10px] font-mono bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-100 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-3.5 py-1.5 hover:bg-neutral-50 rounded text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigning}
                  className="px-4 py-1.5 bg-[#090D1A] hover:bg-[#1e293b] text-white font-medium rounded shadow flex items-center gap-1"
                >
                  {isSigning ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Signing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Authorize</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
