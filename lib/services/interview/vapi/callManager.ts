import { InterviewQuestion } from "../gemini/questionGenerator";

export interface VapiCallConfig {
  assistant: {
    name: string;
    model: string;
    firstMessage: string;
    systemPrompt: string;
    voice: {
      provider: string;
      voiceId: string;
      speed?: number;
    };
  };
  metadata: {
    sessionId: string;
    interviewType: string;
    userId: string;
  };
}

export interface VapiCallResponse {
  id: string;
  status: string;
  createdAt: string;
}

function buildVapiSystemPrompt(questions: InterviewQuestion[]): string {
  const questionsList = questions
    .map((q, i) => `${i + 1}. ${q.text}\n   Key points to cover: ${q.expectedKeyPoints.join(', ')}`)
    .join('\n\n');
  
  return `You are an experienced technical interviewer conducting a mock interview.

Interview Questions (ask in order):
${questionsList}

Guidelines:
- Ask questions clearly and at an appropriate pace
- Listen carefully to user responses
- If response is incomplete, ask targeted follow-up questions from the list provided
- Move to next question when current one is adequately answered
- Be encouraging and professional
- Maintain a conversational tone
- At the end, provide brief encouragement and thank them for their time

Remember:
- This is a mock interview to help them practice
- Be supportive but realistic in your evaluation
- Guide them if they're stuck, but don't give away answers
- Keep track of time - approximately ${Math.floor(questions.reduce((acc, q) => acc + q.timeAllocation, 0))} minutes total`;
}

export async function initializeVapiCall(
  sessionId: string,
  questions: InterviewQuestion[],
  userId: string,
  interviewType: string
): Promise<VapiCallResponse> {
  const systemPrompt = buildVapiSystemPrompt(questions);
  
  const callConfig: VapiCallConfig = {
    assistant: {
      name: "PrepKit Technical Interviewer",
      model: "gpt-4o-mini",
      firstMessage: "Hello! I'm your AI technical interviewer for today's mock interview. Are you ready to begin? Just say 'yes' when you're ready, and I'll ask the first question.",
      systemPrompt,
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM", // Professional neutral voice
        speed: 1.0
      }
    },
    metadata: {
      sessionId,
      interviewType,
      userId
    }
  };

  try {
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...callConfig,
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
        customer: {
          number: '+15555555555', // This would be the user's number in production
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      status: data.status || 'initiated',
      createdAt: data.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error initializing Vapi call:', error);
    throw new Error('Failed to initialize voice interview');
  }
}

export async function getCallDetails(callId: string): Promise<any> {
  try {
    const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting call details:', error);
    throw error;
  }
}

export async function getCallTranscript(callId: string): Promise<string> {
  try {
    const callDetails = await getCallDetails(callId);
    
    // Extract transcript from call details
    if (callDetails.transcript) {
      return callDetails.transcript;
    }
    
    // If no transcript available, construct from messages
    if (callDetails.messages && Array.isArray(callDetails.messages)) {
      return callDetails.messages
        .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
        .join('\n\n');
    }
    
    return '';
  } catch (error) {
    console.error('Error getting call transcript:', error);
    return '';
  }
}

export function parseTranscriptSegments(transcript: string): any[] {
  const lines = transcript.split('\n');
  const segments = [];
  let currentSegment: any = { question: '', answer: '' };
  
  for (const line of lines) {
    if (line.includes('ASSISTANT:') || line.includes('INTERVIEWER:')) {
      if (currentSegment.answer) {
        segments.push(currentSegment);
      }
      currentSegment = { 
        question: line.replace(/^(ASSISTANT:|INTERVIEWER:)/, '').trim(), 
        answer: '' 
      };
    } else if (line.includes('USER:') || line.includes('CANDIDATE:')) {
      currentSegment.answer = line.replace(/^(USER:|CANDIDATE:)/, '').trim();
    }
  }
  
  if (currentSegment.answer) {
    segments.push(currentSegment);
  }
  
  return segments;
}

export async function endCall(callId: string): Promise<void> {
  try {
    await fetch(`https://api.vapi.ai/call/${callId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      }
    });
  } catch (error) {
    console.error('Error ending call:', error);
  }
}
