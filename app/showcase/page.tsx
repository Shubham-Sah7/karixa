import Image from "next/image"

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN FRAME — embeds the real production app in an iframe
// ─────────────────────────────────────────────────────────────────────────────

function ScreenFrame({ screen, label }: { screen: string; label: string }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        border: "1px solid #E5E7EB",
        boxShadow: "0 40px 100px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.05)",
        background: "#fff",
        width: 1024,
        height: 640,
        margin: "0 auto",
      }}
    >
      <iframe
        src={`/?_screen=${screen}`}
        title={label}
        style={{
          width: 1280,
          height: 800,
          transform: "scale(0.8)",
          transformOrigin: "top left",
          border: "none",
          display: "block",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ANNOTATION CALLOUT
// ─────────────────────────────────────────────────────────────────────────────

function Callout({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#EFF2FF",
          color: "#111111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
          marginTop: 1,
          border: "1.5px solid #C7D2FE",
          fontFamily: "monospace",
        }}
      >
        {n}
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4, lineHeight: 1.3 }}>
          {title}
        </p>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>{body}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN SECTION
// ─────────────────────────────────────────────────────────────────────────────

function ScreenSection({
  number,
  tag,
  title,
  purpose,
  screen,
  callouts,
}: {
  number: number
  tag: string
  title: string
  purpose: string
  screen: string
  callouts: { title: string; body: string }[]
}) {
  return (
    <section style={{ marginBottom: 140 }}>
      {/* Label */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", marginBottom: 28 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#2C52F5",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Screen {number} &nbsp;·&nbsp; {tag}
        </p>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: -0.5,
            marginBottom: 14,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.75, maxWidth: 580 }}>{purpose}</p>
      </div>

      {/* Screen frame */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", marginBottom: 40 }}>
        <ScreenFrame screen={screen} label={title} />
      </div>

      {/* Annotation grid */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#9CA3AF",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Design annotations
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          {callouts.map((c, i) => (
            <Callout key={i} n={i + 1} title={c.title} body={c.body} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN PRINCIPLE CARD
// ─────────────────────────────────────────────────────────────────────────────

function PrincipleCard({
  number,
  title,
  body,
}: {
  number: number
  title: string
  body: string
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        padding: "28px 28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#EFF2FF",
          color: "#111111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 800,
          fontFamily: "monospace",
          border: "1px solid #C7D2FE",
        }}
      >
        {String(number).padStart(2, "0")}
      </div>
      <p style={{ fontSize: 17, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{title}</p>
      <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>{body}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOW NODE
// ─────────────────────────────────────────────────────────────────────────────

function FlowNode({
  label,
  badge,
  badgeColor,
  last,
}: {
  label: string
  badge?: string
  badgeColor?: string
  last?: boolean
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: 320,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{label}</p>
        {badge && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 6,
              background: badgeColor === "blue" ? "#EFF2FF" : badgeColor === "green" ? "#ECFDF5" : "#F3F4F6",
              color: badgeColor === "blue" ? "#2C52F5" : badgeColor === "green" ? "#059669" : "#374151",
              border: badgeColor === "blue"
                ? "1px solid #C7D2FE"
                : badgeColor === "green"
                ? "1px solid #A7F3D0"
                : "1px solid #E5E7EB",
              flexShrink: 0,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {!last && (
        <div
          style={{
            width: 1.5,
            height: 32,
            background: "#E5E7EB",
            position: "relative",
          }}
        >
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)" }}
          >
            <path d="M0 0 L5 6 L10 0" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// IA NODE
// ─────────────────────────────────────────────────────────────────────────────

function IARow({ label, sub, active }: { label: string; sub: string; active?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: active ? "#EFF2FF" : "transparent",
        borderRadius: 10,
        border: active ? "1px solid #C7D2FE" : "1px solid transparent",
      }}
    >
      <p style={{ fontSize: 15, fontWeight: active ? 700 : 500, color: active ? "#2C52F5" : "#374151" }}>
        {label}
      </p>
      <p style={{ fontSize: 13, color: "#9CA3AF" }}>{sub}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HORIZONTAL RULE
// ─────────────────────────────────────────────────────────────────────────────

function HR() {
  return <div style={{ height: 1, background: "#F3F4F6", margin: "80px 0" }} />
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ShowcasePage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #FAFAFA; }
        @media print {
          @page { size: A4 landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
          color: "#111827",
          background: "#FAFAFA",
          minHeight: "100vh",
        }}
      >

        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <header style={{ background: "#fff", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px 72px" }}>

            {/* Badge + Logo row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 48,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <Image
                src="/logo.png"
                alt="Klarixa"
                width={180}
                height={52}
                style={{ objectFit: "contain", objectPosition: "left" }}
                priority
              />
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "6px 12px",
                    borderRadius: 20,
                    background: "#EFF2FF",
                    color: "#2C52F5",
                    border: "1px solid #C7D2FE",
                    letterSpacing: "0.05em",
                  }}
                >
                  Founding Product Designer Assignment
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "6px 12px",
                    borderRadius: 20,
                    background: "#F3F4F6",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    letterSpacing: "0.05em",
                  }}
                >
                  June 2026
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: -1.5,
                lineHeight: 1.1,
                marginBottom: 24,
                maxWidth: 720,
              }}
            >
              AI-Powered Pharmaceutical Investigation Platform
            </h1>
            <p style={{ fontSize: 20, color: "#6B7280", lineHeight: 1.65, maxWidth: 600, marginBottom: 48 }}>
              A structured workflow where AI prepares the investigation
              and humans make the final regulatory decision.
            </p>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                gap: 40,
                padding: "20px 0",
                borderTop: "1px solid #F3F4F6",
                flexWrap: "wrap",
              }}
            >
              {[
                ["Role", "Product Designer"],
                ["Domain", "Pharma Quality & GxP Compliance"],
                ["Screens", "7 screens across 1 workspace"],
                ["Approach", "Enterprise AI with Human-in-the-Loop"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>
                    {k}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════════
            PROBLEM
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>

          <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            The Problem
          </p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 20 }}>
            Pharmaceutical investigations take weeks.<br />They shouldn't.
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.8, maxWidth: 600, marginBottom: 48 }}>
            When something goes wrong during drug manufacturing, investigators must determine
            exactly what happened, why it happened, and whether the medicine is safe.
            This is not optional — it is a regulatory requirement. Today, the process is manual,
            fragmented, and takes far too long.
          </p>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 56 }}>
            {[
              { stat: "12+", label: "Disconnected systems", desc: "Investigators switch between MES, LIMS, QMS, equipment logs, email, and more — manually." },
              { stat: "3 wks", label: "Average investigation time", desc: "A single deviation investigation can take weeks of manual cross-referencing and report writing." },
              { stat: "100s", label: "Pages reviewed per case", desc: "Every investigation requires reading hundreds of pages of logs, SOPs, and historical records." },
            ].map(({ stat, label, desc }) => (
              <div
                key={label}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 16,
                  padding: "28px 24px",
                }}
              >
                <p style={{ fontSize: 44, fontWeight: 800, color: "#111827", letterSpacing: -1, lineHeight: 1, marginBottom: 8 }}>
                  {stat}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* What is a deviation */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E5E7EB",
              borderRadius: 20,
              padding: "40px",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>
              What is a pharmaceutical deviation?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.8 }}>
                  Medicine production operates inside predefined limits. Temperature, pressure, equipment
                  status, lab readings — everything must stay within specification. When anything deviates
                  from those limits, production cannot simply continue.
                </p>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.8 }}>
                  The company is required by law to investigate: What happened? When? Why? Was the
                  medicine affected? Can this batch be released? Every step must be documented,
                  verified, and signed off by a qualified investigator.
                </p>
              </div>
            </div>
          </div>
        </section>

        <HR />

        {/* ══════════════════════════════════════════════════════════════════
            SOLUTION
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 80px" }}>

          <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            The Solution
          </p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 20 }}>
            An AI teammate, not an AI replacement.
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.8, maxWidth: 600, marginBottom: 48 }}>
            Klarixa connects to every system in the investigation workflow, automatically
            collects and analyses evidence, and prepares a complete investigation dossier.
            The investigator reviews, edits, and approves. The AI never makes the final decision.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              ["Collects evidence automatically", "Connects to MES, LIMS, QMS and ingests relevant records the moment a deviation is detected."],
              ["Reads and connects documents", "Analyses sensor logs, SOPs, maintenance records, and lab reports to find relevant information."],
              ["Proposes root causes with evidence", "Every hypothesis is backed by a specific document, timestamp, or historical pattern."],
              ["Drafts the investigation report", "Writes structured dossier sections the investigator can edit and approve, not just read."],
              ["Explains every conclusion", "Investigators always see why the AI reached a finding — confidence score, evidence chain, and reasoning."],
              ["Keeps humans responsible", "No AI output is final. Every conclusion, every action, every decision requires explicit human sign-off."],
            ].map(([title, body]) => (
              <div
                key={title}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  padding: "20px 22px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#2C52F5",
                    flexShrink: 0,
                    marginTop: 7,
                  }}
                />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <HR />

        {/* ══════════════════════════════════════════════════════════════════
            PHILOSOPHY
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ background: "#fff", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>

            <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              Design Philosophy
            </p>

            {/* Big statement */}
            <div
              style={{
                background: "#111827",
                borderRadius: 20,
                padding: "48px 48px",
                marginBottom: 32,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
                The most important design decision
              </p>
              <h3
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: -0.8,
                  lineHeight: 1.2,
                  marginBottom: 20,
                  maxWidth: 520,
                }}
              >
                This is not a chatbot.
              </h3>
              <p style={{ fontSize: 16, color: "#9CA3AF", lineHeight: 1.8, maxWidth: 500 }}>
                Investigators already know their job. They don't want to prompt an AI with questions.
                They want the investigation done, explained, and ready to review. Klarixa is a
                structured workspace, not a conversation.
              </p>
            </div>

            {/* Contrast cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 14,
                  padding: "24px 24px",
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
                  ✗ &nbsp; Not this
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  "Tell me about this deviation."
                </p>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>
                  Asking investigators to prompt an AI forces them to think of the right questions, translate
                  their domain knowledge into prompts, and manually synthesise the answers into a report.
                  This is more work than the current system.
                </p>
              </div>
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 14,
                  padding: "24px 24px",
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
                  ✓ &nbsp; This instead
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                  AI investigates. Human approves.
                </p>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>
                  The AI proactively collects evidence, builds the timeline, proposes root causes, and
                  drafts the dossier. The investigator reviews what the AI prepared, edits where needed,
                  and signs off. The workflow matches how experts already think.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            USER + GOALS
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

            {/* User persona */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
                Primary User
              </p>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 16,
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "#111827",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#fff",
                  }}
                >
                  QI
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Quality Investigator</p>
                <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 20 }}>Senior role · FDA-regulated environment</p>
                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
                    Responsibilities
                  </p>
                  {[
                    "Investigate manufacturing deviations",
                    "Verify evidence and root causes",
                    "Approve investigation dossiers",
                    "Maintain FDA 21 CFR Part 11 compliance",
                    "Prepare inspection-ready reports",
                  ].map((r) => (
                    <div key={r} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2C52F5", flexShrink: 0, marginTop: 6 }} />
                      <p style={{ fontSize: 14, color: "#4B5563" }}>{r}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20, marginTop: 8 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
                    Primary goal
                  </p>
                  <p style={{ fontSize: 14, fontStyle: "italic", color: "#374151", lineHeight: 1.65 }}>
                    "Finish investigations faster without compromising quality or compliance."
                  </p>
                </div>
              </div>
            </div>

            {/* Product goals */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
                Product Goals
              </p>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 16,
                  padding: "28px",
                }}
              >
                {[
                  ["Reduce investigation time", "From weeks to days, without sacrificing quality."],
                  ["Eliminate repetitive manual work", "AI handles evidence collection, reading, and drafting."],
                  ["Increase investigator confidence", "Evidence-backed conclusions with visible confidence scores."],
                  ["Improve explainability", "Every AI decision is traceable to a source document."],
                  ["Maintain regulatory compliance", "Every step is logged, timestamped, and inspection-ready."],
                  ["Keep humans responsible", "No AI output is final without explicit human approval."],
                  ["Build institutional trust in AI", "Transparent, predictable AI behaviour in a risk-averse environment."],
                ].map(([title, body], i) => (
                  <div
                    key={title}
                    style={{
                      display: "flex",
                      gap: 14,
                      paddingBottom: i < 6 ? 16 : 0,
                      marginBottom: i < 6 ? 16 : 0,
                      borderBottom: i < 6 ? "1px solid #F9FAFB" : "none",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: "#ECFDF5",
                        color: "#059669",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{title}</p>
                      <p style={{ fontSize: 13, color: "#9CA3AF" }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HR />

        {/* ══════════════════════════════════════════════════════════════════
            DESIGN PRINCIPLES
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ background: "#fff", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "80px 32px" }}>

            <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              Design Principles
            </p>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 48 }}>
              Five principles that guided every decision.
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              <PrincipleCard
                number={1}
                title="Human Always Approves"
                body="AI assists. Humans decide. No AI output — root cause, impact assessment, CAPA, or dossier — is final without explicit human sign-off. The investigator remains legally and professionally responsible."
              />
              <PrincipleCard
                number={2}
                title="Evidence Before Conclusions"
                body="Every AI recommendation is backed by a real document. Claims without citations don't exist in this system. The investigator can trace every conclusion directly to the source record it came from."
              />
              <PrincipleCard
                number={3}
                title="Explainable AI"
                body="Investigators always know why the AI reached a conclusion. Confidence scores, evidence chains, and reasoning are visible for every finding. Black-box AI has no place in regulated environments."
              />
              <PrincipleCard
                number={4}
                title="Trust Through Transparency"
                body="Uncertainty is visible. A 95% confidence finding is treated differently from a 60% finding. The system never hides doubt or presents uncertain conclusions as definitive answers."
              />
              <PrincipleCard
                number={5}
                title="One Workspace"
                body="Everything needed for an investigation lives in one product. No switching between MES, LIMS, QMS, email, and shared drives. The AI brings the information; investigators stay focused."
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            USER FLOW
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>

          <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            User Flow
          </p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 16 }}>
            From deviation detected to inspection-ready.
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.8, maxWidth: 540, marginBottom: 56 }}>
            The AI handles the investigation work. The investigator handles the review and approval.
            Responsibility never leaves the human.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FlowNode label="Deviation Detected" badge="Trigger" badgeColor="gray" />
            <FlowNode label="AI Starts Investigation" badge="AI" badgeColor="blue" />
            <FlowNode label="Evidence Automatically Collected" badge="AI" badgeColor="blue" />
            <FlowNode label="Documents Read & Connected" badge="AI" badgeColor="blue" />
            <FlowNode label="Root Cause Proposed" badge="AI" badgeColor="blue" />
            <FlowNode label="Investigator Reviews Findings" badge="Human" badgeColor="green" />
            <FlowNode label="Conflicts & Gaps Resolved" badge="Human + AI" badgeColor="green" />
            <FlowNode label="Dossier Edited & Signed" badge="Human" badgeColor="green" />
            <FlowNode label="Inspection-Ready Package" badge="Output" badgeColor="gray" last />
          </div>

          {/* Flow legend */}
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            {[
              { color: "#EFF2FF", border: "#C7D2FE", text: "#2C52F5", label: "AI performs" },
              { color: "#ECFDF5", border: "#A7F3D0", text: "#059669", label: "Human performs" },
              { color: "#F3F4F6", border: "#E5E7EB", text: "#374151", label: "System state" },
            ].map(({ color, border, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{ width: 14, height: 14, borderRadius: 4, background: color, border: `1.5px solid ${border}` }}
                />
                <p style={{ fontSize: 13, color: "#6B7280" }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        <HR />

        {/* ══════════════════════════════════════════════════════════════════
            INFORMATION ARCHITECTURE
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ background: "#fff", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>

            <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              Information Architecture
            </p>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 16 }}>
              One workspace. Seven modules.
            </h2>
            <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.8, maxWidth: 540, marginBottom: 48 }}>
              Each module serves a specific purpose in the investigation workflow.
              Navigation is always visible. No dead ends.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
                alignItems: "start",
              }}
            >
              {/* IA tree */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
                  Navigation structure
                </p>
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E5E7EB",
                    borderRadius: 16,
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <IARow label="Command Center" sub="Home · Active investigation" active />
                  <IARow label="Document Review" sub="AI-drafted dossier" />
                  <IARow label="Timeline Story" sub="Chronological evidence chain" />
                  <IARow label="Evidence Library" sub="All source documents" />
                  <IARow label="Knowledge Base" sub="SOPs, patterns, history" />
                  <IARow label="Reports" sub="KPIs and compliance metrics" />
                  <IARow label="Settings" sub="AI, integrations, security" />
                </div>
              </div>

              {/* Module rationale */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  ["Command Center", "The investigation's home screen. Surfaces the AI summary, confidence score, and next required action. Designed to be the first and most frequently visited screen."],
                  ["Document Review", "Where the AI-drafted dossier is reviewed and edited. Structured sections with inline editing, comments, and per-section confidence scores."],
                  ["Timeline Story", "Shows how the AI built its conclusion chronologically. Designed for auditability — every step in the AI's reasoning is visible and verifiable."],
                  ["Evidence Library", "All source documents in one searchable place. Anomalous rows are surfaced automatically. Investigators can preview any document without leaving Klarixa."],
                  ["Knowledge Base", "Historical cases, SOP library, and root cause patterns. Helps the AI match new investigations to past ones, and helps investigators learn from precedent."],
                  ["Reports", "Operational metrics for quality leaders. Investigation trends, resolution times, AI performance, and compliance rates — all exportable for regulatory audits."],
                  ["Settings", "Enterprise configuration: AI reasoning behaviour, connected systems, team roles, notification rules, and compliance framework selection."],
                ].map(([title, body]) => (
                  <div key={title} style={{ display: "flex", gap: 14 }}>
                    <div
                      style={{
                        width: 3,
                        borderRadius: 2,
                        background: "#E5E7EB",
                        flexShrink: 0,
                        alignSelf: "stretch",
                      }}
                    />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{title}</p>
                      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SCREENS DIVIDER
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px 56px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            The Screens
          </p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 16 }}>
            Seven screens. Every design decision explained.
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.8, maxWidth: 580 }}>
            Each screen below is rendered directly from the production application.
            The annotations explain why each component exists, which problem it solves,
            and why it was designed this way.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 1: COMMAND CENTER
        ══════════════════════════════════════════════════════════════════ */}
        <ScreenSection
          number={1}
          tag="Command Center"
          title="The investigation home screen."
          purpose="Instead of opening twelve different systems, everything the investigator needs to understand a deviation is surfaced in one place. The AI has already done the initial work. The investigator arrives to a prepared workspace, not a blank canvas."
          screen="home"
          callouts={[
            {
              title: "Confidence Score",
              body: "Displayed prominently so investigators never act on uncertain AI conclusions without noticing. A 94% score means something different from a 60% score — the design makes that impossible to miss.",
            },
            {
              title: "Real-time Sensor Graph",
              body: "The temperature excursion is visible immediately, before reading any text. Investigators are trained to read sensor data — showing the graph first respects their expertise and gives context for everything else.",
            },
            {
              title: "AI Root Cause",
              body: "The AI's primary conclusion, stated plainly at the top level. Never buried. The investigator immediately knows what the AI found and can begin forming their own judgment.",
            },
            {
              title: "Evidence Base Counter",
              body: "Shows how many documents were analysed. Makes the AI's work transparent — investigators know whether the conclusion is based on three documents or thirty.",
            },
            {
              title: "Investigation Progress",
              body: "Shows where the case stands in the review workflow. Prevents cases from stalling. Each step is a concrete task, not an abstract status.",
            },
            {
              title: "Evidence Table",
              body: "Raw sensor log data with anomalous rows highlighted. Investigators can verify AI conclusions directly against source data without switching to another system.",
            },
            {
              title: "Navigation Tabs",
              body: "Command Center, Document Review, and Timeline Story are always accessible. The investigator is never more than one click from any view of the investigation.",
            },
          ]}
        />

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 2: DOCUMENT REVIEW
        ══════════════════════════════════════════════════════════════════ */}
        <ScreenSection
          number={2}
          tag="Document Review"
          title="AI-drafted dossier. Human-approved."
          purpose="The AI prepares a structured investigation report with every section written, cited, and confidence-scored. The investigator reads, edits inline, discusses with colleagues, and signs. This is the step that currently takes weeks — Klarixa reduces it to hours."
          screen="review"
          callouts={[
            {
              title: "Executive Summary",
              body: "AI-written opening narrative based on all analysed evidence. Investigators edit directly in the text — every change is tracked for the audit log.",
            },
            {
              title: "Section Confidence Scores",
              body: "Each section of the dossier shows an independent confidence score. Low-confidence sections are visually flagged, prompting the investigator to review carefully.",
            },
            {
              title: "Evidence References",
              body: "Every claim links to the specific document that supports it. Nothing is stated without a citation. Investigators click any reference to open the source document inline.",
            },
            {
              title: "AI Reasoning Panel",
              body: "Investigators can expand any section to see exactly why the AI wrote what it wrote — which documents, which patterns, which historical cases it referenced.",
            },
            {
              title: "Root Cause Section",
              body: "The primary cause, confirmed by evidence. Clearly separated from impact and actions so the investigator evaluates each element independently.",
            },
            {
              title: "Corrective & Preventive Actions",
              body: "AI-proposed actions based on the confirmed root cause and historical CAPA precedents. Investigators edit, reassign, or reject each action individually.",
            },
            {
              title: "Collaborative Comments",
              body: "Quality colleagues can review sections and add comments before the final sign-off. Every comment is timestamped and attributed for the audit trail.",
            },
            {
              title: "Approve Investigation Button",
              body: "Human signature is required to close the investigation. The button is prominent but never the first thing seen — review comes before approval.",
            },
          ]}
        />

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 3: TIMELINE STORY
        ══════════════════════════════════════════════════════════════════ */}
        <ScreenSection
          number={3}
          tag="Timeline Story"
          title="How the AI reached its conclusion."
          purpose="This is Klarixa's explainability screen. Investigations are fundamentally chronological — they answer 'what happened and in what order.' The timeline makes the AI's entire reasoning chain visible, verifiable, and challengeable. Investigators cannot reasonably approve an investigation they don't understand."
          screen="timeline"
          callouts={[
            {
              title: "Evidence Collection Events",
              body: "Shows which documents the AI ingested and when. Full transparency on what went into the investigation — investigators know the AI has seen all the relevant records.",
            },
            {
              title: "Laboratory Results",
              body: "LIMS data surfaced automatically in chronological context. Lab results no longer need to be fetched separately — they appear where they belong in the story.",
            },
            {
              title: "Historical Case Match",
              body: "When a past investigation matches this pattern, it appears in the timeline. Investigators see the precedent that shaped the AI's root cause recommendation.",
            },
            {
              title: "Root Cause Selection",
              body: "When multiple causes are possible, the AI presents each with confidence scores. The investigator selects the final determination — the AI doesn't choose for them.",
            },
            {
              title: "Human Review Checkpoints",
              body: "The timeline includes explicit moments where investigator input is required. The AI cannot proceed past a review checkpoint without human confirmation.",
            },
            {
              title: "Conflict Resolution",
              body: "When timestamps conflict — for example, a manual log disagrees with a sensor log — the conflict appears clearly in the timeline with both sources visible for human judgment.",
            },
          ]}
        />

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 4: EVIDENCE LIBRARY
        ══════════════════════════════════════════════════════════════════ */}
        <ScreenSection
          number={4}
          tag="Evidence Library"
          title="Every document. One searchable place."
          purpose="Traceability is a regulatory requirement in GxP environments. Every AI conclusion must be traceable to a source document. The Evidence Library makes that possible — and makes it easy for investigators to verify the AI's work directly against the raw data."
          screen="evidence"
          callouts={[
            {
              title: "Full-Text Search",
              body: "Search across every ingested document — sensor logs, PDFs, SOPs, lab reports — simultaneously. Finding specific evidence takes seconds, not hours.",
            },
            {
              title: "Filter Controls",
              body: "Filter by document type, date range, source system, or anomaly status. Investigators can isolate relevant evidence without scrolling through hundreds of records.",
            },
            {
              title: "Anomaly-Highlighted Table",
              body: "Rows the AI flagged as anomalous are visually distinct from normal data. The investigator immediately sees what the AI considered suspicious, in context.",
            },
            {
              title: "Document Sidebar",
              body: "Documents are listed with their source system, file size, and AI-flagged row count. Investigators know at a glance which files contain the most relevant evidence.",
            },
            {
              title: "Metadata & Audit Trail",
              body: "Every document shows when it was ingested, which system it came from, and whether its integrity has been verified. Required for CFR Part 11 compliance.",
            },
            {
              title: "Related Investigation Links",
              body: "If a document was used in a previous investigation, that link is visible. Knowledge doesn't disappear — it compounds across cases.",
            },
            {
              title: "Upload & Expand",
              body: "Investigators can upload additional evidence manually if the AI missed a document. The system re-analyses and updates its conclusions accordingly.",
            },
          ]}
        />

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 5: KNOWLEDGE BASE
        ══════════════════════════════════════════════════════════════════ */}
        <ScreenSection
          number={5}
          tag="Knowledge Base"
          title="Every investigation makes the next one smarter."
          purpose="Institutional knowledge in pharmaceutical companies currently exists in completed investigation reports, sitting in document management systems that no one searches. Klarixa structures that knowledge and makes it queryable — so every new investigation benefits from everything the organisation already knows."
          screen="knowledge"
          callouts={[
            {
              title: "Failure Pattern Library",
              body: "Root cause patterns extracted across all historical investigations. The AI recognises when a new deviation matches a known failure mode, immediately narrowing the hypothesis space.",
            },
            {
              title: "Historical Cases",
              body: "Every past investigation is stored, indexed, and searchable. When the AI finds a strong match, it surfaces the previous case with its root cause and resolution outcome.",
            },
            {
              title: "SOP Library",
              body: "Standard Operating Procedures are linked to relevant deviation types. The AI checks whether procedures were followed and surfaces the relevant SOP section when they weren't.",
            },
            {
              title: "CAPA Templates",
              body: "Corrective and Preventive Actions from past investigations, organised by failure type. Proven remedies are proposed first when similar failures occur.",
            },
            {
              title: "Equipment Failure History",
              body: "Links failures to specific equipment across all investigations. Recurring equipment problems become visible patterns, not invisible one-offs.",
            },
            {
              title: "AI Confidence Over Time",
              body: "As the knowledge base grows, the AI's root cause confidence scores improve. Investigators can see the trend — the system is getting smarter with every case.",
            },
          ]}
        />

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 6: REPORTS
        ══════════════════════════════════════════════════════════════════ */}
        <ScreenSection
          number={6}
          tag="Reports"
          title="Operational insight for quality leaders."
          purpose="Quality directors need to see beyond individual investigations. Which root causes keep recurring? Is investigation time improving? Are there equipment patterns that predict future failures? This screen answers those questions without requiring the quality director to manually compile reports."
          screen="reports"
          callouts={[
            {
              title: "Core KPIs",
              body: "Open investigations, average resolution time, compliance rate, and overdue cases — always current, updated in real time as investigations progress and close.",
            },
            {
              title: "Investigation Volume Trend",
              body: "Deviation frequency over time. Quality leaders can see whether problems are increasing or decreasing, and whether past corrective actions are working.",
            },
            {
              title: "Root Cause Distribution",
              body: "Which root causes appear most frequently. Guides capital investment decisions — if sensor fouling is the top root cause, maintenance schedules need to change.",
            },
            {
              title: "Compliance Dashboard",
              body: "FDA 21 CFR Part 11 compliance metrics, including investigation closure rate within required timelines. Required data for regulatory submissions.",
            },
            {
              title: "AI Performance Metrics",
              body: "How often the AI's root cause conclusions matched the investigator's final determination. Builds organisational trust in the system over time.",
            },
            {
              title: "Investigation Time Analytics",
              body: "Average time from deviation detection to approved investigation, by type, severity, and facility. The primary ROI metric for Klarixa as a platform.",
            },
          ]}
        />

        {/* ══════════════════════════════════════════════════════════════════
            SCREEN 7: SETTINGS
        ══════════════════════════════════════════════════════════════════ */}
        <ScreenSection
          number={7}
          tag="Settings"
          title="Enterprise configuration. Not an afterthought."
          purpose="Pharmaceutical companies operate in different regulatory environments, use different system stacks, and have different team structures. Settings is where the organisation makes Klarixa fit their specific context — AI reasoning thresholds, data integrations, compliance frameworks, team permissions, and audit log configuration."
          screen="settings"
          callouts={[
            {
              title: "AI Behaviour Settings",
              body: "Configure how aggressively the AI proposes conclusions, the minimum confidence threshold before surfacing a root cause, and how reasoning is communicated to investigators.",
            },
            {
              title: "Compliance Framework",
              body: "Select FDA, EMA, or both. Controls which fields are mandatory, which formats are accepted, and what the electronic signature requirements are.",
            },
            {
              title: "System Integrations",
              body: "Connect MES, LIMS, QMS, CMMS, and email systems. Klarixa pulls evidence from wherever it lives — the investigator doesn't manage the data connections.",
            },
            {
              title: "Notification Rules",
              body: "Alert configuration for overdue investigations, new deviation triggers, pending approvals, and escalation thresholds. Nothing falls through the cracks.",
            },
            {
              title: "Team Roles & Permissions",
              body: "Who can approve investigations, who can review but not approve, and who has read-only access. Role-based access control for GxP environments.",
            },
            {
              title: "Audit Log Configuration",
              body: "Configure audit log retention periods, export formats, and automated archiving. Every AI decision and human action is logged, tamper-proof, and inspection-ready.",
            },
            {
              title: "Security Settings",
              body: "Session timeout, MFA requirements, SSO configuration, and IP allowlisting. Meets enterprise security requirements in regulated environments.",
            },
          ]}
        />

        <HR />

        {/* ══════════════════════════════════════════════════════════════════
            UX DECISIONS
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 80px" }}>

          <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            UX Decisions
          </p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 16 }}>
            Why each decision was made.
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.8, maxWidth: 540, marginBottom: 48 }}>
            Every UX choice was made in response to a specific constraint — regulatory,
            cognitive, or workflow-based.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                decision: "Dashboard instead of chatbot",
                rationale: "Investigators know their job. A chat interface asks them to translate domain expertise into prompts and then synthesise responses into reports — more work, not less. A structured dashboard surfaces AI findings proactively within a workflow they already understand.",
              },
              {
                decision: "Human approval on every critical decision",
                rationale: "In FDA-regulated environments, a human must be legally accountable for the investigation. The design makes it physically impossible for an AI conclusion to become official without an investigator's explicit signature.",
              },
              {
                decision: "Evidence first, conclusions second",
                rationale: "Presenting a conclusion before the evidence creates anchoring bias — investigators see the answer before they've evaluated the data. Klarixa surfaces evidence and reasoning first, then presents the conclusion as the logical outcome.",
              },
              {
                decision: "Visible confidence scores on every AI output",
                rationale: "Hiding uncertainty is dishonest and dangerous. When the AI is 60% confident, the investigator needs to know that before acting on the recommendation. Confidence indicators are not optional UI elements — they're core safety features.",
              },
              {
                decision: "Timeline as the primary explainability view",
                rationale: "Investigations are stories — they have a beginning, a middle, and an end. A timeline is the most natural format for telling that story. It shows not just what happened, but when, in what order, and which evidence connects the events.",
              },
              {
                decision: "Progressive disclosure of AI reasoning",
                rationale: "Showing all AI reasoning all the time creates information overload in an already high-stakes environment. Reasoning is available on demand for any section, but not forced on the investigator unless they want it.",
              },
              {
                decision: "Knowledge base as a first-class module",
                rationale: "Institutional knowledge has historically been trapped in document archives. Making the knowledge base a navigable, searchable, AI-queryable module turns past investigations from static records into active assets that improve future investigations.",
              },
              {
                decision: "Consistent navigation structure regardless of screen",
                rationale: "Investigators work under time pressure and cognitive load. A navigation structure that changes depending on context forces them to re-orient. The sidebar, tabs, and action patterns are identical across all seven screens.",
              },
            ].map(({ decision, rationale }, i) => (
              <div
                key={decision}
                style={{
                  display: "grid",
                  gridTemplateColumns: "280px 1fr",
                  gap: 32,
                  padding: "24px 0",
                  borderBottom: i < 7 ? "1px solid #F3F4F6" : "none",
                  alignItems: "start",
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>{decision}</p>
                <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.75 }}>{rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            EDGE CASES
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ background: "#fff", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>

            <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
              Edge Cases
            </p>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 16 }}>
              What happens when things get complicated.
            </h2>
            <p style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.8, maxWidth: 540, marginBottom: 48 }}>
              Real investigations are messy. Missing evidence, conflicting data, and uncertain conclusions
              are common. Klarixa is designed to handle these cases transparently.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                {
                  case: "Missing evidence",
                  response: "The AI explicitly flags which documents are missing and why they matter. The investigation pauses at the affected section until the gap is resolved. Investigators are not shown a conclusion based on incomplete data without being told.",
                },
                {
                  case: "Conflicting timestamps",
                  response: "When a manual log disagrees with a sensor log, Klarixa surfaces both readings side by side in a dedicated Reconciliation workspace. The investigator reviews the discrepancy, selects the authoritative source, and documents their reasoning.",
                },
                {
                  case: "Multiple possible root causes",
                  response: "The AI presents all viable hypotheses ranked by confidence, each with its supporting evidence chain. The investigator evaluates each option independently and selects the final determination — the AI does not choose.",
                },
                {
                  case: "Low AI confidence",
                  response: "Below a configurable threshold (default 70%), the AI requires additional evidence before surfacing a root cause recommendation. Low-confidence sections are visually flagged and cannot be approved without investigator acknowledgment.",
                },
                {
                  case: "Manual override",
                  response: "If the investigator disagrees with the AI's conclusion, they can reject it, enter their own root cause, and document their reasoning. The override is logged with full attribution. The system never fights the investigator.",
                },
                {
                  case: "Investigations exceeding SLA",
                  response: "Investigations older than a configured duration are automatically flagged, escalated to the quality director, and surfaced in the Reports dashboard. Nothing ages silently.",
                },
              ].map(({ case: c, response }) => (
                <div
                  key={c}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E5E7EB",
                    borderRadius: 14,
                    padding: "24px",
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
                    Edge case
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 12 }}>{c}</p>
                  <div style={{ width: 32, height: 2, background: "#2C52F5", borderRadius: 1, marginBottom: 12 }} />
                  <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{response}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            DEVELOPER NOTES
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px" }}>

          <p style={{ fontSize: 11, fontWeight: 700, color: "#2C52F5", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>
            Developer Notes
          </p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "#111827", letterSpacing: -0.8, lineHeight: 1.15, marginBottom: 48 }}>
            How this was built.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div
              style={{
                background: "#111827",
                borderRadius: 16,
                padding: "32px",
                fontFamily: "monospace",
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>
                Development environment
              </p>
              {[
                ["IDE", "Kiro IDE"],
                ["Framework", "Next.js 16 · App Router"],
                ["Language", "TypeScript"],
                ["Styling", "Tailwind CSS v4"],
                ["Auth", "Clerk"],
                ["Database", "PostgreSQL · Prisma ORM"],
                ["Primary AI Model", "Claude Opus 4.7"],
                ["Additional AI", "Gemini 2.5 Flash · Antigravity"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #1F2937",
                  }}
                >
                  <p style={{ fontSize: 13, color: "#6B7280" }}>{k}</p>
                  <p style={{ fontSize: 13, color: "#E5E7EB", fontWeight: 600 }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 16,
                  padding: "24px",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                  AI-assisted implementation
                </p>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>
                  AI tools — Claude Opus 4.7, Gemini 2.5 Flash, and Antigravity — accelerated
                  implementation and exploration throughout this project. They handled
                  code generation, component scaffolding, and rapid prototyping.
                </p>
              </div>
              <div
                style={{
                  background: "#EFF2FF",
                  border: "1px solid #C7D2FE",
                  borderRadius: 16,
                  padding: "24px",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: "#2C52F5", marginBottom: 12 }}>
                  Designer-led decisions
                </p>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                  The product strategy, UX decisions, workflows, information architecture,
                  interaction design, prioritisation, and final design direction were
                  intentionally designed, reviewed, refined, and approved by the designer.
                  AI accelerated the work — it did not replace the thinking behind it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FINAL REFLECTION
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ background: "#111827" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "100px 32px", textAlign: "center" }}>

            <p style={{ fontSize: 11, fontWeight: 700, color: "#4B5563", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
              Final Reflection
            </p>

            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: -0.5, lineHeight: 1.3, marginBottom: 32 }}>
              The objective was never to automate<br />human judgement.
            </h2>

            <p style={{ fontSize: 17, color: "#9CA3AF", lineHeight: 1.9, marginBottom: 48 }}>
              The objective was to remove the repetitive, manual, error-prone work that
              surrounds human judgement — so that investigators spend their time on what
              only they can do: evaluating evidence, making decisions, and taking responsibility
              for the outcome.
            </p>

            {/* Quote */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "40px 48px",
                marginBottom: 48,
              }}
            >
              <p style={{ fontSize: 20, fontStyle: "italic", color: "#E5E7EB", lineHeight: 1.7, fontWeight: 500 }}>
                "Klarixa transforms a weeks-long investigation into a guided, explainable workflow
                where AI prepares the investigation and humans confidently make the final decision."
              </p>
            </div>

            <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.8 }}>
              In regulated industries, trust in AI is not assumed — it is earned through transparency,
              predictability, and evidence. Every design decision in Klarixa reflects that understanding.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════════ */}
        <footer style={{ background: "#0A0A0A", padding: "48px 32px", textAlign: "center" }}>
          <div style={{ marginBottom: 24 }}>
            <Image
              src="/logo.png"
              alt="Klarixa"
              width={140}
              height={40}
              style={{ objectFit: "contain", opacity: 0.4, margin: "0 auto" }}
            />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#6B7280", marginBottom: 8 }}>
            End of Case Study
          </p>
          <p style={{ fontSize: 13, color: "#374151" }}>
            AI Investigation Platform · Founding Product Designer Assignment · 2026
          </p>
        </footer>

      </div>
    </>
  )
}
