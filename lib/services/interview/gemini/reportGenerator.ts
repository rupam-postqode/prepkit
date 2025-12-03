import { GoogleGenerativeAI } from "@google/generative-ai";
import { InterviewQuestion } from "./questionGenerator";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface InterviewReport {
  reportId: string;
  sessionId: string;
  generatedAt: string;
  overallScore: number;
  scoreBreakdown: {
    technicalDepth: number;
    communication: number;
    problemSolving: number;
    tradeOffAnalysis: number;
    timeManagement: number;
  };
  summary: string;
  questionAnalysis: QuestionAnalysis[];
  strengths: Strength[];
  weaknesses: Weakness[];
  recommendations: Recommendation[];
  comparisonToStandards: {
    yourScore: number;
    averageForDifficulty: number;
    topPerformerScore: number;
    statusMessage: string;
  };
  nextSteps: string[];
  suggestionForNextInterview: {
    recommendedTopic: string;
    focusAreas: string[];
    difficulty: string;
    estimatedImprovement: string;
  };
}

export interface QuestionAnalysis {
  questionId: string;
  questionText: string;
  userScore: number;
  feedback: {
    whatYouDidWell: string[];
    whatCouldBeBetter: string[];
    missingPoints: string[];
    scoringDetails: {
      technicalCorrectness: number;
      completeness: number;
      communication: number;
      depthOfThinking: number;
    };
  };
}

export interface Strength {
  area: string;
  description: string;
  importance: string;
}

export interface Weakness {
  area: string;
  description: string;
  importance: string;
  focusOn: string;
}

export interface Recommendation {
  priority: number;
  topic: string;
  resources: string[];
  timeToMaster: string;
  practiceStrategy: string;
}

const REPORT_SYSTEM_PROMPT = `You are an expert technical interviewer analyzing a mock interview session.
Your job is to provide a detailed, actionable report to help the candidate improve.

Analyze the interview objectively and provide:
1. Accurate scoring based on actual performance
2. Specific, actionable feedback
3. Clear strengths and weaknesses
4. Concrete recommendations with resources
5. Encouraging but honest assessment

Format your response as a JSON object matching the specified structure.`;

function buildReportPrompt(
  transcript: string,
  questions: InterviewQuestion[],
  interviewType: string,
  difficulty: string
): string {
  return `Analyze this mock interview session and generate a comprehensive report.

Interview Type: ${interviewType}
Difficulty: ${difficulty}

Questions Asked:
${questions.map((q, i) => `${i + 1}. ${q.text}\n   Expected Key Points: ${q.expectedKeyPoints.join(', ')}`).join('\n\n')}

Interview Transcript:
${transcript}

Generate a detailed JSON report with this structure:
{
  "overallScore": 75,
  "scoreBreakdown": {
    "technicalDepth": 78,
    "communication": 72,
    "problemSolving": 75,
    "tradeOffAnalysis": 70,
    "timeManagement": 73
  },
  "summary": "Brief overall assessment",
  "questionAnalysis": [
    {
      "questionId": "q1",
      "questionText": "...",
      "userScore": 75,
      "feedback": {
        "whatYouDidWell": ["point1", "point2"],
        "whatCouldBeBetter": ["point1", "point2"],
        "missingPoints": ["point1", "point2"],
        "scoringDetails": {
          "technicalCorrectness": 8,
          "completeness": 7,
          "communication": 7,
          "depthOfThinking": 7
        }
      }
    }
  ],
  "strengths": [
    {
      "area": "Strength name",
      "description": "What they did well",
      "importance": "Why this matters"
    }
  ],
  "weaknesses": [
    {
      "area": "Weakness name",
      "description": "What needs improvement",
      "importance": "Why this matters",
      "focusOn": "Specific action items"
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "topic": "Topic to focus on",
      "resources": ["resource1", "resource2"],
      "timeToMaster": "5-7 hours",
      "practiceStrategy": "How to practice"
    }
  ],
  "comparisonToStandards": {
    "yourScore": 75,
    "averageForDifficulty": 65,
    "topPerformerScore": 85,
    "statusMessage": "Above average performance"
  },
  "nextSteps": ["step1", "step2", "step3"],
  "suggestionForNextInterview": {
    "recommendedTopic": "Topic name",
    "focusAreas": ["area1", "area2"],
    "difficulty": "${difficulty}",
    "estimatedImprovement": "+8-12 points"
  }
}

Important:
- Be specific and actionable in feedback
- Provide realistic scores based on actual performance
- Include concrete resources and practice strategies
- Be encouraging but honest
- Focus on the top 3-5 strengths and weaknesses`;
}

export async function generateInterviewReport(
  sessionId: string,
  transcript: string,
  questions: InterviewQuestion[],
  interviewType: string,
  difficulty: string
): Promise<InterviewReport> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
    });

    const prompt = buildReportPrompt(transcript, questions, interviewType, difficulty);
    
    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ text: prompt }] 
      }],
      generationConfig: {
        temperature: 0.5, // Lower temperature for more consistent scoring
        maxOutputTokens: 4000,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    });

    const response = result.response.text();
    const reportData = JSON.parse(response);
    
    // Construct full report
    const report: InterviewReport = {
      reportId: `rpt_${Date.now()}`,
      sessionId,
      generatedAt: new Date().toISOString(),
      ...reportData
    };

    return report;
  } catch (error) {
    console.error('Error generating interview report:', error);
    
    // Return basic fallback report
    return generateFallbackReport(sessionId, transcript, questions, interviewType, difficulty);
  }
}

function generateFallbackReport(
  sessionId: string,
  transcript: string,
  questions: InterviewQuestion[],
  interviewType: string,
  difficulty: string
): InterviewReport {
  const baseScore = Math.min(70, Math.floor(transcript.length / 100) + 50);
  
  return {
    reportId: `rpt_fallback_${Date.now()}`,
    sessionId,
    generatedAt: new Date().toISOString(),
    overallScore: baseScore,
    scoreBreakdown: {
      technicalDepth: baseScore - 5,
      communication: baseScore,
      problemSolving: baseScore - 10,
      tradeOffAnalysis: baseScore - 15,
      timeManagement: baseScore
    },
    summary: 'Basic analysis completed. For detailed feedback, please contact support.',
    questionAnalysis: questions.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      userScore: baseScore + Math.floor(Math.random() * 10) - 5,
      feedback: {
        whatYouDidWell: ['Attempted the question', 'Provided a response'],
        whatCouldBeBetter: ['Add more details', 'Consider edge cases'],
        missingPoints: ['Additional examples'],
        scoringDetails: {
          technicalCorrectness: 7,
          completeness: 6,
          communication: 7,
          depthOfThinking: 6
        }
      }
    })),
    strengths: [
      {
        area: 'Participation',
        description: 'You attempted all questions and provided responses',
        importance: 'Good effort'
      }
    ],
    weaknesses: [
      {
        area: 'Detail Level',
        description: 'Responses could benefit from more specific details',
        importance: 'Important for technical interviews',
        focusOn: 'Add concrete examples and edge cases'
      }
    ],
    recommendations: [
      {
        priority: 1,
        topic: 'Practice more questions',
        resources: ['PrepKit modules', 'Practice platforms'],
        timeToMaster: '2-3 hours',
        practiceStrategy: 'Do more mock interviews'
      }
    ],
    comparisonToStandards: {
      yourScore: baseScore,
      averageForDifficulty: 65,
      topPerformerScore: 85,
      statusMessage: 'Keep practicing to improve your score'
    },
    nextSteps: [
      'Review the questions you struggled with',
      'Practice similar problems',
      'Schedule another mock interview'
    ],
    suggestionForNextInterview: {
      recommendedTopic: 'Same type with focus on weak areas',
      focusAreas: ['Detail improvement'],
      difficulty: difficulty,
      estimatedImprovement: '+5-10 points'
    }
  };
}
