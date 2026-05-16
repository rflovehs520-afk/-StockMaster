import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Global body text changes
content = content.replace(/text-\[\#00FF41\]/g, 'text-green-400'); // Temporarily protect some greens
content = content.replace(/text-\[\#008F11\]/g, 'text-green-600');

// Replace green primary text with white in main structural areas
// "text-[#00FF41]" -> "text-white" or "text-slate-200"

// Let's manually target specific areas via regular expressions
content = content.replace(/className="min-h-screen bg-\[\#000000\] text-green-400/g, 'className="min-h-screen bg-[#000000] text-slate-200');

// Headers
content = content.replace(/text-2xl uppercase text-green-400/g, 'text-2xl uppercase text-white');
content = content.replace(/text-\[10px\] text-green-400 uppercase/g, 'text-[10px] text-cyan-400 uppercase');

// Intro/Tutorial descriptions
content = content.replace(/<p className="text-green-400 text-sm leading-relaxed crt-text">/g, '<p className="text-slate-300 text-sm leading-relaxed crt-text">');

// Table text
content = content.replace(/text-\[12px\] uppercase tracking-\[0\.2em\] font-medium border-b-2 border-\[\#008F11\]/g, 'text-cyan-400 text-[12px] uppercase tracking-[0.2em] font-medium border-b-2 border-[#008F11]');
content = content.replace(/font-bold text-green-400 drop-shadow-\[1px_1px_0_\#003B00\]/g, 'font-bold text-white drop-shadow-[1px_1px_0_#003B00]');
content = content.replace(/text-\[12px\] text-green-400 tracking-widest/g, 'text-[12px] text-slate-400 tracking-widest');
content = content.replace(/text-sm font-bold text-green-400/g, 'text-sm font-bold text-white');

// Right panel analysis text
content = content.replace(/text-green-400 leading-relaxed text-sm whitespace-pre-line bg-\[\#000000\]/g, 'text-slate-200 leading-relaxed text-sm whitespace-pre-line bg-[#000000]');
content = content.replace(/text-green-400 text-sm leading-relaxed overflow-y-auto pr-2 flex-1 crt-text/g, 'text-slate-300 text-sm leading-relaxed overflow-y-auto pr-2 flex-1 crt-text');

// Footer text
content = content.replace(/text-\[10px\] font-bold uppercase tracking-\[0\.2em\] text-green-400/g, 'text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500');

// Revert placeholders to neon green or specific colors
content = content.replace(/text-green-400/g, 'text-[#00FF41]');
content = content.replace(/text-green-600/g, 'text-[#008F11]');

// Add Cyan text to some specific headers to break up the color
content = content.replace(/<Zap size=\{18\} \/> GLOBAL_DATA_STREAM/g, '<Zap size={18} className="text-[#08F7FE]" /> <span className="text-[#08F7FE]">GLOBAL_DATA_STREAM</span>');
content = content.replace(/<ShieldCheck size=\{18\} \/> SYS\.ANALYSIS/g, '<ShieldCheck size={18} className="text-[#FFD300]" /> <span className="text-[#FFD300]">SYS.ANALYSIS</span>');
content = content.replace(/<Award size=\{18\} \/> SIMULATION_OUTPUT/g, '<Award size={18} className="text-[#08F7FE]" /> <span className="text-[#08F7FE]">SIMULATION_OUTPUT</span>');

// Change chart colors to mix green, cyan, white
content = content.replace(/const chartColors = \['\#00FF41', '\#008F11', '\#003B00', '\#005500', '\#00AA22'\];/g, "const chartColors = ['#00FF41', '#08F7FE', '#FFFFFF', '#FFD300', '#FF00FF'];");

// Change specific texts to white or cyan in details popup
content = content.replace(/text-4xl uppercase text-\[\#00FF41\]/g, 'text-4xl uppercase text-white');
content = content.replace(/text-\[\#00FF41\] text-\[14px\] uppercase tracking-\[0\.3em\] mt-2 font-bold/g, 'text-cyan-400 text-[14px] uppercase tracking-[0.3em] mt-2 font-bold');
content = content.replace(/<p className="text-4xl text-\[\#00FF41\]/g, '<p className="text-4xl text-white');
content = content.replace(/<p className="text-\[\#00FF41\] leading-relaxed text-sm crt-text">/g, '<p className="text-slate-300 leading-relaxed text-sm crt-text">');

// Modifying the text color inside tooltips to be white/slate instead of all green
content = content.replace(/color: '#00FF41'/g, "color: '#FFFFFF'");
content = content.replace(/tick={{fill: '#00FF41'/g, "tick={{fill: '#A0AEC0'");
content = content.replace(/fill: '#008F11'/g, "fill: '#08F7FE'"); // Y axis label

// Change CRT text shadow slightly to be blue and red for retro wave glitch
content = content.replace(/text-shadow: 0 0 5px rgba\(0,255,65,0\.8\), 0 0 10px rgba\(0,255,65,0\.4\);/g, 'text-shadow: 1.5px 0 0 rgba(255,10,10,0.8), -1.5px 0 0 rgba(10,255,255,0.8);');

// Change a few key icons to cyan
content = content.replace(/<Activity size=\{24\} \/><\/div>/g, '<Activity size={24} /></div>');
content = content.replace(/text-\[\#008F11\] animate-pulse/g, 'text-[#08F7FE] animate-pulse');

// Let's write the file
fs.writeFileSync('src/App.tsx', content, 'utf-8');
