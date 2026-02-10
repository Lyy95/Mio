import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Moon, Sun, Lightbulb } from 'lucide-react';

const data = [
  { name: 'Mon', mood: 6, sleep: 7 },
  { name: 'Tue', mood: 5, sleep: 6.5 },
  { name: 'Wed', mood: 3, sleep: 5 },
  { name: 'Thu', mood: 7, sleep: 8 },
  { name: 'Fri', mood: 8, sleep: 7.5 },
  { name: 'Sat', mood: 9, sleep: 9 },
  { name: 'Sun', mood: 8, sleep: 8.5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-lg shadow-slate-200/50">
        <p className="text-slate-500 text-sm mb-1 font-medium">{label}</p>
        <p className="text-indigo-600 font-bold text-sm">
          {payload[0].name === 'sleep' ? '睡眠: ' : '心情: '}
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold text-slate-900">每周洞察</h2>
        <div className="bg-white px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 border border-slate-200 shadow-sm">
          Last 7 Days
        </div>
      </div>
      
      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer">
          <div className="bg-indigo-50 p-3 rounded-xl mb-3">
            <Moon className="text-indigo-600" size={24} />
          </div>
          <span className="text-3xl font-bold text-slate-900">7.3h</span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">平均睡眠</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer">
          <div className="bg-amber-50 p-3 rounded-xl mb-3">
            <Sun className="text-amber-500" size={24} />
          </div>
          <span className="text-3xl font-bold text-slate-900">6.5</span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">平均心情</span>
        </div>
      </div>

      {/* Sleep Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold mb-6 text-sm text-slate-500 flex items-center gap-2 uppercase tracking-wider">
          <Moon size={16} className="text-indigo-500" /> 睡眠质量趋势
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                stroke="#cbd5e1"
                tick={{ fill: '#64748b' }}
                dy={10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.03)'}} />
              <Bar dataKey="sleep" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold mb-6 text-sm text-slate-500 flex items-center gap-2 uppercase tracking-wider">
          <Sun size={16} className="text-amber-500" /> 心情波动曲线
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                stroke="#cbd5e1"
                tick={{ fill: '#64748b' }}
                dy={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={{r: 4, fill: '#ffffff', stroke: '#f59e0b', strokeWidth: 2}} 
                activeDot={{r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-sm text-emerald-800 flex gap-4 shadow-sm">
        <div className="bg-emerald-100 p-2 rounded-lg h-fit">
          <Lightbulb className="flex-shrink-0 text-emerald-600" size={18} />
        </div>
        <div>
          <strong className="text-emerald-700 block mb-1 text-base">AI 洞察发现</strong>
          <span className="leading-relaxed opacity-90">当你心情好的时候，睡眠质量也更高。试着在周三睡前放松一下吧！</span>
        </div>
      </div>
    </div>
  )
}
