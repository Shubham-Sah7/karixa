const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(targetFilePath, 'utf8');

// 1. Replace the purple-leaning light brand blue backgrounds in summary cards/panels with premium slate-50/100
content = content.replace(
  /bg-\[\#2C52F5\]\/5 border border-\[\#2C52F5\]\/10/g,
  'bg-[#F8FAFC] border border-neutral-200/60'
);

content = content.replace(
  /bg-\[\#2C52F5\]\/5 border border-\[\#2C52F5\]\/20/g,
  'bg-[#F8FAFC] border border-neutral-200/60'
);

// 2. Reduce opacity in line chart gradient fill
content = content.replace(
  'stopColor="#2C52F5" stopOpacity="0.15"',
  'stopColor="#2C52F5" stopOpacity="0.03"'
);

// 3. Update summary card labels text color from brand blue to neutral slate
content = content.replace(
  'text-[#2C52F5] font-mono font-bold',
  'text-[#64748B] font-mono font-bold'
);

content = content.replace(
  'text-[#2C52F5] font-mono',
  'text-[#64748B] font-mono'
);

// 4. Update timeline dot active highlight/badges bg to slate/gray instead of light purple
content = content.replace(
  /bg-\[\#EFF2FF\] border border-\[\#C0D1FF\]/g,
  'bg-[#F1F5F9] border border-neutral-200/70'
);

content = content.replace(
  /bg-\[\#EFF2FF\]/g,
  'bg-[#F1F5F9]'
);

content = content.replace(
  /border-\[\#C0D1FF\]/g,
  'border-neutral-200/70'
);

content = content.replace(
  /bg-\[\#FAFBFF\]/g,
  'bg-[#F8FAFC]'
);

// 5. Replace other remaining indigo-50 wrappers
content = content.replace(
  'space-y-4 bg-[#2C52F5]/5 border border-[#2C52F5]/20 rounded-2xl p-6.5',
  'space-y-4 bg-[#F8FAFC] border border-neutral-200/60 rounded-2xl p-6.5'
);

// Let's replace sparkline and progress indicators to be ultra-clean
content = content.replace(
  'bg-[#2C52F5]/5 border border-[#2C52F5]/10 rounded-3xl p-6 space-y-4',
  'bg-[#F8FAFC] border border-neutral-200/60 rounded-3xl p-6 space-y-4'
);

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('Purple/lavender hues removed successfully!');
