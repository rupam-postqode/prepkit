// prisma/content-data/behavioral.ts

export const behavioralLessons = [
  // Section 1: Behavioral Interview Fundamentals (4 lessons)
  {
    title: "STAR Method Mastery",
    slug: "star-method-mastery",
    description: "Master the Situation, Task, Action, Result framework for behavioral interviews",
    markdownContent: `# STAR Method Mastery

## Learning Objectives

Master the STAR framework to structure compelling interview answers:
- Understand each component of STAR
- Learn to identify relevant stories
- Practice structuring responses
- Avoid common pitfalls

## What is the STAR Method?

STAR is a structured method for answering behavioral interview questions:

**S - Situation**
- Set the context and background
- When and where did this happen?
- Keep it concise (30 seconds max)

**T - Task** 
- What was your specific responsibility?
- What challenge needed to be addressed?
- Why was this important?

**A - Action**
- What specific steps did YOU take?
- Focus on your individual contribution
- Use "I" not "we"

**R - Result**
- What was the outcome?
- Quantify when possible
- What did you learn?

## Why STAR Works

### 1. **Structure for Clarity**
- Prevents rambling
- Ensures all key points covered
- Makes answer easy to follow

### 2. **Focuses on Impact**
- Forces you to think about results
- Demonstrates outcome-oriented thinking
- Shows value you bring

### 3. **Prevents Common Mistakes**
- Avoids vague answers
- Prevents rambling
- Ensures you answer the actual question

## Detailed Breakdown

### Situation (S)

**Purpose**: Set the scene for your story

**What to Include**:
- Time frame (e.g., "Last quarter at my previous company")
- Your role and team context
- Business context or challenge
- Brief, relevant background

**What to Avoid**:
- Long, unnecessary details
- Information unrelated to the question
- Starting from your childhood

**Example**:
\`\`\`text
"Last quarter at Postqode, I was the lead frontend developer on a team of 5 engineers. We were working on a VS Code extension that was experiencing critical performance issues affecting 10,000+ users."
\`\`\`

### Task (T)

**Purpose**: Clarify your specific responsibility

**What to Include**:
- Your specific role in the situation
- The challenge or problem to solve
- Why it was important
- Success criteria

**What to Avoid**:
- Blaming others
- Vague responsibilities
- Making it sound easy

**Example**:
\`\`\`text
"My task was to identify and fix the performance bottleneck within 2 weeks, as users were reporting crashes and slow load times. The goal was to reduce load time by 50% and eliminate crashes."
\`\`\`

### Action (A)

**Purpose**: Detail what YOU specifically did

**What to Include**:
- Step-by-step approach
- Skills and techniques used
- How you handled obstacles
- Specific decisions you made

**What to Avoid**:
- Saying "we did" instead of "I did"
- Vague descriptions
- Skipping important steps

**Example**:
\`\`\`text
"I started by profiling the extension using Chrome DevTools to identify bottlenecks. I discovered we were re-rendering 10,000 components unnecessarily. I implemented React.memo and component splitting, reducing re-renders by 95%. I also optimized the bundle size using code splitting and lazy loading. When that wasn't enough, I collaborated with the backend team to implement caching for API responses."
\`\`\`

### Result (R)

**Purpose**: Show the impact of your actions

**What to Include**:
- Quantifiable outcomes
- Business impact
- Lessons learned
- Recognition received

**What to Avoid**:
- Modesty that downplays achievements
- Unverifiable claims
- Forgetting to mention lessons learned

**Example**:
\`\`\`text
"The result was a 75% reduction in load time and elimination of all reported crashes. User satisfaction scores improved by 40%, and we saw a 15% increase in daily active users. This approach became our standard for performance optimization across the team. I learned the importance of systematic profiling and the impact of small optimizations on user experience."
\`\`\`

## Common Behavioral Questions & STAR Examples

### 1. "Tell me about a time you led a project"

**Situation**: "In my previous role at ElnovaLabs, our team needed to migrate our legacy codebase to TypeScript, but no one had ownership of this initiative."

**Task**: "I volunteered to lead the TypeScript migration project, which involved converting 50,000+ lines of code and training 8 team members."

**Action**: "I created a phased migration plan, starting with non-critical modules. I conducted weekly workshops to teach TypeScript concepts, created comprehensive documentation, and implemented gradual adoption with parallel JavaScript support. I also set up automated type checking in our CI/CD pipeline."

**Result**: "We completed the migration in 3 months ahead of schedule. Type-related bugs decreased by 80%, and developer productivity improved by 30%. The migration became a case study for other teams in the company."

### 2. "Describe a time you handled conflict with a team member"

**Situation**: "At my previous startup, I had a disagreement with a senior engineer about our approach to implementing a new payment feature."

**Task**: "I needed to resolve this conflict to ensure we could deliver the feature on time while maintaining team collaboration."

**Action**: "I scheduled a 1:1 meeting to understand their perspective. They were concerned about security, while I was focused on speed. I proposed we build a prototype of both approaches and measure them objectively. I also brought in our security lead as an impartial advisor. After testing, we found a hybrid approach that met both requirements."

**Result**: "We delivered the feature on time with excellent security ratings. Our relationship improved, and we established a new process for technical disagreements that the entire team adopted. This experience taught me the importance of seeking to understand before trying to persuade."

## Practice Framework

### Step 1: Identify Your Stories
Brainstorm 8-10 stories covering:
- Leadership experiences
- Conflict resolution
- Technical challenges
- Failures and learnings
- Customer impact
- Team collaboration
- Process improvements
- Innovation initiatives

### Step 2: Map to STAR
For each story, create a STAR outline:

**Story**: [Brief title]
- **S**: Situation (2-3 sentences max)
- **T**: Task (1-2 sentences)
- **A**: Action (3-5 bullet points)
- **R**: Result (2-3 sentences with metrics)

### Step 3: Practice Delivery
1. **Time Yourself**: Aim for 2-3 minutes per story
2. **Record Yourself**: Watch for clarity and confidence
3. **Get Feedback**: Practice with friends or mentors
4. **Refine**: Improve based on feedback

## Common Mistakes to Avoid

### 1. **The "We" Trap**
\`\`\`text
Wrong: "We worked on the project and delivered it on time."
Right: "I led the team by creating the project plan, tracking progress, and removing blockers. We delivered on time."
\`\`\`

### 2. **Being Too Vague**
\`\`\`text
Wrong: "I improved the performance."
Right: "I reduced API response time from 500ms to 100ms by implementing Redis caching and optimizing database queries."
\`\`\`

### 3. **Not Answering the Question**
\`\`\`text
Question: "Tell me about a time you failed."
Wrong: Talks about success instead
Right: Chooses a real failure and focuses on learning
\`\`\`

### 4. **Taking Too Long**
\`\`\`text
Wrong: 5+ minute story with unnecessary details
Right: 2-3 minute focused story with clear STAR structure
\`\`\`

## Advanced STAR Techniques

### 1. **The STAR-L Method**
Add "Learning" at the end:
\`\`\`text
STAR-L: Situation, Task, Action, Result, Learning
\`\`\`

**Learning Example**: "I learned that proactive communication with stakeholders is crucial for project success."

### 2. **Quantifying Results**
Always include numbers where possible:
\`\`\`text
Instead of: "improved performance"
Use: "reduced load time by 60% from 5s to 2s"

Instead of: "saved money"
Use: "reduced costs by $50,000 annually"

Instead of: "increased users"
Use: "grew user base from 10K to 25K in 6 months"
\`\`\`

### 3. **Handling Follow-up Questions**
Prepare for common follow-ups:
- "What would you do differently?"
- "What was the biggest challenge?"
- "How did you measure success?"

## Remote Interview Considerations

### Virtual Delivery Tips
1. **Camera On**: Show engagement and confidence
2. **Notes Allowed**: Keep STAR outlines handy
3. **Minimize Distractions**: Professional background, quiet space
4. **Energy Level**: Speak with enthusiasm and clarity

### Body Language
- Sit up straight
- Use hand gestures naturally
- Maintain eye contact with camera
- Smile appropriately

## Company-Specific Adaptations

### Google
- Emphasis on data and metrics
- Focus on "Googlyness" (team impact)
- Multiple examples expected

### Amazon
- Leadership principles focus
- Customer obsession stories
- Metrics-driven results

### Startups
- Focus on initiative and ownership
- Resourcefulness stories
- Quick learning and adaptation

## Practice Exercises

### Exercise 1: Quick STAR Drill
Take 5 minutes to create a STAR outline for:
1. A time you had to learn something new quickly
2. A time you disagreed with your manager
3. A time you had to work with difficult team member
4. A time you improved a process
5. A time you failed at something

### Exercise 2: Story Refinement
Pick your strongest story and:
1. Record yourself telling it (2-3 minutes)
2. Transcribe and analyze against STAR framework
3. Identify areas for improvement
4. Practice and record again
5. Compare before/after

### Exercise 3: Mock Interview
Practice with a partner using these questions:
- "Tell me about a time you had to work under pressure"
- "Describe a situation where you had to convince someone"
- "When did you take initiative on a project?"
- "Tell me about your biggest professional failure"

## Key Takeaways

- **Structure Matters**: STAR keeps answers focused and complete
- **Be Specific**: Use concrete examples and data
- **Focus on Impact**: Quantify results whenever possible
- **Practice Regularly**: Rehearse stories until they feel natural
- **Adapt to Company**: Tailor stories to company values and culture

## Quick Reference

### STAR Template
\`\`\`text
**Situation**: [Context - when, where, who, 2-3 sentences]
**Task**: [Your responsibility - what needed to be done, 1-2 sentences]  
**Action**: [Your specific steps - what YOU did, 3-5 bullets]
**Result**: [Outcome - impact, metrics, learning, 2-3 sentences]
\`\`\`

### Common Question Categories
- Leadership & Initiative
- Conflict Resolution
- Problem Solving
- Failure & Learning
- Team Collaboration
- Customer Impact
- Innovation & Process Improvement

### Success Metrics
- Clarity: Interviewer understands your story
- Completeness: All STAR components covered
- Relevance: Story directly answers the question
- Impact: Quantifiable results demonstrated
- Time: 2-3 minutes per story

Master the STAR method to deliver compelling, structured answers that showcase your value and experience effectively.`,
    keyTakeaways: [
      "Structure every behavioral answer using STAR framework",
      "Focus on YOUR specific actions, not team achievements",
      "Quantify results with specific metrics and impact",
      "Practice stories until they feel natural and confident"
    ],
    commonMistakes: [
      "Using 'we' instead of 'I' when describing actions",
      "Being too vague without specific details or metrics",
      "Not actually answering the question being asked",
      "Making stories too long with unnecessary details"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 30
  },

  {
    title: "Common Behavioral Questions",
    slug: "common-behavioral-questions",
    description: "Prepare for the most frequently asked behavioral interview questions",
    markdownContent: `# Common Behavioral Questions

## Learning Objectives

Prepare for the most common behavioral questions:
- Understand what interviewers are really asking
- Develop stories for each question type
- Practice authentic, compelling answers
- Handle unexpected questions confidently

## The 20 Most Common Questions

### Leadership & Initiative

#### 1. "Tell me about a time you showed leadership"
**What they're looking for**: Initiative, influence, taking ownership
**Best story types**: Leading without authority, mentoring, driving change
**Example areas**: Project leadership, process improvement, team motivation

#### 2. "Describe a challenging project you worked on"
**What they're looking for**: Problem-solving, perseverance, technical ability
**Best story types**: Complex technical challenges, tight deadlines, resource constraints
**Example areas**: Migration projects, performance optimization, new feature development

#### 3. "When did you take ownership of something?"
**What they're looking for**: Proactive attitude, accountability, going beyond role
**Best story types**: Fixing broken processes, volunteering for tough tasks, improving systems
**Example areas**: Bug fixes, documentation, tool improvements

### Conflict & Teamwork

#### 4. "Tell me about a time you disagreed with your manager"
**What they're looking for**: Professionalism, communication, handling authority
**Best story types**: Technical disagreements, approach differences, priority conflicts
**Key points**: Respectful disagreement, data-driven arguments, finding middle ground

#### 5. "Describe a time you worked with someone difficult"
**What they're looking for**: Interpersonal skills, adaptability, emotional intelligence
**Best story types**: Personality conflicts, work style differences, communication issues
**Key points**: Empathy, finding common ground, professional boundaries

#### 6. "When did you have to persuade someone?"
**What they're looking for**: Communication, influence, negotiation skills
**Best story types**: Technical recommendations, process changes, resource allocation
**Key points**: Data backing, understanding concerns, building consensus

### Problem Solving & Innovation

#### 7. "Tell me about a time you solved a complex problem"
**What they're looking for**: Analytical thinking, systematic approach, creativity
**Best story types**: Technical challenges, business problems, process inefficiencies
**Key points**: Problem definition, solution exploration, implementation, measurement

#### 8. "When did you have to learn something new quickly?"
**What they're looking for**: Learning agility, adaptability, resourcefulness
**Best story types**: New technologies, domain knowledge, tools, methodologies
**Key points**: Learning process, speed of acquisition, application of new knowledge

#### 9. "Describe an innovation you brought to your team"
**What they're looking for**: Creativity, initiative, impact orientation
**Best story types**: Process improvements, tool introductions, new approaches
**Key points**: Identifying need, developing solution, getting adoption, measuring impact

### Failure & Learning

#### 10. "Tell me about your biggest failure"
**What they're looking for**: Self-awareness, learning ability, resilience
**Best story types**: Project failures, technical mistakes, judgment errors
**Key points**: Ownership, lessons learned, prevention of recurrence

#### 11. "When did you make a mistake and how did you handle it?"
**What they're looking for**: Accountability, problem-solving, integrity
**Best story types**: Code bugs, communication errors, poor decisions
**Key points**: Quick identification, transparent communication, resolution, learning

#### 12. "Tell me about a time you received difficult feedback"
**What they're looking for**: Receptiveness, growth mindset, coachability
**Best story types**: Performance reviews, peer feedback, customer complaints
**Key points**: Listening, understanding, action plan, improvement

### Customer Focus & Impact

#### 13. "When did you go above and beyond for a customer?"
**What they're looking for**: Customer obsession, initiative, business impact
**Best story types**: Solving customer issues, exceeding expectations, advocacy
**Key points**: Understanding needs, creative solutions, business impact

#### 14. "Describe a time you had to make a decision with incomplete information"
**What they're looking for**: Decision-making under uncertainty, risk assessment
**Best story types**: Technical choices, project decisions, resource allocation
**Key points**: Information gathering, risk analysis, decisive action, outcome monitoring

### Team & Process

#### 15. "How do you handle tight deadlines?"
**What they're looking for**: Time management, prioritization, performance under pressure
**Best story types**: Multiple competing priorities, resource constraints, urgent fixes
**Key points**: Prioritization, communication, quality maintenance, delivery

#### 16. "Tell me about a time you improved a process"
**What they're looking for**: Process thinking, efficiency focus, continuous improvement
**Best story types**: Development workflows, testing processes, deployment procedures
**Key points**: Identifying inefficiencies, developing solution, measuring improvement, adoption

#### 17. "When did you have to mentor someone?"
**What they're looking for**: Leadership potential, knowledge sharing, empathy
**Best story types**: Onboarding new team members, helping struggling colleagues, skill development
**Key points**: Assessing needs, creating learning plan, providing support, measuring growth

### Situational & Behavioral

#### 18. "How do you handle disagreement with technical approach?"
**What they're looking for**: Technical collaboration, evidence-based thinking
**Best story types**: Architecture decisions, technology choices, implementation approaches
**Key points**: Evidence gathering, respectful debate, prototyping, consensus building

#### 19. "Tell me about a time you had to adapt to change"
**What they're looking for**: Adaptability, change management, positive attitude
**Best story types**: Company changes, project pivots, role transitions
**Key points**: Understanding change, adapting approach, helping others, learning

#### 20. "Describe your approach to continuous learning"
**What they're looking for**: Growth mindset, self-improvement, staying current
**Best story types**: Learning new skills, staying updated, knowledge sharing
**Key points**: Learning methods, applying knowledge, measuring growth, sharing with team

## Question Analysis Framework

### Step 1: Decode the Question
Ask yourself: "What are they REALLY asking?"

**"Tell me about a time you..."**
- Leadership: "Show me you can lead and influence"
- Failure: "Show me you learn and grow"
- Conflict: "Show me you handle relationships professionally"
- Innovation: "Show me you think differently and create value"

### Step 2: Choose the Right Story
**Story Selection Criteria**:
1. **Relevance**: Directly answers the question
2. **Impact**: Demonstrates positive outcomes
3. **Recency**: Preferably within last 2 years
4. **Authenticity**: Real experience you can speak about confidently
5. **Company Alignment**: Matches company values and culture

### Step 3: Structure with STAR
**Quick STAR Planning** (30 seconds):
- **S**: Situation setup (when, where, context)
- **T**: Your specific task/responsibility
- **A**: Your concrete actions (I, not we)
- **R**: Measurable results and learnings

## Company-Specific Focus

### Google Behavioral Questions
**Focus Areas**:
- Leadership ("Googlyness")
- Problem-solving with data
- Collaboration and impact
- Innovation and creativity

**Common Questions**:
- "Tell me about a time you had an impact beyond your immediate team"
- "Describe a situation where you had to deal with ambiguity"
- "When did you take a calculated risk?"

### Amazon Behavioral Questions
**Focus Areas**:
- 14 Leadership Principles
- Customer obsession
- Invent and simplify
- Dive deep

**Common Questions**:
- "Tell me about a time you obsessed over customer needs"
- "Describe when you had to earn trust"
- "When did you have to make a tough decision with incomplete data?"

### Meta/Facebook Behavioral Questions
**Focus Areas**:
- Move fast
- Build social value
- Be open and connected
- Focus on impact

**Common Questions**:
- "Tell me about a time you moved quickly with limited information"
- "Describe when you had to balance speed with quality"
- "When did you have to influence without authority?"

### Startup Behavioral Questions
**Focus Areas**:
- Initiative and ownership
- Resourcefulness
- Adaptability and learning
- Wearing multiple hats

**Common Questions**:
- "Tell me about a time you did something outside your job description"
- "Describe when you had to learn something completely new"
- "When did you have to make do with limited resources?"

## Preparation Strategy

### Week 1: Story Inventory
**Day 1-2**: Brainstorm 20+ stories from your career
- Use resume and performance reviews as memory aids
- Include successes, failures, challenges, learnings
- Don't judge stories yet - just collect

**Day 3-4**: Categorize stories
- Group by question types (leadership, conflict, failure, etc.)
- Identify gaps in your story inventory
- Plan new stories or existing story adaptations

**Day 5-7**: STAR outlines
- Create STAR outlines for top 10 stories
- Focus on quantifiable results
- Practice timing (aim for 2-3 minutes each)

### Week 2: Practice & Refine
**Day 8-10**: Individual practice
- Record yourself telling each story
- Transcribe and analyze against STAR framework
- Refine for clarity, impact, and conciseness

**Day 11-12**: Mock interviews
- Practice with friends, mentors, or career coaches
- Ask for specific feedback on STAR structure
- Focus on different question categories each session

**Day 13-14**: Company-specific adaptation
- Research target companies' values and culture
- Adapt stories to align with company focus
- Practice company-specific variations of common questions

## Quick Reference Templates

### Leadership Template
\`\`\`text
**Situation**: We needed to [initiative] but no one was taking ownership.
**Task**: I volunteered to [specific responsibility] to achieve [goal].
**Action**: I [action 1], [action 2], and [action 3] with [specific approach].
**Result**: We achieved [metric], resulting in [business impact]. I learned [key learning].
\`\`\`

### Failure Template
\`\`\`text
**Situation**: I was working on [project] and made the mistake to [error].
**Task**: I needed to [fix problem] and prevent recurrence.
**Action**: I immediately [acknowledged], [fixed issue], and [implemented prevention].
**Result**: We recovered quickly, and I implemented [process change] that prevented similar issues. I learned [lesson].
\`\`\`

### Conflict Template
\`\`\`text
**Situation**: I disagreed with [person] about [topic] on [project].
**Task**: I needed to resolve disagreement while maintaining relationship and project progress.
**Action**: I listened to understand their perspective, shared my data-driven view, and we found [compromise solution].
**Result**: We moved forward successfully with [hybrid approach], and our collaboration improved. I learned [communication insight].
\`\`\`

## Red Flags to Avoid

### Don't Do These:
1. **Blame Others**: "My team didn't deliver" → "I worked with my team to overcome challenges"
2. **Be Vague**: "I improved things" → "I reduced deployment time by 60%"
3. **Sound Arrogant**: "I was the only one who could solve it" → "I collaborated with the team to find a solution"
4. **Lie or Exaggerate**: Interviewers can spot inconsistencies
5. **Use "We" for Actions**: "We fixed the bug" → "I identified and fixed the bug"

### Do These Instead:
1. **Take Ownership**: Focus on your contribution
2. **Be Specific**: Use concrete examples and data
3. **Show Learning**: Demonstrate growth mindset
4. **Be Authentic**: Tell real stories that showcase your strengths
5. **Stay Positive**: Frame challenges as learning opportunities

## Final Tips

### During the Interview
1. **Listen Carefully**: Make sure you answer the actual question asked
2. **Take a Pause**: 5-10 seconds to structure your thoughts
3. **Stay Concise**: 2-3 minutes per story maximum
4. **Show Enthusiasm**: Energy and passion make stories memorable
5. **Read the Room**: Adjust based on interviewer reactions

### After Each Answer
- **Check for Understanding**: "Does that answer your question?"
- **Be Ready for Follow-ups**: Anticipate "what would you do differently?"
- **Stay Confident**: Own your experiences and learnings

Practice these common questions until you can answer them naturally, authentically, and compellingly using the STAR framework.`,
    keyTakeaways: [
      "Prepare stories for all major behavioral question categories",
      "Understand what interviewers are really asking with each question",
      "Adapt stories to match company values and culture",
      "Practice delivering answers concisely with STAR framework"
    ],
    commonMistakes: [
      "Not actually answering the question being asked",
      "Being too vague without specific examples or metrics",
      "Blaming others instead of taking ownership",
      "Making stories too long with unnecessary details"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 45
  }
];
