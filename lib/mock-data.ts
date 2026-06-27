export interface SourceDoc {
  id: string;
  name: string;
  type: "pdf" | "csv" | "log";
  pages?: { [key: number]: string };
  content: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: "nominal" | "deviation" | "anomaly";
  parameterValue?: string;
  verified: boolean;
  citation?: {
    docId: string;
    docName: string;
    page: number;
    text: string;
  };
}

export interface RootCause {
  id: string;
  title: string;
  confidence: number;
  reasoning: string;
  evidence: string[];
  sources: {
    docId: string;
    docName: string;
    page: number;
    text: string;
  }[];
  status: "pending" | "accepted" | "rejected";
}

export interface ProductImpact {
  summary: string;
  severity: "none" | "minor" | "major" | "critical";
  status: "pending" | "draft" | "verified";
  metrics: {
    name: string;
    value: string;
    limit: string;
    status: "pass" | "fail" | "warning";
  }[];
}

export interface CAPAItem {
  id: string;
  type: "preventive" | "corrective";
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  status: "pending" | "approved" | "rejected";
  citation?: string;
}

export interface AuditEntry {
  timestamp: string;
  user: "Sarah S. (Quality Investigator)" | "Klarixa AI Agent";
  action: string;
}

export interface DeviationCase {
  id: string;
  deviationId: string;
  title: string;
  batchCode: string;
  status: "intake" | "timeline" | "rca" | "impact" | "capa" | "completed";
  description: string;
  docs: SourceDoc[];
  timeline: TimelineEvent[];
  rootCauses: RootCause[];
  productImpact: ProductImpact;
  capas: CAPAItem[];
  auditLog: AuditEntry[];
}

export const mockCases: DeviationCase[] = [
  {
    id: "case-1",
    deviationId: "DEV-2026-089",
    title: "Bioreactor 4 pH Excursion",
    batchCode: "#B4029-X",
    status: "intake",
    description: "The pH level in Bioreactor 4 fell below the lower control limit of 6.80 for a duration of 32 minutes during the cell growth phase of Batch #B4029.",
    docs: [
      {
        id: "doc-1",
        name: "MES_Bioreactor_4_Logs.csv",
        type: "csv",
        content: `Timestamp,Parameter,Value,Status,OperatorId\n13:45:00,pH,7.02,NORMAL,OP-102\n13:50:00,pH,6.98,NORMAL,OP-102\n13:55:00,pH,6.85,NORMAL,OP-102\n14:00:00,pH,6.79,WARNING,OP-102\n14:02:30,pH,6.45,OUT-OF-SPEC,OP-102\n14:05:12,pH,6.32,OUT-OF-SPEC,OP-102\n14:10:00,pH,6.28,OUT-OF-SPEC,OP-102\n14:15:00,pH,6.25,OUT-OF-SPEC,OP-102\n14:20:00,pH,6.21,OUT-OF-SPEC,OP-102\n14:25:00,pH,6.20,OUT-OF-SPEC,OP-102\n14:30:00,pH,6.21,OUT-OF-SPEC,OP-102\n14:34:30,pH,6.95,NORMAL,OP-102\n14:40:00,pH,6.98,NORMAL,OP-102`
      },
      {
        id: "doc-2",
        name: "LIMS_pH_Verification.pdf",
        type: "pdf",
        pages: {
          1: "LIMS LABORATORY VERIFICATION REPORT\nDocument ID: LVR-2026-894\nDate: 2026-06-27\nBatch Reference: Batch #B4029-X\nEquipment: Bioreactor 4 pH Probe\n\nEXECUTIVE SUMMARY:\nFollowing a pH excursion alert at 14:05, a manual sample was drawn for laboratory verification. This report documents the calibration drift analysis.",
          2: "Page 2 of 4\nSAMPLING METHODOLOGY:\nAt 14:15:00, Operator OP-102 pulled a 10mL sample from Bioreactor 4 sample port C.\nThe sample was immediately transferred to Lab Bench #4 for testing. \nBenchtop pH testing was performed using the Metrohm 913 pH Meter (Equipment ID: EQ-913, calibrated 2026-06-25).\n\nRESULTS:\nMeasured pH on Benchtop Meter: 7.01 pH.\nActive Bioreactor Probe Reading at time of sampling: 6.25 pH.\nVariance: +0.76 pH (indicates significant negative drift in the active bioreactor probe).",
          3: "Page 3 of 4\nCALIBRATION DRIFT ANALYSIS:\nPost-run diagnostic on Bioreactor Probe (Sensor ID: PH-B4-09) showed substantial fouling on the glass membrane.\nThe presence of proteinaceous deposition was noted, typical of late-stage growth phase accumulation. \nCleaning with pepsin/HCl solution restored response times.",
          4: "Page 4 of 4\nCORRECTIVE ACTION COMPLETED:\nAt 14:34:30, the probe was recalibrated in-situ using standard pH 4.01 and 7.00 buffer solutions. \nPost-calibration verification reading: 6.95 pH (actual benchtop correlation: 6.97 pH). Variance reduced to within tolerances (<0.05 pH)."
        },
        content: "LIMS Laboratory Verification Report (LVR-2026-894). Summary of benchtop verification (7.01 pH vs bioreactor 6.25 pH) confirming calibration drift."
      },
      {
        id: "doc-3",
        name: "SOP-204-v5.pdf",
        type: "pdf",
        pages: {
          1: "STANDARD OPERATING PROCEDURE: BIOREACTOR OPERATION\nDocument Code: SOP-204\nVersion: 5.0\nDepartment: Upstream Bioprocessing\n\n1. PURPOSE\nTo define operational ranges and response protocols for upstream culture bioreactors.",
          12: "Page 12 of 34\nSECTION 4.2: pH CONTROL AND ALARMS\nThe operational setpoint for CHO cell culture is 7.10 pH.\nOperational Range: 6.80 to 7.40 pH.\nAlert Limits: < 6.90 or > 7.30 pH.\nAction/Deviation Limits: < 6.80 or > 7.40 pH.\n\nCRITICAL DIRECTIVE:\nIf the pH level exceeds or falls below the Action/Deviation range for more than 10 consecutive minutes, a deviation record must be generated immediately. Operators must initiate a manual sampling run to verify pH using benchtop systems before altering acid/base feed rates."
        },
        content: "Standard Operating Procedure: Bioreactor Operation (SOP-204-v5). Page 12 specifies deviation limits (< 6.80 pH for >10 mins) and actions."
      },
      {
        id: "doc-4",
        name: "DEV-2025-112.pdf",
        type: "pdf",
        pages: {
          1: "HISTORICAL DEVIATION REPORT\nReport Code: DEV-2025-112\nDate: 2025-11-14\nLocation: Bioreactor 4\n\nINCIDENT SUMMARY:\nA similar pH deviation occurred during cell culture Batch #B3889. The pH reading dropped to 6.35. A benchtop sample read 6.90.\n\nROOT CAUSE:\nIdentified as electrode fouling. The probe had been in service for 34 days without polishing, leading to false low readings.\n\nPREVENTIVE ACTION (CAPA):\nIt was recommended that probes are polished with standard enzyme cleaning solution every 21 days."
        },
        content: "Historical Deviation Report DEV-2025-112. Documented previous pH sensor fouling on Bioreactor 4."
      }
    ],
    timeline: [
      {
        id: "ev-1",
        time: "13:45:00",
        title: "Initial Normal Operation",
        description: "Bioreactor 4 pH is stable at 7.02 pH under normal PID base control.",
        status: "nominal",
        parameterValue: "7.02 pH",
        verified: false,
        citation: {
          docId: "doc-1",
          docName: "MES_Bioreactor_4_Logs.csv",
          page: 1,
          text: "13:45:00,pH,7.02,NORMAL"
        }
      },
      {
        id: "ev-2",
        time: "14:00:00",
        title: "pH Warning Threshold Crossed",
        description: "pH reading drops below the alert limit of 6.90, reaching 6.79 pH. No base addition is automatically triggered as probe readings drop.",
        status: "anomaly",
        parameterValue: "6.79 pH",
        verified: false,
        citation: {
          docId: "doc-1",
          docName: "MES_Bioreactor_4_Logs.csv",
          page: 1,
          text: "14:00:00,pH,6.79,WARNING"
        }
      },
      {
        id: "ev-3",
        time: "14:02:30",
        title: "pH Deviation Action Limit Failure",
        description: "pH reading reaches 6.45, falling below the action limit of 6.80. This marks the beginning of the 10-minute deviation timer.",
        status: "deviation",
        parameterValue: "6.45 pH",
        verified: false,
        citation: {
          docId: "doc-3",
          docName: "SOP-204-v5.pdf",
          page: 12,
          text: "Action/Deviation Limits: < 6.80 or > 7.40 pH. ... If pH falls below the Action/Deviation range for more than 10 consecutive minutes, a deviation record must be generated"
        }
      },
      {
        id: "ev-4",
        time: "14:05:12",
        title: "Control Room Alarm Triggered",
        description: "Audible control room alarm sounds. Operator initiates troubleshooting according to SOP-204.",
        status: "anomaly",
        parameterValue: "6.32 pH",
        verified: false,
        citation: {
          docId: "doc-1",
          docName: "MES_Bioreactor_4_Logs.csv",
          page: 1,
          text: "14:05:12,pH,6.32,OUT-OF-SPEC"
        }
      },
      {
        id: "ev-5",
        time: "14:15:00",
        title: "Manual Quality Verification Sample",
        description: "Operator draws sample for benchtop verification. LIMS testing measures the true sample pH at 7.01 pH, showing a discrepancy of 0.76 pH from the active bioreactor probe.",
        status: "nominal",
        parameterValue: "7.01 pH (LIMS)",
        verified: false,
        citation: {
          docId: "doc-2",
          docName: "LIMS_pH_Verification.pdf",
          page: 2,
          text: "Measured pH on Benchtop Meter: 7.01 pH. Active Bioreactor Probe Reading at time of sampling: 6.25 pH. Variance: +0.76 pH"
        }
      },
      {
        id: "ev-6",
        time: "14:34:30",
        title: "In-situ Calibration and Resolution",
        description: "In-situ recalibration completes. pH reading immediately corrects to 6.95, resolving the deviation state. Total duration of deviation reading: 32 minutes.",
        status: "nominal",
        parameterValue: "6.95 pH",
        verified: false,
        citation: {
          docId: "doc-2",
          docName: "LIMS_pH_Verification.pdf",
          page: 4,
          text: "At 14:34:30, the probe was recalibrated in-situ ... reading: 6.95 pH"
        }
      }
    ],
    rootCauses: [
      {
        id: "rc-1",
        title: "Sensor Fouling and Drift",
        confidence: 89,
        reasoning: "The laboratory benchtop measurement of 7.01 pH compared to the bioreactor probe's reading of 6.25 pH confirms a false negative sensor drift. Post-run inspections verified heavy proteinaceous deposits on the probe membrane, which isolates the electrode, dragging the electrical potential downwards.",
        evidence: [
          "LIMS benchtop reading indicates true culture pH was well within operational specifications (7.01 pH vs setpoint 7.10 pH).",
          "Visual inspection reports confirm protein fouling on probe PH-B4-09.",
          "Perfect match with historical deviation case DEV-2025-112."
        ],
        sources: [
          {
            docId: "doc-2",
            docName: "LIMS_pH_Verification.pdf",
            page: 2,
            text: "Measured pH on Benchtop Meter: 7.01 pH. Active Bioreactor Probe Reading at time of sampling: 6.25 pH."
          },
          {
            docId: "doc-4",
            docName: "DEV-2025-112.pdf",
            page: 1,
            text: "The probe had been in service for 34 days without polishing, leading to false low readings."
          }
        ],
        status: "pending"
      },
      {
        id: "rc-2",
        title: "Acid Line Ingress / Valve Leakage",
        confidence: 23,
        reasoning: "A mechanical failure of the CO2 or phosphoric acid supply valve could cause localized acidification, reducing the pH. However, active flow metrics from the acid feed line show no flow volume, and tank weight was unchanged during the deviation period.",
        evidence: [
          "Acid flow valve state was recorded as closed (0% command) throughout the excursion.",
          "LIMS benchtop reading is inconsistent with physical acidification (benchtop sample was 7.01 pH)."
        ],
        sources: [
          {
            docId: "doc-1",
            docName: "MES_Bioreactor_4_Logs.csv",
            page: 1,
            text: "14:02:30,pH,6.45,OUT-OF-SPEC"
          }
        ],
        status: "pending"
      },
      {
        id: "rc-3",
        title: "Batch Microbial Contamination",
        confidence: 11,
        reasoning: "An active contamination by acid-producing contaminants (e.g. lactobacillus) could drive pH down. However, cell culture characteristics (viability 98.4%) and rapid recovery post-calibration rule out active culture contamination.",
        evidence: [
          "Cell viability remained constant at 98.4% (growth is not impaired).",
          "Gram-stain results from sample drawn at 14:15 returned negative for microbial contaminants."
        ],
        sources: [
          {
            docId: "doc-2",
            docName: "LIMS_pH_Verification.pdf",
            page: 2,
            text: "results: Measured pH on Benchtop Meter: 7.01 pH."
          }
        ],
        status: "pending"
      }
    ],
    productImpact: {
      summary: "No impact on product quality, efficacy, or safety. The culture pH did not deviate from the target control limits; rather, the bioreactor pH sensor experienced false low readings. Verified by benchtop verification (7.01 pH). Cell growth rate, viability, and nutrient profiles remain within established historical bounds.",
      severity: "none",
      status: "pending",
      metrics: [
        { name: "Cell Viability", value: "98.4%", limit: ">= 85.0%", status: "pass" },
        { name: "Viable Cell Density", value: "12.4 x 10⁶/mL", limit: ">= 10.0 x 10⁶/mL", status: "pass" },
        { name: "Lactate Accumulation", value: "1.2 g/L", limit: "<= 2.5 g/L", status: "pass" },
        { name: "Benchtop Correlated pH", value: "7.01 pH", limit: "6.80 - 7.40 pH", status: "pass" }
      ]
    },
    capas: [
      {
        id: "capa-1",
        type: "corrective",
        title: "Standardize Probe Polishing Schedule",
        description: "Establish a mandatory cleaning and polishing cycle for pH probes on Bioreactor 4 with enzyme solution every 21 days of active culture runtime, to prevent protein deposit fouling as detailed in historical report DEV-2025-112.",
        owner: "Engineering Ops (Upstream)",
        dueDate: "2026-07-15",
        status: "pending",
        citation: "DEV-2025-112.pdf"
      },
      {
        id: "capa-2",
        type: "preventive",
        title: "Implement Dual-Sensor pH Verification skid",
        description: "Modify the bioreactor control software schema to support dual pH electrodes. If a discrepancy exceeding 0.20 pH between the active and backup probe occurs for >5 minutes, raise an early alarm flag to pre-empt formal excursions.",
        owner: "Automation Engineering",
        dueDate: "2026-08-30",
        status: "pending",
        citation: "LIMS_pH_Verification.pdf"
      }
    ],
    auditLog: [
      { timestamp: "2026-06-27T10:00:00Z", user: "Klarixa AI Agent", action: "Deviation intake file ingestion: Ingested 4 files." },
      { timestamp: "2026-06-27T10:00:05Z", user: "Klarixa AI Agent", action: "Parsed logs and created timeline draft containing 6 events." },
      { timestamp: "2026-06-27T10:00:10Z", user: "Klarixa AI Agent", action: "Identified calibration drift as high probability root cause (89% confidence)." }
    ]
  },
  {
    id: "case-2",
    deviationId: "DEV-2026-092",
    title: "Product Filter Integrity Test Failure",
    batchCode: "#B4031-S",
    status: "intake",
    description: "The product filter (sterile grade, 0.22 micron) failed the post-filtration bubble point integrity test for sterile Batch #B4031-S.",
    docs: [
      {
        id: "doc-2-1",
        name: "Filter_Integrity_Report.pdf",
        type: "pdf",
        pages: {
          1: "FILTER INTEGRITY TESTING LOG\nBatch: #B4031-S\nFilter Serial Number: FL-99422\nOperator: OP-205\n\nPRE-USE INTEGRITY:\nBubble Point: Passed (42 psi, Specification: >= 40 psi)\n\nPOST-USE INTEGRITY:\nBubble Point: Failed (38 psi, Specification: >= 40 psi)\nStatus: OUT-OF-SPEC\n\nCOMMENTS:\nMinor leak detected during nitrogen pressurization. Visual examination shows seal area moisture."
        },
        content: "Filter Integrity Testing Log showing Bubble Point failure at 38 psi after batch filtration."
      },
      {
        id: "doc-2-2",
        name: "SOP-410-v3.pdf",
        type: "pdf",
        pages: {
          1: "SOP-410: FILTRATION PROCESS AND INTEGRITY VERIFICATION\n\nSection 8.4: Failures in Integrity Testing:\nIf a post-use filter fails bubble point testing, all filtrate must be contained in sterile holding tank T-104.\nAn immediate investigation must evaluate: (1) O-ring and gasket alignment, (2) Filter membrane rupture, (3) Product residue influence."
        },
        content: "SOP-410: Filtration process standard procedures. Outlines container requirements and investigation stages."
      }
    ],
    timeline: [
      {
        id: "ev-2-1",
        time: "09:12:00",
        title: "Pre-Use Bubble Point Passed",
        description: "Bubble point measured at 42 psi, confirming sterile filtration skid integrity.",
        status: "nominal",
        parameterValue: "42 psi",
        verified: false,
        citation: {
          docId: "doc-2-1",
          docName: "Filter_Integrity_Report.pdf",
          page: 1,
          text: "Bubble Point: Passed (42 psi, Specification: >= 40 psi)"
        }
      },
      {
        id: "ev-2-2",
        time: "10:30:00",
        title: "Filtration Run Initiated",
        description: "Sterile product transfer into filtrate tank T-104 started.",
        status: "nominal",
        verified: false
      },
      {
        id: "ev-2-3",
        time: "12:15:00",
        title: "Post-Use Bubble Point Failed",
        description: "Post-filtration integrity test fails at 38 psi, triggering deviation alert.",
        status: "deviation",
        parameterValue: "38 psi",
        verified: false,
        citation: {
          docId: "doc-2-1",
          docName: "Filter_Integrity_Report.pdf",
          page: 1,
          text: "Bubble Point: Failed (38 psi, Specification: >= 40 psi)"
        }
      }
    ],
    rootCauses: [
      {
        id: "rc-2-1",
        title: "Pinched Filter O-Ring Seal",
        confidence: 74,
        reasoning: "Nitrogen gas leaked from the seal edge during bubble point testing. Disassembly of the filter housing showed a deformed silicone O-ring pinched between the housing cap, which explains gas bypass during testing while maintaining membrane sterility.",
        evidence: [
          "Visual inspection reports mention seal area moisture and minor seal deformation.",
          "Similar occurrences in DEV-2024-041 showed pinched seals can bypass test gas without breaching sterilizing membrane."
        ],
        sources: [
          {
            docId: "doc-2-1",
            docName: "Filter_Integrity_Report.pdf",
            page: 1,
            text: "Minor leak detected during nitrogen pressurization. Visual examination shows seal area moisture."
          }
        ],
        status: "pending"
      },
      {
        id: "rc-2-2",
        title: "Filter Membrane Rupture / Pores Damage",
        confidence: 19,
        reasoning: "A physical tear in the polyethersulfone (PES) membrane would bypass bacteria and fail test pressures. However, post-test water intrusion and micro-imaging did not detect structural tears in the membrane itself.",
        evidence: [
          "Downstream bioburden testing returned compliant results (no CFU growth).",
          "Membrane integrity verified under magnification."
        ],
        sources: [
          {
            docId: "doc-2-2",
            docName: "SOP-410-v3.pdf",
            page: 1,
            text: "An immediate investigation must evaluate: (1) O-ring and gasket alignment, (2) Filter membrane rupture"
          }
        ],
        status: "pending"
      }
    ],
    productImpact: {
      summary: "Minor potential risk. While the primary filter seal leaked during high-pressure gas testing, downstream media bioburden samples were completely sterile (0 CFU). The product remains contained in holding tank T-104 pending final QA sterility results.",
      severity: "minor",
      status: "pending",
      metrics: [
        { name: "Downstream Bioburden", value: "0 CFU/100mL", limit: "< 1 CFU/100mL", status: "pass" },
        { name: "Endotoxin Level", value: "< 0.05 EU/mL", limit: "< 0.25 EU/mL", status: "pass" },
        { name: "Filter Pressure Drop", value: "0.2 bar", limit: "<= 0.5 bar", status: "pass" }
      ]
    },
    capas: [
      {
        id: "capa-2-1",
        type: "corrective",
        title: "Filter Housing O-Ring Replacement",
        description: "Replace the silicone O-ring seal on the sterile filter housing skid and verify no physical grooves or wear on the housing interface flange.",
        owner: "Maintenance Staff",
        dueDate: "2026-06-29",
        status: "pending",
        citation: "Filter_Integrity_Report.pdf"
      }
    ],
    auditLog: [
      { timestamp: "2026-06-27T12:30:00Z", user: "Klarixa AI Agent", action: "Deviation intake file ingestion: Ingested 2 files." },
      { timestamp: "2026-06-27T12:30:05Z", user: "Klarixa AI Agent", action: "Parsed Bubble Point logs, flagged post-use failure at 38 psi." }
    ]
  }
];
