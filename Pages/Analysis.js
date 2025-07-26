import React, { useState, useEffect } from 'react';
import { InvestmentCalculation } from '@/entities/InvestmentCalculation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calculator, DollarSign, Target, Calendar } from "lucide-react";
import { format } from 'date-fns';

export default function Analysis() {
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  // Prepare data for charts
  const chartData = calculations.slice(0, 10).map((calc, index) => ({
    name: `Goal ${index + 1}`,
    targetAmount: calc.target_amount,
    monthlyContribution: calc.monthly_contribution,
    totalContributions: calc.total_contributions,
    totalGrowth: calc.total_growth,
    yearsToGoal: calc.years_to_goal
  }));

  const riskDistribution = calculations.reduce((acc, calc) => {
    const scenario = calc.risk_scenario || 'custom';
    acc[scenario] = (acc[scenario] || 0) + 1;
    return acc;
  }, {});

  const riskLabels = {
      conservative: 'Conservative',
      moderate: 'Moderate',
      aggressive: 'Aggressive',
      very_aggressive: 'Very Aggressive',
      custom: 'Custom'
  }

  const pieData = Object.entries(riskDistribution).map(([risk, count]) => ({
    name: riskLabels[risk],
    value: count,
    color: getRiskBadgeColor(risk).split(' ')[0].replace('bg-', '#').slice(0, -4) // Heuristic for color
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Investment Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Analyze your investment calculations and track your financial planning journey
          </p>
        </div>

        {calculations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Calculations Yet</h3>
            <p className="text-slate-500 mb-6">
              Start by creating your first investment calculation to see analysis here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Calculations</p>
                      <p className="text-2xl font-bold text-slate-900">{calculations.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg Target</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(calculations.reduce((sum, calc) => sum + calc.target_amount, 0) / calculations.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg Monthly</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(calculations.reduce((sum, calc) => sum + calc.monthly_contribution, 0) / calculations.length)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Avg Timeline</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {Math.round(calculations.reduce((sum, calc) => sum + calc.years_to_goal, 0) / calculations.length)} years
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                    <span>Monthly Contributions vs Target Amount</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                        <YAxis fontSize={12} stroke="#64748b" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip 
                          formatter={(value, name) => [
                            formatCurrency(value), 
                            name === 'monthlyContribution' ? 'Monthly' : 'Target'
                          ]}
                          labelStyle={{ color: '#1e293b' }}
                        />
                        <Bar dataKey="monthlyContribution" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Risk Scenario Distribution</CardTitle>
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
                        <Tooltip formatter={(value) => [value, 'Calculations']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm text-slate-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Calculations */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Recent Investment Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculations.slice(0, 5).map((calc) => (
                    <div key={calc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {formatCurrency(calc.target_amount)} in {calc.years_to_goal} years
                          </p>
                          <p className="text-sm text-slate-600">
                            Created {format(new Date(calc.created_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-blue-600">
                          {formatCurrency(calc.monthly_contribution)}/month
                        </p>
                        <Badge className={getRiskBadgeColor(calc.risk_scenario)}>
                          {riskLabels[calc.risk_scenario]}
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