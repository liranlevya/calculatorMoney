
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, Target, TrendingUp, Percent } from "lucide-react";

export default function InvestmentForm_he({ onCalculate, isCalculating, onReset, results }) {
  const [formData, setFormData] = useState({
    targetAmount: '',
    yearsToGoal: '',
    initialInvestment: '',
    riskScenario: 'moderate',
    customRate: '',
    useCustomRate: false
  });

  const formatNumberWithCommas = (value) => {
    if (!value) return '';
    const numberValue = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(numberValue)) return '';
    return new Intl.NumberFormat('en-US').format(numberValue);
  };

  const handleFormattedInputChange = (field, value) => {
    const unformattedValue = value.replace(/,/g, '');
    if (/^\d*\.?\d*$/.test(unformattedValue)) {
        setFormData(prev => ({ ...prev, [field]: unformattedValue }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.targetAmount || !formData.yearsToGoal) return;
    
    onCalculate({
      target_amount: parseFloat(formData.targetAmount),
      years_to_goal: parseInt(formData.yearsToGoal),
      initial_investment: parseFloat(formData.initialInvestment) || 0,
      risk_scenario: formData.riskScenario,
      custom_rate: formData.useCustomRate ? parseFloat(formData.customRate) / 100 : null
    });
  };

  const handleRiskScenarioChange = (value) => {
    const isCustom = value === 'custom';
    setFormData(prev => ({ 
      ...prev, 
      riskScenario: value,
      useCustomRate: isCustom
    }));
  };

  const handleReset = () => {
    setFormData({
      targetAmount: '',
      yearsToGoal: '',
      initialInvestment: '',
      riskScenario: 'moderate',
      customRate: '',
      useCustomRate: false
    });
    if (onReset) {
      onReset();
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50" />
      
      <CardHeader className="relative pb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">יעד השקעה</CardTitle>
            <p className="text-sm text-slate-600 mt-1">חשב את ההפקדה החודשית שלך</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="targetAmount" className="text-sm font-semibold text-slate-700 flex items-center">
                <DollarSign className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 text-slate-500" />
                סכום יעד
              </Label>
              <Input
                id="targetAmount"
                type="text"
                inputMode="numeric"
                placeholder="1,000,000"
                value={formatNumberWithCommas(formData.targetAmount)}
                onChange={(e) => handleFormattedInputChange('targetAmount', e.target.value)}
                className="h-12 text-lg font-medium bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsToGoal" className="text-sm font-semibold text-slate-700 flex items-center">
                <Calendar className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 text-slate-500" />
                שנים להשגת היעד
              </Label>
              <Input
                id="yearsToGoal"
                type="number"
                placeholder="20"
                min="1"
                max="50"
                value={formData.yearsToGoal}
                onChange={(e) => handleFormattedInputChange('yearsToGoal', e.target.value)}
                className="h-12 text-lg font-medium bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialInvestment" className="text-sm font-semibold text-slate-700 flex items-center">
              <TrendingUp className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 text-slate-500" />
              השקעה ראשונית (אופציונלי)
            </Label>
            <Input
              id="initialInvestment"
              type="text"
              inputMode="numeric"
              placeholder="10,000"
              value={formatNumberWithCommas(formData.initialInvestment)}
              onChange={(e) => handleFormattedInputChange('initialInvestment', e.target.value)}
              className="h-12 text-lg font-medium bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">תשואה שנתית צפויה</Label>
            <Select 
              value={formData.riskScenario} 
              onValueChange={handleRiskScenarioChange}
            >
              <SelectTrigger className="h-12 text-lg bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">שמרני (6% תשואה שנתית)</SelectItem>
                <SelectItem value="moderate">מתון (8% תשואה שנתית)</SelectItem>
                <SelectItem value="aggressive">אגרסיבי (10% תשואה שנתית)</SelectItem>
                <SelectItem value="very_aggressive">אגרסיבי מאוד (12% תשואה שנתית)</SelectItem>
                <SelectItem value="custom">תשואה מותאמת אישית</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.useCustomRate && (
            <div className="space-y-2">
              <Label htmlFor="customRate" className="text-sm font-semibold text-slate-700 flex items-center">
                <Percent className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 text-slate-500" />
                שיעור תשואה שנתי מותאם אישית (%)
              </Label>
              <Input
                id="customRate"
                type="number"
                placeholder="8.5"
                min="0"
                max="30"
                step="0.1"
                value={formData.customRate}
                onChange={(e) => setFormData(prev => ({ ...prev, customRate: e.target.value }))}
                className="h-12 text-lg font-medium bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                הזן את שיעור התשואה השנתי הצפוי שלך (למשל, 8.5 עבור 8.5%)
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isCalculating || !formData.targetAmount || !formData.yearsToGoal || (formData.useCustomRate && !formData.customRate)}
            >
              {isCalculating ? (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>מחשב...</span>
                </div>
              ) : (
                'חשב הפקדה חודשית'
              )}
            </Button>

            {results && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleReset}
                className="h-14 px-6 text-lg font-semibold border-2 hover:bg-slate-50 transition-all duration-200"
              >
                איפוס
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
