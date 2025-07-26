import React, { useState, useEffect } from 'react';
import { InvestmentCalculation } from '@/entities/InvestmentCalculation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calculator, DollarSign, Target, Calendar } from "lucide-react";
import { format } from 'date-fns';

export default function Analysis_he() {
  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    try {
      const data = await InvestmentCalculation.list('-created_date', 20);
      setCalculations(data);
    } catch (error) {
      console.error('Error loading calculations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const riskTranslations = {
    conservative: 'שמרני',
    moderate: 'מתון',
    aggressive: 'אגרסיבי',
    very_aggressive: 'אגרסיבי מאוד',
    custom: 'מותאם אישית'
  };

  const getRiskBadgeColor = (scenario) => {
    switch (scenario) {
      case 'conservative': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'aggressive': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'very_aggressive': return 'bg-red-100 text-red-800 border-red-200';
      case 'custom': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const chartData = calculations.slice(0, 10).map((calc, index) => ({
    name: `יעד ${index + 1}`,
    targetAmount: calc.target_amount,
    monthlyContribution: calc.monthly_contribution
  }));

  const riskDistribution = calculations.reduce((acc, calc) => {
    const scenario = calc.risk_scenario || 'custom';
    acc[scenario] = (acc[scenario] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(riskDistribution).map(([risk, count]) => ({
    name: riskTranslations[risk],
    value: count,
    color: risk === 'conservative' ? '#10b981' : risk === 'moderate' ? '#3b82f6' : risk === 'aggressive' ? '#f59e0b' : risk === 'very_aggressive' ? '#ef4444' : '#a855f7'
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            ניתוח השקעות
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            נתח את חישובי ההשקעות שלך ועקוב אחר מסע התכנון הפיננסי שלך
          </p>
        </div>

        {calculations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">אין עדיין חישובים</h3>
            <p className="text-slate-500 mb-6">
              התחל ביצירת חישוב ההשקעה הראשון שלך כדי לראות כאן ניתוחים.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">סך חישובים</p>
                      <p className="text-2xl font-bold text-slate-900">{calculations.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">יעד ממוצע</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(calculations.reduce((sum, calc) => sum + calc.target_amount, 0) / calculations.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">הפקדה חודשית ממוצעת</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(calculations.reduce((sum, calc) => sum + calc.monthly_contribution, 0) / calculations.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">טווח זמן ממוצע</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {Math.round(calculations.reduce((sum, calc) => sum + calc.years_to_goal, 0) / calculations.length)} שנים
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                    <span>הפקדות חודשיות מול סכום יעד</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                        <YAxis fontSize={12} stroke="#64748b" tickFormatter={(value) => `₪${(value / 1000).toFixed(0)}k`} orientation="right"/>
                        <Tooltip 
                          formatter={(value, name) => [
                            formatCurrency(value), 
                            name === 'monthlyContribution' ? 'חודשי' : 'יעד'
                          ]}
                          labelStyle={{ color: '#1e293b' }}
                        />
                        <Bar dataKey="monthlyContribution" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>התפלגות תרחישי סיכון</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'חישובים']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 rtl:space-x-reverse mt-4">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm text-slate-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>חישובי השקעות אחרונים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculations.slice(0, 5).map((calc) => (
                    <div key={calc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {formatCurrency(calc.target_amount)} ב-{calc.years_to_goal} שנים
                          </p>
                          <p className="text-sm text-slate-600">
                            נוצר ב-{format(new Date(calc.created_date), 'd MMM, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-blue-600">
                          {formatCurrency(calc.monthly_contribution)}/חודש
                        </p>
                        <Badge className={getRiskBadgeColor(calc.risk_scenario)}>
                          {riskTranslations[calc.risk_scenario]}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}