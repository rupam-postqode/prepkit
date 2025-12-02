# PrepKit Mock Interview Feature
## Comprehensive Feature Requirement Document (FRD)

**Document Version:** 1.0  
**Last Updated:** December 3, 2025  
**Status:** Ready for Development  
**Priority:** High (P0)  

---

## EXECUTIVE SUMMARY

The **Mock Interview Feature** enables users to conduct realistic technical interview practice sessions using AI-powered voice interviews. The system integrates **Vapi AI** for voice conversation with **Google Gemini API** for intelligent question generation and performance analysis, providing users with comprehensive interview reports and actionable feedback.

**Key Value Propositions:**
- Real-time voice-based technical interviews
- Personalized question generation based on user requirements
- Comprehensive interview analysis & detailed performance reports
- Pay-per-interview pricing model
- Full database sync & historical tracking

---

## SECTION 1: SYSTEM OVERVIEW

### 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PrepKit Frontend (Web)                    │
│  - Interview Setup  - Vapi Voice Widget  - Results Display   │
└────────────┬────────────────────────────────────────┬────────┘
             │                                        │
    ┌────────▼────────┐                      ┌────────▼────────┐
    │  PrepKit Backend │                      │  Database Layer │
    │   (Next.js API)  │                      │   (PostgreSQL)  │
    │  - Orchestrator  │                      │   - Interviews  │
    │  - Sync Manager  │                      │   - Questions   │
    │  - Pricing Calc  │                      │   - Results     │
    └────────┬────────┘                      └────────┬────────┘
             │                                        │
    ┌────────▼────────────────┐           ┌──────────┘
    │    Third-Party APIs      │           │
    │                          │           │
    ├──────────────────────────┤           │
    │ Vapi AI                  │◄──────────┘
    │ - Create Call            │
    │ - Voice Session          │
    │ - Call Metadata          │
    │ - Recording/Transcript   │
    ├──────────────────────────┤
    │ Google Gemini API        │
    │ - Question Generation    │
    │ - Conversation Analysis  │
    │ - Report Generation      │
    └──────────────────────────┘
```

### 1.2 User Journey

```
┌──────────────┐
│  User Login  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Mock Interview Setup Page   │
│  - Select Interview Type     │
│  - Choose Focus Area         │
│  - Set Difficulty Level      │
│  - Additional Requirements   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Question Generation (Gemini) │
│ Prepares 5-7 questions       │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Interview Session (Vapi AI) │
│  - AI Interviewer asks Q1    │
│  - User responds (voice)     │
│  - AI listens & responds     │
│  - Questions 2-7 continue    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Call Transcription (Vapi)    │
│ - Extract full transcript    │
│ - Get call recording data    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Report Generation (Gemini)  │
│  - Analyze performance       │
│  - Generate detailed report  │
│  - Provide recommendations   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Store & Display Results     │
│  - Save to database          │
│  - Show report to user       │
│  - Charge user (pay-per-use) │
└──────────────────────────────┘
```

---

## SECTION 2: FEATURE REQUIREMENTS

### 2.1 Interview Setup & Configuration

#### 2.1.1 Interview Type Selection

**User selects interview category:**

```
Options:
- JavaScript/Frontend ────────► 22 lessons (from Module 1)
- Machine Coding Patterns ──► 42 patterns (from Module 2)
- Data Structures & Algorithms ► 130 problems (from Module 3)
- System Design & Architecture ► 15 lessons (from Module 4)
- Behavioral & HR Round ────► 12 lessons (from Module 5)

User Selects: [System Design & Architecture]
```

#### 2.1.2 Difficulty Level Selection

```
┌─────────────────────────────────────┐
│    Select Difficulty Level          │
├─────────────────────────────────────┤
│ ☐ Easy (Beginner)                  │
│   - Basic concepts                 │
│   - 5-10 min interview             │
│   - Guided questions               │
│                                    │
│ ☐ Medium (Intermediate)  [DEFAULT] │
│   - Real-world scenarios           │
│   - 15-20 min interview            │
│   - Follow-up questions            │
│                                    │
│ ☐ Hard (Advanced)                  │
│   - Complex scenarios              │
│   - 20-30 min interview            │
│   - Deep technical questions       │
│                                    │
│ ☐ Expert (L4+)                     │
│   - Real FAANG questions           │
│   - 30-45 min interview            │
│   - Extensive follow-ups           │
└─────────────────────────────────────┘
```

#### 2.1.3 Interview Configuration Form

```json
{
  "interviewSetup": {
    "type": "system-design",
    "difficulty": "medium",
    "duration": 20,
    "focusAreas": [
      "scalability",
      "database-design",
      "caching"
    ],
    "specificRequirements": "Design for 1B users, focus on CAP theorem",
    "language": "en",
    "voice": "neutral",
    "pace": "moderate",
    "followUpStyle": "deep-dive"
  }
}
```

#### 2.1.4 Additional Requirements (Open-ended)

Users can specify:
- Specific topics to focus on
- Companies they're interviewing for
- Particular systems to design
- Pain areas from previous interviews
- Time constraints

**Example:**
```
"I'm interviewing for Google for L4 Backend role.
Focus on distributed systems, microservices, and 
database scaling. I'm weak on cache invalidation.
Please give challenging follow-up questions."
```

---

### 2.2 Question Generation Pipeline (Gemini)

#### 2.2.1 Gemini Prompt Engineering

**System Prompt:**
```
You are an expert technical interviewer at Google/Meta/Amazon.
Your role is to conduct realistic mock interviews and generate
highly relevant, challenging questions based on the user's level
and focus areas.

Context:
- User Level: {{difficulty}}
- Interview Type: {{type}}
- Focus Areas: {{focusAreas}}
- Specific Requirements: {{requirements}}
- Time Available: {{duration}} minutes

Generate exactly {{questionCount}} questions (typically 5-7 for a 20-min interview).

For each question, provide:
1. Question text (clear and realistic)
2. Why this question (motivation)
3. Expected key points (what answer should cover)
4. Difficulty rating (1-10)
5. Time allocation (in minutes)
6. Follow-up questions (2-3 if answer is incomplete)

Format: JSON
```

**Gemini Request:**
```json
{
  "model": "gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": "Generate interview questions for: {{setupData}}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 3000,
  "top_k": 40,
  "top_p": 0.95
}
```

#### 2.2.2 Example Generated Questions (System Design)

```json
{
  "questions": [
    {
      "id": "q1",
      "order": 1,
      "text": "Design a scalable URL shortener that handles 1 billion requests per day with 99.99% availability.",
      "motivation": "Tests understanding of scalability, database design, caching, and trade-offs",
      "expectedKeyPoints": [
        "Capacity estimation",
        "Database choice justification",
        "Caching strategy",
        "Load balancing approach",
        "Replication/sharding strategy"
      ],
      "difficulty": 6,
      "timeAllocation": 5,
      "followUps": [
        "How would you handle the hot key problem?",
        "What if the shortening service goes down?",
        "How do you route requests geographically?"
      ]
    },
    {
      "id": "q2",
      "order": 2,
      "text": "Your system is experiencing 95% cache hit rate but still has 200ms latency. Debug this.",
      "motivation": "Tests debugging skills and understanding of bottlenecks beyond cache",
      "expectedKeyPoints": [
        "Identifying non-cached operations",
        "Network latency analysis",
        "Database query optimization",
        "Serialization overhead"
      ],
      "difficulty": 7,
      "timeAllocation": 4,
      "followUps": [
        "How do you measure each component's latency?",
        "What monitoring would you set up?"
      ]
    }
    // ... more questions
  ],
  "totalQuestions": 5,
  "estimatedDuration": 22,
  "generated_at": "2025-12-03T09:30:00Z"
}
```

---

### 2.3 Vapi Voice Integration

#### 2.3.1 Vapi Call Creation

**Process:**
1. Questions generated by Gemini
2. Convert questions to natural speech prompt
3. Create Vapi call with AI interviewer persona
4. Stream user voice input
5. Process with Gemini for follow-ups
6. Continue until interview ends

#### 2.3.2 Vapi Configuration

```json
{
  "vapiCallConfig": {
    "assistant": {
      "name": "Technical Interviewer AI",
      "model": "gpt-4",
      "firstMessage": "Hello! I'm your technical interviewer today. We'll be discussing system design. Let's start with the first question.",
      "systemPrompt": "You are an expert technical interviewer conducting a mock system design interview. Ask the prepared questions in order. Listen carefully to responses, ask follow-ups when needed, guide the conversation to cover all key points. Be professional but approachable.",
      "voice": {
        "provider": "eleven-labs",
        "voiceId": "professional-neutral",
        "speed": 1.0
      },
      "interruptionThreshold": 0.5,
      "numFastFallback": 10
    },
    "phoneNumber": "{{USER_VAPI_PHONE_NUMBER}}",
    "customer": {
      "userId": "{{USER_ID}}",
      "name": "{{USER_NAME}}"
    },
    "messages": [
      {
        "role": "user",
        "content": "Start the interview with: Design a scalable URL shortener..."
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "getFollowUpQuestion",
          "description": "Get follow-up question based on user response",
          "parameters": {
            "userResponse": "string",
            "currentQuestionId": "string"
          }
        }
      },
      {
        "type": "function",
        "function": {
          "name": "moveToNextQuestion",
          "description": "Move to next question after current is answered",
          "parameters": {
            "currentQuestionId": "string"
          }
        }
      }
    ]
  }
}
```

#### 2.3.3 Vapi Call Webhooks & Events

**Vapi sends webhooks for:**
- `call.started` - Interview session begins
- `call.ended` - Interview session completes
- `call.recording` - Recording ready
- `call.transcript` - Full transcript ready
- `call.failed` - Call failed (handle gracefully)

**Webhook Handler:**
```javascript
// pages/api/webhooks/vapi.js

export default async function handler(req, res) {
  const event = req.body;
  
  switch(event.type) {
    case 'call.started':
      // Log interview start
      await db.interviewSession.update({
        where: { sessionId: event.callId },
        data: { status: 'IN_PROGRESS', startedAt: new Date() }
      });
      break;
      
    case 'call.ended':
      // Finalize session, trigger report generation
      await db.interviewSession.update({
        where: { sessionId: event.callId },
        data: { 
          status: 'COMPLETED',
          endedAt: new Date(),
          duration: event.duration
        }
      });
      await generateInterviewReport(event.callId);
      break;
      
    case 'call.transcript':
      // Store transcript
      await db.interviewTranscript.create({
        data: {
          sessionId: event.callId,
          transcript: event.transcript,
          confidence: event.confidence
        }
      });
      break;
  }
  
  res.status(200).json({ received: true });
}
```

---

### 2.4 Interview Session Management

#### 2.4.1 Session Initialization

**Flow:**
```
1. User submits interview configuration
2. Backend creates InterviewSession record
3. Backend generates questions via Gemini
4. Backend creates Vapi assistant with system prompt
5. Backend initiates Vapi call
6. Frontend shows voice widget
7. User can start speaking immediately
```

#### 2.4.2 Real-time Session Tracking

**Database Schema:**
```sql
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL REFERENCES users(id),
  sessionId VARCHAR(255) UNIQUE, -- Vapi call ID
  type VARCHAR(50), -- 'javascript', 'system-design', etc
  difficulty VARCHAR(20), -- 'easy', 'medium', 'hard', 'expert'
  status VARCHAR(50), -- 'setup', 'in_progress', 'completed', 'failed'
  
  -- Timing
  createdAt TIMESTAMP,
  startedAt TIMESTAMP,
  endedAt TIMESTAMP,
  duration INT, -- in seconds
  
  -- Configuration
  configuration JSONB, -- Questions, focus areas, requirements
  questionsGenerated JSONB, -- All generated questions
  
  -- Vapi Data
  vapiCallId VARCHAR(255),
  vapiRecordingUrl VARCHAR(500),
  vapiTranscript TEXT,
  
  -- Results
  reportGenerated BOOLEAN DEFAULT false,
  reportData JSONB, -- Full report from Gemini
  
  -- Pricing
  costCalculated DECIMAL(8, 2),
  paymentStatus VARCHAR(50), -- 'pending', 'completed', 'failed'
  
  -- Metadata
  metadata JSONB
);

CREATE TABLE interview_questions (
  id UUID PRIMARY KEY,
  sessionId UUID NOT NULL REFERENCES interview_sessions(id),
  questionOrder INT,
  questionText TEXT,
  difficulty INT,
  expectedKeyPoints TEXT[],
  userResponse TEXT, -- Full answer from transcript
  responseScore INT, -- 0-100
  timeSpentSeconds INT,
  followUpAsked BOOLEAN,
  metadata JSONB
);

CREATE TABLE interview_transcripts (
  id UUID PRIMARY KEY,
  sessionId UUID NOT NULL REFERENCES interview_sessions(id),
  rawTranscript TEXT, -- Full conversation
  transcriptSegments JSONB, -- Segmented by Q&A
  confidenceScore FLOAT,
  createdAt TIMESTAMP
);

CREATE TABLE interview_reports (
  id UUID PRIMARY KEY,
  sessionId UUID NOT NULL REFERENCES interview_sessions(id),
  overallScore INT, -- 0-100
  scoringBreakdown JSONB, -- Per question scores
  strengthsIdentified TEXT[],
  weaknessesIdentified TEXT[],
  recommendations TEXT[],
  detailedAnalysis TEXT,
  generatedAt TIMESTAMP
);
```

---

### 2.5 Report Generation Pipeline (Gemini)

#### 2.5.1 Report Generation Prompt

**System Prompt for Analysis:**
```
You are an expert technical interviewer analyzing a mock interview session.
Your job is to provide a detailed, actionable report to the candidate.

Interview Data:
- Type: {{interviewType}}
- Difficulty: {{difficulty}}
- Questions: {{questions}}
- User Responses: {{transcript}}

Analyze and generate a comprehensive report including:

1. **Overall Performance**: 0-100 score
2. **Question-by-Question Analysis**: 
   - Score for each response (0-100)
   - What they did well
   - What could be better
   - Key missing points

3. **Strengths Identified** (top 3-5):
   - What they excelled at
   - Why these are important

4. **Weaknesses Identified** (top 3-5):
   - Areas that need improvement
   - Why these matter for interviews

5. **Specific Feedback Per Question**:
   - Clarity of thinking
   - Completeness of answer
   - Communication quality
   - Depth of knowledge

6. **Actionable Recommendations**:
   - Top 3 areas to focus on
   - Specific resources/topics
   - Practice strategies
   - Common pitfalls to avoid

7. **Comparison to Standards**:
   - How this compares to typical performance at this level
   - Expected baseline for this company/role

Format: Professional report in JSON, suitable for display to user.
```

#### 2.5.2 Report Structure

```json
{
  "reportId": "rpt_abc123",
  "sessionId": "sess_xyz789",
  "generatedAt": "2025-12-03T10:45:00Z",
  
  "overallScore": 72,
  "scoreBreakdown": {
    "technicalDepth": 78,
    "communication": 68,
    "problemSolving": 75,
    "tradeOffAnalysis": 65,
    "timManagement": 72
  },
  
  "summary": "Good foundational understanding with room for improvement in trade-off analysis and communication clarity.",
  
  "questionAnalysis": [
    {
      "questionId": "q1",
      "questionText": "Design a scalable URL shortener...",
      "userScore": 75,
      "feedback": {
        "whatYouDidWell": [
          "Good capacity estimation calculations",
          "Considered both SQL and NoSQL databases",
          "Mentioned caching strategy"
        ],
        "whatCouldBeBetter": [
          "Didn't discuss replication strategy",
          "Limited explanation of sharding approach",
          "Missed geographic distribution discussion"
        ],
        "missingPoints": [
          "High availability/failover design",
          "Monitoring and alerting strategy",
          "Security considerations"
        ],
        "scoringDetails": {
          "technicalCorrectness": 8,
          "completeness": 7,
          "communication": 7,
          "depthOfThinking": 7
        }
      }
    },
    // ... more questions
  ],
  
  "strengths": [
    {
      "area": "Systematic Approach",
      "description": "You started with capacity estimation before diving into design. This is the right approach.",
      "importance": "High - Interviewers value structured thinking"
    },
    {
      "area": "Database Knowledge",
      "description": "You demonstrated good understanding of SQL vs NoSQL trade-offs",
      "importance": "High - Critical for system design roles"
    },
    {
      "area": "Communication",
      "description": "Your explanations were generally clear and easy to follow",
      "importance": "Medium - Important for distributed teams"
    }
  ],
  
  "weaknesses": [
    {
      "area": "Trade-off Discussion",
      "description": "You didn't deeply explore consistency vs availability trade-offs (CAP theorem)",
      "importance": "High - Essential for senior-level interviews",
      "focusOn": "Study CAP theorem, understand why different systems make different choices"
    },
    {
      "area": "Failure Scenarios",
      "description": "Limited discussion of what happens when components fail",
      "importance": "High - Real systems must handle failures",
      "focusOn": "Learn about circuit breakers, retries, timeouts, graceful degradation"
    },
    {
      "area": "Monitoring Strategy",
      "description": "Didn't mention how to monitor the system in production",
      "importance": "Medium - Increasingly important for observability",
      "focusOn": "Study metrics, logging, tracing, and alerting"
    }
  ],
  
  "recommendations": [
    {
      "priority": 1,
      "topic": "CAP Theorem & Trade-offs",
      "resources": [
        "Module4, Lesson 4.5: Distributed Systems Concepts",
        "Practice: Design 3 systems focusing on different CAP choices"
      ],
      "timeToMaster": "5-7 hours",
      "practiceStrategy": "Do 3 more mock interviews with explicit focus on trade-off discussion"
    },
    {
      "priority": 2,
      "topic": "Failure Handling & Resilience",
      "resources": [
        "Module4, Lesson 4.3: Reliability Patterns",
        "Read: Site Reliability Engineering (SRE) principles"
      ],
      "timeToMaster": "8-10 hours",
      "practiceStrategy": "In next interview, start with 'What if this component fails?'"
    },
    {
      "priority": 3,
      "topic": "Communication & Conciseness",
      "resources": [
        "Practice explaining designs in 2-minute summaries",
        "Do behavioral round training"
      ],
      "timeToMaster": "3-5 hours",
      "practiceStrategy": "Record your mock interviews and review for clarity"
    }
  ],
  
  "comparisonToStandards": {
    "yourScore": 72,
    "averageForDifficulty": 65,
    "topPerformerScore": 85,
    "statusMessage": "You're performing above average for this difficulty level. With focused practice on weaknesses, you could reach 85+."
  },
  
  "nextSteps": [
    "Focus on Module4, Lessons 4.5-4.8 (Trade-offs, Failure Handling, Monitoring)",
    "Do 2 more mock interviews this week, one focused on failure scenarios",
    "Review your communication - be more concise, get interviewer feedback faster",
    "Practice explaining your reasoning out loud"
  ],
  
  "suggestionForNextInterview": {
    "recommendedTopic": "Messaging System (WhatsApp/Slack design)",
    "focusAreas": ["Failure handling", "Trade-off discussion"],
    "difficulty": "medium",
    "estimatedImprovement": "+8-12 points if you focus on recommendations"
  }
}
```

---

## SECTION 3: TECHNICAL IMPLEMENTATION

### 3.1 API Endpoints

#### 3.1.1 Interview Setup Endpoints

```javascript
// POST /api/interviews/setup
// Initialize interview session
Request: {
  type: string, // 'javascript', 'system-design', etc
  difficulty: string, // 'easy', 'medium', 'hard', 'expert'
  focusAreas: string[],
  specificRequirements: string,
  duration: number // minutes
}

Response: {
  sessionId: string,
  questions: object[], // Generated questions
  vapiCallUrl: string, // Ready to call
  estimatedDuration: number,
  estimatedCost: number
}

// GET /api/interviews/:sessionId
// Get interview session details

Response: {
  sessionId: string,
  status: string,
  configuration: object,
  questions: object[],
  transcript?: string,
  report?: object,
  createdAt: timestamp,
  duration: number
}

// POST /api/interviews/:sessionId/start
// Start Vapi call

Response: {
  callId: string,
  status: 'initiated',
  timestamp: timestamp
}

// POST /api/interviews/:sessionId/complete
// Complete interview, trigger report generation

Response: {
  reportGenerating: true,
  estimatedTime: '30 seconds'
}
```

#### 3.1.2 Report & History Endpoints

```javascript
// GET /api/interviews/:sessionId/report
// Get interview report

Response: {
  reportId: string,
  overallScore: number,
  scoreBreakdown: object,
  analysis: object,
  recommendations: object[],
  generatedAt: timestamp
}

// GET /api/interviews/history?page=1&limit=10
// Get user's interview history

Response: {
  interviews: [
    {
      sessionId: string,
      type: string,
      difficulty: string,
      score: number,
      date: timestamp,
      duration: number,
      status: string
    }
  ],
  total: number,
  page: number
}

// DELETE /api/interviews/:sessionId
// Delete interview session (soft delete)

Response: {
  deleted: true
}
```

---

### 3.2 Gemini Integration

#### 3.2.1 Question Generation Service

```javascript
// services/gemini/questionGenerator.ts

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateInterviewQuestions(
  interviewSetup: InterviewSetup
): Promise<InterviewQuestion[]> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-pro",
    systemInstruction: SYSTEM_PROMPT
  });

  const prompt = buildQuestionPrompt(interviewSetup);
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 3000,
      topK: 40,
      topP: 0.95
    }
  });

  const response = result.response.text();
  const questions = parseQuestionsFromResponse(response);
  
  return questions;
}

function buildQuestionPrompt(setup: InterviewSetup): string {
  return `
    Generate ${setup.difficulty === 'easy' ? 5 : 7} interview questions for:
    
    Type: ${setup.type}
    Difficulty: ${setup.difficulty}
    Focus Areas: ${setup.focusAreas.join(', ')}
    Specific Requirements: ${setup.specificRequirements}
    
    Return as JSON with: id, text, motivation, expectedKeyPoints, difficulty, timeAllocation, followUps
  `;
}
```

#### 3.2.2 Report Generation Service

```javascript
// services/gemini/reportGenerator.ts

export async function generateInterviewReport(
  sessionId: string,
  transcript: string,
  questions: InterviewQuestion[]
): Promise<InterviewReport> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-pro",
    systemInstruction: REPORT_SYSTEM_PROMPT
  });

  const prompt = buildReportPrompt(transcript, questions);
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.5, // Lower temp for consistency
      maxOutputTokens: 4000,
      topP: 0.9
    }
  });

  const response = result.response.text();
  const report = parseReportFromResponse(response);
  
  // Save report to database
  await db.interviewReports.create({
    sessionId,
    ...report,
    generatedAt: new Date()
  });
  
  return report;
}
```

---

### 3.3 Vapi Integration

#### 3.3.1 Vapi Call Initialization

```javascript
// services/vapi/callInitializer.ts

import axios from 'axios';

const vapiClient = axios.create({
  baseURL: 'https://api.vapi.ai',
  headers: {
    'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export async function initializeVapiCall(
  sessionId: string,
  questions: InterviewQuestion[],
  userId: string
): Promise<string> {
  // Convert questions to natural language system prompt
  const systemPrompt = buildVapiSystemPrompt(questions);
  
  const callConfig = {
    assistant: {
      name: "Technical Interviewer",
      model: "gpt-4",
      systemPrompt,
      firstMessage: "Hello! I'm your AI technical interviewer. Let's start with the first question.",
      voice: {
        provider: "eleven-labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM", // Professional neutral
      }
    },
    phoneNumber: process.env.VAPI_PHONE_NUMBER,
    customer: {
      userId,
      name: userId
    },
    customerName: userId,
    webhookUrl: `${process.env.BACKEND_URL}/api/webhooks/vapi`,
    metadata: {
      sessionId,
      interviewType: 'mock-interview',
      timestamp: new Date().toISOString()
    }
  };

  try {
    const response = await vapiClient.post('/call/create', callConfig);
    
    // Save Vapi call ID to session
    await db.interviewSessions.update(
      { id: sessionId },
      { vapiCallId: response.data.id, status: 'initiated' }
    );
    
    return response.data.id;
  } catch (error) {
    console.error('Failed to create Vapi call:', error);
    throw new Error('Failed to initiate interview call');
  }
}

function buildVapiSystemPrompt(questions: InterviewQuestion[]): string {
  const questionsList = questions
    .map((q, i) => `${i + 1}. ${q.text}\nKey points to cover: ${q.expectedKeyPoints.join(', ')}`)
    .join('\n\n');
  
  return `
    You are an experienced technical interviewer conducting a mock interview.
    
    Interview Questions (ask in order):
    ${questionsList}
    
    Guidelines:
    - Ask questions clearly and at appropriate pace
    - Listen carefully to user responses
    - If response is incomplete, ask targeted follow-up questions
    - Move to next question when current one is adequately answered
    - Be encouraging and professional
    - Interrupt gracefully if user goes too long without answering
    - At the end, provide brief encouragement and summarize what you learned
  `;
}
```

#### 3.3.2 Webhook Handler for Vapi Events

```javascript
// pages/api/webhooks/vapi.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body;
  
  console.log('Vapi Webhook Event:', event.type);
  
  try {
    switch (event.type) {
      case 'call.started':
        await handleCallStarted(event);
        break;
        
      case 'call.ended':
        await handleCallEnded(event);
        break;
        
      case 'call.updated':
        await handleCallUpdated(event);
        break;
        
      case 'call.transcript':
        await handleTranscript(event);
        break;
        
      case 'call.recording':
        await handleRecording(event);
        break;
        
      case 'call.failed':
        await handleCallFailed(event);
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCallStarted(event: any) {
  await db.interviewSessions.update(
    { vapiCallId: event.callId },
    { 
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      vapiSessionId: event.sessionId
    }
  );
}

async function handleCallEnded(event: any) {
  const session = await db.interviewSessions.findOne({ 
    vapiCallId: event.callId 
  });
  
  await db.interviewSessions.update(
    { id: session.id },
    {
      status: 'COMPLETED',
      endedAt: new Date(),
      duration: event.duration
    }
  );
  
  // Trigger async report generation
  await triggerReportGeneration(session.id);
}

async function handleTranscript(event: any) {
  const session = await db.interviewSessions.findOne({
    vapiCallId: event.callId
  });
  
  // Parse transcript into Q&A segments
  const segments = parseTranscriptSegments(event.transcript);
  
  await db.interviewTranscripts.create({
    sessionId: session.id,
    rawTranscript: event.transcript,
    transcriptSegments: segments,
    confidenceScore: event.confidence || 0.95
  });
}

async function handleRecording(event: any) {
  const session = await db.interviewSessions.findOne({
    vapiCallId: event.callId
  });
  
  // Store recording URL
  await db.interviewSessions.update(
    { id: session.id },
    { vapiRecordingUrl: event.recordingUrl }
  );
}

async function handleCallFailed(event: any) {
  const session = await db.interviewSessions.findOne({
    vapiCallId: event.callId
  });
  
  await db.interviewSessions.update(
    { id: session.id },
    {
      status: 'FAILED',
      metadata: {
        ...session.metadata,
        error: event.error,
        failureReason: event.reason
      }
    }
  );
}

function parseTranscriptSegments(transcript: string): object[] {
  // Parse transcript into Q&A pairs
  // Implementation depends on transcript format from Vapi
  const lines = transcript.split('\n');
  const segments = [];
  let currentSegment = { question: '', answer: '' };
  
  for (const line of lines) {
    if (line.includes('INTERVIEWER:')) {
      if (currentSegment.answer) segments.push(currentSegment);
      currentSegment = { 
        question: line.replace('INTERVIEWER:', '').trim(), 
        answer: '' 
      };
    } else if (line.includes('USER:')) {
      currentSegment.answer = line.replace('USER:', '').trim();
    }
  }
  
  if (currentSegment.answer) segments.push(currentSegment);
  return segments;
}

async function triggerReportGeneration(sessionId: string) {
  // Use job queue (Bull, BullMQ, or similar)
  await reportQueue.add('generate-report', { sessionId });
}
```

---

## SECTION 4: PRICING & MONETIZATION

### 4.1 Cost Structure

**Per-Interview Costs:**

```
┌─────────────────────────────────────────────────────────┐
│ Component                          │ Cost          │ %   │
├─────────────────────────────────────────────────────────┤
│ Vapi Voice Call (20 min avg)       │ ₹15-25       │ 50% │
│   - $0.5 base call fee             │              │     │
│   - $0.75 per minute (15 min avg)  │              │     │
│                                    │              │     │
│ Gemini API Usage                   │ ₹5-10        │ 25% │
│   - Question generation (3k tokens)│ ₹2           │     │
│   - Report generation (4k tokens)  │ ₹3-5         │     │
│   - Conversation analysis          │ ₹2-3         │     │
│                                    │              │     │
│ Infrastructure & Storage           │ ₹3-5         │ 15% │
│   - Database (PostgreSQL)          │              │     │
│   - Recording storage (AWS S3)     │              │     │
│   - Compute (processing reports)   │              │     │
│                                    │              │     │
│ Payment Processing (Stripe/Razorpay)│ ₹2-3       │ 10% │
│   - Transaction fees 2.4% + ₹0.99 │              │     │
│                                    │              │     │
├─────────────────────────────────────────────────────────┤
│ TOTAL COST PER INTERVIEW           │ ₹25-43       │ 100%│
└─────────────────────────────────────────────────────────┘
```

### 4.2 Pricing Model

**User Pays:**

```
┌──────────────────────────────────────────────────┐
│ Difficulty Level  │ Duration │ Price  │ Margin  │
├──────────────────────────────────────────────────┤
│ Easy              │ 10-12 min│ ₹99    │ ₹50     │
│ Medium (Popular)  │ 15-20 min│ ₹149   │ ₹75     │
│ Hard              │ 20-25 min│ ₹199   │ ₹100    │
│ Expert (FAANG)    │ 25-30 min│ ₹299   │ ₹150    │
└──────────────────────────────────────────────────┘

Profit per interview: ₹50-150
Monthly goal: 1000 interviews = ₹50K-150K revenue
```

### 4.3 Subscription Tiers (Alternative)

```
┌──────────────────────────────────────────────────────┐
│ Free Tier                                            │
├──────────────────────────────────────────────────────┤
│ - 1 free mock interview / month                      │
│ - Basic report (no detailed breakdown)              │
│ - Ads on platform                                   │
│ Goal: User acquisition & engagement                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Pro Tier (₹499/month or ₹99 per interview)         │
├──────────────────────────────────────────────────────┤
│ - Unlimited mock interviews                         │
│ - Detailed reports with recommendations             │
│ - Interview history & progress tracking             │
│ - No ads                                            │
│ Goal: Main revenue driver (~70% of users)          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Premium Tier (₹1,999/month)                        │
├──────────────────────────────────────────────────────┤
│ - Everything in Pro                                 │
│ - 1-on-1 expert review (per month)                 │
│ - Custom interview prep (target company/role)      │
│ - Priority support                                 │
│ Goal: Power users who are serious (~5-10%)        │
└──────────────────────────────────────────────────────┘
```

### 4.4 Pricing Logic Implementation

```javascript
// services/pricing/calculateInterviewCost.ts

export function calculateInterviewCost(
  difficulty: string,
  estimatedDuration: number
): { userPrice: number; costPrice: number; margin: number } {
  
  const costPrices = {
    vapi: Math.ceil(estimatedDuration / 60) * 0.75 + 0.5, // $
    gemini: 0.01, // $ for generation + report
    infrastructure: 0.05, // $ for storage, compute
    payment: 0.03 // $ for payment processing
  };
  
  const totalCost = (
    costPrices.vapi + 
    costPrices.gemini + 
    costPrices.infrastructure + 
    costPrices.payment
  ) * 83; // USD to INR
  
  const userPrices = {
    easy: 99,
    medium: 149,
    hard: 199,
    expert: 299
  };
  
  const userPrice = userPrices[difficulty];
  const margin = userPrice - totalCost;
  
  return {
    userPrice,
    costPrice: Math.round(totalCost),
    margin: Math.round(margin)
  };
}

// pages/api/interviews/setup
export async function POST(req, res) {
  const { difficulty, duration } = req.body;
  
  const pricing = calculateInterviewCost(difficulty, duration);
  
  // Show user before proceeding
  return res.json({
    ...pricing,
    message: `This mock interview will cost ₹${pricing.userPrice}`
  });
}
```

---

## SECTION 5: DATABASE SCHEMA

### 5.1 Interview-Related Tables

```sql
-- Main interview session table
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Info
  type VARCHAR(50) NOT NULL, -- javascript, system-design, dsa, etc
  difficulty VARCHAR(20) NOT NULL, -- easy, medium, hard, expert
  status VARCHAR(50) DEFAULT 'setup', -- setup, in_progress, completed, failed
  
  -- Vapi Integration
  vapiCallId VARCHAR(255) UNIQUE,
  vapiSessionId VARCHAR(255),
  vapiRecordingUrl VARCHAR(500),
  
  -- Timing
  createdAt TIMESTAMP DEFAULT NOW(),
  startedAt TIMESTAMP,
  endedAt TIMESTAMP,
  durationSeconds INT,
  
  -- Configuration & Questions
  configuration JSONB NOT NULL, -- {focusAreas, requirements, duration}
  questionsGenerated JSONB NOT NULL, -- Full questions array
  
  -- Results
  reportGenerated BOOLEAN DEFAULT false,
  costCalculated DECIMAL(8, 2),
  paymentStatus VARCHAR(50), -- pending, completed, failed, refunded
  
  -- Metadata
  metadata JSONB,
  updatedAt TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('setup', 'in_progress', 'completed', 'failed')),
  CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert'))
);

CREATE INDEX idx_interview_sessions_userId ON interview_sessions(userId);
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);
CREATE INDEX idx_interview_sessions_createdAt ON interview_sessions(createdAt);

-- Questions breakdown per interview
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessionId UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  
  questionOrder INT NOT NULL,
  questionId VARCHAR(50),
  questionText TEXT NOT NULL,
  difficulty INT,
  expectedKeyPoints TEXT[],
  
  -- User Response
  userResponseText TEXT,
  userResponseDuration INT, -- seconds
  responseScore INT CHECK (responseScore >= 0 AND responseScore <= 100),
  
  -- Follow-ups
  followUpAsked BOOLEAN DEFAULT false,
  followUpQuestions TEXT[],
  
  metadata JSONB,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interview_questions_sessionId ON interview_questions(sessionId);

-- Full conversation transcript
CREATE TABLE interview_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessionId UUID NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
  
  rawTranscript TEXT NOT NULL,
  transcriptSegments JSONB, -- Parsed Q&A pairs
  confidenceScore FLOAT CHECK (confidenceScore >= 0 AND confidenceScore <= 1),
  
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Detailed interview report
CREATE TABLE interview_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessionId UUID NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
  
  -- Scoring
  overallScore INT CHECK (overallScore >= 0 AND overallScore <= 100),
  scoreBreakdown JSONB, -- {technicalDepth, communication, problemSolving, etc}
  
  -- Analysis
  strengths TEXT[],
  weaknesses TEXT[],
  recommendations TEXT[],
  detailedAnalysis TEXT,
  
  -- Comparison
  averageScoreForDifficulty INT,
  topPerformerScore INT,
  percentileRank INT,
  
  -- Generated Content
  reportJson JSONB NOT NULL,
  
  generatedAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interview_reports_sessionId ON interview_reports(sessionId);

-- User interview statistics
CREATE TABLE interview_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  totalInterviews INT DEFAULT 0,
  totalSpent DECIMAL(10, 2) DEFAULT 0,
  averageScore INT,
  
  -- By type
  javascriptInterviews INT DEFAULT 0,
  machinecodingInterviews INT DEFAULT 0,
  dsaInterviews INT DEFAULT 0,
  systemdesignInterviews INT DEFAULT 0,
  behavioralInterviews INT DEFAULT 0,
  
  -- Progress
  lastInterviewAt TIMESTAMP,
  bestScoreAchieved INT,
  improvementTrend INT, -- % improvement over last 5 interviews
  
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Payment & Billing
CREATE TABLE interview_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id),
  sessionId UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  
  amount DECIMAL(8, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50), -- pending, completed, failed, refunded
  
  paymentMethodId VARCHAR(255), -- Stripe/Razorpay ID
  transactionId VARCHAR(255) UNIQUE,
  
  createdAt TIMESTAMP DEFAULT NOW(),
  completedAt TIMESTAMP,
  
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

CREATE INDEX idx_interview_payments_userId ON interview_payments(userId);
CREATE INDEX idx_interview_payments_sessionId ON interview_payments(sessionId);
```

---

## SECTION 6: SECURITY & COMPLIANCE

### 6.1 Data Security

**Recording & Transcript Storage:**
```
- Store on secure S3 buckets (encrypted at rest)
- Access controlled via IAM policies
- Automatic deletion after 90 days (configurable)
- User can request deletion anytime
- GDPR compliant data handling
```

**API Keys Protection:**
```
- Vapi API key: in .env.local (never committed)
- Gemini API key: in .env.local (never committed)
- All keys rotated every 90 days
- Rate limiting: 100 req/min per user
- API signing with HMAC-SHA256 for webhooks
```

### 6.2 User Privacy

```
- Users own their interview data
- Can export/delete anytime
- Transcripts not used for training (unless opted-in)
- No selling of interview data
- Clear privacy policy
```

---

## SECTION 7: USER INTERFACE

### 7.1 Interview Setup Flow

```
┌─────────────────────────────────────────┐
│  Step 1: Select Interview Type          │
│  ☐ JavaScript (22 lessons)              │
│  ☐ Machine Coding (42 patterns)         │
│  ☐ DSA (130 problems)                   │
│  ☐ System Design (15 lessons) [SELECTED]│
│  ☐ Behavioral (12 lessons)              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Step 2: Select Difficulty              │
│  ○ Easy (5-10 min)                      │
│  ◉ Medium (15-20 min) [SELECTED]        │
│  ○ Hard (20-25 min)                     │
│  ○ Expert (25-30 min)                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Step 3: Choose Focus Areas             │
│  ☑ Scalability & Performance            │
│  ☑ Database Design                      │
│  ☑ Caching Strategies                   │
│  ☐ API Design                           │
│  ☐ Microservices                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Step 4: Additional Requirements        │
│  [Textarea]                             │
│  "I'm interviewing for Google L4.       │
│   Focus on distributed systems and      │
│   failure handling."                    │
│                                         │
│  [Continue] [Cancel]                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  Step 5: Review & Pay                   │
│  Interview Type: System Design          │
│  Difficulty: Medium                     │
│  Duration: ~20 minutes                  │
│  Cost: ₹149                             │
│                                         │
│  [Pay with Razorpay] [Cancel]           │
└─────────────────────────────────────────┘
```

### 7.2 Interview Widget

```
┌─────────────────────────────────────────┐
│  PrepKit Mock Interview Session          │
│  Question 1 of 5                        │
│  Time: 04:32 / 20:00                    │
├─────────────────────────────────────────┤
│                                         │
│  🎤 AI Interviewer:                     │
│  "Design a scalable URL shortener...    │
│   Can you break down the approach?"     │
│                                         │
│  [Your response is being recorded]      │
│                                         │
│  🔴 Recording... (Click to stop)         │
│                                         │
│  [Next Question →]  [End Interview]     │
└─────────────────────────────────────────┘
```

### 7.3 Report Display

```
┌───────────────────────────────────┐
│  Interview Report                 │
│  System Design (Medium Difficulty)│
├───────────────────────────────────┤
│                                   │
│  Overall Score: 72/100 ⭐⭐⭐     │
│                                   │
│  Breakdown:                       │
│  - Technical Depth: 78/100        │
│  - Communication: 68/100          │
│  - Problem Solving: 75/100        │
│  - Trade-off Analysis: 65/100     │
│  - Time Management: 72/100        │
│                                   │
├───────────────────────────────────┤
│  TOP STRENGTHS ✓                  │
│  • Good systematic approach       │
│  • Strong database knowledge      │
│  • Clear communication            │
│                                   │
│  AREAS TO IMPROVE 📍              │
│  • Trade-off discussion           │
│  • Failure handling scenarios     │
│  • Monitoring strategy            │
│                                   │
│  TOP RECOMMENDATIONS 🎯           │
│  1. Study CAP theorem (5-7 hrs)  │
│  2. Practice failure scenarios    │
│  3. Learn monitoring patterns     │
│                                   │
│  [View Full Report] [New Interview]
│  [Share Results]                  │
└───────────────────────────────────┘
```

---

## SECTION 8: IMPLEMENTATION ROADMAP

### Phase 1: MVP (Week 1-2)
```
✓ Database schema & migrations
✓ Vapi API integration (basic)
✓ Gemini API integration (question gen)
✓ Interview setup page
✓ Basic interview widget
✓ Webhook handling
```

### Phase 2: Core Features (Week 3-4)
```
✓ Report generation (Gemini)
✓ Report display UI
✓ Interview history
✓ Payment integration (Razorpay/Stripe)
✓ Cost calculation & display
```

### Phase 3: Enhancements (Week 5-6)
```
✓ Progress tracking
✓ Personalized recommendations
✓ Comparison to benchmarks
✓ Email reporting
✓ Export reports as PDF
```

### Phase 4: Polish & Launch (Week 7-8)
```
✓ Error handling & graceful degradation
✓ Performance optimization
✓ Security audit
✓ QA testing
✓ Beta launch
```

---

## SECTION 9: SUCCESS METRICS

### Key Metrics to Track

```
User Engagement:
- Daily active interviews: Target 50+ by Month 1
- Average session duration: 18-22 minutes
- User retention (7-day): 40%+ 
- Repeat interviews per user: 3+ within 30 days

Business Metrics:
- Total revenue: Target ₹50K+ by Month 1
- Average revenue per user: ₹500+
- Cost per interview: ₹30-40 (target margin 50%+)
- Payment success rate: 98%+

Quality Metrics:
- Interview completion rate: 95%+
- Report generation success: 99%+
- User satisfaction: 4.5/5 stars minimum
- Average performance score: Trending upward

Technical Metrics:
- API availability: 99.95% uptime
- Vapi call success rate: 98%+
- Gemini API response time: <5 seconds
- Database query performance: <100ms p95
```

---

## SECTION 10: ROLLOUT PLAN

### Beta Launch (Week 8)
- Invite 100 PrepKit users
- Collect feedback
- Monitor performance metrics
- Fix bugs & optimize

### Public Launch (Week 9)
- Open to all PrepKit users
- Marketing campaign
- Referral incentives (₹50 per referral)

### Growth Phase (Month 2+)
- Scale infrastructure as needed
- Add more question types
- Implement advanced features
- Partner with companies for bulk interviews

---

## APPENDIX: API Integration Examples

### Example: Complete Interview Flow

```javascript
// 1. User initiates interview
const setupResponse = await fetch('/api/interviews/setup', {
  method: 'POST',
  body: JSON.stringify({
    type: 'system-design',
    difficulty: 'medium',
    focusAreas: ['scalability', 'databases'],
    specificRequirements: 'Google L4 focus',
    duration: 20
  })
});

const { sessionId, estimatedCost } = await setupResponse.json();

// 2. User confirms and makes payment
const paymentResponse = await fetch('/api/payments/create', {
  method: 'POST',
  body: JSON.stringify({ sessionId, amount: 149 })
});

const { paymentId } = await paymentResponse.json();

// 3. Questions are generated (background)
// Backend calls Gemini, stores questions

// 4. Start Vapi call
const callResponse = await fetch(`/api/interviews/${sessionId}/start`, {
  method: 'POST'
});

const { callId, vapiUrl } = await callResponse.json();

// 5. Show Vapi widget to user
showVapiWidget(vapiUrl);

// 6. Vapi sends webhooks as call progresses
// Backend receives call.started, call.ended, call.transcript

// 7. Report generated and displayed
// User sees report in real-time as it's generated

// 8. Results saved to database
// User can view history anytime
```

---

## FINAL NOTES

**This FRD provides a complete blueprint for implementing the Mock Interview Feature.**

Key Differentiators:
- ✅ Real-time voice interaction (not text-based)
- ✅ AI-powered question generation tailored to user
- ✅ Comprehensive analysis & detailed reports
- ✅ Proper pricing model with profit margin
- ✅ Full database sync & historical tracking
- ✅ Professional, scalable architecture

**Next Steps:**
1. Review this FRD with team
2. Estimate engineering effort (40-60 hours)
3. Set up development environment
4. Begin Phase 1 implementation
5. Plan beta launch

---

**Document Status:** ✅ Complete & Ready for Development
**Created:** December 3, 2025
**Version:** 1.0 Production Ready
