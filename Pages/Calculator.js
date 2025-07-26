
import React, { useState } from 'react';
import { InvestmentCalculation } from '@/entities/InvestmentCalculation';
import InvestmentForm from '../components/calculator/InvestmentForm';
import ResultsDisplay from '../components/calculator/ResultsDisplay';
import GrowthChart from '../components/calculator/GrowthChart';

export default function Calculator() {
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateInvestment = async (formData) => {
    setIsCalculating(true);
    
    try {
      // Define return rates based on risk scenario
      const returnRates = {
        conservative: 0.06,   // 6%
        moderate: 0.08,       // 8%
        aggressive: 0.10,     // 10%
        very_aggressive: 0.12, // 12%
        custom: formData.custom_rate || 0.08
      };

      const annualReturn = returnRates[formData.risk_scenario];
      const monthlyReturn = annualReturn / 12;
      const totalMonths = formData.years_to_goal * 12;
      const initialInvestment = formData.initial_investment || 0;

      // Calculate future value with compound interest
      const futureValueOfInitial = initialInvestment * Math.pow(1 + annualReturn, formData.years_to_goal);
      const targetAfterInitial = formData.target_amount - futureValueOfInitial;

      // Calculate required monthly contribution
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

      // Save to database
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            S&P 500 Investment Calculator
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Calculate how much you need to invest monthly to reach your financial goals 
            with customizable return rates or based on historical S&P 500 performance projections.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <InvestmentForm 
              onCalculate={calculateInvestment}
              isCalculating={isCalculating}
              onReset={handleReset}
              results={results}
            />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <ResultsDisplay results={results} />
                <GrowthChart results={results} />
              </>
            ) : (
              <div className="flex items-center justify-center h-96 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-slate-500">
                    Fill out the form to see your investment projections
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-sm">⚠</span>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Important Disclaimer</h4>
              <p className="text-amber-700 text-sm leading-relaxed">
                This calculator provides estimates based on your selected return rates or historical S&P 500 performance. 
                Past performance does not guarantee future results. Actual returns may vary 
                significantly due to market volatility, economic conditions, and other factors. 
                Please consult with a financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
