import * as fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add Bar to recharts import
content = content.replace(
  /ComposedChart\n} from 'recharts';/,
  "ComposedChart,\n  Bar\n} from 'recharts';"
);

// 2. Fix `getChartData` to use actual price (last historical value) instead of dcf
const newChartData = `  const getChartData = () => {
    const basePrice = selectedCompany ? selectedCompany.history[selectedCompany.history.length - 1] : 100;
    switch (timeframe) {
      case '日':
        return Array.from({ length: 30 }).map((_, i) => ({
          time: \`Day \${i + 1}\`,
          price: basePrice * (0.8 + Math.random() * 0.4),
          volume: Math.floor(Math.random() * 8000) + 2000
        }));
      case '月':
        return Array.from({ length: 12 }).map((_, i) => ({
          time: \`Month \${i + 1}\`,
          price: basePrice * (0.6 + Math.random() * 0.8),
          volume: Math.floor(Math.random() * 15000) + 5000
        }));
      case '年':
        return Array.from({ length: 5 }).map((_, i) => ({
          time: \`20\${20 + i}\`,
          price: basePrice * (0.4 + Math.random() * 1.2),
          volume: Math.floor(Math.random() * 50000) + 10000
        }));
      case '分時':
      default:
        return Array.from({ length: 24 }).map((_, i) => ({
          time: \`\${9 + Math.floor(i/4)}:\${(i%4)*15 === 0 ? '00' : (i%4)*15}\`,
          price: basePrice * (0.95 + Math.random() * 0.1),
          volume: Math.floor(Math.random() * 4000) + 500
        }));
    }
  };`;

content = content.replace(
  /const getChartData = \(\) => \{[\s\S]*?^\s*};\n/m,
  newChartData + '\n'
);

// 3. Add volume to ComposedChart
const newYAxis = `<YAxis 
                      yAxisId="left"
                      domain={['auto', 'auto']} 
                      axisLine={false} 
                      tick={{ fill: '#08F7FE', fontSize: 12 }} 
                      tickFormatter={(value) => value.toFixed(0)}
                      dx={-10}
                      label={{ 
                        value: '價格 (TWD)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        fill: '#08F7FE', 
                        fontSize: 12,
                        dy: 30
                      }} 
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      domain={['auto', 'auto']}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#A0AEC0', fontSize: 10 }}
                      tickFormatter={(value) => (value / 1000).toFixed(1) + 'k'}
                      label={{
                        value: '交易量',
                        angle: -90,
                        position: 'insideRight',
                        fill: '#A0AEC0',
                        fontSize: 12,
                        dy: -30
                      }}
                    />`;

content = content.replace(
  /<YAxis \n\s*domain=\{\['auto', 'auto'\]\} \n\s*axisLine=\{false\} \n\s*tick=\{\{ fill: '#08F7FE', fontSize: 12 \}\} \n\s*tickFormatter=\{\(value\) => value\.toFixed\(0\)\}\n\s*dx=\{-10\}\n\s*label=\{\{ \n\s*value: '價格 \(TWD\)', \n\s*angle: -90, \n\s*position: 'insideLeft', \n\s*fill: '#08F7FE', \n\s*fontSize: 12,\n\s*dy: 30\n\s*\}\} \n\s*\/>/m,
  newYAxis
);

// Update tooltip and line components
content = content.replace(
  /formatter=\{\(value: any\) => \[`NT\$ \$\{Number\(value\)\.toFixed\(2\)\}`, '價格'\]\}/g,
  "formatter={(value: any, name: any) => { if (name === 'price') return [`NT$ ${Number(value).toFixed(2)}`, '價格']; return [`${value} 張`, '交易量']; }}"
);

content = content.replace(
  /<Line \n\s*type="monotone" \n\s*dataKey="price" /,
  '<Bar yAxisId="right" dataKey="volume" fill="#00FF41" opacity={0.3} barSize={20} />\n                    <Line \n                      yAxisId="left" \n                      type="monotone" \n                      dataKey="price" '
);

fs.writeFileSync('src/App.tsx', content, 'utf-8');
