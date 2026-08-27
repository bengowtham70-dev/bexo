const fs=require('fs');
const g=fs.readFileSync('src/app/globals.css','utf8');
const b=fs.readFileSync('src/components/ui/button.tsx','utf8');
const p=fs.readFileSync('prisma/schema.prisma','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks = [
  ['tailwindcss', g.includes('@import "tailwindcss"')],
  ['theme inline', g.includes('@theme inline')],
  ['no google', !g.includes('fonts.googleapis')],
  ['forwardRef', b.includes('forwardRef')],
  ['enum Role', p.includes('enum Role')],
  ['lucide', !!pkg.dependencies['lucide-react']],
];
checks.forEach(c=> console.log(c[0]+': '+(c[1]?'PASS':'FAIL')));
const ok = checks.every(c=>c[1]);
console.log(ok ? 'ALL FIXES PASS' : 'FAIL');
if(!ok) process.exit(1);
