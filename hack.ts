import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Color Palette swaps to Matrix Hack themes
content = content.replace(/#FF00FF/g, '#008F11'); // Dark Green
content = content.replace(/#00FFFF/g, '#00FF41'); // Bright Green
content = content.replace(/#FFFF00/g, '#00FF41'); // Bright Green
content = content.replace(/#FF0000/g, '#00FF41'); // Bright Green
content = content.replace(/#FFFFFF/g, '#00FF41'); // Bright Green
content = content.replace(/#39FF14/g, '#00FF41'); // Neon Green to Matrix Green

// Drop shadow & static shadow refinements
content = content.replace(/drop-shadow-\[2px_2px_0_#[0-9A-Fa-f]{6}\]/g, 'drop-shadow-[2px_2px_0_#003B00]');
content = content.replace(/drop-shadow-\[3px_3px_0_#[0-9A-Fa-f]{6}\]/g, 'drop-shadow-[2px_2px_0_#003B00]');
content = content.replace(/drop-shadow-\[1px_1px_0_#[0-9A-Fa-f]{6}\]/g, 'drop-shadow-[1px_1px_0_#003B00]');
content = content.replace(/drop-shadow-\[0_0_2px_#[0-9A-Fa-f]{6}\]/g, 'drop-shadow-[0_0_2px_#00FF41]');
content = content.replace(/drop-shadow-\[0_0_5px_#[0-9A-Fa-f]{6}\]/g, 'drop-shadow-[0_0_5px_#00FF41]');

content = content.replace(/shadow-\[4px_4px_0_0_#[0-9A-Fa-f]{6}\]/g, 'shadow-[4px_4px_0_0_#003B00]');
content = content.replace(/shadow-\[8px_8px_0_0_rgba.*?\]/g, 'shadow-[4px_4px_0_0_#003B00]');
content = content.replace(/shadow-\[10px_10px_0_0_#[0-9A-Fa-f]{6}\]/g, 'shadow-[4px_4px_0_0_#003B00]');
content = content.replace(/shadow-\[inset_0_0_10px_rgba.*?\]/g, 'shadow-[inset_0_0_20px_rgba(0,255,65,0.1)]');
content = content.replace(/shadow-\[0_4px_20px_rgba.*?\]/g, 'shadow-[0_4px_20px_rgba(0,255,65,0.1)]');

// Change specific term arrays
content = content.replace(/const chartColors = \[.*?\];/, "const chartColors = ['#00FF41', '#008F11', '#003B00', '#005500', '#00AA22'];");

// Terminology Changes
content = content.replace(/StockMaster Arcade Edition/g, 'StockMaster MAIN_TERMINAL');
content = content.replace(/AI ARCADE/g, 'MATRIX.SYS');
content = content.replace(/INSERT COIN TO START/g, 'WAKE UP, NEO...');
content = content.replace(/VS MODE/g, 'SYS.COMPARE');
content = content.replace(/RANKING LIST/g, 'NODE.RANKING');
content = content.replace(/CRITICAL INSIGHT/g, 'SYS.ANALYSIS');
content = content.replace(/BATTLE RESULT/g, 'SIMULATION_OUTPUT');
content = content.replace(/MARKET TREND/g, 'GLOBAL_DATA_STREAM');
content = content.replace(/SYSTEM INSIGHT/g, 'DATA_PACKET_INTERCEPT');
content = content.replace(/AI MASTER/g, 'ORACLE_INTERFACE');
content = content.replace(/font-sans/g, 'font-mono');
content = content.replace(/font-serif/g, 'font-mono');

// Rebuild CRT Text
content = content.replace(/text-shadow: 1\.5px 0 0 rgba\(255,0,0,0\.7\), -1\.5px 0 0 rgba\(0,255,255,0\.7\);/g, 'text-shadow: 0 0 5px rgba(0,255,65,0.8), 0 0 10px rgba(0,255,65,0.4);');

// Change thick borders to clean terminal-like borders
content = content.replace(/border-4/g, 'border-2');

fs.writeFileSync('src/App.tsx', content, 'utf-8');
