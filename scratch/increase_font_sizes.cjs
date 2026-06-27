const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(targetFilePath, 'utf8');

// Replace specific small font size values with more readable ones
const textReplacements = [
  // 1. Tiny text tokens (9px-11.5px)
  { old: 'text-[9px]', new: 'text-[12px]' },
  { old: 'text-[9.5px]', new: 'text-[12.5px]' },
  { old: 'text-[10px]', new: 'text-[13px]' },
  { old: 'text-[10.5px]', new: 'text-[13px]' },
  { old: 'text-[11px]', new: 'text-[13.5px]' },
  { old: 'text-[11.5px]', new: 'text-[14px]' },
  
  // 2. Small text tokens (12px-13.5px)
  { old: 'text-xs', new: 'text-[14.5px]' },
  { old: 'text-[12.5px]', new: 'text-[14.5px]' },
  { old: 'text-[13px]', new: 'text-[15px]' },
  { old: 'text-[13.5px]', new: 'text-[15.5px]' },
  
  // 3. Medium text tokens (14px-15.5px)
  { old: 'text-[14px]', new: 'text-[16px]' },
  { old: 'text-[15.5px]', new: 'text-[17.5px]' },
  { old: 'text-sm', new: 'text-[16px]' },

  // 4. Large headers/metric values
  { old: 'text-xl', new: 'text-2xl' },
  { old: 'text-lg', new: 'text-xl' },
  { old: 'text-base', new: 'text-lg' }
];

for (const rep of textReplacements) {
  // Use a regex that replaces text size classes safely inside quotes
  const re = new RegExp(`(?<=\\s|")` + rep.old.replace('[', '\\[').replace(']', '\\]') + `(?=\\s|")`, 'g');
  content = content.replace(re, rep.new);
}

// Ensure the code block font sizes inside reconciliation are legible
content = content.replace(
  'font-mono text-[14px] text-neutral-650 space-y-2 select-text whitespace-pre-line leading-relaxed',
  'font-mono text-[14.5px] text-neutral-650 space-y-2.5 select-text whitespace-pre-line leading-relaxed'
);

// Scale up the metrics values inside complete view
content = content.replace(
  'text-base font-extrabold text-neutral-900 font-mono',
  'text-xl font-extrabold text-neutral-900 font-mono'
);

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('Font sizes scaled up successfully!');
