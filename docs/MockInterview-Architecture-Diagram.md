# Mock Interview Feature - Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Frontend]
        Setup[Interview Setup UI]
        Widget[Vapi Voice Widget]
        Reports[Report Display]
        History[Interview History]
    end

    subgraph "API Layer"
        API[Next.js API Routes]
        Auth[Authentication Middleware]
        Rate[Rate Limiting]
        Security[Security Middleware]
    end

    subgraph "Service Layer"
        Interview[Interview Service]
        Gemini[Gemini Service]
        Vapi[Vapi Service]
        Payment[Payment Service]
        Report[Report Service]
        Cache[Cache Service]
    end

    subgraph "External APIs"
        GeminiAPI[Google Gemini API]
        VapiAPI[Vapi AI API]
        Razorpay[Razorpay API]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
        Redis[(Redis Cache)]
        S3[(AWS S3 Storage)]
    end

    UI --> API
    Setup --> API
    Widget --> API
    Reports --> API
    History --> API

    API --> Auth
    API --> Rate
    API --> Security

    API --> Interview
    API --> Payment
    API --> Report

    Interview --> Gemini
    Interview --> Vapi
    Report --> Gemini
    Payment --> Razorpay

    Gemini --> GeminiAPI
    Vapi --> VapiAPI

    Interview --> DB
    Report --> DB
    Payment --> DB
    Interview --> Redis
    Vapi --> S3

    GeminiAPI -.->|Questions| Interview
    GeminiAPI -.->|Reports| Report
    VapiAPI -.->|Voice Calls| Vapi
    VapiAPI -.->|Webhooks| Vapi
    Razorpay -.->|Payment Processing| Payment
```

## User Journey Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Gemini
    participant Vapi
    participant DB
    participant Payment

    User->>Frontend: Start Mock Interview
    Frontend->>API: POST /api/interviews/setup
    API->>Gemini: Generate Questions
    Gemini-->>API: Questions Generated
    API->>DB: Save Interview Session
    API-->>Frontend: Session ID + Pricing
    Frontend->>User: Show Payment Screen
    User->>Payment: Complete Payment
    Payment-->>API: Payment Confirmation
    API->>DB: Update Payment Status
    Frontend->>API: POST /api/interviews/{id}/start
    API->>Vapi: Create Voice Call
    Vapi-->>API: Call ID + Webhook URL
    API-->>Frontend: Call Initiated
    Frontend->>User: Show Voice Widget
    User->>Vapi: Voice Interaction
    Vapi->>API: Webhook Events
    API->>DB: Update Session Status
    Vapi-->>API: Call Ended + Transcript
    API->>Gemini: Generate Report
    Gemini-->>API: Report Generated
    API->>DB: Save Report
    API-->>Frontend: Report Ready
    Frontend->>User: Display Report
```

## Database Schema Relationships

```mermaid
erDiagram
    User ||--o{ InterviewSession : creates
    User ||--o{ InterviewPayment : makes
    User ||--|| InterviewStatistics : has
    
    InterviewSession ||--o{ InterviewQuestion : contains
    InterviewSession ||--|| InterviewTranscript : has
    InterviewSession ||--|| InterviewReport : generates
    InterviewSession ||--|| InterviewPayment : requires
    
    InterviewQuestion {
        string id PK
        string sessionId FK
        int questionOrder
        string questionText
        int difficulty
        string expectedKeyPoints[]
        string userResponseText
        int responseScore
        boolean followUpAsked
    }
    
    InterviewSession {
        string id PK
        string userId FK
        string type
        string difficulty
        string status
        string vapiCallId
        datetime createdAt
        datetime startedAt
        datetime endedAt
        int durationSeconds
        json configuration
        json questionsGenerated
        boolean reportGenerated
        decimal costCalculated
    }
    
    InterviewTranscript {
        string id PK
        string sessionId FK
        string rawTranscript
        json transcriptSegments
        float confidenceScore
    }
    
    InterviewReport {
        string id PK
        string sessionId FK
        int overallScore
        json scoreBreakdown
        string strengths[]
        string weaknesses[]
        string recommendations[]
        json reportJson
    }
    
    InterviewPayment {
        string id PK
        string userId FK
        string sessionId FK
        decimal amount
        string currency
        string status
        string transactionId
    }
    
    InterviewStatistics {
        string id PK
        string userId FK
        int totalInterviews
        decimal totalSpent
        int averageScore
        int lastInterviewAt
    }
```

## API Endpoint Structure

```mermaid
graph LR
    subgraph "Interview API"
        Setup[POST /api/interviews/setup]
        Start[POST /api/interviews/{id}/start]
        Complete[POST /api/interviews/{id}/complete]
        Report[GET /api/interviews/{id}/report]
        History[GET /api/interviews/history]
        Delete[DELETE /api/interviews/{id}]
    end

    subgraph "Payment API"
        CreatePayment[POST /api/payments/interview/create]
        VerifyPayment[POST /api/payments/interview/verify]
    end

    subgraph "Webhook API"
        VapiWebhook[POST /api/webhooks/vapi]
    end

    Setup --> CreatePayment
    Start --> VapiWebhook
    Complete --> VapiWebhook
    VapiWebhook --> Report
```

## Component Architecture

```mermaid
graph TB
    subgraph "Frontend Components"
        SetupPage[Interview Setup Page]
        PaymentPage[Payment Page]
        InterviewPage[Interview Session Page]
        ReportPage[Report Page]
        HistoryPage[History Page]
    end

    subgraph "UI Components"
        TypeSelector[Interview Type Selector]
        DifficultySelector[Difficulty Selector]
        FocusAreaSelector[Focus Area Selector]
        VoiceWidget[Voice Interview Widget]
        ScoreDisplay[Score Display]
        FeedbackList[Feedback List]
        RecommendationCard[Recommendation Card]
    end

    subgraph "Service Components"
        QuestionGenerator[Question Generator]
        CallManager[Call Manager]
        ReportGenerator[Report Generator]
        PricingCalculator[Pricing Calculator]
        WebhookHandler[Webhook Handler]
        ErrorHandler[Error Handler]
    end

    SetupPage --> TypeSelector
    SetupPage --> DifficultySelector
    SetupPage --> FocusAreaSelector
    PaymentPage --> PricingCalculator
    InterviewPage --> VoiceWidget
    InterviewPage --> CallManager
    ReportPage --> ScoreDisplay
    ReportPage --> FeedbackList
    ReportPage --> RecommendationCard
    ReportPage --> ReportGenerator

    QuestionGenerator --> GeminiAPI
    CallManager --> VapiAPI
    ReportGenerator --> GeminiAPI
    WebhookHandler --> VapiAPI
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        Auth[Authentication Layer]
        AuthZ[Authorization Layer]
        RateLimit[Rate Limiting]
        InputValidation[Input Validation]
        WebhookSecurity[Webhook Security]
        DataEncryption[Data Encryption]
    end

    subgraph "Security Measures"
        JWT[JWT Tokens]
        CSRF[CSRF Protection]
        HMAC[HMAC Signature Verification]
        SQLInjection[SQL Injection Prevention]
        XSS[XSS Protection]
        RBAC[Role-Based Access Control]
    end

    Auth --> JWT
    AuthZ --> RBAC
    RateLimit --> CSRF
    InputValidation --> XSS
    InputValidation --> SQLInjection
    WebhookSecurity --> HMAC
    DataEncryption --> AES[ AES-256 Encryption ]
```

## Performance Optimization

```mermaid
graph LR
    subgraph "Caching Strategy"
        QuestionCache[Question Cache]
        ReportCache[Report Cache]
        UserStatsCache[User Stats Cache]
        SessionCache[Session Cache]
    end

    subgraph "Database Optimization"
        Indexes[Proper Indexes]
        QueryOptimization[Query Optimization]
        ConnectionPooling[Connection Pooling]
        ReadReplicas[Read Replicas]
    end

    subgraph "API Optimization"
        ResponseCompression[Response Compression]
        LazyLoading[Lazy Loading]
        Pagination[Pagination]
        BatchProcessing[Batch Processing]
    end

    QuestionCache --> Redis
    ReportCache --> Redis
    UserStatsCache --> Redis
    SessionCache --> Redis

    Indexes --> PostgreSQL
    QueryOptimization --> PostgreSQL
    ConnectionPooling --> PostgreSQL
    ReadReplicas --> PostgreSQL
```

## Error Handling Flow

```mermaid
flowchart TD
    Start[API Request] --> Validation{Input Validation}
    Validation -->|Invalid| ErrorResponse[Return 400 Error]
    Validation -->|Valid| AuthCheck{Authentication}
    AuthCheck -->|Failed| AuthError[Return 401 Error]
    AuthCheck -->|Success| RateLimitCheck{Rate Limit}
    RateLimitCheck -->|Exceeded| RateError[Return 429 Error]
    RateLimitCheck -->|Allowed| ProcessRequest[Process Request]
    
    ProcessRequest --> APIError{API Error?}
    APIError -->|Yes| LogError[Log Error]
    LogError --> Fallback{Fallback Available?}
    Fallback -->|Yes| UseFallback[Use Fallback Service]
    Fallback -->|No| ServerError[Return 500 Error]
    
    APIError -->|No| Success[Return Success Response]
    UseFallback --> Success
    
    Success --> MonitorMetrics[Monitor Performance]
    ErrorResponse --> MonitorMetrics
    AuthError --> MonitorMetrics
    RateError --> MonitorMetrics
    ServerError --> MonitorMetrics
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Load Balancer"
            LB[Application Load Balancer]
        end

        subgraph "Web Servers"
            Server1[Next.js Server 1]
            Server2[Next.js Server 2]
            Server3[Next.js Server 3]
        end

        subgraph "Database Cluster"
            PrimaryDB[(Primary PostgreSQL)]
            ReplicaDB1[(Replica 1)]
            ReplicaDB2[(Replica 2)]
        end

        subgraph "Cache Layer"
            RedisCluster[Redis Cluster]
        end

        subgraph "Storage"
            S3[AWS S3 Bucket]
        end

        subgraph "Monitoring"
            Logs[Log Aggregation]
            Metrics[Metrics Collection]
            Alerts[Alert System]
        end
    end

    LB --> Server1
    LB --> Server2
    LB --> Server3

    Server1 --> PrimaryDB
    Server2 --> PrimaryDB
    Server3 --> PrimaryDB

    PrimaryDB --> ReplicaDB1
    PrimaryDB --> ReplicaDB2

    Server1 --> RedisCluster
    Server2 --> RedisCluster
    Server3 --> RedisCluster

    Server1 --> S3
    Server2 --> S3
    Server3 --> S3

    Server1 --> Logs
    Server2 --> Logs
    Server3 --> Logs

    Server1 --> Metrics
    Server2 --> Metrics
    Server3 --> Metrics

    Metrics --> Alerts
    Logs --> Alerts
```

## Integration Points

```mermaid
graph LR
    subgraph "External Services"
        Gemini[Google Gemini API]
        Vapi[Vapi AI API]
        Razorpay[Razorpay Payment Gateway]
        Email[Email Service]
        SMS[SMS Service]
    end

    subgraph "Internal Services"
        Auth[NextAuth Service]
        DB[Database Service]
        Cache[Cache Service]
        Storage[Storage Service]
        Monitoring[Monitoring Service]
    end

    subgraph "Integration Methods"
        REST[REST APIs]
        Webhooks[Webhooks]
        SDK[SDKs]
        Queues[Message Queues]
    end

    Gemini --> REST
    Vapi --> REST
    Vapi --> Webhooks
    Razorpay --> REST
    Email --> SDK
    SMS --> SDK

    Auth --> REST
    DB --> REST
    Cache --> REST
    Storage --> REST
    Monitoring --> REST

    REST --> InternalServices
    Webhooks --> Queues