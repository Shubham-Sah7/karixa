const fs = require('fs');
const path = require('path');

const targetFilePath = path.join(__dirname, '../app/page.tsx');
let content = fs.readFileSync(targetFilePath, 'utf8');

// 1. Sidebar adjustments
content = content.replace(/w-80/g, 'w-[260px]');
content = content.replace(/h-24/g, 'h-16');
content = content.replace(/h-\[52px\]/g, 'h-[36px]');

// 2. Main Header adjustments
content = content.replace(/h-\[76px\]/g, 'h-[58px]');
content = content.replace(/px-10/g, 'px-6');
content = content.replace(/h-\[32px\]/g, 'h-[25px]');
content = content.replace(/h-\[38px\]/g, 'h-[28px]');
content = content.replace(/h-\[36px\]/g, 'h-[26px]');

// 3. Spacing adjustments
content = content.replace(/p-10/g, 'p-7');
content = content.replace(/p-8/g, 'p-6');
content = content.replace(/p-6\.5/g, 'p-5');
content = content.replace(/p-5/g, 'p-4');
content = content.replace(/py-3\.5/g, 'py-2');
content = content.replace(/py-2\.5/g, 'py-1.5');
content = content.replace(/gap-8/g, 'gap-6');
content = content.replace(/gap-5/g, 'gap-4');
content = content.replace(/space-y-8/g, 'space-y-6');
content = content.replace(/space-y-6/g, 'space-y-4');

// 4. Icon size adjustments
content = content.replace(/w-5\.5 h-5\.5/g, 'w-4.5 h-4.5');
content = content.replace(/w-4\.5 h-4\.5/g, 'w-3.5 h-3.5');
content = content.replace(/w-4 h-4/g, 'w-3.5 h-3.5');
content = content.replace(/w-3\.5 h-3\.5/g, 'w-3 h-3');

// 5. Typography scale reduction (approx 15-20% down)
content = content.replace(/text-3xl/g, 'text-[24px]');
content = content.replace(/text-2xl/g, 'text-[19px]');
content = content.replace(/text-\[17\.5px\]/g, 'text-[14.5px]');
content = content.replace(/text-\[16\.5px\]/g, 'text-[13.5px]');
content = content.replace(/text-\[16px\]/g, 'text-[13.5px]');
content = content.replace(/text-\[15px\]/g, 'text-[12.5px]');
content = content.replace(/text-\[14\.5px\]/g, 'text-[12px]');
content = content.replace(/text-\[13\.5px\]/g, 'text-[11.5px]');
content = content.replace(/text-\[13px\]/g, 'text-[11px]');
content = content.replace(/text-\[12\.5px\]/g, 'text-[10.5px]');
content = content.replace(/text-\[12px\]/g, 'text-[10px]');

fs.writeFileSync(targetFilePath, content, 'utf8');
console.log('UI scaled down by 15-20% successfully!');
