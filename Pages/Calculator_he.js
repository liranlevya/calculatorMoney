
import React, { useState } from 'react';
import { InvestmentCalculation } from '@/entities/InvestmentCalculation';
import InvestmentForm_he from '../components/calculator/InvestmentForm_he';
import ResultsDisplay_he from '../components/calculator/ResultsDisplay_he';
import GrowthChart_he from '../components/calculator/GrowthChart_he';

export default function Calculator_he() {
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateInvestment = async (formData) => {
    setIsCalculating(true);
    
    try {
      const returnRates = {
        conservative: 0.06,
        moderate: 0.08,
        aggressive: 0.10,
        very_aggressive: 0.12,
        custom: formData.custom_rate || 0.08
      };

      const annualReturn = returnRates[formData.risk_scenario];
      const monthlyReturn = annualReturn / 12;
      const totalMonths = formData.years_to_goal * 12;
      const initialInvestment = formData.initial_investment || 0;
      
      const futureValueOfInitial = initialInvestment * Math.pow(1 + annualReturn, formData.years_to_goal);
      const targetAfterInitial = formData.target_amount - futureValueOfInitial;
      
      let monthlyContribution = 0;
      if (targetAfterInitial > 0) {
        const factor = (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
        monthlyContribution = targetAfterInitial / factor;
      }

      const totalContributions = initialInvestment + (monthlyContribution * totalMonths);
      const totalGrowth = formData.target_amount - totalContributions;

      const calculationResults = {
        target_amount: formData.target_amount,
        years_to_goal: formData.years_to_goal,
        initial_investment: formData.initial_investment || 0,
        risk_scenario: formData.risk_scenario,
        monthly_contribution: Math.max(0, monthlyContribution),
        projected_annual_return: annualReturn,
        total_contributions: totalContributions,
        total_growth: Math.max(0, totalGrowth),
        custom_rate: formData.custom_rate
      };

      await InvestmentCalculation.create(calculationResults);
      setResults(calculationResults);
    } catch (error) {
      console.error('Error calculating investment:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            מחשבון השקעות S&P 500
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            חשב כמה צריך להשקיע מדי חודש כדי להגיע ליעדים הפיננסיים שלך 
            עם שיעורי תשואה מותאמים אישית או בהתבסס על תחזיות ביצועים היסטוריות של מדד S&P 500.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <InvestmentForm_he 
              onCalculate={calculateInvestment}
              isCalculating={isCalculating}
              onReset={handleReset}
              results={results}
            />
          </div>

          <div className="space-y-6">
            {results ? (
              <>
                <ResultsDisplay_he results={results} />
                <GrowthChart_he results={results} />
              </>
            ) : (
              <div className="flex items-center justify-center h-96 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    מוכן לחישוב
                  </h3>
                  <p className="text-slate-500">
                    מלא את הטופס כדי לראות את תחזיות ההשקעה שלך
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-sm">⚠</span>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">גילוי נאות חשוב</h4>
              <p className="text-amber-700 text-sm leading-relaxed">
                מחשבון זה מספק הערכות המבוססות על שיעורי התשואה שבחרת או על ביצועי העבר של מדד S&P 500. 
                ביצועי העבר אינם מבטיחים תוצאות עתידיות. התשואות בפועל עשויות להשתנות 
                באופן משמעותי עקב תנודתיות השוק, תנאים כלכליים וגורמים אחרים. 
                יש להיוועץ ביועץ פיננסי לפני קבלת החלטות השקעה.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
