import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface InterviewSetup {
  type: string;
  difficulty: string;
  focusAreas: string[];
  specificRequirements?: string;
  duration: number;
  language?: string;
  voice?: string;
  pace?: string;
  followUpStyle?: string;
}

export interface InterviewQuestion {
  id: string;
  order: number;
  text: string;
  motivation: string;
  expectedKeyPoints: string[];
  difficulty: number;
  timeAllocation: number;
  followUps: string[];
}

const SYSTEM_PROMPT = `You are an expert technical interviewer at top companies like Google, Meta, and Amazon.
Your role is to conduct realistic mock interviews and generate highly relevant, challenging questions 
based on the candidate's level and focus areas.

Generate questions that:
1. Are realistic and similar to actual interview questions
2. Cover the specified focus areas thoroughly
3. Match the difficulty level appropriately
4. Build progressively in complexity
5. Test both breadth and depth of knowledge

Format your response as a JSON array of question objects.`;

function buildQuestionPrompt(setup: InterviewSetup): string {
  const questionCount = setup.difficulty === 'easy' ? 5 : setup.difficulty === 'medium' ? 6 : 7;
  
  return `Generate ${questionCount} interview questions for:

Type: ${setup.type}
Difficulty: ${setup.difficulty}
Focus Areas: ${setup.focusAreas.join(', ')}
${setup.specificRequirements ? `Specific Requirements: ${setup.specificRequirements}` : ''}
Duration: ${setup.duration} minutes

Return a JSON array with this exact structure:
[
  {
    "id": "q1",
    "order": 1,
    "text": "Question text here",
    "motivation": "Why this question is important",
    "expectedKeyPoints": ["point1", "point2", "point3"],
    "difficulty": 6,
    "timeAllocation": 5,
    "followUps": ["Follow-up question 1?", "Follow-up question 2?"]
  }
]

Make sure questions are:
- Progressively challenging
- Realistic for ${setup.difficulty} level
- Relevant to ${setup.type} interviews
- Time-appropriate for ${setup.duration} minute session`;
}

export async function generateInterviewQuestions(
  interviewSetup: InterviewSetup
): Promise<InterviewQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
    });

    const prompt = buildQuestionPrompt(interviewSetup);
    
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: prompt }] 
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
        topK: 40,
        topP: 0.95,
        responseMimeType: "application/json",
      },
    });

    const response = result.response.text();
    const questions = JSON.parse(response);
    
    // Validate and return questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format from Gemini');
    }

    return questions;
  } catch (error) {
    console.error('Error generating interview questions:', error);
    
    // Return fallback questions if Gemini fails
    return getFallbackQuestions(interviewSetup);
  }
}

function getFallbackQuestions(setup: InterviewSetup): InterviewQuestion[] {
  // Fallback questions based on type
  const fallbackQuestions: Record<string, InterviewQuestion[]> = {
    'javascript': [
      {
        id: 'js_fb_1',
        order: 1,
        text: 'Explain the event loop in JavaScript and how it handles asynchronous operations.',
        motivation: 'Tests fundamental understanding of JavaScript runtime',
        expectedKeyPoints: ['Call stack', 'Event queue', 'Microtasks', 'Macrotasks', 'Non-blocking'],
        difficulty: 5,
        timeAllocation: 5,
        followUps: ['What is the difference between setTimeout and Promise?', 'How does async/await work internally?']
      },
      {
        id: 'js_fb_2',
        order: 2,
        text: 'What are closures in JavaScript and when would you use them?',
        motivation: 'Tests understanding of scope and practical application',
        expectedKeyPoints: ['Lexical scope', 'Function scope', 'Data privacy', 'Practical examples'],
        difficulty: 4,
        timeAllocation: 4,
        followUps: ['Can you show a practical use case?', 'What are potential memory issues?']
      }
    ],
    'system-design': [
      {
        id: 'sd_fb_1',
        order: 1,
        text: 'Design a URL shortener service like bit.ly that can handle 1 billion requests per day.',
        motivation: 'Tests scalability and system design fundamentals',
        expectedKeyPoints: ['Capacity estimation', 'Database choice', 'Hashing algorithm', 'Caching', 'Load balancing'],
        difficulty: 6,
        timeAllocation: 8,
        followUps: ['How would you handle collisions?', 'What database would you choose and why?', 'How would you implement analytics?']
      }
    ],
    'dsa': [
      {
        id: 'dsa_fb_1',
        order: 1,
        text: 'Given an array of integers, find two numbers that add up to a specific target.',
        motivation: 'Tests basic problem-solving and optimization',
        expectedKeyPoints: ['Hash map approach', 'Time complexity O(n)', 'Space complexity', 'Edge cases'],
        difficulty: 3,
        timeAllocation: 5,
        followUps: ['What if the array is sorted?', 'Can you do it with O(1) space?']
      }
    ]
  };

  const typeQuestions = fallbackQuestions[setup.type] || fallbackQuestions['javascript'];
  return typeQuestions.slice(0, setup.difficulty === 'easy' ? 3 : 5);
}
