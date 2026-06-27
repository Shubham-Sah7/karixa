const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(targetFilePath, 'utf8');

// 1. Replace logo header in Sidebar
const sidebarLogoOld = `          {/* Logo Header */}
          <div className="h-20 px-8 flex items-center gap-4 border-b border-neutral-50/50">
            <div className="w-9 h-9 rounded-[9px] bg-[#090D1A] flex items-center justify-center shadow-xs">
              <div className="w-4.5 h-4.5 rounded-[4px] border-[2.5px] border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">Klarixa</span>
          </div>`;

const sidebarLogoNew = `          {/* Logo Header */}
          <div className="h-20 px-8 flex items-center border-b border-neutral-50/50 select-none">
            <img src="/logo.png" alt="Karixa Logo" className="h-[28px] w-auto object-contain" />
          </div>`;

content = content.replace(sidebarLogoOld, sidebarLogoNew);

// 2. Replace logo in Timeline view header
const timelineLogoOld = `                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-neutral-905 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded bg-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-neutral-900">Klarixa</span>
                  </div>`;

const timelineLogoNew = `                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Karixa Logo" className="h-[22px] w-auto object-contain" />
                  </div>`;

content = content.replace(timelineLogoOld, timelineLogoNew);

// 3. Replace logo in Complete view header
const completeLogoOld = `                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[#10B981] flex items-center justify-center shadow-xs">
                      <Check className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-neutral-900">Klarixa Archive</span>
                  </div>`;

const completeLogoNew = `                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Karixa Logo" className="h-[22px] w-auto object-contain" />
                  </div>`;

content = content.replace(completeLogoOld, completeLogoNew);

// 4. Perform color replacements
const colorReplacements = [
  { old: '#4F46E5', new: '#2C52F5' },
  { old: 'bg-indigo-650', new: 'bg-[#2C52F5]' },
  { old: 'text-indigo-650', new: 'text-[#2C52F5]' },
  { old: 'text-indigo-605', new: 'text-[#2C52F5]' },
  { old: 'text-indigo-655', new: 'text-[#2C52F5]' },
  { old: 'bg-indigo-600', new: 'bg-[#2C52F5]' },
  { old: 'bg-indigo-400', new: 'bg-[#7B94FF]' },
  { old: 'bg-indigo-300', new: 'bg-[#A3B8FF]' },
  { old: 'bg-indigo-50/20', new: 'bg-[#2C52F5]/5' },
  { old: 'border-indigo-100', new: 'border-[#2C52F5]/20' },
  { old: 'text-indigo-600', new: 'text-[#2C52F5]' },
  { old: 'text-indigo-700', new: 'text-[#2C52F5]' },
  { old: 'text-indigo-800', new: 'text-[#2C52F5]' },
  { old: 'bg-indigo-50', new: 'bg-[#EFF2FF]' },
  { old: 'border-l-indigo-600', new: 'border-l-[#2C52F5]' },
  { old: 'bg-[#F5F3FF]', new: 'bg-[#EFF2FF]' },
  { old: 'border-[#E0E7FF]', new: 'border-[#D0DBFF]' },
  { old: 'bg-[#EEF2FF]', new: 'bg-[#EFF2FF]' },
  { old: 'border-[#C7D2FE]', new: 'border-[#C0D1FF]' },
  { old: 'bg-[#FAFAFE]', new: 'bg-[#FAFBFF]' }
];

for (const rep of colorReplacements) {
  const re = new RegExp(rep.old, 'g');
  content = content.replace(re, rep.new);
}

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('Branding replacement done successfully!');
