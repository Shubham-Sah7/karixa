const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(targetFilePath, 'utf8');

// 1. Evidence Page: Remove the 4 summary cards row entirely
const oldEvidenceSummary = `                  {/* 4 Summary Cards (Light brand colored backgrounds) */}
                  <div className="grid grid-cols-4 gap-5 select-none">
                    <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                      <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono font-bold">Total Documents</div>
                      <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">124 files</div>
                      <span className="text-[13px] text-neutral-450 block mt-1">Telemetry, log & SOP index</span>
                    </div>
                    <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                      <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono font-bold">Evidence Sources</div>
                      <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">8 systems</div>
                      <span className="text-[13px] text-neutral-455 block mt-1">MES, LIMS, CMMS connected</span>
                    </div>
                    <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                      <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono font-bold">AI Indexed</div>
                      <div className="text-3xl font-extrabold text-[#2C52F5] mt-2 font-mono">98.4%</div>
                      <span className="text-[13px] text-emerald-600 font-semibold block mt-1">Audit-ready validation</span>
                    </div>
                    <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                      <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono font-bold">Recently Added</div>
                      <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">12 new</div>
                      <span className="text-[13px] text-neutral-455 block mt-1">Last sync 4 min ago</span>
                    </div>
                  </div>`;

content = content.replace(oldEvidenceSummary, '');

// Reduce emphasis on AI confidence percentages in Evidence table
content = content.replace(
  '<td className="py-4 font-mono text-[#2C52F5] font-bold">{row.conf}</td>',
  '<td className="py-4 font-mono text-neutral-450 font-semibold">{row.conf}</td>'
);

// 2. Knowledge Page: Remove the 4 summary cards row entirely
const oldKnowledgeSummary = `                    {/* 4 Summary Cards (Light brand colored backgrounds) */}
                    <div className="grid grid-cols-4 gap-5 select-none">
                      <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                        <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono">Validated Cases</div>
                        <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">318 cases</div>
                        <span className="text-[13px] text-neutral-450 block mt-1">SOP & CAPA cross-linked</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                        <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono">Root Cause Patterns</div>
                        <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">14 patterns</div>
                        <span className="text-[13px] text-neutral-455 block mt-1">Mapped to thermal anomalies</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                        <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono">SOP References</div>
                        <div className="text-3xl font-extrabold text-[#2C52F5] mt-2 font-mono">48 SOPs</div>
                        <span className="text-[13px] text-emerald-600 font-semibold block mt-1">Active vault compliance</span>
                      </div>
                      <div className="bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-5">
                        <div className="text-[13px] font-bold uppercase tracking-wider text-[#64748B] font-mono">AI Knowledge Coverage</div>
                        <div className="text-3xl font-extrabold text-neutral-900 mt-2 font-mono">94.2%</div>
                        <span className="text-[13px] text-neutral-455 block mt-1">Accuracy rate on intake files</span>
                      </div>
                    </div>`;

content = content.replace(oldKnowledgeSummary, '');

// 3. Reports Page: Simplify Row 2 (Merge Root Causes and Compliance, remove AI Performance)
const oldReportsRow2 = `                {/* Dashboard Visualizations Row 2 */}
                <div className="grid grid-cols-5 gap-8 select-text">
                  {/* Section 3: Most Common Root Causes (2/5) */}
                  <div className="col-span-2 border border-neutral-100 rounded-2xl p-6.5 space-y-4">
                    <h3 className="text-[15px] font-bold text-neutral-905 uppercase tracking-wider font-mono select-none">Most Common Root Causes</h3>
                    <div className="space-y-3.5 pt-1">
                      {[
                        { label: "Equipment Failure", count: 84, pct: "90%" },
                        { label: "Temperature Excursion", count: 62, pct: "72%" },
                        { label: "Calibration Drift", count: 41, pct: "50%" },
                        { label: "Operator Error", count: 18, pct: "25%" },
                        { label: "Documentation Issue", count: 8, pct: "10%" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-[13.5px] font-semibold text-neutral-700">
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

                  {/* Section 4: Compliance Overview Progress Indicators (1.5/5) */}
                  <div className="col-span-1.5 border border-neutral-100 rounded-2xl p-6.5 space-y-4">
                    <h3 className="text-[15px] font-bold text-neutral-905 uppercase tracking-wider font-mono select-none">Compliance Overview</h3>
                    <div className="space-y-4 pt-1">
                      {[
                        { label: "Investigation Rate", val: "98%", pct: "98%" },
                        { label: "On-time CAPA Rate", val: "94%", pct: "94%" },
                        { label: "FDA Audit Readiness", val: "100%", pct: "100%" },
                        { label: "Evidence Completeness", val: "97%", pct: "97%" },
                        { label: "Human Sign-off Compliance", val: "100%", pct: "100%" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[13px] font-semibold text-neutral-700">
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

                  {/* Section 5: AI Performance Insights (1.5/5) */}
                  <div className="col-span-1.5 border border-neutral-100 rounded-2xl p-6.5 space-y-4 select-none">
                    <h3 className="text-[15px] font-bold text-neutral-905 uppercase tracking-wider font-mono">AI Accuracy & Mappings</h3>
                    <div className="space-y-4.5 pt-2">
                      <div className="flex justify-between items-baseline border-b border-neutral-50 pb-2">
                        <span className="text-neutral-500 font-medium text-[14.5px]">Avg AI Confidence</span>
                        <span className="font-bold text-neutral-900 font-mono text-[16px]">95.8%</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-neutral-50 pb-2">
                        <span className="text-neutral-500 font-medium text-[14.5px]">Evidence Mapped</span>
                        <span className="font-bold text-neutral-900 font-mono text-[16px]">14.2 files</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-neutral-50 pb-2">
                        <span className="text-neutral-500 font-medium text-[14.5px]">Human Approval Rate</span>
                        <span className="font-bold text-[#2C52F5] font-mono text-[16px]">97.4%</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-neutral-50 pb-2">
                        <span className="text-neutral-500 font-medium text-[14.5px]">Revision Cycles</span>
                        <span className="font-bold text-neutral-900 font-mono text-[16px]">1.2 cycles</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-neutral-500 font-medium text-[14.5px]">Avg Cycle Reduction</span>
                        <span className="font-bold text-emerald-600 font-mono text-[16px]">86% saved</span>
                      </div>
                    </div>
                  </div>
                </div>`;

const newReportsRow2 = `                {/* Dashboard Visualizations Row 2 */}
                <div className="grid grid-cols-5 gap-8 select-text">
                  {/* Section 3: Most Common Root Causes (3/5) */}
                  <div className="col-span-3 border border-neutral-100 rounded-2xl p-6.5 space-y-4">
                    <h3 className="text-[15px] font-bold text-neutral-905 uppercase tracking-wider font-mono select-none">Most Common Root Causes</h3>
                    <div className="space-y-3.5 pt-1">
                      {[
                        { label: "Equipment Failure", count: 84, pct: "90%" },
                        { label: "Temperature Excursion", count: 62, pct: "72%" },
                        { label: "Calibration Drift", count: 41, pct: "50%" },
                        { label: "Operator Error", count: 18, pct: "25%" },
                        { label: "Documentation Issue", count: 8, pct: "10%" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-[13.5px] font-semibold text-neutral-700">
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
                  <div className="col-span-2 border border-neutral-100 rounded-2xl p-6.5 space-y-4">
                    <h3 className="text-[15px] font-bold text-neutral-905 uppercase tracking-wider font-mono select-none">Compliance Overview</h3>
                    <div className="space-y-4 pt-1">
                      {[
                        { label: "Investigation Completion Rate", val: "98%", pct: "98%" },
                        { label: "On-time CAPA Completion", val: "94%", pct: "94%" },
                        { label: "Audit Readiness Score", val: "100%", pct: "100%" },
                        { label: "Evidence Completeness", val: "97%", pct: "97%" },
                        { label: "Human Review Compliance", val: "100%", pct: "100%" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[13px] font-semibold text-neutral-700">
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
                </div>`;

content = content.replace(oldReportsRow2, newReportsRow2);

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('Design refinements applied successfully!');
