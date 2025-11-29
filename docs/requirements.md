# PrepKit - Product Requirement Document
## Complete Interview Preparation Platform for Software Engineers

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Status:** Active Development Planning  
**Product:** PrepKit - Interview Preparation Platform

---

## Executive Summary

**PrepKit** is a comprehensive, structured interview preparation SaaS platform designed specifically to help Indian and global software engineers crack competitive interviews at top tech companies. The platform combines curated content across DSA, Machine Coding, System Design, behavioral interviews, and other essential components needed for modern software engineering interviews.

### Vision
Democratize access to elite-level interview preparation through structured, expert-curated content that helps engineers systematically master all interview dimensions—from algorithms to system design to communication skills.

### Mission
Help every software engineer confidently prepare for and succeed in technical interviews through:
- **Structured Learning Paths** - Clear progression from fundamentals to advanced concepts
- **Multi-Modal Content** - Video lessons, markdown documentation, interactive examples
- **Practical Practice** - Integrated links to LeetCode, CodeSandbox for real implementation
- **Content Protection** - Enterprise-grade security ensuring content remains proprietary
- **Expert Guidance** - Content curated from successful FAANG and Indian product company interviewers

---

## Market Analysis & Opportunity

### Market Size & Growth
- **TAM (Total Addressable Market):** 2M+ engineers in India actively seeking interviews; 10M+ globally
- **Market Growth Rate:** Interview prep platforms growing 25-30% YoY
- **User Acquisition:** LeetCode has 26M+ developers; coding interview prep market valued at $2B+

### Competitor Landscape

| Competitor | Pricing | Strengths | Weaknesses | Market Position |
|---|---|---|---|---|
| **LeetCode** | $35-159/yr | Massive problem library, community, DSA focus | Limited video, no structural path, overwhelming UI | Market Leader (DSA) |
| **AlgoExpert** | $99-299/yr | High-quality DSA videos, clean UI | Only DSA-focused, limited machine coding | Strong (DSA only) |
| **InterviewBit** | $199-499/yr | Curated problems, mock interviews | Outdated UI, expensive, limited system design depth | Mid-tier |
| **Coding Ninjas** | $299-999/yr | IIT certification, bootcamp model | High price, bootcamp-heavy, less self-paced | Emerging |
| **Preplaced** | $599-1999/yr | 1:1 mentorship from MAANG engineers | Very expensive, not scalable, mentor-dependent | Premium Niche |
| **OfferGoose/Exponent** | $10-99/month | AI mocks, behavioral focus, career coaching | Limited DSA depth, AI can miss nuances | Growing (Behavioral) |

### PrepKit's Competitive Advantage
1. **Holistic Coverage** - Not just DSA; includes machine coding round, system design, behavioral, HR, and company-specific patterns
2. **Structured Pathways** - Clear learning progression vs. random problem browsing
3. **Affordability** - $99-299 annual pricing vs. competitors at $500-2000+
4. **Content Security** - Built-in DRM protection (watermarking, screenshot prevention, device restrictions)
5. **Vertical Integration** - All-in-one: learning + practice + tracking + feedback
6. **Indian-Focused** - Optimized for Indian product companies (Flipkart, Swiggy, Cred, etc.) + FAANG patterns
7. **Modern Tech Stack** - Next.js performance, fast content delivery, real-time updates

### Market Trends to Capitalize On
- **Machine Coding Rising** - Product companies prioritizing MCR over pure DSA
- **System Design Importance** - Even junior roles expecting system design basics
- **Behavioral + Technical** - 70% of hiring now includes behavioral assessment
- **Mobile-First Learning** - Preference for bite-sized, mobile-friendly lessons
- **Community Learning** - Peer review and shared experiences matter
- **AI Integration** - AI-powered mock interviews becoming standard expectation

---

## Product Vision & Goals

### Primary Goals (MVP)
1. **Structured Learning** - Help engineers complete a 12-16 week preparation roadmap
2. **Content Mastery** - Ensure learners achieve >80% topic coverage across DSA, machine coding, system design
3. **Practice Integration** - Seamless linking to LeetCode, CodeSandbox, real-world problems
4. **Secure Content** - Enterprise-grade protection preventing unauthorized sharing/piracy
5. **Sustainable Monetization** - Reach 1000+ paying users by Month 6, $100K+ MRR by Month 12

### Success Metrics
- **User Acquisition:** 5K+ registered users by Month 3; 15K+ by Month 6
- **Conversion Rate:** 8-12% of free users converting to paid (industry standard: 2-5%)
- **Retention:** 70%+ D7 retention, 40%+ D30 retention
- **Revenue:** $10K MRR by Month 3; $50K MRR by Month 6; $100K+ MRR by Month 12
- **NPS Score:** Target 50+ (measure via post-interview feedback surveys)
- **Completion Rate:** 50%+ of users completing core modules

---

## Content Structure & Curriculum

### Core Modules (Phase 1 - MVP)

#### 1. **Data Structures & Algorithms (DSA)** - 40% of prep time
**Duration:** 4-5 weeks | **Difficulty:** Beginner to Advanced | **Lessons:** 60-80

**Chapters:**
- Fundamentals (Complexity Analysis, Big O notation, Problem-Solving Patterns)
- Arrays & Strings (15 patterns, 40+ problems)
- Linked Lists (Manipulation, Two-pointers, Fast-slow pointers)
- Stack & Queue (Monotonic stacks, Sliding window, Deque patterns)
- Trees & Graphs (BFS/DFS, DP on Trees, Topological sort, Union-Find)
- Heaps & Priority Queues (K-way merge, Median finding)
- Hash Tables & Sets (Collision handling, Subset problems)
- Dynamic Programming (Knapsack, DP patterns, Matrix chain)
- Bit Manipulation & Math (Powers of 2, XOR tricks, Prime algorithms)

**Per Lesson Format:**
- 8-12 min video explanation with visual diagrams
- Markdown document covering theory + pseudocode + edge cases
- 2-3 curated LeetCode problems with difficulty progression
- Important notes tab with key patterns and mnemonic tips
- Common mistakes and optimization techniques

**Learning Path:** Easy → Medium → Hard with company-specific curations (Google, Microsoft, Amazon patterns separately)

---

#### 2. **Machine Coding Round** - 25% of prep time
**Duration:** 2-3 weeks | **Difficulty:** Intermediate to Advanced | **Lessons:** 25-35

**Chapters:**
- **Foundations** (Requirements engineering, API design, JSON/REST basics, OOP principles)
- **Frontend Machines** (React component design, State management, Form handling, Search/Filter/Sort UI)
- **Backend Services** (Service layer architecture, Database modeling, Transaction handling, Caching patterns)
- **Full-Stack Problems** (Authentication, Authorization, Real-time features, Rate limiting)
- **Company-Specific MCR**
  - Flipkart patterns (30-45 min, service layer focus)
  - Swiggy patterns (Real-time updates, geolocation)
  - Cred patterns (Payment integration, complex state)
  - Amazon patterns (Scalability focus)
  - Microsoft patterns (Design patterns, clean code)

**Per Lesson Format:**
- 15-20 min problem walkthrough video
- Complete problem statement (requirements, constraints, expected output format)
- Step-by-step approach breakdown (3-4 different solution levels)
- Full code solution with explanations (JavaScript/TypeScript)
- CodeSandbox embedded link for copy-paste and experimentation
- Common follow-ups and optimization discussions
- Production-ready considerations (error handling, logging, testing)

**Unique Feature:** Video shows real clock-time approach (90 min session broken into phases):
1. 15 min - Clarification & API design
2. 45 min - Core implementation
3. 20 min - Optimization & edge cases
4. 10 min - Q&A and discussion

---

#### 3. **System Design** - 20% of prep time
**Duration:** 2-3 weeks | **Difficulty:** Advanced | **Lessons:** 20-25

**Chapters:**
- **Fundamentals** (CAP theorem, Consistency models, Partitioning, Replication)
- **Core Concepts** (Load balancing, Caching layers, Database sharding, Message queues)
- **Design Patterns** (Saga pattern, CQRS, Event sourcing, Distributed transactions)
- **Scalability** (Horizontal vs. vertical, Rate limiting, Circuit breaker)
- **Real-World Systems**
  - URL Shortener (Bit.ly style)
  - Social Network Feed (Twitter/Instagram)
  - E-commerce Platform (Flipkart/Amazon)
  - Video Streaming (Netflix/YouTube)
  - Real-time Collaboration (Google Docs)
  - Distributed Cache (Redis at scale)

**Per Lesson Format:**
- 20-25 min comprehensive walkthrough
- System design diagram (architecture, data flow, components)
- Requirement breakdown with constraints (1M DAU, 1M QPS, etc.)
- Database choice rationale (SQL vs. NoSQL vs. Cache)
- API design and contract
- Scalability improvements and tradeoffs
- Discussion of alternatives and when to use them
- Company interview insights (how Google, Meta, Amazon approach it)

---

#### 4. **Behavioral & HR Rounds** - 10% of prep time
**Duration:** 1 week | **Difficulty:** Beginner to Intermediate | **Lessons:** 15-20

**Chapters:**
- **STAR Method** (Situation, Task, Action, Result storytelling)
- **Common Questions** (Tell me about yourself, Why us?, Failure stories)
- **Technical Leadership Stories** (Led a team, Code review feedback, Mentorship)
- **Handling Difficult Situations** (Conflict resolution, Giving bad news, Handling criticism)
- **Negotiation Basics** (Salary discussion, Offer evaluation, Counter-offer)
- **Company Culture Fit** (Research tips, Values alignment, Red flags to watch)

**Per Lesson Format:**
- 5-10 min video with example answer + annotations
- Transcript of good answer with commentary
- Common pitfalls and how to avoid them
- 3 variations of the same answer (brief, detailed, company-specific)
- Self-evaluation checklist (clarity, conciseness, impact)

---

#### 5. **Interview Formats & Preparation** - 5% of prep time
**Duration:** 1 week | **Difficulty:** Beginner | **Lessons:** 10-15

**Chapters:**
- **Phone Screening** (What to expect, Time management, Communication tips)
- **Online Assessment** (Proctored exams, HackerRank/CodeSignal patterns)
- **On-site Rounds** (Multiple rounds sequencing, Energy management, Lunch round tips)
- **Company-Specific Processes**
  - FAANG patterns (Google, Facebook, Amazon, Netflix, Apple interview loops)
  - Indian Product Companies (Flipkart, Swiggy, OYO, Cred, Dream11)
- **Mock Interview Tips** (How to practice effectively, Recording & reviewing yourself)

---

### Content Architecture

```
PrepKit (Root)
├── Modules (5 core areas)
│   ├── DSA
│   │   ├── Chapters (9 major topics)
│   │   │   ├── Lessons (6-8 per chapter)
│   │   │   │   ├── Video (8-12 min)
│   │   │   │   ├── Markdown Notes
│   │   │   │   ├── Practice Links (LeetCode)
│   │   │   │   ├── Notes (important points, patterns)
│   │   │   │   └── Resources (external links)
│   │   │   └── Quiz/Assessment (optional for Phase 2)
│   │   └── Progress Tracking
│   ├── Machine Coding
│   │   ├── Chapters (company-specific + patterns)
│   │   │   ├── Lessons (25-35 total)
│   │   │   │   ├── Video (15-20 min)
│   │   │   │   ├── Problem Statement
│   │   │   │   ├── Solution Code
│   │   │   │   ├── CodeSandbox Link
│   │   │   │   ├── Discussion/Follow-ups
│   │   │   │   └── Key Learnings
│   │   └── Progress Tracking
│   ├── System Design
│   ├── Behavioral
│   └── Interview Formats
├── Learning Paths (Roadmaps)
│   ├── 4-Week Express Path (quick refresher)
│   ├── 12-Week Complete Path (beginner to advanced)
│   ├── 16-Week Deep Dive Path (mastery level)
│   └── Company-Specific Paths (Facebook, Google, Amazon, Flipkart, etc.)
├── Practice Tracking
│   ├── Problem Completion
│   ├── Topic Mastery % 
│   ├── Time Spent
│   └── Performance Metrics
└── Resources & External Links
    ├── LeetCode Company-specific problems
    ├── CodeSandbox templates
    ├── Interview resources
    └── Follow-up learning materials
```

---

## Product Features & User Experience

### 1. **Authentication & User Management**

**Sign Up/Login:**
- Email + Password (simple initial approach)
- Future: Google OAuth, GitHub OAuth for quick signup
- Email verification required
- Secure password reset flow
- Session management (JWT tokens, refresh token rotation)

**User Roles:**
- **Admin** (yourself): Full access to content creation, user management, payment settings
- **User** (learner): Access based on subscription tier (free vs. paid)

**User Profile:**
- Name, email, target companies, interview date, experience level
- Preferred programming language (JavaScript, Python, Java, C++)
- Learning preferences (prefer videos, markdown, or mixed)

---

### 2. **Pricing & Payment Model**

#### Pricing Strategy

**Free Tier:**
- 3-5 free lessons from each module (sampler content)
- No chapter/lesson videos
- No LeetCode integration
- Goal: Demonstrate quality, drive paid conversion
- Unlimited access (no expiration)

**Paid Tier Options:**

| Plan | Duration | Price (INR) | Price (USD) | Features | Target User |
|---|---|---|---|---|---|
| **Monthly** | 1 month | ₹499 | $6 | Full access to all content + updates | Try-before-commit |
| **Quarterly** | 3 months | ₹1,299 | $16 | Full access + email support | Active interviewer (immediate) |
| **Yearly** | 12 months | ₹3,999 | $48 | Full access + updates + lifetime access to paid content | Serious learner |
| **Lifetime** | Forever | ₹9,999 | $120 | Permanent access + all future content additions | Professional reference |

**Pricing Rationale:**
- Yearly plan = 33% discount vs. monthly (incentivize commitment)
- Lifetime = ~2.5x yearly (high barrier but good for revenue + eliminates churn concerns)
- USD pricing for global market (1 USD = 82 INR approx)
- Positioned between cheap (₹199-499) DIY platforms and expensive (₹10K+) bootcamps

**Payment Processing:**
- **Primary:** Razorpay (best for India, supports INR + USD, easy setup)
- **Secondary:** Stripe (for international customers USD payments)
- Automated invoicing and receipts
- Subscription management (pause, resume, cancel)

**Upsell Opportunities (Future):**
- Mock Interview Sessions with AI (₹499 for 5 sessions)
- Personalized Feedback from Mentors (₹2999/month)
- 1:1 Coaching Calls (₹499 per session)
- Resume Review + Interview Prep Bundle (₹4999)

---

### 3. **Core UI/UX - Lesson Viewer Layout**

#### Dashboard (First view after login)
```
┌─────────────────────────────────────────────────────────────────┐
│ PrepKit Logo    [ Search ]  [ Settings ]  [ Account ]  [ Logout] │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Left Sidebar (Fixed)      │ Main Content Area (Flex)             │
├─────────────────────────┼─────────────────────────────────────────┤
│                         │                                         │
│ CHAPTERS                │ SELECTED LESSON VIEWER                  │
│ ├─ DSA                  │                                         │
│ │ ├─ Arrays            │ 📄 Markdown Tab  | 🎥 Video Tab        │
│ │ ├─ Linked Lists      │ 📝 Notes Tab     | 💻 Practice Tab     │
│ │ ├─ Stack & Queue     │                                         │
│ │ └─ [More...]         │ ┌─────────────────────────────────────┐ │
│ ├─ Machine Coding       │ │ [Currently viewing: Markdown]       │ │
│ │ ├─ Frontend MCR       │ ├─────────────────────────────────────┤ │
│ │ ├─ Backend MCR        │ │ # Arrays - Introduction              │ │
│ │ └─ [More...]         │ │ ## What is an Array?                 │ │
│ ├─ System Design        │ │ An array is a contiguous memory...   │ │
│ │ ├─ Fundamentals       │ │ ```javascript                        │ │
│ │ ├─ Design Patterns    │ │ const arr = [1, 2, 3];              │ │
│ │ └─ [More...]         │ │ ```                                  │ │
│ ├─ Behavioral           │ │ [Content continues...]              │ │
│ └─ Interview Formats    │ └─────────────────────────────────────┘ │
│                         │                                         │
│ ▶️ Learning Path        │ [Scroll through markdown content]      │
│ (Roadmap)               │                                         │
│                         │ [LeetCode Link]  [CodeSandbox Link]    │
│                         │                                         │
│ ⬜ Progress: 34%        │ [Mark as Complete]  [Leave Feedback]   │
│                         │                                         │
└─────────────────────────┴─────────────────────────────────────────┘
```

#### Lesson Viewer (Multiple Tab Interface)

**Tab 1: Markdown Document (Default)**
- Full markdown content with syntax highlighting
- Embedded code examples
- Links to external resources (LeetCode problems, articles)
- Cannot be copied/selected (CSS user-select: none with JS enforcement)
- Watermarked background with user ID (visual deterrent)

**Tab 2: Video**
- Embedded video player (HLS streaming with DRM for sensitive content)
- 1.25x, 1.5x, 2x playback speeds
- Auto-scroll to corresponding section in markdown as video plays
- Timestamp-based notes ("Note at 5:23 - Pay attention to...")
- Video controls: Play/pause, chapter markers, quality selection
- **Video Restrictions:**
  - No right-click download
  - No screen recording detection (JS + browser API detection)
  - Watermark overlay (username + timestamp every 15 seconds, optional)
  - Device restriction (limit to 2 devices per account)

**Tab 3: Notes (Crowdsourced + Curated)**
- **Important Points:** Bullet-list of key takeaways per lesson
- **Common Mistakes:** Top 3-5 mistakes users make
- **Quick Reference:** Formulas, syntax reminders, cheat sheet
- **LeetCode Links:** Curated 3-5 problem links to practice immediately
- **CodeSandbox Links:** For machine coding, embedded React/Node templates
- **External Resources:** Medium articles, GitHub repos, related concepts

**Tab 4: Practice**
- **Problem Set:** Show 2-5 recommended problems for this topic
- **Difficulty Filter:** Easy, Medium, Hard
- **External Links:**
  - LeetCode (direct URL with topic filter pre-applied)
  - CodeSandbox (pre-loaded template for MCR lessons)
  - AlgoExpert (if same topic covered)
  - HackerRank (coding practice)
- **Time Estimates:** "Avg. time to solve: 15-20 min"
- **Completion Tracking:** "You solved X/Y problems from this lesson"

#### Sidebar Navigation (Left)

**Expandable Chapter List:**
- Courses shown as collapsible sections (DSA, Machine Coding, etc.)
- Each chapter expandable to show lessons
- Visual indicators:
  - ✅ Green checkmark = lesson completed
  - ⭕ Grey circle = not started
  - ⏳ Orange timer = in progress
- Clicking lesson = loads it in main content area
- Progress % per chapter displayed

**Learning Path Selector:**
- Dropdown: "Choose Your Path"
  - 4-Week Express
  - 12-Week Complete Path (default, highlighted)
  - 16-Week Deep Dive
  - Company-Specific (Google, Meta, Amazon, Flipkart, etc.)
- Current path shown with % completion

**Progress Dashboard (Mini):**
- Overall Completion: 34%
- Current Module: Machine Coding (62% done)
- This Week: 8 lessons, 12 hours
- Next Milestone: Reach 50% DSA (3 chapters left)

---

### 4. **Content Protection & Anti-Piracy (Critical)**

**Goal:** Prevent unauthorized sharing, recording, copying of paid content

#### Technical Measures

**Video Protection:**
- **Streaming:** HLS encryption + DASH with DRM (Widevine/PlayReady-grade encryption)
- **Screenshot Detection:** JavaScript detection of screen capture attempts; warning + pause video
- **Recording Prevention:** CSS + JS prevent recording API usage; detect screen recording tools
- **Device Restriction:** Max 2 devices per account; login elsewhere = automatic previous session logout
- **Expiration:** Daily token refresh; force re-login every 30 days

**Document Protection:**
- **CSS User-Select Disabled:** `user-select: none` + `-webkit-user-select: none` on markdown content
- **Copy Prevention:** JavaScript intercept Ctrl+C, Cmd+C; show toast "Content copying disabled"
- **Right-Click Disabled:** Prevent inspect element on content divs
- **Screenshot Detection:** Monitor for PrintScreen key, browser dev tools; visual warning
- **Watermarking:** Subtle watermark background with username + timestamp (rotate position)

**Print Prevention:**
- `@media print { body { display: none; } }` CSS rule
- Browser print dialog shows "Printing is disabled for this content"

**Account Security:**
- IP-based anomaly detection (login from different country = verification email)
- Device fingerprinting (browser + OS combination; change = re-verification)
- Session timeout after 2 hours of inactivity
- Enforce HTTPS only; no HTTP fallback

#### Legal Measures
- **Terms of Service:** Clear prohibition on sharing, recording, screen capture
- **Copyright Notice:** ©PrepKit 2025. All content proprietary and copyrighted.
- **DMCA Compliance:** Counter-notice process for pirated content takedowns
- **Watermark Matching:** Watermark on any leaked content = trace to account holder

#### Monitoring & Detection
- **Anomaly Detection:** Unusual access patterns (multiple IPs, suspicious device patterns)
- **Piracy Scanning:** Periodic scanning of known piracy sites for PrepKit content
- **Account Suspension:** Automatic suspension on 2 strikes (suspicious activity detected)
- **Refund Policy:** No refund if content used for piracy

---

### 5. **Admin Panel** (For You - Founder)

**Dashboard:**
- Key Metrics (Users, MRR, Churn, Conversion rate)
- Revenue Chart (last 7, 30, 90 days)
- New Signups & Paid Conversions
- Top Performing Content (most viewed lessons)
- User Engagement (lesson completion rate, time spent)

**Content Management:**
- Create/Edit/Delete Chapters and Lessons
- Upload Video (auto-convert to HLS, apply watermark, DRM)
- Edit Markdown Content with live preview
- Batch Upload (CSV import of lesson metadata)
- Version Control (track changes, rollback if needed)
- Publishing Workflow (draft → review → publish → archive)

**User Management:**
- View all users (email, signup date, subscription status, total spent)
- Churn Analysis (why users left)
- Manual Subscription Upgrade/Downgrade (admin override)
- Ban accounts for piracy/violation
- Export user data (CSV for analysis)

**Payment Management:**
- Revenue Dashboard (MRR, ARR, churn revenue)
- Refund Requests (manual approval/rejection)
- Razorpay Transaction Logs
- Pricing Experiments (A/B test different price points per cohort)

**Feedback & Analytics:**
- Feedback submissions from users
- Feature Requests (voting/prioritization)
- User Session Recordings (Clarity or Hotjar integration, optional)
- Heatmap of most-clicked elements
- Lesson Ratings & Reviews

---

## Technical Architecture

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router, Server Components)
- React 18+ (UI components)
- TypeScript (type safety)
- Tailwind CSS + shadcn/ui (design system, accessible components)
- Zustand or Context API (state management for user progress, filters)
- SWR or React Query (data fetching, caching, real-time updates)

**Backend:**
- Next.js API Routes (serverless functions)
- Node.js (runtime)
- Prisma ORM (type-safe database queries)
- PostgreSQL (database via Neon, free tier for MVP)

**Video Delivery:**
- AWS S3 (video storage)
- CloudFront CDN (distribution)
- HLS streaming (segmented, adaptive bitrate)
- AWS Lambda (video encoding on upload, convert to HLS)

**Payment:**
- Razorpay API (subscription management, webhooks)
- Stripe API (international USD payments)
- Backend webhook handlers for payment confirmations

**Authentication:**
- NextAuth.js (JWT + session management)
- Argon2 (password hashing, secure)

**Content Delivery & Performance:**
- Next.js Image Optimization
- Markdown parsing: `react-markdown` + `remark` plugins for syntax highlighting
- Code highlighting: Prism.js or Shiki

**Analytics:**
- Vercel Analytics (built-in, Next.js deployment)
- Posthog or Mixpanel (advanced user tracking, funnels, retention cohorts)
- Google Analytics 4 (funnel tracking)

**Security & DRM:**
- Encryption: TweetNaCl.js for client-side encryption (if needed)
- Device fingerprinting: FingerprintJS or TruValidate
- Screenshot/recording detection: custom JavaScript
- Watermarking: sharp library (image processing) + FFmpeg (video watermarking on backend)

**Deployment:**
- Vercel (Next.js hosting, serverless functions, built-in CI/CD)
- Neon (PostgreSQL, free tier, auto-scaling)
- Cloudflare (additional CDN layer, DDoS protection)

**Monitoring & Logging:**
- Sentry (error tracking)
- LogRocket (session replay, user behavior)
- Pino or Winston (application logging)

---

### Database Schema (Core Tables)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role ENUM('admin', 'user'),
  target_companies TEXT[],
  experience_level ENUM('fresher', 'junior', 'mid', 'senior'),
  preferred_language VARCHAR(50),
  subscription_status ENUM('free', 'active', 'expired', 'cancelled'),
  subscription_plan VARCHAR(50),
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters
CREATE TABLE chapters (
  id UUID PRIMARY KEY,
  module_id UUID REFERENCES modules(id),
  title VARCHAR(255),
  description TEXT,
  order_index INT,
  difficulty_level ENUM('beginner', 'intermediate', 'advanced'),
  estimated_hours INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  chapter_id UUID REFERENCES chapters(id),
  title VARCHAR(255),
  description TEXT,
  order_index INT,
  video_url VARCHAR(500),
  markdown_content TEXT,
  duration_minutes INT,
  difficulty_level ENUM('easy', 'medium', 'hard'),
  published_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  time_spent_seconds INT,
  video_watched_percentage INT,
  markdown_read BOOLEAN,
  rating INT (1-5),
  notes TEXT,
  UNIQUE(user_id, lesson_id)
);

-- Practice Links
CREATE TABLE practice_links (
  id UUID PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id),
  platform ENUM('leetcode', 'codesandbox', 'algoexpert', 'hackerrank'),
  problem_title VARCHAR(255),
  problem_url VARCHAR(500),
  difficulty ENUM('easy', 'medium', 'hard'),
  order_index INT,
  created_at TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan VARCHAR(50),
  status ENUM('active', 'cancelled', 'expired'),
  razorpay_subscription_id VARCHAR(255),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  amount_paid INT (in paise),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  rating INT (1-5),
  comment TEXT,
  type ENUM('bug', 'suggestion', 'general'),
  created_at TIMESTAMP
);
```

---

## Go-to-Market & Monetization Strategy

### Phase 1: MVP Launch (Month 1-2)
**Focus:** Validate product-market fit, build initial user base

**Launch Strategy:**
1. **Soft Launch** (Private Beta)
   - 50-100 beta users (friends, network, Twitter followers)
   - Free access in exchange for feedback
   - Weekly feedback sessions
   - Document pain points, iterate rapidly

2. **Hard Launch**
   - ProductHunt launch (target: 1st page, 200+ upvotes)
   - Twitter/LinkedIn announcement (tech influencers in interview prep space)
   - Reddit (r/learnprogramming, r/leetcode, r/indianjobs, r/cscareerquestions)
   - IndianStartups, Dev community forums

3. **Content Marketing**
   - Blog: "12-Week Interview Prep Roadmap", "Machine Coding Patterns", "System Design Guide"
   - YouTube: Teasers of top lessons (free)
   - Twitter threads on interview prep (threading engagement → follow → conversion)

4. **Pricing Offer (First Month)**
   - Early bird: 50% off yearly plan (₹1,999 for ₹3,999 plan)
   - Expires in 7 days (urgency)
   - Goal: Get 100 paying users

### Phase 2: Growth (Month 3-6)
**Focus:** Acquire 10K+ users, reach $50K MRR

**User Acquisition:**
1. **SEO/Organic**
   - Target keywords: "DSA interview prep", "machine coding round", "system design interview"
   - Blog content: Long-form guides (3000+ words)
   - Expected: 50-100 organic users/month by Month 4

2. **Paid Ads** (Controlled spend)
   - Google Ads: Interview-related keywords
   - Facebook/Instagram ads targeting software engineers
   - LinkedIn ads (higher CPC, good for B2C2B)
   - Budget: $2000-5000/month; measure CAC (Customer Acquisition Cost)

3. **Partnerships & Referrals**
   - Affiliate program: Users get ₹300 credit per successful referral
   - Partnership with bootcamps/colleges (bulk discounts)
   - Placement agencies (refer candidates preparing for interviews)

4. **Community Building**
   - Discord community (free members welcome, exclusive content for paid)
   - Weekly mock interview sessions (host on Discord)
   - Leaderboard (points for lesson completion, engagement)
   - Monthly webinar: "Interview Success Stories" + Q&A

### Phase 3: Scale (Month 6-12)
**Focus:** Reach 50K+ users, $100K+ MRR, establish brand leadership

**Strategy:**
1. **Product Expansion**
   - Add mock interview feature with AI (partner with OpenAI)
   - 1:1 mentorship marketplace (share revenue with mentors from FAANG)
   - Company-specific interview guides (Google, Microsoft, Amazon, Flipkart deep dives)
   - Mobile app (React Native for iOS/Android)

2. **Market Expansion**
   - International marketing (US, Canada, EU)
   - Localization (Hindi content for Indian market, Spanish, etc.)
   - B2B: Offer bulk licenses to companies for employee upskilling

3. **Strategic Partnerships**
   - LeetCode API integration (show your solved problems in PrepKit)
   - CodeSignal integration (take mock exams within PrepKit)
   - University partnerships (offer to CS departments at discounted rates)

---

## Monetization Model

### Revenue Streams

| Stream | % of Revenue | Effort | Scalability |
|--------|---|---|---|
| **Subscription (Yearly Plan)** | 70% | Low | High |
| **Subscription (Monthly Plan)** | 20% | Low | High |
| **Mock Interviews (AI)** | 5% | Medium | High |
| **Mentorship Commission** | 3% | Medium | High |
| **B2B/Corporate Licenses** | 2% | High | Medium |

### Unit Economics (Target)
- **CAC (Customer Acquisition Cost):** ₹200-300 per user
- **LTV (Lifetime Value):** ₹3,500-5,000 per user (average user retention: 12 months)
- **LTV:CAC Ratio:** 12:1 to 17:1 (healthy SaaS = >3:1)
- **Gross Margin:** 85-90% (content digital, hosting costs low)
- **Churn Rate:** Target 5-8% monthly (industry avg: 10-15%)

---

## Risk Analysis & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|---|---|---|
| **Content Piracy** | High | High | DRM encryption, watermarking, legal enforcement, monitor darkweb |
| **Competition from LeetCode, Codeforces** | Very High | Medium | Focus on holistic coverage (not just DSA), better UX, community |
| **Low Conversion Rate** | Medium | High | A/B test pricing, improve free-to-paid funnel, better onboarding |
| **High Churn** | Medium | Medium | Regular content updates, community engagement, success metrics |
| **Regulatory (GST, Tax)** | Medium | Low | Consult CA early, automate GST invoicing via Razorpay |
| **Payment Processing Issues** | Low | Medium | Have Stripe as backup; test payment flow thoroughly |
| **Scaling Database** | Low | Medium | Use Neon's auto-scaling; migrate to RDS if needed |

---

## Success Metrics & KPIs

### Product Metrics
- **Lessons Completed:** % of users completing at least 50% of DSA module
- **Video Watch Time:** Avg. minutes watched per user per week
- **Problem Solved:** Avg. LeetCode problems linked per user per week
- **Lesson Rating:** Average rating (>4.0/5 target)

### Business Metrics
- **Monthly Active Users (MAU):** Month 1: 1K → Month 6: 10K → Year 1: 50K
- **Conversion Rate:** % of free users → paid (Target: 8-12%)
- **Monthly Recurring Revenue (MRR):** Month 1: $500 → Month 6: $5K → Year 1: $10K
- **Customer Lifetime Value (LTV):** Average total revenue per user
- **Churn Rate:** % of users canceling per month (Target: <8%)
- **Net Retention Rate:** (MRR_end - churn + expansion) / MRR_start (Target: >100%)

### User Acquisition Metrics
- **CAC (Cost Acquisition):** Total marketing spend / new customers
- **CAC Payback Period:** Months to recover CAC from user revenue
- **Viral Coefficient:** Referrals generated per user (Target: >1.2)

---

## Roadmap & Timeline

### MVP (Current → Month 2)
- [x] Core content (DSA - 70%, MCR - 50%)
- [ ] Auth system (signup, login, password reset)
- [ ] Payment integration (Razorpay)
- [ ] Video delivery (HLS + basic DRM)
- [ ] Lesson viewer (markdown, video, links tabs)
- [ ] Admin panel (basic CRUD)
- [ ] Content protection (watermarking, screenshot blocking)
- [ ] Launch on ProductHunt + social media

### Phase 2 (Month 3-4)
- [ ] Complete DSA, MCR, System Design content (100% coverage)
- [ ] Admin panel enhancements (analytics, user management)
- [ ] Community features (Discord integration, Discord bot)
- [ ] Email campaigns (onboarding, re-engagement)
- [ ] Mobile-responsive design improvements
- [ ] SEO optimization & blog launch

### Phase 3 (Month 5-6)
- [ ] AI mock interviews (OpenAI integration, user feedback loop)
- [ ] Mentorship marketplace (1:1 sessions)
- [ ] Company-specific interview guides (detailed walkthroughs)
- [ ] Advanced analytics (cohort analysis, retention curves)
- [ ] Performance optimization (page load time <2s)
- [ ] International pricing & support (USD, EUR)

### Phase 4 (Month 7-12)
- [ ] Mobile app (React Native)
- [ ] Video course bundles (DSA + System Design combo, ₹6,999)
- [ ] B2B licensing (companies bulk purchase for teams)
- [ ] Advanced DRM (Widevine, PlayReady integration)
- [ ] Live group sessions (weekly Q&A with founder)
- [ ] Certification program (badge upon completion of full roadmap)

---

## What NOT to Build (Scope Creep Prevention)

❌ **Avoid Initially:**
- Live coding classes (high operational overhead, doesn't scale)
- 1:1 personalized coaching (not scalable, requires hiring)
- Job board/placement service (different business model, distracting)
- Mobile app (defer to post-MVP; web is sufficient)
- AI tutors/chatbots (not core value; defer to Phase 3)
- Certification prep (FAANG-specific interviews first; general certs later)
- Gamification (leaderboards, badges) - nice to have, not core
- Offline mode/downloadable content (adds complexity, doesn't justify MVP)
- Multiple language support (English first; Hindi/localization later)

---

## Financial Projections (Conservative)

### Year 1 Assumptions
- Avg. user acquisition: 1K Month 1 → 5K Month 6 → 15K Year 1
- Conversion rate: 8% (free → paid)
- Avg. revenue per user: ₹2,500/year (mix of monthly/yearly plans)
- Churn rate: 5% monthly

### Conservative Scenario
| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Registered Users | 1,000 | 5,000 | 15,000 | 50,000 |
| Paid Users | 80 | 400 | 1,200 | 4,000 |
| MRR | ₹15,000 ($180) | ₹75,000 ($900) | ₹2,25,000 ($2,700) | ₹8,00,000 ($9,600) |
| ARR | - | - | - | ₹96,00,000 ($115K) |
| CAC | ₹300 | ₹300 | ₹250 | ₹200 |
| LTV | ₹3,000 | ₹3,500 | ₹4,000 | ₹5,000 |

### Optimistic Scenario
| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Registered Users | 2,000 | 10,000 | 30,000 | 1,00,000 |
| Paid Users | 200 | 1,000 | 3,000 | 12,000 |
| MRR | ₹50,000 ($600) | ₹2,50,000 ($3,000) | ₹7,50,000 ($9,000) | ₹3,00,00,000 ($36K) |
| ARR | - | - | - | ₹3,60,00,000 ($432K) |
| CAC | ₹200 | ₹200 | ₹200 | ₹150 |
| LTV | ₹4,000 | ₹5,000 | ₹6,000 | ₹8,000 |

---

## Conclusion

**PrepKit** is positioned to capture the growing market for interview preparation by offering a comprehensive, structured, and secure platform that goes beyond traditional DSA-focused sites. By combining rigorous content curation, multiple learning modalities, and robust content protection, PrepKit will help thousands of software engineers crack their dream jobs while building a sustainable, profitable SaaS business.

**Success Factors:**
1. ✅ **Content Quality** - Curated from real interview experiences at FAANG and Indian product companies
2. ✅ **Holistic Coverage** - DSA + Machine Coding + System Design + Behavioral (not siloed)
3. ✅ **User Experience** - Intuitive, distraction-free learning platform
4. ✅ **Content Security** - Industry-leading DRM to prevent piracy
5. ✅ **Affordability** - 50-70% cheaper than competitors; accessible to Indian engineers
6. ✅ **Scalability** - Serverless architecture, can grow to 1M+ users without major refactoring
7. ✅ **Founder Advantage** - Built by someone (you) who has interviewed and been interviewed; authentic insights

**Next Steps:**
1. Validate market demand (launch beta, 50-100 users, get feedback)
2. Build MVP (4-6 weeks development)
3. Iterate on content and UX based on beta feedback
4. Launch publicly (Month 2, aim for ProductHunt top page)
5. Iterate on monetization and growth (Month 3-6)
6. Scale operations and expand team (Month 6+)

---

**Document Prepared:** November 29, 2025  
**Prepared By:** PrepKit Founding Team  
**Status:** Ready for Implementation  
**Next Review:** December 15, 2025 (Post Beta Testing)
