export const systemDesignModuleData = {
  chapters: [
    {
      title: "System Design Fundamentals",
      slug: "system-design-fundamentals",
      description: "Learn the building blocks of scalable systems",
      orderIndex: 1,
      difficultyLevel: "MEDIUM",
      estimatedHours: 10,
      lessons: [
        {
          title: "Scalability & Performance Basics",
          slug: "scalability-performance-basics",
          description: "Understand vertical vs horizontal scaling, performance metrics, and bottlenecks",
          orderIndex: 1,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-1-1-video",
          videoDurationSec: 900,
          markdownContent: `# Scalability & Performance Basics

## Learning Objectives
- Understand scalability concepts
- Know vertical vs horizontal scaling
- Master performance metrics
- Identify bottlenecks

## Content

### Part 1: Scalability Types

**Vertical Scaling (Scale Up):**
- Add more resources to single machine
- CPU, RAM, storage upgrades
- Easier to implement
- Hit ceiling quickly
- More expensive

**Horizontal Scaling (Scale Out):**
- Add more machines
- Distribute load across servers
- Unlimited growth potential
- More complex
- Better for large scale

### Part 2: Key Performance Metrics

**Latency (Response Time):**
- Time to get response
- Measure in ms
- Lower is better
- Target: <100ms for web

**Throughput:**
- Requests per second (RPS)
- Transactions per second (TPS)
- Higher is better
- Scale metric

**Availability:**
- Uptime percentage
- 99.9% = 43 minutes downtime/month
- 99.99% = 4 minutes downtime/month
- 99.999% = 26 seconds downtime/month

### Part 3: Identifying Bottlenecks

Common bottlenecks:
1. **Database:** Slow queries, no indexing
2. **Network:** Bandwidth limitations
3. **Application:** Inefficient code, memory leaks
4. **Disk I/O:** Slow disk operations
5. **CPU:** High computation

## Practice Problem

**Scenario:** API response: 5 seconds
Breaking it down:
- Database query: 3 seconds ← BOTTLENECK
- Network: 0.5 seconds
- Processing: 1 second
- Serialization: 0.5 seconds

**Solution:** Optimize database query

## Interview Tips
- Always identify bottleneck first
- Show measurement approach
- Propose solution with trade-offs
- Discuss before/after metrics

## Follow-up Questions
1. How would you measure performance?
2. What's the difference between vertical and horizontal scaling?
3. How do you handle database bottlenecks?`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Scalability Analysis",
              problemUrl: "https://codesandbox.io/s/scalability-analysis",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Load Balancing",
          slug: "load-balancing",
          description: "Design load balanced systems with different strategies",
          orderIndex: 2,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-1-2-video",
          videoDurationSec: 900,
          markdownContent: `# Load Balancing

## Learning Objectives
- Understand load balancing concepts
- Know distribution strategies
- Design load balanced system
- Understand challenges

## Content

### Part 1: Why Load Balancing?

Single server problems:
- Max 10,000 RPS capacity
- Single point of failure
- Can't handle spikes
- Easy DDoS target

Load balancer solution:
- Distributes traffic
- Handles 100,000+ RPS
- Fault tolerance
- Transparent to clients

### Part 2: Load Balancing Strategies

**Round Robin:**
\`\`\`
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1
\`\`\`
Simple, but ignores server capacity

**Least Connections:**
\`\`\`
Track active connections
Send to server with fewest connections
Better than round robin
\`\`\`

**IP Hash:**
\`\`\`
hash(client_ip) % num_servers
Same client always → same server
Good for sessions
\`\`\`

**Weighted:**
\`\`\`
Server 1: 50% of traffic
Server 2: 30% of traffic
Server 3: 20% of traffic
Based on server capacity
\`\`\`

### Part 3: Load Balancer Placement

\`\`\`
Clients → LB (Layer 4)
       → LB (Layer 7)
       → Servers
\`\`\`

**Layer 4 (TCP/UDP):**
- Fast, simple
- No understanding of protocol
- Good for throughput

**Layer 7 (HTTP/HTTPS):**
- Can route based on URL, headers
- More intelligent
- Slower but more flexible

## Practice Problem

Design load balancing for:
- 1 million concurrent users
- Video streaming service
- 10Gbps bandwidth per server

**Solution:**
\`\`\`
Multiple load balancers (HA)
→ Round robin between them
  → Layer 7 LB (HTTP level)
    → 100+ servers
    → Weighted by capacity
    
Monitor:
- Connections per LB
- Bandwidth utilization
- Response times
\`\`\`

## Interview Tips
- Discuss different algorithms
- Show understanding of layers
- Mention health checks
- Explain session affinity`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Load Balancer Design",
              problemUrl: "https://codesandbox.io/s/load-balancer-design",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Caching Strategies",
          slug: "caching-strategies",
          description: "Design multi-tier cache with proper invalidation",
          orderIndex: 3,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-1-3-video",
          videoDurationSec: 900,
          markdownContent: `# Caching Strategies

## Learning Objectives
- Understand caching layers
- Know cache strategies
- Design multi-tier cache
- Handle cache invalidation

## Content

### Part 1: Cache Layers

\`\`\`
User Request
    ↓
L1: Browser Cache (Browser)
    ↓
L2: CDN Cache (Edge servers)
    ↓
L3: Application Cache (Redis, Memcached)
    ↓
L4: Database Cache (Query result cache)
    ↓
L5: Disk (Persistent storage)
\`\`\`

**Browser Cache:**
- Stored locally in browser
- Control via HTTP headers
- Reduces requests to server

**CDN Cache:**
- Geographic distribution
- Copies content worldwide
- Dramatically reduces latency

**Application Cache:**
- In-memory cache (Redis, Memcached)
- Extremely fast (microseconds)
- Limited by memory

**Database Cache:**
- Query results cached
- Reduces database load
- Fast for read-heavy workloads

### Part 2: Cache Invalidation Strategies

**TTL (Time-To-Live):**
\`\`\`
Cache data for 5 minutes
After 5 minutes, fetch fresh data
Simple but data may be stale
\`\`\`

**Event-based Invalidation:**
\`\`\`
When data changes → invalidate cache
More complex to implement
Always fresh data
\`\`\`

**LRU (Least Recently Used):**
\`\`\`
When cache full, remove least used item
Common for fixed-size caches
\`\`\`

### Part 3: Caching Examples

**Example: Product Catalog**
\`\`\`
Products rarely change
Cache for 24 hours
When product updates → invalidate
Result: 99% cache hits
\`\`\`

**Example: User Profile**
\`\`\`
Profile changes frequently
Cache for 1 hour OR
Cache with event invalidation
Event: User updates profile → clear cache
\`\`\`

## Practice Problem

Design caching for YouTube:
- 1 billion videos
- Constantly changing view counts
- Popular videos: 1M views/day
- Unpopular videos: 1 view/day

**Solution:**
\`\`\`
Tier 1: Browser cache (30 min)
Tier 2: CDN cache (1 hour)
  - Popular videos: 1TB cache
  - Unpopular: not cached
Tier 3: Redis cache (view counts)
  - TTL: 5 minutes
Tier 4: Database (source of truth)

Hot data strategy:
- Popular videos → all tiers
- Unpopular videos → skip cache
- Smart pre-warming
\`\`\`

## Interview Tips
- Explain cache hierarchy
- Show invalidation trade-offs
- Discuss CDN benefits
- Mention cache warming strategies`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Cache Design",
              problemUrl: "https://codesandbox.io/s/cache-design",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Database Design",
          slug: "database-design",
          description: "Choose right database type, sharding, and replication",
          orderIndex: 4,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-1-4-video",
          videoDurationSec: 900,
          markdownContent: `# Database Design

## Learning Objectives
- Choose right database type
- Understand sharding strategies
- Know replication methods
- Design schema for scale

## Content

### Part 1: Database Types

**SQL (Relational):**
- PostgreSQL, MySQL, Oracle
- ACID transactions
- Complex queries
- Schema required
- Good for: Banking, ERP

**NoSQL (Document):**
- MongoDB, Firebase
- Flexible schema
- Horizontal scaling
- No joins
- Good for: Social media, User data

**Key-Value:**
- Redis, Memcached
- Blazingly fast
- Simple get/set
- In-memory
- Good for: Cache, Sessions

**Search:**
- Elasticsearch, Solr
- Full-text search
- Aggregations
- Distributed
- Good for: Search engines

**Time Series:**
- InfluxDB, Prometheus
- Optimized for metrics
- Time-based queries
- Good for: Monitoring

### Part 2: Sharding

**Problem:** Database too large for one server

**Solution: Sharding (Horizontal partitioning)**

\`\`\`
Users table (1 billion rows)
Split by user_id hash:

Shard 1: user_id % 10 == 0
Shard 2: user_id % 10 == 1
...
Shard 10: user_id % 10 == 9

Each shard: 100 million rows (manageable)
\`\`\`

**Sharding strategies:**

1. **Range-based:**
\`\`\`
Shard 1: user_id 0-999,999
Shard 2: user_id 1,000,000-1,999,999
Problem: Uneven distribution
\`\`\`

2. **Hash-based:**
\`\`\`
Shard = hash(user_id) % num_shards
Even distribution
But: resharding is hard
\`\`\`

3. **Directory-based:**
\`\`\`
Lookup table: user_id → shard_id
Most flexible
Extra lookup cost
\`\`\`

### Part 3: Replication

**Master-Slave Replication:**
\`\`\`
Master (Primary)
  ↓ (writes go here)
Slave1 (Replica)
Slave2 (Replica)
  ↑ (reads come from here)
\`\`\`

Benefits:
- High availability
- Read scalability
- Backup

**Multi-Master Replication:**
\`\`\`
Master1 ← sync → Master2
  ↓            ↓
Slave1        Slave2
\`\`\`

Complex but:
- Both can write
- No single point of failure
- More challenging consistency

## Practice Problem

Shard a user database:
- 1 billion users
- Max 100M per shard
- Need 10 shards

**Challenge:** user_id 1,000,000 moves servers

**Solution:**
- Hash-based sharding with consistent hashing
- Allows gradual migration
- Or directory-based for flexibility

## Interview Tips
- Discuss CAP theorem
- Explain consistency models
- Show sharding trade-offs
- Mention replication strategies`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Database Sharding",
              problemUrl: "https://codesandbox.io/s/database-sharding",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Distributed Systems Concepts",
          slug: "distributed-systems-concepts",
          description: "Understand CAP theorem, consistency models, and failure handling",
          orderIndex: 5,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-1-5-video",
          videoDurationSec: 900,
          markdownContent: `# Distributed Systems Concepts

## Learning Objectives
- Understand CAP theorem
- Know consistency models
- Understand consensus
- Handle failures

## Content

### Part 1: CAP Theorem

In distributed systems, choose 2 of 3:

**Consistency (C):**
- All nodes see same data
- Strong consistency
- Slower writes

**Availability (A):**
- System always responds
- May return stale data
- Can handle failures

**Partition Tolerance (P):**
- System works despite network failures
- Required in distributed systems
- So really: Choose C or A

\`\`\`
           ╱─────────────╲
          ╱       P       ╲
         ╱                 ╲
        C ─────────────────── A
\`\`\`

**Example:**

Google Docs:
- Chooses AP (Availability + Partition Tolerance)
- Eventual consistency
- Works offline, syncs later

Bank transfer:
- Chooses CP (Consistency + Partition Tolerance)
- Strong consistency
- May be unavailable

### Part 2: Consistency Models

**Strong Consistency:**
\`\`\`
Write completes → All reads see new value
Cost: Latency, availability
Good for: Banking, critical operations
\`\`\`

**Eventual Consistency:**
\`\`\`
Write completes → Reads may be stale
After delay → All reads see new value
Cost: Complexity
Good for: Social media, scalability
\`\`\`

**Causal Consistency:**
\`\`\`
Related operations see consistent order
Unrelated operations may be stale
Middle ground
\`\`\`

### Part 3: Failure Handling

Types of failures:
1. **Machine failure:** Restart or replace
2. **Network failure:** Retry with timeout
3. **Software bugs:** Graceful degradation
4. **Data corruption:** Backups & checksums

Design for failure:
- Redundancy
- Monitoring
- Automated recovery
- Graceful degradation

## Interview Tips
- Explain CAP theorem clearly
- Give real-world examples
- Discuss trade-offs
- Show understanding of consistency models`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "CAP Theorem Analysis",
              problemUrl: "https://codesandbox.io/s/cap-theorem-analysis",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Design Problems",
      slug: "design-problems",
      description: "Design real-world systems like YouTube, URL shortener, and social media feeds",
      orderIndex: 2,
      difficultyLevel: "MEDIUM",
      estimatedHours: 15,
      lessons: [
        {
          title: "Design YouTube",
          slug: "design-youtube",
          description: "Design YouTube architecture for billions of users",
          orderIndex: 1,
          difficulty: "HARD",
          videoUrl: "https://example.com/sd-2-1-video",
          videoDurationSec: 1200,
          markdownContent: `# Design YouTube

## Problem Statement
Design YouTube architecture for:
- 1 billion users
- 100 million daily active users
- 500 hours video uploaded per minute
- Multiple resolutions & bitrates

## Approach

### 1. Capacity Estimation

**Videos uploaded:** 500 hrs/min = 43,200 hrs/day
**Storage per video:** 1GB/hour average
**Daily storage:** 43,200 TB/day
**Yearly:** 15.8 PB/year

**Bandwidth:**
- 100M DAU
- 2 hours watch/day
- 1MB/sec video stream
- Peak: 300Gbps needed

### 2. High-Level Architecture

\`\`\`
Users → CDN (video delivery)
     → API Servers (metadata)
     → Database (user data, video info)
     → Message Queue (upload processing)
     → Video Encoding Service
     → Storage (S3/GCS)
\`\`\`

### 3. Video Upload Pipeline

\`\`\`
1. User uploads video
2. Stored in staging area
3. Message sent to queue
4. Encoding service picks up
5. Encodes in multiple qualities (360p, 720p, 1080p)
6. Uploaded to CDN
7. Metadata updated
\`\`\`

### 4. Video Delivery

\`\`\`
User request for video
→ Lookup in CDN
→ If hit: serve from edge
→ If miss: fetch from origin, cache
→ Stream to user
\`\`\`

### 5. Database Schema

\`\`\`
Users:
  user_id, username, email, profile
Videos:
  video_id, user_id, title, duration, thumbnail, view_count
Comments:
  comment_id, video_id, user_id, text, timestamp
Watches:
  user_id, video_id, watch_duration, timestamp
\`\`\`

### 6. Scaling Challenges

- Ingestion (500 hrs/min)
- Storage (petabytes)
- Delivery (hundreds of Gbps)
- Encoding (compute-intensive)

## Interview Tips
- Start with requirements clarification
- Show capacity estimation
- Draw high-level architecture
- Discuss trade-offs
- Mention scalability concerns`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "YouTube System Design",
              problemUrl: "https://codesandbox.io/s/youtube-system-design",
              difficulty: "HARD",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Design Facebook/Instagram Feed",
          slug: "design-facebook-instagram-feed",
          description: "Design scalable feed system for social media",
          orderIndex: 2,
          difficulty: "HARD",
          videoUrl: "https://example.com/sd-2-2-video",
          videoDurationSec: 1200,
          markdownContent: `# Design Facebook/Instagram Feed

## Problem Statement
Design scalable feed system for:
- 1 billion users
- Real-time updates
- Chronological + algorithmic ranking
- 50K posts/second

## Key Decisions

### 1. Data Model

\`\`\`
Posts:
  post_id, user_id, content, timestamp
Follows:
  follower_id, following_id
Feed:
  user_id, post_id, timestamp, score
\`\`\`

### 2. Two Approaches

**Push Model (Fanout on write):**
\`\`\`
User posts → 
  For each follower:
    Add post to feed
Pros: Fast reads
Cons: Slow writes, memory intensive
\`\`\`

**Pull Model (Fanout on read):**
\`\`\`
User request feed →
  Get user's followers
  Get posts from each
  Rank & sort
Cons: Slow reads, database load
Pros: Less write latency
\`\`\`

**Hybrid Model (Best):**
\`\`\`
Heavy users: Push model
Light users: Pull model
Cache: Recent posts in Redis
\`\`\`

### 3. Architecture

\`\`\`
API Servers
  ↓
Cache Layer (Redis)
  - User's recent feed
  - Posts by friends (24h)
Feed Service
  - Compute feed rank
  - Merge from multiple sources
Post Storage
  - Cassandra (timeline)
  - Search service (full-text)
\`\`\`

### 4. Ranking Algorithm

\`\`\`
Score = 
  (likes * 0.3) +
  (comments * 0.5) +
  (shares * 1.0) +
  (recency_factor) -
  (time_decay)

Return top 50 posts
\`\`\`

## Interview Tips
- Explain push vs pull trade-offs
- Show understanding of scalability
- Discuss cache strategies
- Mention ranking factors`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Social Feed Design",
              problemUrl: "https://codesandbox.io/s/social-feed-design",
              difficulty: "HARD",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Design URL Shortener (Tiny URL)",
          slug: "design-url-shortener",
          description: "Design service for shortening URLs with high throughput",
          orderIndex: 3,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-2-3-video",
          videoDurationSec: 900,
          markdownContent: `# Design URL Shortener (Tiny URL)

## Problem Statement
Design service for:
- 1 billion short URLs
- 1000 QPS
- Simple & fast
- Short URLs that redirect to long URLs

## Approach

### 1. Database Schema

\`\`\`
ShortURLs:
  id (primary key, auto-increment)
  short_code (unique)
  long_url
  created_at
  expiration
\`\`\`

### 2. Generating Short Code

\`\`\`
ID: 1234567890
Encode in base62: [0-9a-zA-Z]

1234567890 in base62 = "8N8R6"
URL: tiny.url/8N8R6
\`\`\`

### 3. Architecture

\`\`\`
POST /shorten → Generate & store
GET /8N8R6 → Lookup & redirect
  ↑
Cache (Redis)
  - Hot URLs
  - Recent redirects
  - TTL: 24h
  ↓
Database
  - Persistent storage
  - Analytics data
\`\`\`

### 4. Scaling

\`\`\`
Multiple shorten services
Load balanced
Distributed cache
Database replication
Analytics on redirects
\`\`\`

## Interview Tips
- Discuss ID generation options
- Handle collisions
- Explain cache strategy
- Show database choice reasoning
- Mention redirect performance`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "URL Shortener Design",
              problemUrl: "https://codesandbox.io/s/url-shortener-design",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        }
      ]
    },
    {
      title: "Advanced Patterns",
      slug: "advanced-patterns",
      description: "Advanced system design patterns and best practices",
      orderIndex: 3,
      difficultyLevel: "MEDIUM",
      estimatedHours: 5,
      lessons: [
        {
          title: "Microservices Architecture",
          slug: "microservices-architecture",
          description: "Design patterns for microservices and distributed systems",
          orderIndex: 1,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-3-1-video",
          videoDurationSec: 900,
          markdownContent: `# Microservices Architecture

## Learning Objectives
- Understand microservices benefits
- Know communication patterns
- Design service discovery
- Handle distributed transactions

## Content

### Part 1: Benefits

**Independent scaling:**
- Each service can scale independently
- Team autonomy
- Technology flexibility
- Easier deployment

**Challenges:**
- Network latency
- Data consistency
- Operational complexity
- Testing difficulty

### Part 2: Communication Patterns

**API Gateway:**
\`\`\`
Single entry point
Authentication
Rate limiting
Request routing
Response aggregation
\`\`\`

**Service Discovery:**
\`\`\`
Service registry
Health checks
Load balancing
Automatic failover
\`\`\`

**Message Queues:**
\`\`\`
Asynchronous communication
Event-driven architecture
Decoupling services
Reliability guarantees
\`\`\`

### Part 3: Best Practices

**Database per Service:**
\`\`\`
Each service owns its database
Avoids shared database complexity
Enforces bounded context
\`\`\`

**Circuit Breaker:**
\`\`\`
Prevents cascade failures
Fallback mechanisms
Automatic recovery
Monitoring integration
\`\`\`

## Interview Tips
- Explain service boundaries
- Discuss communication trade-offs
- Show understanding of distributed challenges
- Mention monitoring and observability`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Microservices Design",
              problemUrl: "https://codesandbox.io/s/microservices-design",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Message Queues & Event Streaming",
          slug: "message-queues-event-streaming",
          description: "Design patterns using Kafka, RabbitMQ for async communication",
          orderIndex: 2,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-3-2-video",
          videoDurationSec: 900,
          markdownContent: `# Message Queues & Event Streaming

## Learning Objectives
- Understand queue patterns
- Know event streaming concepts
- Design reliable messaging
- Handle message ordering

## Content

### Part 1: Technologies

**Kafka:**
\`\`\`
High throughput, persistence
Event sourcing, stream processing
Complex but powerful
\`\`\`

**RabbitMQ:**
\`\`\`
Reliability, routing
Message acknowledgments
Complex routing scenarios
\`\`\`

**SQS:**
\`\`\`
Managed, simple
Pay per use
Good for serverless
\`\`\`

### Part 2: Patterns

**Publish-Subscribe:**
\`\`\`
One producer, multiple consumers
Event notification systems
Loose coupling
\`\`\`

**Request-Reply:**
\`\`\`
Synchronous communication
RPC patterns
Correlation IDs
\`\`\`

**Event Sourcing:**
\`\`\`
Store all events as immutable log
Rebuild state by replaying events
Audit trail built-in
\`\`\`

**Dead Letter Queue:**
\`\`\`
Handle failed messages
Retry logic
Error analysis
\`\`\`

### Part 3: Design Considerations

**Message Ordering:**
\`\`\`
Partition by key
Single partition per key
Global ordering via single partition
\`\`\`

**At-Least-Once Delivery:**
\`\`\`
Idempotent consumers
Duplicate detection
Acknowledgments
\`\`\`

**Backpressure:**
\`\`\`
Flow control mechanisms
Consumer rate limiting
Buffer management
\`\`\`

## Interview Tips
- Explain pattern trade-offs
- Show understanding of guarantees
- Discuss scaling considerations
- Mention monitoring and observability`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Message Queue Design",
              problemUrl: "https://codesandbox.io/s/message-queue-design",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        },
        {
          title: "Monitoring & Observability",
          slug: "monitoring-observability",
          description: "Design comprehensive monitoring for distributed systems",
          orderIndex: 3,
          difficulty: "MEDIUM",
          videoUrl: "https://example.com/sd-3-3-video",
          videoDurationSec: 900,
          markdownContent: `# Monitoring & Observability

## Learning Objectives
- Understand monitoring pillars
- Know key metrics
- Design alerting systems
- Implement distributed tracing

## Content

### Part 1: Three Pillars of Observability

**Metrics:**
\`\`\`
Numerical data about system behavior
Counters, gauges, histograms
Time series data
Examples: requests/second, error rate, response time
\`\`\`

**Logging:**
\`\`\`
Discrete events with context
Structured logs (JSON)
Log levels: ERROR, WARN, INFO, DEBUG
Correlation IDs for request tracing
\`\`\`

**Tracing:**
\`\`\`
Request flow across multiple services
Causality analysis
Performance bottlenecks
Distributed context propagation
\`\`\`

### Part 2: Key Metrics

**SRE Golden Signals:**
\`\`\`
1. **Latency:** Request duration
2. **Traffic:** Request rate
3. **Errors:** Error rate
4. **Saturation:** Resource utilization
\`\`\`

**Application Metrics:**
\`\`\`
Business metrics: active users, conversions
Technical metrics: database connections, cache hit rate
Custom metrics: feature usage, performance
\`\`\`

### Part 3: Implementation

**Tools:**
\`\`\`
Prometheus (metrics)
ELK Stack (logging)
Jaeger (tracing)
Grafana (dashboards)
\`\`\`

**Alerting:**
\`\`\`
Threshold-based alerts
Multi-channel notifications (email, Slack, PagerDuty)
Escalation policies
Runbook automation
\`\`\`

## Interview Tips
- Explain three pillars clearly
- Show understanding of SRE practices
- Discuss tool choices
- Mention alerting best practices`,
          practiceLinks: [
            {
              platform: "CODESANDBOX",
              problemTitle: "Monitoring System Design",
              problemUrl: "https://codesandbox.io/s/monitoring-system-design",
              difficulty: "MEDIUM",
              orderIndex: 1
            }
          ]
        }
      ]
    }
  ]
};