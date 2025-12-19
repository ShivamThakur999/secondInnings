
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FirstInningsForm, SecondInningsForm, Opportunity } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY not found");
}


const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Context: You are the backend engine for "Second Innings," a platform helping Indian athletes navigate their "First Innings" (aspiring) and "Second Innings" (career transition/lost hope).
Task: When a user asks for a roadmap or a career pivot, you must provide highly localized Indian data.
Tone: Professional, realistic, encouraging, and authoritative on Indian sports structures.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    current_status_analysis: { type: Type.STRING },
    roadmap_steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          duration: { type: Type.STRING },
          actions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    },
    pivot_options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          description: { type: Type.STRING },
          pathway: { type: Type.STRING }
        }
      }
    },
    key_institutions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    financial_aid_tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["title", "current_status_analysis", "roadmap_steps", "key_institutions", "financial_aid_tips"]
};

export const generateFirstInningsRoadmap = async (data: FirstInningsForm): Promise<string> => {
  const prompt = `
    Create a detailed development roadmap for a ${data.age}-year-old ${data.level} ${data.sport} player in India.
    Their main goal is: "${data.goal}".
    
    Requirements:
    - Breakdown the path into: Grassroots (School/Club) -> District -> State (Ranji/Santosh Trophy/National Games) -> National/Pro Leagues (IPL, ISL, PKL).
    - Mention specific Indian bodies: SAI (Sports Authority of India), Khelo India, and State Federations.
    - Include a "Scholarships" section in financial_aid_tips mentioning specific Indian grants (e.g., Reliance Foundation, Tata Football Academy, or Govt. Sports Quota).
    - Provide specific drills and benchmarks in the roadmap_steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return JSON.stringify({
      title: "Error",
      current_status_analysis: "Failed to generate roadmap. Please ensure your API Key is valid and try again.",
      roadmap_steps: [],
      key_institutions: [],
      financial_aid_tips: []
    });
  }
};

export const generateSecondInningsRoadmap = async (data: SecondInningsForm): Promise<string> => {
  const prompt = `
    A retired/pivoting athlete in India needs a "Second Innings" career plan.
    Profile:
    - Sport: ${data.sport} (Played ${data.yearsPlayed} years)
    - Identity Score (1-10, 10 is pure athlete): ${data.identityScore}
    - Physical Capacity: ${data.physicalCapacity}
    - Locker Room Role: ${data.role}
    - Financial Urgency: ${data.financialUrgency}
    - Constraints: ${data.constraints.join(", ")}

    Based on these specific constraints and skills, suggest 3 highly realistic Indian career paths.
    
    Requirements:
    - Populate 'pivot_options' with the 3 career paths.
    - For each pivot option, include the EXACT certification needed (e.g., NIS Patiala for coaching, BCCI Level 1 for umpiring, IISM Mumbai for management).
    - If suggesting Govt Jobs: Explain the "Sports Quota" for Railways, Banks (SBI/PNB), and Police forces.
    - If suggesting Tech: Mention Video Analysis or Sports Data Analytics.
    - In 'current_status_analysis', specifically address their Identity Score and Constraints with empathy and logic.
    - Use 'roadmap_steps' to outline the immediate next 6 months of transition (Networking, Upskilling, Application).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });
    return response.text || "{}";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return JSON.stringify({
      title: "Error",
      current_status_analysis: "Failed to generate pivot plan. Please ensure your API Key is valid and try again.",
      roadmap_steps: [],
      key_institutions: [],
      financial_aid_tips: []
    });
  }
};

export const analyzeEligibility = async (profileText: string, schemeName: string): Promise<string> => {
    const prompt = `
      User Profile: "${profileText}"
      Scheme: "${schemeName}"
      
      Act as a Govt of India Sports Ministry eligibility officer.
      Analyze if the user qualifies for this scheme.
      If yes, state "QUALIFIED" and explain why.
      If no, state "NOT QUALIFIED" and list the missing criteria (e.g., missing National Medal, Age limit exceeded).
      Keep it brief (max 50 words).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        return response.text || "Analysis unavailable.";
    } catch (e) {
        return "Could not connect to analysis engine.";
    }
};

export const translateAthleticSkills = async (sport: string, role: string): Promise<string> => {
    const prompt = `
      I am a ${sport} player who played as a "${role}".
      Translate my on-field "game sense" and soft skills into specific Corporate or Tech skills.
      
      Output format JSON:
      {
        "core_transferable_skill": "string (e.g. Risk Assessment)",
        "corporate_translation": "string (explanation)",
        "suggested_roles": ["role1", "role2"]
      }
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { 
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json"
            }
        });
        return response.text || "{}";
    } catch (e) {
        return JSON.stringify({ core_transferable_skill: "Error", corporate_translation: "Failed to translate.", suggested_roles: [] });
    }
}

export const generateMentalSupport = async (answers: any): Promise<string> => {
    const prompt = `
      User is a retired athlete struggling with transition (Second Innings).
      
      Assessment Answers:
      1. Time since retirement: ${answers.timeSince}
      2. Missing most: ${answers.misses}
      3. Clarity of purpose (1-10): ${answers.purpose}
      4. Current Mood: ${answers.mood}
      
      Task: Provide a compassionate, non-clinical supportive message.
      - Validate their feeling of "Athlete Grief" (loss of identity).
      - Explain why this feeling is biologically/psychologically normal for athletes.
      - Suggest 3 small, non-sport "Grounding Habits" for tomorrow.
      
      Tone: Warm, empathetic, brotherly/sisterly. NOT robotic.
      Format: Markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { 
                systemInstruction: "You are a mental performance coach and compassionate mentor for Indian athletes.",
            }
        });
        return response.text || "Support system unavailable currently.";
    } catch (e) {
        return "We are having trouble connecting to the support engine. Please try again.";
    }
}
