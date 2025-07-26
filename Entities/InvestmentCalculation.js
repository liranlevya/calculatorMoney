{
    "name": "InvestmentCalculation",
    "type": "object",
    "properties": {
      "target_amount": {
        "type": "number",
        "description": "Target investment amount to reach"
      },
      "years_to_goal": {
        "type": "number",
        "description": "Number of years to reach the goal"
      },
      "initial_investment": {
        "type": "number",
        "description": "Initial lump sum investment"
      },
      "risk_scenario": {
        "type": "string",
        "enum": [
          "conservative",
          "moderate",
          "aggressive",
          "very_aggressive",
          "custom"
        ],
        "description": "Risk tolerance scenario"
      },
      "monthly_contribution": {
        "type": "number",
        "description": "Calculated monthly contribution needed"
      },
      "projected_annual_return": {
        "type": "number",
        "description": "Projected annual return rate used"
      },
      "total_contributions": {
        "type": "number",
        "description": "Total amount that will be contributed"
      },
      "total_growth": {
        "type": "number",
        "description": "Total growth from investments"
      },
      "custom_rate": {
        "type": "number",
        "description": "Custom annual return rate if specified"
      }
    },
    "required": [
      "target_amount",
      "years_to_goal"
    ]
  }