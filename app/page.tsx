"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlusCircle, History, Scale, TrendingUp } from 'lucide-react';

export default function WeightTracker() {
  const [weight, setWeight] = useState('');
  const [data, setData] = useState<{date: string, weight: number}[]>([]);

  // 页面加载时从浏览器内存读取数据
  useEffect(() => {
    const saved = localStorage.getItem('my_weights');
    if (saved) setData(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    if (!weight || isNaN(parseFloat(weight))) return;
    const newEntry = { 
      date: new Date().toLocaleDateString('zh-CN', {month: '2-digit', day: '2-digit'}), 
      weight: parseFloat(weight) 
    };
    const newData = [...data, newEntry];
    setData(newData);
    localStorage.setItem('my_weights', JSON.stringify(newData));
    setWeight('');
  };

  const clearData = () => {
    if(confirm("确定要清空所有记录吗？")) {
      setData([]);
      localStorage.removeItem('my_weights');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-10">
      {/* 顶部导航 */}
      <header className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Scale className="text-blue-500" />
          <h1 className="text-xl font-bold text-slate-800">轻记录</h1>
        </div>
        <button onClick={clearData} className="text-xs text-slate-400">重置</button>
      </header>

      <main className="p-4 space-y-6">
        {/* 输入卡片 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm mb-2">今天称了吗？</p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input 
                type="number" 
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-2xl font-semibold focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="00.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg</span>
            </div>
            <button 
              onClick={handleSave}
              className="bg-blue-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
            >
              <PlusCircle size={28} />
            </button>
          </div>
        </div>

        {/* 趋势图表 */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 px-2">
            <TrendingUp size={18} className="text-green-500" />
            <h2 className="text-sm font-bold text-slate-700">体重趋势</h2>
          </div>
          <div className="h-48 w-full">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                    labelStyle={{display: 'none'}}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm">暂无数据，开始记录吧</div>
            )}
          </div>
        </div>

        {/* 历史记录 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <History size={18} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-700">最近记录</h2>
          </div>
          <div className="space-y-2">
            {data.slice().reverse().map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100">
                <span className="text-slate-500 text-sm font-medium">{item.date}</span>
                <span className="text-slate-800 font-bold">{item.weight} <span className="text-xs font-normal text-slate-400">kg</span></span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}