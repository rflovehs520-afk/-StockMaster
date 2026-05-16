import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Info, 
  ExternalLink,
  Globe,
  Award,
  ArrowRightLeft,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  Stethoscope,
  BrainCircuit,
  Loader2,
  X,
  Menu
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ComposedChart,
  Bar
} from 'recharts';

const API_KEY = process.env.GEMINI_API_KEY || ""; // 從環境變量獲取 API Key
const MODEL_NAME = "gemini-3-flash-preview"; // 或使用 gemini-2.5-flash

// 初始模擬數據
const INITIAL_COMPANIES = [
  { id: '2330', name: '台積電', sector: '半導體', score: 98, eps: 32.34, roe: 28.5, pe: 24.1, dcf: 1100, asset: '2.5兆', yield: 1.8, website: 'https://www.tsmc.com', diagnosis: '全球晶圓代工龍頭，技術領先同業兩代以上。', history: [500, 520, 580, 600, 590, 630, 680, 750, 800, 900] },
  { id: '2454', name: '聯發科', sector: 'IC設計', score: 92, eps: 51.2, roe: 22.1, pe: 18.5, dcf: 1350, asset: '8000億', yield: 4.5, website: 'https://www.mediatek.tw', diagnosis: '手機晶片市佔第一，積極佈局AI伺服器與車用。', history: [800, 850, 900, 880, 920, 950, 1000, 1100, 1050, 1200] }
];

export default function App() {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(INITIAL_COMPANIES[0]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState(['2330', '2454']);
  const [industryInsights, setIndustryInsights] = useState('請輸入產業啟動 AI 深度分析報告...');
  const [comparisonAnalysis, setComparisonAnalysis] = useState('選取兩家以上公司進行戰略對比分析...');
  const [analyzingMaster, setAnalyzingMaster] = useState(false);
  const [activeTab, setActiveTab] = useState('insight'); // 'insight' or 'master'
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [timeframe, setTimeframe] = useState('分時');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 確保第一次進入時顯示教學
  useEffect(() => {
    const seen = localStorage.getItem('stockmaster_tutorial_v4');
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  const callGemini = async (prompt: string) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });
      if (!response.ok) throw new Error('API 連線失敗');
      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    
    const systemPrompt = `你現在是專業台股投資分析大師。請針對產業「${query}」篩選前 20 家優質台股公司。
    請回傳 JSON 格式：
    {
      "industryInsights": "200字內的產業趨勢分析...",
      "companies": [
        { "id": "代號", "name": "公司名", "sector": "次產業", "score": 0-100, "eps": 數值, "roe": 數值, "pe": 數值, "dcf": 估值, "asset": "淨資產", "yield": 數值, "website": "URL", "diagnosis": "業務診斷", "history": [10個數值代表10年股價] }
      ]
    }`;

    const result = await callGemini(systemPrompt);
    if (result) {
      setCompanies(result.companies);
      setIndustryInsights(result.industryInsights);
      setSelectedCompany(result.companies[0]);
      setComparisonList(result.companies.slice(0, 3).map((c: any) => c.id));
      
      // 自動觸發前五強對決分析
      handleComparisonAnalysis(result.companies.slice(0, 5));
    }
    setLoading(false);
  };

  const handleComparisonAnalysis = async (customTargets = null) => {
    setAnalyzingMaster(true);
    setActiveTab('master');
    const targets = customTargets || companies.filter(c => comparisonList.includes(c.id));
    
    const prompt = `分析以下台股公司數據並給出決策建議（過濾掉 * 號，純文字格式）：${JSON.stringify(targets)}。
    請比較他們的 ROE 穩定度、DCF 安全邊際，並推薦最值得投資的一家標的及其理由。回傳 JSON: { "analysis": "內容..." }`;

    const result = await callGemini(prompt);
    if (result) {
      setComparisonAnalysis(result.analysis.replace(/\*/g, ''));
    } else {
      setComparisonAnalysis("無法取得大師建議，請檢查連線或縮減選取範圍。");
    }
    setAnalyzingMaster(false);
  };

  const chartColors = ['#00FF41', '#08F7FE', '#FFFFFF', '#FFD300', '#FF00FF'];
  
  const historyData = Array.from({ length: 10 }).map((_, i) => {
    const entry: any = { year: 2015 + i };
    comparisonList.forEach((id, idx) => {
      const company = companies.find(c => c.id === id);
      if (company && company.history) {
        entry[company.name] = company.history[i];
      }
    });
    return entry;
  });

    const getChartData = () => {
    const basePrice = selectedCompany ? selectedCompany.history[selectedCompany.history.length - 1] : 100;
    switch (timeframe) {
      case '日':
        return Array.from({ length: 30 }).map((_, i) => ({
          time: `Day ${i + 1}`,
          price: basePrice * (0.8 + Math.random() * 0.4),
          volume: Math.floor(Math.random() * 8000) + 2000
        }));
      case '月':
        return Array.from({ length: 12 }).map((_, i) => ({
          time: `Month ${i + 1}`,
          price: basePrice * (0.6 + Math.random() * 0.8),
          volume: Math.floor(Math.random() * 15000) + 5000
        }));
      case '年':
        return Array.from({ length: 5 }).map((_, i) => ({
          time: `20${20 + i}`,
          price: basePrice * (0.4 + Math.random() * 1.2),
          volume: Math.floor(Math.random() * 50000) + 10000
        }));
      case '分時':
      default:
        return Array.from({ length: 24 }).map((_, i) => ({
          time: `${9 + Math.floor(i/4)}:${(i%4)*15 === 0 ? '00' : (i%4)*15}`,
          price: basePrice * (0.95 + Math.random() * 0.1),
          volume: Math.floor(Math.random() * 4000) + 500
        }));
    }
  };

  const chartData = getChartData();

  const tutorialSteps = [
    { title: "歡迎來到 StockMaster Pro", content: "這是您的專屬台股決策終端。點擊標題旁的問號可隨時重啟教學。", icon: <Zap className="text-[#C5A059]" /> },
    { title: "智慧搜尋分析", content: "在輸入框輸入產業（如：AI、綠能），AI 會自動抓取 Top 20 標的。", icon: <Search className="text-[#C5A059]" /> },
    { title: "大師對決系統", content: "勾選左側排行榜公司，點擊右側「執行自選對決分析」獲取深度報告。", icon: <BrainCircuit className="text-[#C5A059]" /> },
    { title: "即時監控儀表", content: "點擊公司名稱可切換下方紅色折線圖，掌握精準股價動能。", icon: <Activity className="text-[#C5A059]" /> },
    { title: "深度業務診斷", content: "點擊排行榜序號（如 #1）可彈出完整的 AI 業務體檢報告。", icon: <Stethoscope className="text-[#C5A059]" /> }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-slate-200 font-mono selection:bg-[#00FF41]/30 relative">
      {/* 賽博龐克背景網格與掃描線 */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(57,255,20,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_2px,transparent_2px)] bg-[size:100%_4px] z-50 mix-blend-overlay"></div>

      {/* 導覽列 */}
      <header className="border-b-4 border-[#00FF41] bg-[#000000] sticky top-0 z-40 p-5 relative shadow-[0_4px_20px_rgba(0,255,65,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00FF41] flex items-center justify-center border-2 border-[#000000]">
                <TrendingUp className="text-[#000000]" size={20} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl uppercase text-white tracking-tighter drop-shadow-[2px_2px_0_#003B00]">
                  StockMaster Pro <span className="text-[#00FF41] text-sm ml-1 font-mono hidden sm:inline">AI Strategy</span>
                </h1>
                <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-medium hidden sm:block">Intelligent Stock Analysis Terminal</p>
              </div>
              <button 
                onClick={() => setShowTutorial(true)}
                className="ml-2 p-1.5 hover:bg-[#00FF41] hover:text-[#000000] border border-transparent hover:border-[#00FF41] transition-colors text-[#00FF41] hidden md:block"
                title="查看操作教學"
              >
                <HelpCircle size={18} />
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#00FF41] hover:text-[#08F7FE] transition-colors p-2"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#008F11] group-focus-within:text-[#00FF41] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="輸入產業關鍵字 (如：半導體、航運...)" 
                className="w-full bg-[#000000] border-2 border-[#008F11] focus:border-[#00FF41] py-3 pl-12 pr-4 h-11 focus:outline-none transition-all text-xs text-[#00FF41] placeholder-[#008F11]/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#000000] border-2 border-[#00FF41] hover:bg-[#00FF41] hover:text-[#000000] text-[#00FF41] shadow-[4px_4px_0_0_#003B00] hover:shadow-[0px_0px_0_0_#00FF41] active:translate-x-1 active:translate-y-1 disabled:opacity-50 px-4 sm:px-8 h-11 text-[12px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
              啟動分析
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#000000] border-b-2 border-[#00FF41] shadow-[0_4px_20px_rgba(0,255,65,0.2)] flex flex-col p-4 space-y-4 z-50">
            <a href="#chart-section" onClick={() => setIsMenuOpen(false)} className="text-[#FF0000] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2 flex items-center gap-2"><BarChart3 size={16}/> 十年成長動能比對</a>
            <a href="#table-section" onClick={() => setIsMenuOpen(false)} className="text-[#FF00FF] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2 flex items-center gap-2"><Award size={16}/> 台股產業實力榜</a>
            <a href="#monitoring-section" onClick={() => setIsMenuOpen(false)} className="text-[#08F7FE] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2 flex items-center gap-2"><Activity size={16}/> 即時監控系統</a>
            <a href="#analysis-section" onClick={() => setIsMenuOpen(false)} className="text-[#FFD300] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] border-b border-[#008F11] pb-2 flex items-center gap-2"><BrainCircuit size={16}/> 分析大師 / 產業洞察</a>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                setShowTutorial(true);
                setTutorialStep(0);
              }}
              className="text-left text-[#00FF41] uppercase font-bold tracking-widest text-sm hover:text-[#FFFFFF] flex items-center gap-2"
            >
              <HelpCircle size={16} /> 操作指南
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左側：數據與排行榜 */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 十年成長比對曲線 */}
          <section id="chart-section" className="bg-[#000000] border-2 border-[#00FF41] p-4 md:p-8 relative shadow-[4px_4px_0_0_#003B00]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 border-b-2 border-[#00FF41] pb-4 gap-4">
              <div>
                <h2 className="text-lg md:text-xl flex items-center gap-2 uppercase text-[#FF0000] drop-shadow-[2px_2px_0_#800000]">
                  <BarChart3 className="text-[#FF0000]" size={20} /> 十年成長動能比對
                </h2>
                <p className="text-[10px] uppercase tracking-widest text-[#FF0000] mt-1">追蹤選中公司歷史獲利能力軌跡</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-start md:justify-end md:max-w-[50%]">
                {comparisonList.map((id, idx) => {
                  const name = companies.find(c => c.id === id)?.name || id;
                  return (
                    <span key={id} className="text-[12px] px-2 py-1 border border-[#00FF41] bg-[#000000] flex items-center gap-2 font-medium text-[#00FF41] shadow-[2px_2px_0_0_#008F11]">
                      <div className="w-3 h-3" style={{ backgroundColor: chartColors[idx % chartColors.length] }}></div>
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="w-full overflow-x-auto custom-scrollbar pb-2">
              <div className="w-full min-w-[700px] h-[40vh] min-h-[250px] md:h-[350px] max-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData}>
                  <defs>
                    {chartColors.map((color, i) => (
                      <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#00FF41" opacity={0.2} vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#A0AEC0', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#A0AEC0', fontSize: 12}} tickFormatter={(value) => value.toFixed(0)} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '2px solid #08F7FE', color: '#FFFFFF', boxShadow: '4px 4px 0 0 #008F11' }}
                    itemStyle={{ fontSize: '14px' }}
                    formatter={(value: any, name: any) => [`NT$ ${Number(value).toFixed(2)}`, name]}
                  />
                  {comparisonList.map((id, idx) => {
                    const company = companies.find(c => c.id === id);
                    if (!company) return null;
                    return (
                      <Area 
                        key={id}
                        type="monotone" 
                        dataKey={company.name} 
                        stroke={chartColors[idx % chartColors.length]} 
                        fill={`url(#grad-${idx})`} 
                        strokeWidth={2}
                        animationDuration={1500}
                      />
                    );
                  })}
                </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* 即時股價紅線監控圖 - 座標軸強化版 */}
          <section id="monitoring-section" className="bg-[#000000] border-2 border-[#08F7FE] p-4 md:p-8 relative overflow-hidden shadow-[4px_4px_0_0_#008080]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b-2 border-[#08F7FE] pb-4">
              <div className="flex items-center gap-4">
                <div className="text-[#08F7FE] animate-pulse drop-shadow-[0_0_5px_#00FF41]"><Activity size={24} /></div>
                <div>
                  <h2 className="text-lg md:text-xl flex items-center gap-2 uppercase text-[#00FF41] drop-shadow-[2px_2px_0_#008080]">
                    即時監控系統 <span className="text-[#08F7FE] uppercase text-[10px] md:text-sm">[{selectedCompany?.name} {selectedCompany?.id}]</span>
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap bg-[#000000] p-1 border-2 border-[#08F7FE]">
                {['分時', '日', '月', '年'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTimeframe(t)}
                    className={`px-3 md:px-4 py-1.5 text-[10px] md:text-[12px] uppercase font-bold tracking-widest transition-all ${t === timeframe ? 'bg-[#00FF41] text-[#000000]' : 'text-[#00FF41] hover:bg-[#008080] hover:text-[#000000]'}`}>{t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full overflow-x-auto custom-scrollbar-cyan pb-2">
              <div className="w-full min-w-[700px] h-[40vh] min-h-[250px] md:h-[350px] max-h-[400px]">
                {selectedCompany ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#08F7FE" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tick={{ fill: '#08F7FE', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
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
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#000000', border: '2px solid #08F7FE', color: '#FFFFFF'}} 
                      formatter={(value: any, name: any) => { if (name === 'price') return [`NT$ ${Number(value).toFixed(2)}`, '價格']; return [`${value} 張`, '交易量']; }}
                    />
                    <Bar yAxisId="right" dataKey="volume" fill="#00FF41" opacity={0.3} barSize={20} />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#08F7FE" 
                      strokeWidth={4} 
                      dot={false} 
                      filter="url(#glow)"
                      animationDuration={2000}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#08F7FE] uppercase animate-pulse">
                  <Activity size={48} className="mb-4 opacity-50" />
                  請從下方排行榜點擊公司觀看紅線走勢
                </div>
              )}
              </div>
            </div>
          </section>

          {/* 台股實力排行榜 */}
          <section id="table-section" className="bg-[#000000] border-2 border-[#FF00FF] shadow-[4px_4px_0_0_#800080]">
            <div className="p-4 md:p-6 border-b-2 border-[#FF00FF] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#000000]">
              <h2 className="text-lg md:text-xl flex items-center gap-2 uppercase text-[#FF00FF] drop-shadow-[2px_2px_0_#800080]">
                <Award className="text-[#FF00FF]" size={20} /> 台股產業實力榜
              </h2>
              <span className="text-[10px] md:text-[12px] uppercase tracking-widest text-[#00FF41] animate-pulse">嚴選前段班</span>
            </div>
            <div className="overflow-x-auto custom-scrollbar-fuchsia pb-1">
               <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#000000] text-[#FF00FF] text-[12px] uppercase tracking-[0.2em] font-medium border-b-2 border-[#FF00FF]">
                  <tr>
                    <th className="px-6 py-4 font-normal">排名</th>
                    <th className="px-6 py-4 font-normal">代號/名稱</th>
                    <th className="px-6 py-4 font-normal">綜合評分</th>
                    <th className="px-6 py-4 text-center font-normal">對比</th>
                    <th className="px-6 py-4 font-normal">EPS / ROE</th>
                    <th className="px-6 py-4 font-normal">估值(TWD)</th>
                    <th className="px-6 py-4 font-normal">官網</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FF00FF]/30">
                  {companies.map((c: any, idx) => (
                    <tr 
                      key={c.id} 
                      className={`group hover:bg-[#008080]/10 transition-colors cursor-pointer border-b border-[#008F11]/30 last:border-0 ${selectedCompany?.id === c.id ? 'bg-[#008F11]/20' : ''}`}
                      onClick={() => setSelectedCompany(c)}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedCompany(c); setIsDetailOpen(true); }}
                          className="font-mono text-2xl text-[#FF00FF] group-hover:text-white transition-colors drop-shadow-[1px_1px_0_#800080]"
                        >
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white drop-shadow-[1px_1px_0_#003B00] group-hover:text-[#00FF41] transition-colors text-lg uppercase">{c.name}</div>
                        <div className="text-[12px] text-slate-400 tracking-widest uppercase mt-1">[{c.id}] {c.sector}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[14px] font-bold w-8 text-[#00FF41] drop-shadow-[1px_1px_0_#003B00]">{c.score}</span>
                          <div className="flex-1 h-3 w-16 bg-[#000000] border border-[#FF00FF] rounded-none overflow-hidden">
                            <div className="h-full bg-[#FF00FF]" style={{ width: `${c.score}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setComparisonList(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]);
                          }}
                          className={`p-2 transition-colors ${comparisonList.includes(c.id) ? 'text-[#00FF41] drop-shadow-[0_0_5px_#00FF41]' : 'text-[#737373] hover:text-[#00FF41]'}`}
                        >
                          {comparisonList.includes(c.id) ? <CheckCircle2 size={24} /> : <PlusCircle size={24} />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-white">EPS: {c.eps}</div>
                        <div className="text-[12px] text-[#00FF41] mt-1">ROE: {c.roe}%</div>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-slate-400 tracking-widest uppercase font-bold">
                        {c.dcf}
                      </td>
                      <td className="px-6 py-4">
                        <a href={c.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 text-[#00FF41] hover:text-[#00FF41] transition-colors inline-block">
                          <Globe size={20} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 右側：AI 分析面板 */}
        <aside className="lg:col-span-4 space-y-8">
          <section id="analysis-section" className="bg-[#000000] border-2 border-[#FFD300] flex flex-col h-auto lg:h-[900px] min-h-[900px] shadow-[4px_4px_0_0_#B29600] relative">
            <div className="p-4 md:p-6 border-b-2 border-[#FFD300] flex justify-between items-center bg-[#000000]">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-[#FFD300] animate-pulse">
                  {activeTab === 'insight' ? <PieChart className="w-5 h-5 md:w-6 md:h-6" /> : <BrainCircuit className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <h2 className="text-lg md:text-xl uppercase text-[#FFD300] tracking-wide drop-shadow-[2px_2px_0_#B29600]">{activeTab === 'insight' ? '產業深度洞察' : 'AI 分析大師'}</h2>
              </div>
              <button 
                onClick={() => setActiveTab(prev => prev === 'insight' ? 'master' : 'insight')}
                className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] text-[#00FF41] hover:text-[#000000] hover:bg-[#00FF41] border border-[#00FF41] hover:border-[#00FF41] px-2 py-1 flex items-center gap-1 md:gap-2 font-bold transition-all whitespace-nowrap"
              >
                <ArrowRightLeft size={14} className="hidden sm:block" /> {activeTab === 'insight' ? '切換 AI' : '切換洞察'}
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden bg-[#000000] crt-lines">
              <div className={`flex transition-transform duration-700 ease-in-out h-full ${activeTab === 'master' ? '-translate-x-full' : 'translate-x-0'}`}>
                
                {/* 產業洞察 Slide */}
                <div className="w-full flex-shrink-0 h-full p-8 overflow-y-auto custom-scrollbar-yellow">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#08F7FE] font-bold text-[14px] uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_2px_#08F7FE]">
                      <Zap size={18} className="text-[#08F7FE]" /> <span className="text-[#08F7FE]">市場趨勢分析</span>
                    </div>
                    <div className="text-slate-200 leading-relaxed text-sm whitespace-pre-line bg-[#000000] p-6 border-2 border-[#08F7FE] font-mono crt-text shadow-[4px_4px_0_0_#008080]">
                      <div className="mb-2 text-[#08F7FE]">&gt; 系統分析中...</div>
                      {industryInsights}
                    </div>
                    {/* 新增裝飾性數據點 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#000000] border-2 border-[#008F11] flex flex-col items-start shadow-[4px_4px_0_0_#003B00]">
                        <div className="text-[12px] text-[#00FF41] uppercase tracking-[0.2em] mb-2 font-bold">AI 信心指數</div>
                        <div className="text-3xl text-[#00FF41] drop-shadow-[2px_2px_0_#003B00]">89%</div>
                      </div>
                      <div className="p-4 bg-[#000000] border-2 border-[#00FF41] flex flex-col items-start shadow-[4px_4px_0_0_#003B00]">
                        <div className="text-[12px] text-[#008F11] uppercase tracking-[0.2em] mb-2 font-bold">推薦風險比</div>
                        <div className="text-3xl text-[#00FF41] drop-shadow-[2px_2px_0_#003B00]">LOW</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI 分析大師 Slide */}
                <div className="w-full flex-shrink-0 h-full p-6 overflow-y-auto custom-scrollbar-yellow flex flex-col space-y-6">
                  {/* 大師點評視窗 */}
                  <div className="bg-[#000000] border-2 border-[#FF00FF] p-6 relative overflow-hidden flex flex-col min-h-[220px] max-h-[300px] shadow-[4px_4px_0_0_#800080]">
                    <div className="flex items-center gap-2 text-[#00FF41] mb-4 font-bold text-[14px] uppercase tracking-[0.2em] drop-shadow-[0_0_2px_#00FF41]">
                      <ShieldCheck size={18} className="text-[#FFD300]" /> <span className="text-[#FFD300]">大師戰略點評</span>
                    </div>
                    <div className="text-slate-300 text-sm leading-relaxed overflow-y-auto pr-2 flex-1 crt-text">
                      &gt; 系統建議： <br/>「目前該產業正處於週期性復甦的拐點，應優先關注 DCF 安全邊際大於 15% 且 ROE 持續增長的龍頭標的...」
                    </div>
                  </div>

                  {/* 決策工具箱 - 對決按鈕 */}
                  <div className="bg-[#000000] border-2 border-[#FFD300] p-8 text-center space-y-6 relative z-10 shadow-[4px_4px_0_0_#B29600]">
                    <div className="flex items-center justify-center gap-2 text-[#FFD300] text-[14px] font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_2px_#FFD300]">
                      <ArrowRightLeft size={18} /> 決策工具箱
                    </div>
                    <div>
                      <div className="text-[12px] text-[#00FF41] mb-3 uppercase tracking-[0.2em] font-bold">目前選取： <span className="text-[#00FF41] px-2 text-lg">{comparisonList.length}</span></div>
                      <button 
                        onClick={() => handleComparisonAnalysis()}
                        disabled={analyzingMaster || comparisonList.length < 2}
                        className={`w-full py-4 text-[14px] uppercase tracking-[0.2em] font-bold transition-all border-2 ${comparisonList.length >= 2 ? 'bg-[#FFD300] text-[#000000] border-[#FFD300] hover:bg-[#FFFFFF] shadow-[4px_4px_0_0_#B29600] active:translate-x-1 active:translate-y-1 active:shadow-none' : 'bg-[#000000] text-[#737373] border-[#737373] cursor-not-allowed'}`}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          {analyzingMaster ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                          執行分析
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 戰略分析報告 - 配合面板下拉擴大空間 */}
                  <div className="p-8 bg-[#000000] border-2 border-[#00FF41] flex-1 flex flex-col overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,65,0.1)]">
                    <div className="flex items-center gap-3 mb-6 text-[#00FF41] font-bold text-[14px] uppercase tracking-[0.2em] drop-shadow-[0_0_2px_#00FF41]">
                      <Award size={18} className="text-[#08F7FE]" /> <span className="text-[#08F7FE]">戰略分析報告</span>
                    </div>
                    {/* 滑塊區域 */}
                    <div className="overflow-y-auto custom-scrollbar-yellow pr-2 flex-1 text-sm text-[#00FF41] leading-relaxed break-words crt-text">
                      {comparisonAnalysis ? (
                        <div className="whitespace-pre-line animate-in fade-in slide-in-from-bottom-4 duration-700">
                          {comparisonAnalysis}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[#008F11] uppercase animate-pulse gap-4 text-center">
                          <BrainCircuit size={48} className="opacity-50" />
                          <p>等待指令...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* 公司詳情彈窗 */}
      {isDetailOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/80">
          <div className="bg-[#000000] border-2 border-[#00FF41] w-full max-w-2xl overflow-hidden shadow-[4px_4px_0_0_#003B00] animate-in zoom-in duration-300">
            <div className="p-4 md:p-8 bg-[#000000] border-b-4 border-[#00FF41] flex justify-between items-start">
              <div>
                <h3 className="text-2xl md:text-4xl uppercase text-white drop-shadow-[2px_2px_0_#003B00]">{selectedCompany.name}</h3>
                <p className="text-cyan-400 text-[12px] md:text-[14px] uppercase tracking-[0.3em] mt-2 font-bold drop-shadow-[1px_1px_0_#003B00]">ID: {selectedCompany.id} // {selectedCompany.sector}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="p-2 border-2 border-transparent hover:border-[#008F11] text-[#008F11] hover:text-[#00FF41] transition-colors"><X size={24} /></button>
            </div>
            <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-[#000000] max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div className="border-2 border-[#00FF41] p-4 md:p-6 bg-[#000000] shadow-[4px_4px_0_0_#003B00]">
                  <p className="text-[14px] text-[#00FF41] uppercase tracking-[0.2em] mb-2 font-bold">ROE</p>
                  <p className="text-3xl md:text-4xl text-white drop-shadow-[2px_2px_0_#003B00]">{selectedCompany.roe}%</p>
                </div>
                <div className="border-2 border-[#008F11] p-4 md:p-6 bg-[#000000] shadow-[4px_4px_0_0_#003B00]">
                  <p className="text-[14px] text-[#008F11] uppercase tracking-[0.2em] mb-2 font-bold">EPS</p>
                  <p className="text-3xl md:text-4xl text-white drop-shadow-[2px_2px_0_#003B00]">{selectedCompany.eps}</p>
                </div>
                <div className="border-2 border-[#00FF41] p-4 md:p-6 bg-[#000000] shadow-[4px_4px_0_0_#003B00]">
                  <p className="text-[14px] text-[#00FF41] uppercase tracking-[0.2em] mb-2 font-bold">YIELD</p>
                  <p className="text-3xl md:text-4xl text-white drop-shadow-[2px_2px_0_#003B00]">{selectedCompany.yield}%</p>
                </div>
              </div>

              {/* AI 業務診斷區 */}
              <div className="relative p-6 md:p-8 bg-[#000000] border-2 border-[#00FF41] overflow-hidden shadow-[4px_4px_0_0_#003B00]">
                <Stethoscope className="absolute -right-8 -bottom-8 text-[#00FF41]/20 w-48 h-48 -rotate-12" />
                <div className="relative z-10">
                  <h4 className="text-[14px] font-bold uppercase text-[#00FF41] tracking-[0.2em] mb-4 flex items-center gap-2 drop-shadow-[0_0_2px_#00FF41]">
                    <Activity size={18} /> 業務診斷
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-sm crt-text">
                    &gt; {selectedCompany.diagnosis}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="flex-1 bg-[#00FF41] border-2 border-[#00FF41] text-[#000000] py-4 text-[14px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-[#000000] hover:text-[#00FF41] transition-colors shadow-[4px_4px_0_0_#003B00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                  <Globe size={18} /> 官方網站
                </a>
                <button onClick={() => setIsDetailOpen(false)} className="px-10 border-2 border-[#008F11] bg-[#000000] text-[#008F11] hover:bg-[#008080] hover:text-[#000000] py-4 text-[14px] uppercase tracking-[0.2em] font-bold transition-colors shadow-[4px_4px_0_0_#003B00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新手教學導覽 */}
      {showTutorial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-black/80">
          <div className="bg-[#000000] border-2 border-[#00FF41] w-full max-w-lg overflow-hidden animate-in zoom-in duration-500 shadow-[4px_4px_0_0_#003B00] max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-12 text-center space-y-6 md:space-y-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#000000] border-2 border-[#00FF41] mx-auto flex items-center justify-center text-[#00FF41] shadow-[4px_4px_0_0_#003B00] animate-bounce">
                {tutorialSteps[tutorialStep].icon}
              </div>
              <div>
                <h3 className="text-xl md:text-3xl uppercase mb-4 text-[#00FF41] drop-shadow-[2px_2px_0_#003B00]">{tutorialSteps[tutorialStep].title}</h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed crt-text">&gt; {tutorialSteps[tutorialStep].content}</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                {tutorialSteps.map((_, i) => (
                  <div key={i} className={`h-[4px] transition-all ${i === tutorialStep ? 'w-12 bg-[#00FF41]' : 'w-4 bg-[#008F11]/50'}`}></div>
                ))}
              </div>
              <div className="pt-8">
                <button 
                  onClick={() => {
                    if (tutorialStep < tutorialSteps.length - 1) {
                      setTutorialStep(tutorialStep + 1);
                    } else {
                      setShowTutorial(false);
                      localStorage.setItem('stockmaster_tutorial_v4', 'true');
                    }
                  }}
                  className="w-full bg-[#000000] border-2 border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-[#000000] py-4 text-[16px] uppercase tracking-[0.2em] font-bold transition-all shadow-[4px_4px_0_0_#003B00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-3"
                >
                  {tutorialStep === tutorialSteps.length - 1 ? '開始使用' : 'NEXT'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-7xl mx-auto px-12 py-8 border-t-4 border-[#00FF41] flex flex-col md:flex-row justify-between items-center gap-6 mt-12 bg-[#000000]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#00FF41] border border-[#000000]"></div>
          <span className="font-bold tracking-[0.2em] text-[12px] uppercase text-[#00FF41] drop-shadow-[1px_1px_0_#003B00]">StockMaster 主控端</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">
          <button onClick={() => setShowTutorial(true)} className="hover:text-[#00FF41] transition-colors drop-shadow-[0_0_2px_#00FF41]">操作指南</button>
          <span className="hover:text-[#00FF41] transition-colors cursor-help drop-shadow-[0_0_2px_#00FF41]">來源: 證交所</span>
          <span className="text-[#008F11] drop-shadow-[0_0_2px_#00FF41]">© 2026 MATRIX.SYS</span>
        </div>
      </footer>

      <style>{`
        /* Base scrollbar sizes */
        .custom-scrollbar::-webkit-scrollbar,
        .custom-scrollbar-fuchsia::-webkit-scrollbar,
        .custom-scrollbar-cyan::-webkit-scrollbar,
        .custom-scrollbar-yellow::-webkit-scrollbar { width: 8px; height: 8px; }

        /* Track backgrounds */
        .custom-scrollbar::-webkit-scrollbar-track,
        .custom-scrollbar-fuchsia::-webkit-scrollbar-track,
        .custom-scrollbar-cyan::-webkit-scrollbar-track,
        .custom-scrollbar-yellow::-webkit-scrollbar-track { background: #000000; }

        /* --- Colors: default (green #00FF41) --- */
        .custom-scrollbar::-webkit-scrollbar-track { border-left: 2px solid #00FF41; border-top: 2px solid #00FF41; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #00FF41; border: 1px solid #000000; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #00FF41; }

        /* --- Colors: fuchsia (#FF00FF) --- */
        .custom-scrollbar-fuchsia::-webkit-scrollbar-track { border-left: 2px solid #FF00FF; border-top: 2px solid #FF00FF; }
        .custom-scrollbar-fuchsia::-webkit-scrollbar-thumb { background: #FF00FF; border: 1px solid #000000; }
        .custom-scrollbar-fuchsia::-webkit-scrollbar-thumb:hover { background: #FF00FF; }

        /* --- Colors: cyan (#08F7FE) --- */
        .custom-scrollbar-cyan::-webkit-scrollbar-track { border-left: 2px solid #08F7FE; border-top: 2px solid #08F7FE; }
        .custom-scrollbar-cyan::-webkit-scrollbar-thumb { background: #08F7FE; border: 1px solid #000000; }
        .custom-scrollbar-cyan::-webkit-scrollbar-thumb:hover { background: #08F7FE; }

        /* --- Colors: yellow (#FFD300) --- */
        .custom-scrollbar-yellow::-webkit-scrollbar-track { border-left: 2px solid #FFD300; border-top: 2px solid #FFD300; }
        .custom-scrollbar-yellow::-webkit-scrollbar-thumb { background: #FFD300; border: 1px solid #000000; }
        .custom-scrollbar-yellow::-webkit-scrollbar-thumb:hover { background: #FFD300; }
        .crt-text {
          text-shadow: 1.5px 0 0 rgba(255,10,10,0.8), -1.5px 0 0 rgba(10,255,255,0.8);
          animation: textFlicker 0.05s infinite alternate;
        }
        .crt-lines::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 255, 65, 0.1) 50%), linear-gradient(90deg, rgba(0, 255, 65, 0.03), rgba(0, 143, 17, 0.03), rgba(0, 59, 0, 0.03));
          z-index: 20;
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
        }
        @keyframes textFlicker {
          0% { opacity: 0.95; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
