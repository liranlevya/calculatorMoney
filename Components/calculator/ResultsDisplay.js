import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target, PiggyBank, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsDisplay({ results }) {
  if (!results) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate) => {
    return `${(rate * 100).toFixed(1)}%`;
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

  const getRiskLabel = (scenario) => {
    const s = scenario || 'custom';
    switch (s) {
      case 'conservative': return 'conservative';
      case 'moderate': return 'moderate';
      case 'aggressive': return 'aggressive';
      case 'very_aggressive': return 'very aggressive';
      case 'custom': return `custom (${formatPercentage(results.projected_annual_return)})`;
      default: return s;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl border-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent" />
        
        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Monthly Contribution</CardTitle>
                <p className="text-blue-100 text-sm">Required to reach your goal</p>
              </div>
            </div>
            <Badge className={`${getRiskBadgeColor(results.risk_scenario)} font-medium capitalize`}>
              {getRiskLabel(results.risk_scenario)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {formatCurrency(results.monthly_contribution)}
            </div>
            <p className="text-blue-100 text-lg">per month</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Target Amount</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(results.target_amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Annual Return</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatPercentage(results.projected_annual_return)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Time Frame</p>
                <p className="text-xl font-bold text-slate-900">
                  {results.years_to_goal} years
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <span>Investment Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Total Contributions</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(results.total_contributions)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Expected Growth</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(results.total_growth)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Initial Investment</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(results.initial_investment || 0)}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Monthly × Months</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(results.monthly_contribution)} × {results.years_to_goal * 12}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Growth Percentage</span>
                <span className="font-semibold text-green-600">
                  {results.total_contributions > 0 ? ((results.total_growth / results.total_contributions) * 100).toFixed(1) + '%' : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 font-bold text-lg">
                <span className="text-slate-900">Final Amount</span>
                <span className="text-blue-600">
                  {formatCurrency(results.target_amount)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}