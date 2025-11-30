# PrepKit Module 4: System Design & Architecture
## Complete Course Content

**Module Weight:** 15% of interview preparation  
**Total Duration:** 20-30 hours  
**Total Lessons:** 15  
**Practice Problems:** 20+  
**Difficulty:** Medium → Hard  

---

## 📚 MODULE OVERVIEW

This module is **critical** because:
- Senior engineer differentiator (L3+)
- Shows architectural thinking
- Real-world problem solving
- Leadership & mentoring indicator

**Target Companies:** Google, Meta, Amazon, Microsoft (L3+), Salesforce, Rippling

---

## SECTION 1: SYSTEM DESIGN FUNDAMENTALS

### Lesson 4.1: Scalability & Performance Basics ⭐⭐⭐

**Learning Objectives:**
- Understand scalability concepts
- Know vertical vs horizontal scaling
- Master performance metrics
- Understand bottlenecks

**Content:**

#### Part 1: Scalability Types

**Vertical Scaling (Scale Up):**
- Add more resources to single machine
- CPU, RAM, storage upgrades
- Easier to implement
- Hit ceiling quickly
- More expensive

```
1 server (8GB RAM) → 1 server (64GB RAM)
Limited by hardware capabilities
```

**Horizontal Scaling (Scale Out):**
- Add more machines
- Distribute load across servers
- Unlimited growth potential
- More complex
- Better for large scale

```
1 server → 10 servers → 1000 servers
Easier to manage at massive scale
```

#### Part 2: Key Performance Metrics

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

**Example:**
```
API Response Latency: 150ms
Throughput: 10,000 RPS
Availability: 99.95%
```

#### Part 3: Identifying Bottlenecks

Common bottlenecks:
1. **Database:** Slow queries, no indexing
2. **Network:** Bandwidth limitations
3. **Application:** Inefficient code, memory leaks
4. **Disk I/O:** Slow disk operations
5. **CPU:** High computation

**How to identify:**
- Monitor metrics
- Use profilers
- Load testing
- Trace requests

**Practice Problem:**
```
API response: 5 seconds
Breaking it down:
- Database query: 3 seconds ← BOTTLENECK
- Network: 0.5 seconds
- Processing: 1 second
- Serialization: 0.5 seconds

Solution: Optimize database query
```

**Interview Tips:**
- Always identify bottleneck first
- Show measurement approach
- Propose solution with trade-offs
- Discuss before/after metrics

---

### Lesson 4.2: Load Balancing ⭐⭐⭐

**Learning Objectives:**
- Understand load balancing
- Know distribution strategies
- Understand challenges
- Design load balanced system

**Content:**

#### Part 1: Why Load Balancing?

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

```
Clients → Load Balancer → Server 1
                       → Server 2
                       → Server 3
```

#### Part 2: Load Balancing Strategies

**Round Robin:**
```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1
```
Simple, but ignores server capacity

**Least Connections:**
```
Track active connections
Send to server with fewest connections
Better than round robin
```

**IP Hash:**
```
hash(client_ip) % num_servers
Same client always → same server
Good for sessions
```

**Weighted:**
```
Server 1: 50% of traffic
Server 2: 30% of traffic
Server 3: 20% of traffic
Based on server capacity
```

#### Part 3: Load Balancer Placement

```
Clients → LB (Layer 4)
       → LB (Layer 7)
       → Servers
```

**Layer 4 (TCP/UDP):**
- Fast, simple
- No understanding of protocol
- Good for throughput

**Layer 7 (HTTP/HTTPS):**
- Can route based on URL, headers
- More intelligent
- Slower but more flexible

**Practice Problem:**

Design load balancing for:
- 1 million concurrent users
- Video streaming service
- 10Gbps bandwidth per server

Solution:
```
Multiple load balancers (HA)
→ Round robin between them
  → Layer 7 LB (HTTP level)
    → 100+ servers
    → Weighted by capacity
    
Monitor:
- Connections per LB
- Bandwidth utilization
- Response times
```

---

### Lesson 4.3: Caching Strategies ⭐⭐⭐

**Learning Objectives:**
- Understand caching layers
- Know cache strategies
- Design multi-tier cache
- Handle cache invalidation

**Content:**

#### Part 1: Cache Layers

```
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
```

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

#### Part 2: Cache Invalidation

**Cache invalidation strategies:**

1. **TTL (Time-To-Live):**
```
Cache data for 5 minutes
After 5 minutes, fetch fresh data
Simple but data may be stale
```

2. **Event-based Invalidation:**
```
When data changes → invalidate cache
More complex to implement
Always fresh data
```

3. **LRU (Least Recently Used):**
```
When cache full, remove least used item
Common for fixed-size caches
```

**The Hard Problem:**
```
"There are only two hard things in Computer Science:
 cache invalidation and naming things." - Phil Karlton
```

#### Part 3: Caching Examples

**Example: Product Catalog**
```
Products rarely change
Cache for 24 hours
When product updates → invalidate
Result: 99% cache hits
```

**Example: User Profile**
```
Profile changes frequently
Cache for 1 hour OR
Cache with event invalidation
Event: User updates profile → clear cache
```

**Practice Problem:**

Design caching for YouTube:
- 1 billion videos
- Constantly changing view counts
- Popular videos: 1M views/day
- Unpopular videos: 1 view/day

Solution:
```
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
```

---

### Lesson 4.4: Database Design ⭐⭐⭐

**Learning Objectives:**
- Choose right database type
- Understand sharding
- Know replication strategies
- Design schema for scale

**Content:**

#### Part 1: Database Types

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

#### Part 2: Sharding

**Problem:** Database too large for one server

**Solution: Sharding (Horizontal partitioning)**

```
Users table (1 billion rows)
Split by user_id hash:

Shard 1: user_id % 10 == 0
Shard 2: user_id % 10 == 1
...
Shard 10: user_id % 10 == 9

Each shard: 100 million rows (manageable)
```

**Sharding strategies:**

1. **Range-based:**
```
Shard 1: user_id 0-999,999
Shard 2: user_id 1,000,000-1,999,999
Problem: Uneven distribution
```

2. **Hash-based:**
```
Shard = hash(user_id) % num_shards
Even distribution
But: resharding is hard
```

3. **Directory-based:**
```
Lookup table: user_id → shard_id
Most flexible
Extra lookup cost
```

**Practice Problem:**

Shard a user database:
- 1 billion users
- Max 100M per shard
- Need 10 shards

```
Challenge: user_id 1,000,000 moves servers

Solution:
- Hash-based sharding with consistent hashing
- Allows gradual migration
- Or directory-based for flexibility
```

#### Part 3: Replication

**Master-Slave Replication:**
```
Master (Primary)
  ↓ (writes go here)
Slave1 (Replica)
Slave2 (Replica)
  ↑ (reads come from here)
```

Benefits:
- High availability
- Read scalability
- Backup

**Multi-Master Replication:**
```
Master1 ← sync → Master2
  ↓            ↓
Slave1        Slave2
```

Complex but:
- Both can write
- No single point of failure
- More challenging consistency

---

### Lesson 4.5: Distributed Systems Concepts ⭐⭐⭐

**Learning Objectives:**
- Understand CAP theorem
- Know consistency models
- Understand consensus
- Handle failures

**Content:**

#### Part 1: CAP Theorem

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

```
           ╱─────────────╲
          ╱       P       ╲
         ╱                 ╲
        C ─────────────────── A

CA: Single server database
CP: Banking (consistency over availability)
AP: Social media (availability over consistency)
```

**Example:**

Google Docs:
- Chooses AP (Availability + Partition Tolerance)
- Eventual consistency
- Works offline, syncs later

Bank transfer:
- Chooses CP (Consistency + Partition Tolerance)
- Strong consistency
- May be unavailable

#### Part 2: Consistency Models

**Strong Consistency:**
```
Write completes → All reads see new value
Cost: Latency, availability
Good for: Banking, critical operations
```

**Eventual Consistency:**
```
Write completes → Reads may be stale
After delay → All reads see new value
Cost: Complexity
Good for: Social media, scalability
```

**Causal Consistency:**
```
Related operations see consistent order
Unrelated operations may be stale
Middle ground
```

#### Part 3: Failure Handling

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

**Practice Problem:**

Design reliable system for:
- 1 million users
- 99.999% availability (< 26 sec downtime/year)
- Real-time payments

Solution:
```
Multiple data centers (geographic redundancy)
Synchronous replication (consistency)
Automated failover (availability)
Monitoring & alerts (operations)
Testing chaos engineering (reliability)
```

---

## SECTION 2: SYSTEM DESIGN PROBLEMS

### Problem 4.6: Design YouTube ⭐⭐⭐

**Problem Statement:**
Design YouTube architecture for:
- 1 billion users
- 100 million daily active users
- 500 hours video uploaded per minute
- Multiple resolutions & bitrates

**Approach:**

1. **Capacity Estimation:**
```
Videos uploaded: 500 hrs/min = 43,200 hrs/day
Storage per video: 1GB/hour average
Daily storage: 43,200 TB/day
Yearly: 15.8 PB/year

Bandwidth:
- 100M DAU
- 2 hours watch/day
- 1MB/sec video stream
- Peak: 300Gbps needed
```

2. **High-Level Architecture:**
```
Users → CDN (video delivery)
     → API Servers (metadata)
     → Database (user data, video info)
     → Message Queue (upload processing)
     → Video Encoding Service
     → Storage (S3/GCS)
```

3. **Video Upload Pipeline:**
```
1. User uploads video
2. Stored in staging area
3. Message sent to queue
4. Encoding service picks up
5. Encodes in multiple qualities (360p, 720p, 1080p)
6. Uploaded to CDN
7. Metadata updated
```

4. **Video Delivery:**
```
User request for video
→ Lookup in CDN
→ If hit: serve from edge
→ If miss: fetch from origin, cache
→ Stream to user
```

5. **Database Schema:**
```
Users:
  user_id, username, email, profile

Videos:
  video_id, user_id, title, duration
  upload_date, view_count

Comments:
  comment_id, video_id, user_id, text

Watches:
  user_id, video_id, watch_duration
```

6. **Scaling Challenges:**
- Ingestion (500 hrs/min)
- Storage (petabytes)
- Delivery (hundreds of Gbps)
- Encoding (compute-intensive)

---

### Problem 4.7: Design Facebook/Instagram Feed ⭐⭐⭐

**Problem Statement:**
Design scalable feed system for:
- 1 billion users
- Real-time updates
- Chronological + algorithmic ranking
- 50K posts/second

**Key Decisions:**

1. **Data Model:**
```
Posts:
  post_id, user_id, content, timestamp

Follows:
  follower_id, following_id

Feed:
  user_id, post_id, timestamp, score
```

2. **Two Approaches:**

**Push Model (Fanout on write):**
```
User posts → 
  For each follower:
    Add post to feed
    
Pros: Fast reads
Cons: Slow writes, memory intensive
```

**Pull Model (Fanout on read):**
```
User request feed →
  Get user's followers
  Get posts from each
  Rank & sort
  
Pros: Less write latency
Cons: Slow reads, database load
```

**Hybrid Model (Best):**
```
Heavy users: Push model
Light users: Pull model
Cache: Recent posts in Redis
```

3. **Architecture:**
```
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
```

4. **Ranking Algorithm:**
```
Score = 
  (likes * 0.3) +
  (comments * 0.5) +
  (shares * 1.0) +
  (recency_factor) -
  (time_decay)

Return top 50 posts
```

---

### Problem 4.8: Design URL Shortener (Tiny URL) ⭐⭐

**Problem Statement:**
Design service for:
- 1 billion short URLs
- 1000 QPS
- Simple & fast

**Approach:**

1. **Database Schema:**
```
ShortURLs:
  id (primary key, auto-increment)
  short_code (unique)
  long_url
  created_at
  expiration
```

2. **Generating Short Code:**
```
ID: 1234567890
Encode in base62: [0-9a-zA-Z]

1234567890 in base62 = "8N8R6"

URL: tiny.url/8N8R6
```

3. **Architecture:**
```
POST /shorten → Generate & store
GET /8N8R6 → Lookup & redirect
  ↑
Cache (Redis)
  - Hot URLs
  - Recent redirects
  - TTL: 24h
```

4. **Scaling:**
```
Multiple shorten services
Load balanced
Distributed cache
Database replication
```

**Interview Tips:**
- Discuss ID generation options (UUID vs sequential)
- Handle collisions
- Cache strategy
- Database choice
- Redirect performance

---

### Problem 4.9: Design Notification System ⭐⭐

**Problem Statement:**
Design for:
- 1 billion users
- 1M notifications/second
- Multiple channels (email, SMS, push)
- Real-time delivery

**Architecture:**

```
Event Trigger
  ↓
Message Queue (Kafka)
  ↓
Notification Service
  - Filter by channel
  - Template rendering
  ↓
Channel-specific Workers
  - Email service
  - SMS service
  - Push service
  ↓
Delivery
```

**Implementation:**

```
1. Event fires (user comment on post)
2. Message to Kafka queue
3. Notification service consumes
4. Determines channels for user
5. Renders templates
6. Sends to respective services
7. Retry on failure
8. Track delivery status
```

**Challenges:**
- At-least-once delivery
- Order preservation
- Deduplication
- Rate limiting
- Retry logic

---

### Problem 4.10: Design Distributed Cache (Redis) ⭐⭐

### Problem 4.11: Design Messaging System (WhatsApp) ⭐⭐⭐

### Problem 4.12: Design Rate Limiter ⭐⭐

### Problem 4.13: Design Autocomplete (Search Suggestions) ⭐⭐

### Problem 4.14: Design Payment System ⭐⭐⭐

### Problem 4.15: Design Ride Sharing (Uber) ⭐⭐⭐

---

## SECTION 3: DESIGN PATTERNS & BEST PRACTICES

### Lesson 4.16: Microservices Architecture ⭐⭐

**Benefits:**
- Independent scaling
- Technology flexibility
- Team autonomy
- Easier deployment

**Challenges:**
- Network latency
- Data consistency
- Operational complexity
- Testing difficulty

**Best Practices:**
- One database per service
- API gateway
- Service discovery
- Circuit breakers
- Monitoring

---

### Lesson 4.17: Message Queues & Event Streaming ⭐⭐

**Technologies:**
- Kafka: High throughput, persistence
- RabbitMQ: Reliability, routing
- SQS: Managed, simple

**Patterns:**
- Publish-Subscribe
- Request-Reply
- Event Sourcing

---

### Lesson 4.18: Monitoring & Observability ⭐⭐⭐

**What to monitor:**
- Latency (p50, p95, p99)
- Error rate
- Throughput
- Resource usage
- Business metrics

**Tools:**
- Prometheus (metrics)
- ELK (logging)
- Jaeger (tracing)
- Grafana (dashboards)

---

## ASSESSMENT & PRACTICE

### Design Interview Format:

**45-60 minute interview:**
1. Ask clarifying questions (5 min)
2. Define requirements (5 min)
3. Estimate capacity (5 min)
4. High-level design (10 min)
5. Deep dive (15 min)
6. Identify bottlenecks (5 min)
7. Improvements & trade-offs (5 min)

### Practice Framework:

For each problem:
1. Clarify requirements
2. Estimate scale
3. Draw architecture
4. Discuss trade-offs
5. Handle follow-ups

### Sample Follow-ups:

- How do you handle failures?
- What about data consistency?
- How to scale this component?
- What's the bottleneck?
- How do you monitor this?
- What's the cost?

---

## INTERVIEW TIPS

1. **Ask before designing:**
   - How many users?
   - Read/write ratio?
   - Consistency requirements?
   - Latency requirements?

2. **Think about trade-offs:**
   - Speed vs Cost
   - Consistency vs Availability
   - Simplicity vs Features

3. **Discuss scaling:**
   - Vertical vs Horizontal
   - Database scaling
   - Caching strategies

4. **Don't memorize:**
   - Understand principles
   - Apply to new problems
   - Discuss reasoning

---

**Expected Completion Time:** 20-30 hours  
**Prerequisite:** Module 1-3 completion  
**Target Companies:** Google, Meta, Amazon, Microsoft (L3+)  

**By the end of this module, you should design complex systems confidently.**
