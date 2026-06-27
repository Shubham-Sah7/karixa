const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(targetFilePath, 'utf8');

// 1. Update sidebar background to a soft, modern off-white/gray surface (#F9FAFB)
content = content.replace(
  'aside className="w-[18%] border-r border-neutral-200/50 bg-white flex flex-col justify-between flex-shrink-0 select-none"',
  'aside className="w-[18%] border-r border-neutral-200/40 bg-[#F9FAFB] flex flex-col justify-between flex-shrink-0 select-none"'
);

// Update sidebar logo border-b
content = content.replace(
  'div className="h-20 px-8 flex items-center border-b border-neutral-50/50 select-none"',
  'div className="h-20 px-8 flex items-center border-b border-neutral-100 select-none"'
);

// Update sidebar footer border-t
content = content.replace(
  'div className="p-5 space-y-4 border-t border-neutral-100/50"',
  'div className="p-5 space-y-4 border-t border-neutral-100"'
);

// 2. Document Review: Make the central area a soft warm slate viewport and elevate the document sheet
content = content.replace(
  'main className="flex-1 overflow-y-auto bg-white border-r border-neutral-100"',
  'main className="flex-1 overflow-y-auto bg-[#F8F9FC] border-r border-neutral-200/40"'
);

content = content.replace(
  'div className="max-w-[760px] mx-auto px-12 py-12 space-y-12 pb-32"',
  'div className="max-w-[800px] mx-auto px-12 py-14 space-y-12 pb-32 my-8 bg-white border border-neutral-200/35 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_40px_rgba(0,0,0,0.015)]"'
);

// Outline Nav panel background to match sidebar
content = content.replace(
  'nav className="w-[260px] border-r border-neutral-200 flex-shrink-0 p-6 overflow-y-auto bg-white select-none"',
  'nav className="w-[260px] border-r border-neutral-200/40 flex-shrink-0 p-6 overflow-y-auto bg-[#F9FAFB] select-none"'
);

// 3. Complete View: Elevate containers and soften cards
content = content.replace(
  'className="flex-1 flex flex-col bg-white select-text overflow-y-auto"',
  'className="flex-1 flex flex-col bg-[#F8F9FC] select-text overflow-y-auto"'
);

content = content.replace(
  'div className="px-10 py-10 max-w-[1360px] mx-auto w-full space-y-12 pb-36"',
  'div className="px-10 py-10 max-w-[1360px] mx-auto w-full space-y-10 pb-36 bg-white border border-neutral-200/45 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01),0_12px_45px_rgba(0,0,0,0.015)] my-6"'
);

// 4. Soften standard shadows on cards
content = content.replace(
  /shadow-2xs/g,
  'shadow-[0_1px_2px_rgba(0,0,0,0.01),0_2px_4px_rgba(0,0,0,0.015)]'
);

content = content.replace(
  /shadow-3xs/g,
  'shadow-[0_1px_1px_rgba(0,0,0,0.005),0_1px_2px_rgba(0,0,0,0.01)]'
);

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('Premium enterprise polish applied successfully!');
