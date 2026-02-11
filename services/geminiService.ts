import { GoogleGenAI, Type } from "@google/genai";
import { FinancialReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTicker = async (ticker: string, startYear: number, endYear: number): Promise<FinancialReport> => {
  
  const ANALYSIS_PROMPT = `
You are an expert financial analyst ("Firm Analysis Assistant").
Your task is to perform a comprehensive financial analysis of the company provided by the user.

1.  **Search & Retrieval**: Use the 'googleSearch' tool to find the most recent financial statements. 
    *   **Data Hierarchy**: Try to find data at three levels:
        *   **Annual**: From ${startYear} to ${endYear} (${endYear - startYear + 1} years).
        *   **Quarterly**: Last 8-12 quarters.
        *   **Monthly**: *Only if available* (e.g., monthly revenue reports common in some Asian markets).
    *   **Metrics**: Revenue, Cost of Revenue, Operating Expenses, Net Income, Total Assets, Total Equity.
    *   **Units**: Identify the specific reporting unit (e.g., "Billion VND", "Million USD", "Billion JPY").

2.  **Analysis**:
    *   **Vertical Analysis**: Analyze the latest period's expenses as a percentage of revenue.
    *   **Horizontal Analysis**: Compare the growth/decline of key metrics over the retrieved periods.

3.  **Output**: Return the data in a strict JSON format matching the schema provided.

The response MUST be valid JSON.
Ensure specific numbers are found. If exact numbers are not available, estimate based on the search results but prioritize accuracy.
**CRITICAL**: You MUST classify each period as 'year', 'quarter', or 'month' in the 'type' field and provide the 'year' field (e.g., "${endYear}") for grouping.
Include a list of source URLs in the 'sources' field.

Structure the JSON as follows:
{
  "companyName": "Full Company Name",
  "ticker": "TICKER",
  "currency": "VND", 
  "reportingUnit": "Billion VND",
  "periods": [
    {
      "periodLabel": "${endYear}",
      "type": "year",
      "year": "${endYear}",
      "revenue": 1000,
      "costOfRevenue": 600,
      "grossProfit": 400,
      "operatingExpenses": 200,
      "operatingIncome": 200,
      "netIncome": 150,
      "totalAssets": 5000,
      "totalEquity": 2000
    },
    {
      "periodLabel": "Q1 ${endYear}",
      "type": "quarter",
      "year": "${endYear}",
      ...
    }
  ],
  ... analysis fields ...
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze the financial performance of ${ticker} for the period ${startYear} to ${endYear}, with annual, quarterly, and monthly breakdown if possible.`,
      config: {
        systemInstruction: ANALYSIS_PROMPT,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            ticker: { type: Type.STRING },
            currency: { type: Type.STRING },
            reportingUnit: { type: Type.STRING, description: "The unit of the numbers, e.g., 'Billion VND' or 'Million USD'" },
            periods: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  periodLabel: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["year", "quarter", "month"] },
                  year: { type: Type.STRING, description: "The year this period belongs to (e.g. '2023')" },
                  revenue: { type: Type.NUMBER },
                  costOfRevenue: { type: Type.NUMBER },
                  grossProfit: { type: Type.NUMBER },
                  operatingExpenses: { type: Type.NUMBER },
                  operatingIncome: { type: Type.NUMBER },
                  netIncome: { type: Type.NUMBER },
                  totalAssets: { type: Type.NUMBER },
                  totalEquity: { type: Type.NUMBER },
                },
                required: ["periodLabel", "type", "year", "revenue", "grossProfit", "netIncome"]
              }
            },
            verticalAnalysis: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            horizontalAnalysis: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            executiveSummary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            sources: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["companyName", "periods", "reportingUnit", "verticalAnalysis", "horizontalAnalysis", "executiveSummary"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    try {
      const data = JSON.parse(text) as FinancialReport;
      return data;
    } catch (e) {
      console.error("JSON Parse Error", e);
      throw new Error("Failed to parse financial report data.");
    }
  } catch (error) {
    console.error("Gemini API Error", error);
    throw error;
  }
};