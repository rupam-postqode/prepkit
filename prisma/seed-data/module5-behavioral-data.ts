export const behavioralModuleData = {
  chapters: [
    {
      title: "STAR Method & Storytelling",
      slug: "star-method",
      description: "Master the art of behavioral interview storytelling",
      orderIndex: 1,
      difficultyLevel: "BEGINNER" as const,
      estimatedHours: 4,
      lessons: [
        {
          title: "What Interviewers Look For",
          slug: "what-interviewers-look-for",
          description: "Understand six core competencies evaluated in behavioral interviews",
          orderIndex: 1,
          difficulty: "EASY",
          videoUrl: "https://example.com/behav-1-1-video",
          videoDurationSec: 600,
          markdownContent: `# What Interviewers Look For

## Learning Objectives
- Understand what's being evaluated
- Know STAR method
- Prepare strong stories
- Understand company culture

## Content

### Part 1: Six Core Competencies

**1. Communication & Clarity**
- Can you explain complex ideas simply?
- Do you listen actively?
- Can you handle disagreement professionally?

**2. Problem-Solving & Analysis**
- How do you approach problems?
- Can you break down complexity?
- Do you ask right questions?

**3. Leadership & Initiative**
- Do you take ownership?
- Can you influence without authority?
- Do you mentor others?

**4. Teamwork & Collaboration**
- How do you work with diverse teams?
- Can you handle conflict?
- Do you build relationships?

**5. Adaptability & Learning**
- Can you handle change?
- Do you learn from failures?
- Are you curious?

**6. Customer Focus & Impact**
- Do you care about user needs?
- Do you measure impact?
- Can you balance speed & quality?

### Part 2: STAR Method

**Structure** your stories using STAR:

**S - Situation:**
- Set context
- When? Where? What project?
- Keep brief (30 seconds)

**T - Task:**
- What was challenge?
- What was your responsibility?
- Why was it difficult?

**A - Action:**
- What did YOU do specifically?
- Not "we" but "I"
- What was your approach?
- What was your decision-making process?

**R - Result:**
- What was the outcome?
- Quantify if possible
- What did you learn?

## Example (Wrong - not specific):
\`\`\`
"We worked on a difficult project and I helped
team solve problem."
\`\`\`

Problem: Vague, no specifics, uses "we"

## Example (Right - STAR format):
\`\`\`
**Situation:** Last year at Postqode, we had a critical
bug affecting 10% of users where VS Code
extension crashed on large files.

**Task:** As primary frontend developer, I was
responsible for root-causing and fixing the issue.

**Action:** I used Chrome DevTools to profile code,
identified that we were re-rendering 10,000 components
unnecessarily. I implemented React.memo and component
splitting, reducing re-renders by 95%.

**Result:** Crash rate dropped from 10% to 0.1%,
improved user satisfaction by 40%, and prevented $100K in
potential churn. The fix is now our standard pattern
in codebase.
\`\`\`

## Interview Tips
- Structure answers using STAR
- Be specific and use data
- Focus on YOUR contributions
- Show learning and growth
- Keep answers concise (2-3 minutes)

## Follow-up Questions
1. Tell me about a time you showed leadership.
2. Describe a situation where you had to learn something new quickly.
3. How do you handle disagreement with your manager?`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "STAR Method Practice",
              problemUrl: "https://codesandbox.io/s/star-method-practice",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Common Behavioral Questions",
          slug: "common-behavioral-questions",
          description: "Master answers to the most frequently asked behavioral questions",
          orderIndex: 2,
          difficulty: "EASY",
          videoUrl: "https://example.com/behav-1-2-video",
          videoDurationSec: 900,
          markdownContent: `# Common Behavioral Questions

## Learning Objectives
- Know most common questions
- Prepare structured responses
- Handle difficult questions
- Practice delivery

## Content

### Part 1: Leadership & Initiative

**1. "Tell me about a time you showed leadership."**

Response framework:
\`\`\`
Situation: Describe a project or team situation
Task: What leadership was needed?
Action: How did you lead?
Result: Quantified impact
\`\`\`

Example:
\`\`\`
At Postqode, our frontend had technical debt affecting
velocity. While not officially assigned, I took ownership
of proposing a refactoring plan. I:
- Analyzed code bottlenecks
- Created migration strategy
- Got team buy-in through demos
- Guided implementation

Result: 30% faster builds, 2 weeks saved per sprint,
team morale improved. This became our standard approach.
\`\`\`

**2. "Describe a challenging project you worked on."**

**3. "Tell me about a situation where you took ownership."**

**4. "When did you go above and beyond?"**

### Part 2: Conflict & Disagreement

**5. "Tell me about a time you disagreed with your manager."**

Response:
\`\`\`
Situation: Specific disagreement
My position: Why I disagreed (data-driven)
Their position: Understand their perspective
Resolution: How we resolved
Learning: What you learned
\`\`\`

Example:
\`\`\`
At previous company, manager wanted to rush launch
for marketing deadline. I proposed 2-week delay to
handle technical debt and security issues.

My reasoning: 3 customers reported crashes,
security audit found 5 issues.

Manager was concerned about marketing window.

We compromised: Launched critical features on time,
scheduled security fixes for next sprint with dedicated resources.

Learning: Deadline pressure is real, but quality matters.
I learned to propose alternatives with trade-offs, not just say "no".
\`\`\`

**6. "Describe a time you worked with someone difficult."**

### Part 3: Failure & Learning

**7. "Tell me about your biggest failure."**

Response:
\`\`\`
The failure: Be specific and honest
Learning: What did you learn?
Root cause: Why it happened?
Application: How did you apply it?
\`\`\`

Example:
\`\`\`
At Postqode, I shipped a feature without proper testing.
It had a security vulnerability that 50 users were
affected, costing us $10K in refund requests.

My failure: Assumed CI environment was representative.
Didn't test on actual customer environments.

Learning: Testing is critical, "works on my machine" is
not acceptable. Environment matters.

Application: Now I:
- Test on multiple environments
- Add compatibility matrix to CI
- Always ask "who could this break?"
Haven't had environment-related bugs since.
\`\`\`

**8. "Tell me about a time you failed to meet a deadline."**

**9. "Describe something you'd do differently."**

### Part 4: Teamwork & Collaboration

**10. "How do you handle disagreement with peers?"**

**11. "Tell me about your teamwork style."**

**12. "Describe a time you mentored someone."**

### Part 5: Technical & Problem-Solving

**13. "Describe your approach to solving a complex problem."**

Response:
\`\`\`
Approach:
1. Ask clarifying questions
2. Break down into smaller parts
3. Research existing solutions
4. Propose multiple approaches
5. Evaluate trade-offs
6. Implement iteratively
7. Measure results
\`\`\`

**14. "Tell me about your biggest technical achievement."**

### Part 6: Customer Focus & Impact

**15. "How do you ensure customer satisfaction?"**

**16. "Describe a time you improved a product based on user feedback."**

### Part 7: Company & Culture Fit

**17. "Why do you want to work here?"**

Prepare:
\`\`\`
Research company
Know their products
Understand culture
Connect to your values
\`\`\`

Good answer:
\`\`\`
"Postqode's mission to help developers write better
code aligns with my passion for developer experience.
Your focus on performance and reliability is something
I care deeply about. Your engineering culture and
mentorship approach attracted me."
\`\`\`

Bad answer:
\`\`\`
"You have good salary and benefits."
\`\`\`

**18. "What's your understanding of our company culture?"**

**19. "How do you handle pressure or stress?"**

## Interview Tips
- Prepare 8-10 stories covering different competencies
- Practice delivering answers in 2-3 minutes
- Use data and metrics in responses
- Research company-specific values
- Be authentic but professional`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Behavioral Question Practice",
              problemUrl: "https://codesandbox.io/s/behavioral-question-practice",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Company-Specific Culture Questions",
          slug: "company-specific-culture-questions",
          description: "Prepare for company-specific behavioral questions",
          orderIndex: 3,
          difficulty: "EASY",
          videoUrl: "https://example.com/behav-1-3-video",
          videoDurationSec: 600,
          markdownContent: `# Company-Specific Culture Questions

## Learning Objectives
- Know company-specific patterns
- Prepare tailored responses
- Understand different interview styles
- Research target companies

## Content

### Part 1: Google Behavioral Questions

**Focus Areas:**
- **"How do you approach novel problems?"**
- **"Tell me about a time you influenced others."**
- **"How do you handle ambiguity?"**
- **"Describe a project with significant impact."**

**Google Values:**
- Focus on user experience
- Technical excellence
- Innovation
- Collaboration

### Part 2: Meta/Facebook Behavioral Questions

**Focus Areas:**
- **"Tell me about a time you broke something."**
- **"How do you move fast and stay quality?"**
- **"Describe your collaboration style."**
- **"How do you handle failure?"**

**Meta Values:**
- Move fast and build
- Be bold and open
- Focus on impact
- Direct communication

### Part 3: Amazon Behavioral Questions

**Leadership Principles:**
- **Customer Obsession:** Start with customer
- **Ownership:** Take responsibility
- **Invent and Simplify:** Find simple solutions
- **Are Right, A Lot:** Humility, make decisions
- **Learn and Be Curious:** Never stop learning
- **Hire and Develop the Best:** Raise the bar
- **Think Big:** Think differently
- **Bias for Action:** Trust and take action
- **Deliver Results:** Deliver on commitments
- **Strive to be Earth's Best Employer:** Success and scale bring responsibility

**Common Questions:**
- **"Tell me about a time you dealt with an impossible deadline."**
- **"Describe a time you had to make a decision with incomplete data."**
- **"How do you prioritize customer needs vs. technical constraints?"**

### Part 4: Salesforce Behavioral Questions

**Focus Areas:**
- **"How do you build relationships with customers?"**
- **"Tell me about a time you drove impact."**
- **"Describe your approach to complex customer problems."**
- **"How do you ensure quality in your work?"**

**Salesforce Values:**
- Trust
- Customer success
- Innovation
- Equality
- Sustainability

### Part 5: Indian Product Companies

**Flipkart:**
- **"How do you handle high-pressure situations?"**
- **"Describe a time you optimized for scale."**
- **"Tell me about a time you had to make quick decisions."**

**Swiggy:**
- **"How do you handle real-time system issues?"**
- **"Describe a time you improved user experience."**
- **"Tell me about a time you worked with cross-functional teams."**

**Cred:**
- **"How do you approach risk assessment?"**
- **"Describe a time you had to balance business and technical needs."**
- **"How do you ensure data-driven decisions?"**

**OYO:**
- **"How do you approach A/B testing?"**
- **"Describe a time you had to pivot quickly."**
- **"How do you optimize for mobile-first experiences?"**

## Interview Tips
- Research company values and recent news
- Prepare company-specific examples
- Align your stories with their culture
- Show understanding of their business model
- Demonstrate knowledge of their products`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Company-Specific Interview Prep",
              problemUrl: "https://codesandbox.io/s/company-specific-interview-prep",
              difficulty: "EASY",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Salary Negotiation & Career",
          slug: "salary-negotiation-career",
          description: "Master salary negotiation, offer evaluation, and career progression",
          orderIndex: 4,
          difficultyLevel: "MEDIUM",
          estimatedHours: 2,
          lessons: [
            {
              title: "Salary Negotiation Basics",
              slug: "salary-negotiation-basics",
              description: "Learn negotiation strategies and tactics",
              orderIndex: 1,
              difficulty: "MEDIUM",
              videoUrl: "https://example.com/behav-4-1-video",
              videoDurationSec: 900,
              markdownContent: `# Salary Negotiation Basics

## Learning Objectives
- Research market rates
- Negotiate confidently
- Understand total compensation
- Evaluate offers effectively

## Content

### Part 1: Know Your Value

**Factors affecting salary:**
- Years of experience: 3 years = entry-level
- Location: Bangalore > Tier-2 cities
- Company size: FAANG > startups
- Role level: Junior/Mid/Senior
- Technical skills: In-demand stack
- Negotiation skill: Often 20% difference

### Part 2: Research Market Rates

**For 3 years exp, frontend, India:**
\`\`\`
Startup: ₹15-20 LPA
Series B/C: ₹20-25 LPA
Mid-size: ₹22-28 LPA
Large company: ₹25-35 LPA
FAANG: ₹30-45 LPA
\`\`\`

**Research sources:**
- Levels.fyi
- Blind (anonymous)
- Glassdoor
- LinkedIn (job postings)
- Friends & network

### Part 3: Negotiation Strategy

**Before negotiating:**
\`\`\`
1. Get written offer
2. Research market rate
3. Know your walk-away price
4. Understand total comp (not just base)
5. Don't mention current salary
\`\`\`

**During negotiation:**
\`\`\`
1. Thank them for offer
2. Express enthusiasm for role
3. Explain your research
4. Propose counteroffer with reasoning
5. Listen to their response
6. Negotiate on multiple axes
\`\`\`

**What to negotiate:**
- Base salary
- Sign-on bonus
- Equity/RSUs
- Relocation bonus
- PTO
- Work from home
- Title

### Part 4: Evaluating Multiple Offers

Create comparison matrix:

\`\`\`
Factor               | Company A | Company B
------------------|-----------|-----------
Base Salary          | ₹28 LPA   | ₹25 LPA
Sign-on              | ₹2L       | ₹0
Equity (4yr vesting) | ₹4L/year  | ₹6L/year
Growth opportunity   | High      | Medium
Work culture         | Great     | Good
Learning             | High      | Medium
Commute             | 30 min    | 10 min

Total Comp (Y1)      | ₹32L      | ₹31L
\`\`\`

## Interview Tips
- Know your market value
- Be prepared to walk away
- Focus on total compensation
- Use data to support your ask
- Consider non-monetary benefits`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Salary Negotiation Simulator",
              problemUrl: "https://codesandbox.io/s/salary-negotiation-simulator",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Evaluating Offers Beyond Salary",
          slug: "evaluating-offers-beyond-salary",
          description: "Look beyond salary to make the right career choice",
          orderIndex: 2,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/behav-4-2-video",
          videoDurationSec: 900,
          markdownContent: `# Evaluating Offers Beyond Salary

## Learning Objectives
- Consider total package
- Evaluate growth opportunities
- Assess company stability
- Make informed career decisions

## Content

### Part 1: Factors Beyond Money

**1. Learning Opportunity:**
- New tech stack?
- Larger scale?
- Better engineers?
- Mentorship?
- Career growth?

**2. Company Stability:**
- Profitable?
- Funded?
- Market position?
- Growth trajectory?

**3. Work Environment:**
- Team culture?
- Management quality?
- Work-life balance?
- Remote policy?

**4. Career Trajectory:**
- Promotion path?
- Role growth?
- Internal mobility?
- Reputation?

**5. Location & Commute:**
- Office location?
- Remote options?
- Commute time?

### Part 2: Decision Framework

**Questions to ask yourself:**
1. Will I grow as engineer here?
2. Is this team strong?
3. Will this look good on my resume?
4. Can I see myself here in 2-3 years?
5. Does this align with my long-term goals?

**Red Flags:**
- Unclear direction
- Toxic culture (glassdoor reviews)
- Constant turnover
- No growth path
- Unrealistic expectations
- Poor engineering practices

**Example Decision:**

**Offer A:** ₹35 LPA at FAANG, great team, cutting edge tech
**Offer B:** ₹28 LPA at mid-size company, stable tech, good culture, better work-life balance

**Analysis:** Choose based on your priorities - growth vs. stability vs. compensation

## Interview Tips
- Create decision matrix
- Research thoroughly
- Trust your instincts
- Consider long-term impact
- Don't be swayed by highest salary alone`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Offer Evaluation Framework",
              problemUrl: "https://codesandbox.io/s/offer-evaluation-framework",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        }
      ]
        }
      ]
    }
  ]
};