import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Title translations
content = content.replace(/START/g, '啟動分析');
content = content.replace(/NODE\.RANKING/g, '台股產業實力榜');
content = content.replace(/TOP TIER ONLY/g, '嚴選前段班');
content = content.replace(/<th className="px-6 py-4 font-normal">RANK<\/th>/g, '<th className="px-6 py-4 font-normal">排名</th>');
content = content.replace(/<th className="px-6 py-4 font-normal">ID \/ NAME<\/th>/g, '<th className="px-6 py-4 font-normal">代號/名稱</th>');
content = content.replace(/<th className="px-6 py-4 font-normal">POWER SCORE<\/th>/g, '<th className="px-6 py-4 font-normal">綜合評分</th>');
content = content.replace(/<th className="px-6 py-4 text-center font-normal">VERSUS<\/th>/g, '<th className="px-6 py-4 text-center font-normal">對比</th>');
content = content.replace(/<th className="px-6 py-4 font-normal">VALUE\(TWD\)<\/th>/g, '<th className="px-6 py-4 font-normal">估值(TWD)</th>');
content = content.replace(/<th className="px-6 py-4 font-normal">WEB<\/th>/g, '<th className="px-6 py-4 font-normal">官網</th>');

content = content.replace(/DATA_PACKET_INTERCEPT/g, '產業深度洞察');
content = content.replace(/ORACLE_INTERFACE/g, 'AI 分析大師');
content = content.replace(/SWITCH/g, '切換模式');
content = content.replace(/GLOBAL_DATA_STREAM/g, '市場趨勢分析');
content = content.replace(/ANALYZING SECURE CHANNEL\.\.\./g, '系統分析中...');
content = content.replace(/CONFIDENCE/g, 'AI 信心指數');
content = content.replace(/RISK LVL/g, '推薦風險比');
content = content.replace(/SYS\.ANALYSIS/g, '大師戰略點評');
content = content.replace(/SYSTEM ADVISORY:/g, '系統建議：');

content = content.replace(/SYS\.COMPARE/g, '決策工具箱');
content = content.replace(/SELECTED TARGETS:/g, '目前選取：');
content = content.replace(/EXECUTE BATTLE/g, '執行分析');
content = content.replace(/SIMULATION_OUTPUT/g, '戰略分析報告');
content = content.replace(/WAITING FOR INSTRUCTIONS\.\.\./g, '等待指令...');

content = content.replace(/DIAGNOSIS/g, '業務診斷');
content = content.replace(/OFFICIAL SITE/g, '官方網站');
content = content.replace(/> CLOSE</g, '> 關閉 <');

content = content.replace(/WAKE UP, NEO\.\.\./g, '開始使用');
content = content.replace(/> NEXT</g, '> 下一步 <');
content = content.replace(/>MANUAL</g, '>操作指南<');
content = content.replace(/>DATA: TWSE</g, '>來源: 證交所<');
content = content.replace(/MATRIX\.SYS/g, 'MATRIX.SYS');
content = content.replace(/StockMaster MAIN_TERMINAL/g, 'StockMaster 主控端');

// Fix title colors and borders using precise replace logic
content = content.replace(
  /<section className="bg-\[#000000\] border-2 border-\[#00FF41\] p-8 relative overflow-hidden shadow-\[4px_4px_0_0_#003B00\]">/g,
  '<section className="bg-[#000000] border-2 border-[#08F7FE] p-8 relative overflow-hidden shadow-[4px_4px_0_0_#008080]">'
);
content = content.replace(
  /<div className="flex justify-between items-center mb-6 border-b-2 border-\[#00FF41\] pb-4">/g,
  '<div className="flex justify-between items-center mb-6 border-b-2 border-[#08F7FE] pb-4">'
);
content = content.replace(
  /drop-shadow-\[2px_2px_0_#003B00\]">\n\s*即時監控系統 <span className="text-\[#00FF41\]/g,
  'drop-shadow-[2px_2px_0_#008080]">\n                    即時監控系統 <span className="text-[#08F7FE]'
);
content = content.replace(
  /bg-\[#000000\] p-1 border-2 border-\[#00FF41\]/g,
  'bg-[#000000] p-1 border-2 border-[#08F7FE]'
);
content = content.replace(
  /hover:bg-\[#008F11\]/g,
  'hover:bg-[#008080]'
);
content = content.replace(
  /stroke="#00FF41" opacity=\{0\.3\}/g,
  'stroke="#08F7FE" opacity={0.3}'
);
content = content.replace(
  /tick={{ fill: '#00FF41', fontSize: 12 }}/g,
  "tick={{ fill: '#08F7FE', fontSize: 12 }}"
);
content = content.replace(
  /border: '2px solid #00FF41'/g,
  "border: '2px solid #08F7FE'"
);
content = content.replace(
  /stroke="#008F11" \n\s*strokeWidth=\{4\}/g,
  'stroke="#08F7FE" \n                      strokeWidth={4}'
);

content = content.replace(
  /<div className="h-full flex flex-col items-center justify-center text-\[#008F11\] uppercase animate-pulse">/g,
  '<div className="h-full flex flex-col items-center justify-center text-[#08F7FE] uppercase animate-pulse">'
);

content = content.replace(
  /<section className="bg-\[#000000\] border-2 border-\[#008F11\] shadow-\[4px_4px_0_0_#003B00\]">/g,
  '<section className="bg-[#000000] border-2 border-[#FF00FF] shadow-[4px_4px_0_0_#800080]">'
);
content = content.replace(
  /<div className="p-6 border-b-2 border-\[#008F11\] flex justify-between items-center bg-\[#000000\]">/g,
  '<div className="p-6 border-b-2 border-[#FF00FF] flex justify-between items-center bg-[#000000]">'
);
content = content.replace(
  /text-xl flex items-center gap-2 uppercase text-\[#00FF41\] drop-shadow-\[2px_2px_0_#003B00\]">\n\s*<Award className="text-\[#00FF41\]" size=\{20\} \/> 台股產業實力榜/g,
  'text-xl flex items-center gap-2 uppercase text-[#FF00FF] drop-shadow-[2px_2px_0_#800080]">\n                <Award className="text-[#FF00FF]" size={20} /> 台股產業實力榜'
);

content = content.replace(
  /text-\[12px\] uppercase tracking-\[0\.2em\] font-medium border-b-2 border-\[#008F11\]/g,
  'text-[#FF00FF] text-[12px] uppercase tracking-[0.2em] font-medium border-b-2 border-[#FF00FF]'
);
content = content.replace(
  /divide-\[#008F11\]\/30/g,
  'divide-[#FF00FF]/30'
);
content = content.replace(
  /hover:bg-\[#008F11\]\/10 transition-colors cursor-pointer border-b border-\[#008F11\]\/30 last:border-0 \${selectedCompany\?\.id === c\.id \? 'bg-\[#008F11\]\/20'/g,
  "hover:bg-[#FF00FF]/10 transition-colors cursor-pointer border-b border-[#FF00FF]/30 last:border-0 ${selectedCompany?.id === c.id ? 'bg-[#FF00FF]/20'"
);
content = content.replace(
  /text-\[#00FF41\] group-hover:text-\[#00FF41\] transition-colors drop-shadow-\[1px_1px_0_#003B00\]/g,
  'text-[#FF00FF] group-hover:text-white transition-colors drop-shadow-[1px_1px_0_#800080]'
);
content = content.replace(
  /w-16 bg-\[#000000\] border border-\[#00FF41\]/g,
  'w-16 bg-[#000000] border border-[#FF00FF]'
);
content = content.replace(
  /<div className="h-full bg-\[#00FF41\]" style=\{{ width: `\$\{c\.score\}%` \}}><\/div>/g,
  '<div className="h-full bg-[#FF00FF]" style={{ width: `${c.score}%` }}></div>'
);

content = content.replace(
  /<section className="bg-\[#000000\] border-2 border-\[#00FF41\] flex flex-col h-\[900px\] shadow-\[4px_4px_0_0_#003B00\] relative">/g,
  '<section className="bg-[#000000] border-2 border-[#FFD300] flex flex-col h-[900px] shadow-[4px_4px_0_0_#B29600] relative">'
);
content = content.replace(
  /<div className="p-6 border-b-2 border-\[#00FF41\] flex justify-between items-center bg-\[#000000\]">/g,
  '<div className="p-6 border-b-2 border-[#FFD300] flex justify-between items-center bg-[#000000]">'
);
content = content.replace(
  /<div className="text-\[#00FF41\] animate-pulse">/g,
  '<div className="text-[#FFD300] animate-pulse">'
);
content = content.replace(
  /<h2 className="text-xl uppercase text-\[#00FF41\] tracking-wide drop-shadow-\[2px_2px_0_#003B00\]">\{activeTab === 'insight' \? '產業深度洞察' : 'AI 分析大師'\}<\/h2>/g,
  '<h2 className="text-xl uppercase text-[#FFD300] tracking-wide drop-shadow-[2px_2px_0_#B29600]">{activeTab === \'insight\' ? \'產業深度洞察\' : \'AI 分析大師\'}</h2>'
);
content = content.replace(
  /className="text-\[12px\] uppercase tracking-\[0\.2em\] text-\[#00FF41\] hover:text-\[#00FF41\] hover:bg-\[#008F11\] border border-\[#00FF41\] hover:border-\[#008F11\] px-2 py-1 flex items-center gap-2 font-bold transition-all"/g,
  'className="text-[12px] uppercase tracking-[0.2em] text-[#FFD300] hover:text-[#000000] hover:bg-[#FFD300] border border-[#FFD300] hover:border-[#FFD300] px-2 py-1 flex items-center gap-2 font-bold transition-all"'
);

content = content.replace(
  /text-\[#00FF41\] font-bold text-\[14px\] uppercase tracking-\[0\.2em\] mb-4 drop-shadow-\[0_0_2px_#00FF41\]/g,
  'text-[#08F7FE] font-bold text-[14px] uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_2px_#08F7FE]'
);
content = content.replace(
  /border-2 border-\[#00FF41\] font-mono crt-text/g,
  'border-2 border-[#08F7FE] font-mono crt-text shadow-[4px_4px_0_0_#008080]'
);

content = content.replace(
  /bg-\[#000000\] border-2 border-\[#00FF41\] p-6 relative overflow-hidden flex flex-col min-h-\[220px\] max-h-\[300px\] shadow-\[4px_4px_0_0_#003B00\]/g,
  'bg-[#000000] border-2 border-[#FF00FF] p-6 relative overflow-hidden flex flex-col min-h-[220px] max-h-[300px] shadow-[4px_4px_0_0_#800080]'
);

content = content.replace(
  /bg-\[#000000\] border-2 border-\[#008F11\] p-8 text-center space-y-6 relative z-10 shadow-\[4px_4px_0_0_#003B00\]/g,
  'bg-[#000000] border-2 border-[#FFD300] p-8 text-center space-y-6 relative z-10 shadow-[4px_4px_0_0_#B29600]'
);
content = content.replace(
  /text-\[#008F11\] text-\[14px\] font-bold uppercase tracking-\[0\.2em\] drop-shadow-\[0_0_2px_#00FF41\]/g,
  'text-[#FFD300] text-[14px] font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_2px_#FFD300]'
);
content = content.replace(
  /className={`w-full py-4 text-\[14px\] uppercase tracking-\[0\.2em\] font-bold transition-all border-2 \${comparisonList\.length >= 2 \? 'bg-\[#008F11\] text-\[#000000\] border-\[#008F11\] hover:bg-\[#00FF41\] shadow-\[4px_4px_0_0_#003B00\]/g,
  "className={`w-full py-4 text-[14px] uppercase tracking-[0.2em] font-bold transition-all border-2 ${comparisonList.length >= 2 ? 'bg-[#FFD300] text-[#000000] border-[#FFD300] hover:bg-[#FFFFFF] shadow-[4px_4px_0_0_#B29600]"
);

content = content.replace(
  /<div className="mb-2 text-\[#00FF41\]">/g,
  '<div className="mb-2 text-[#08F7FE]">'
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
