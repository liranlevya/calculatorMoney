import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from "lucide-react";

export default function GrowthChart_he({ results }) {
  if (!results) return null;

  const generateProjectionData = () => {
    const data = [];
    const monthlyContribution = results.monthly_contribution;
    const annualReturn = results.projected_annual_return;
    const initialInvestment = results.initial_investment || 0;
    
    let totalContributions = initialInvestment;
    let totalValue = initialInvestment;
    
    data.push({
      year: 0,
      totalValue: Math.round(totalValue),
      totalContributions: Math.round(totalContributions),
      growth: 0
    });

    for (let year = 1; year <= results.years_to_goal; year++) {
      totalContributions += monthlyContribution * 12;
      totalValue = (totalValue + monthlyContribution * 12) * (1 + annualReturn);
      const growth = totalValue - totalContributions;
      
      data.push({
        year,
        totalValue: Math.round(totalValue),
        totalContributions: Math.round(totalContributions),
        growth: Math.round(growth)
      });
    }
    return data;
  };

  const projectionData = generateProjectionData();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 text-right">
          <p className="font-semibold text-slate-900 mb-2">{`שנה ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'totalValue' && `שווי כולל: ${formatCurrency(entry.value)}`}
              {entry.name === 'totalContributions' && `הפקדות: ${formatCurrency(entry.value)}`}
              {entry.name === 'growth' && `צמיחה: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <TrendingUp className="w-5 h-5 text-slate-600" />
          <span>תחזית צמיחת ההשקעה</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 20, right: 20, left: 30, bottom: 5 }} layout="horizontal">
              <defs>
                <linearGradient id="totalValueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="contributionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis 
                dataKey="year" 
                stroke="#64748b"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}k`}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="totalContributions"
                stackId="1"
                stroke="#64748b"
                fill="url(#contributionsGradient)"
                strokeWidth={2}
                name="totalContributions"
              />
              
              <Area
                type="monotone"
                dataKey="growth"
                stackId="1"
                stroke="#10b981"
                fill="url(#totalValueGradient)"
                strokeWidth={2}
                name="growth"
              />
              
              <Line
                type="monotone"
                dataKey="totalValue"
                stroke="#1e40af"
                strokeWidth={3}
                dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#1e40af' }}
                name="totalValue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse mt-4 text-sm">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            <span className="text-slate-600">סך ההפקדות</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-600">צמיחה</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
            <span className="text-slate-600">שווי כולל</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}