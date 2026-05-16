import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add `Menu` to `lucide-react` imports
content = content.replace(
  /Loader2,\n\s*X\n\} from 'lucide-react';/,
  "Loader2,\n  X,\n  Menu\n} from 'lucide-react';"
);

// 2. Add `isMenuOpen` state
content = content.replace(
  /const \[timeframe, setTimeframe\] = useState\('分時'\);/,
  "const [timeframe, setTimeframe] = useState('分時');\n  const [isMenuOpen, setIsMenuOpen] = useState(false);"
);

// 3. Update the header to include the mobile menu button and dropdown
const headerRegex = /\{?\/\*\s*導覽列\s*\*\/\s*\}?[\s\S]*?<header className="border-b-4 border-\[\#39FF14\] bg-\[\#000000\] sticky top-0 z-40 p-5 relative shadow-\[0_4px_20px_rgba\(57,255,20,0\.15\)\]">[\s\S]*?<\/header>/m;

const newHeader = `{/* 導覽列 */}
      <header className="border-b-4 border-[#39FF14] bg-[#000000] sticky top-0 z-40 p-5 relative shadow-[0_4px_20px_rgba(57,255,20,0.15)]">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#39FF14] flex items-center justify-center border-2 border-[#000000]">
              <TrendingUp size={20} className="text-[#000000] drop-shadow-[1px_1px_0_#FFFFFF]" />
            </div>
            <h1 className="text-xl md:text-2xl font-black italic tracking-widest text-white drop-shadow-[2px_2px_0_#008F11] crt-text">StockMaster 主控端</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setShowTutorial(true);
                setTutorialStep(0);
              }}
              className="hidden md:flex text-[#00FF41] hover:text-[#000000] hover:bg-[#00FF41] border border-[#00FF41] px-3 py-1 items-center gap-2 text-[12px] uppercase font-bold tracking-widest transition-all"
            >
              <HelpCircle size={14} /> &gt;操作指南&lt;
            </button>
            <div className="hidden md:flex text-[10px] text-cyan-400 uppercase tracking-widest border-l-2 border-[#008F11] pl-4">
              <span className="animate-pulse mr-2">●</span> SYS_ONLINE
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#00FF41] hover:text-[#08F7FE] transition-colors p-2"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#000000] border-b-2 border-[#00FF41] shadow-[0_4px_20px_rgba(0,255,65,0.2)] flex flex-col p-4 space-y-4 z-50">
            <a href="#chart-section" onClick={() => setIsMenuOpen(false)} className="text-[#08F7FE] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2">十年成長動能比對</a>
            <a href="#table-section" onClick={() => setIsMenuOpen(false)} className="text-[#FF00FF] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2">台股產業實力榜</a>
            <a href="#monitoring-section" onClick={() => setIsMenuOpen(false)} className="text-[#08F7FE] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2">即時監控系統</a>
            <a href="#analysis-section" onClick={() => setIsMenuOpen(false)} className="text-[#FFD300] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2">產業深度洞察</a>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                setShowTutorial(true);
                setTutorialStep(0);
              }}
              className="text-left text-[#00FF41] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] flex items-center gap-2"
            >
              <HelpCircle size={14} /> 操作指南
            </button>
          </div>
        )}
      </header>`;

content = content.replace(headerRegex, newHeader);

// 4. Add IDs to sections so we can scroll to them
// Chart section (十年成長比對曲線)
content = content.replace(
  /<section className="bg-\[\#000000\] border-2 border-\[\#08F7FE\] p-8 relative overflow-hidden shadow-\[4px_4px_0_0_\#008080\]">/,
  '<section id="chart-section" className="bg-[#000000] border-2 border-[#08F7FE] p-8 relative overflow-hidden shadow-[4px_4px_0_0_#008080]">'
);

// Tracking/monitoring section (即時監控系統)
content = content.replace(
  /<section className="bg-\[\#000000\] border-2 border-\[\#00FF41\] p-8 relative shadow-\[4px_4px_0_0_\#003B00\]">/,
  '<section id="monitoring-section" className="bg-[#000000] border-2 border-[#00FF41] p-8 relative shadow-[4px_4px_0_0_#003B00]">'
);

// Table section (台股實力排行榜)
content = content.replace(
  /<section className="bg-\[\#000000\] border-2 border-\[\#FF00FF\] shadow-\[4px_4px_0_0_\#800080\]">/,
  '<section id="table-section" className="bg-[#000000] border-2 border-[#FF00FF] shadow-[4px_4px_0_0_#800080]">'
);

// Analysis section (產業深度洞察)
content = content.replace(
  /<section className="bg-\[\#000000\] border-2 border-\[\#FFD300\] flex flex-col h-\[900px\] shadow-\[4px_4px_0_0_\#B29600\] relative">/,
  '<section id="analysis-section" className="bg-[#000000] border-2 border-[#FFD300] flex flex-col min-h-[900px] h-auto md:h-[900px] shadow-[4px_4px_0_0_#B29600] relative">'
);

// Adjust grid to make it work better on mobile by removing max-width on mobile or making the grid change at lg instead of md. It's already lg.
// `grid-cols-1 lg:grid-cols-12`
// We should make the "h-[base]" responsive if there is any fixed height, e.g. h-[350px] might be OK.
// The `h-[900px]` was making the right sidebar rigid on mobile, changed it to `min-h-[900px] h-auto md:h-[900px]` above.
// The table section `overflow-x-auto` is fine.
// The modal might need padding changes but let's stick to the prompt.

fs.writeFileSync('src/App.tsx', content, 'utf-8');
