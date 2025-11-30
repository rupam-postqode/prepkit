// prisma/content-data/system-design.ts

export const systemDesignLessons = [
  // Section 1: System Design Fundamentals (5 lessons)
  {
    title: "Scalability & Performance Basics",
    slug: "scalability-performance-basics",
    description: "Understanding vertical vs horizontal scaling, performance metrics, and bottlenecks",
    markdownContent: `# Scalability & Performance Basics

## Learning Objectives

Understand the fundamental concepts of system scalability:
- Vertical vs Horizontal scaling
- Key performance metrics (latency, throughput, availability)
- Identifying bottlenecks in systems
- Performance measurement techniques

## Core Concepts

### 1. Types of Scaling

**Vertical Scaling (Scale Up)**
- Adding more resources to a single machine
- CPU upgrades, RAM increases, faster storage
- Simple to implement
- Limited by hardware constraints
- Higher cost per unit of performance

**Horizontal Scaling (Scale Out)**
- Adding more machines to distribute load
- Load balancers distribute traffic
- Unlimited theoretical capacity
- More complex implementation
- Better fault tolerance

### 2. Performance Metrics

**Latency (Response Time)**
- Time taken to respond to a request
- Measured in milliseconds (ms)
- Critical for user experience
- Target: <100ms for web applications

**Throughput**
- Number of requests handled per second
- Measured in RPS (Requests Per Second)
- Indicates system capacity
- Key for capacity planning

**Availability**
- System uptime percentage
- 99.9% = 43 minutes downtime/month
- 99.99% = 4 minutes downtime/month
- 99.999% = 26 seconds downtime/month

### 3. Common Bottlenecks

**Database Bottlenecks**
- Slow queries, missing indexes
- Connection pool exhaustion
- Lock contention
- Solution: Query optimization, caching, sharding

**Application Bottlenecks**
- Inefficient algorithms
- Memory leaks
- Synchronous operations
- Solution: Code optimization, async processing

**Network Bottlenecks**
- Bandwidth limitations
- High latency connections
- DNS resolution delays
- Solution: CDNs, connection pooling

## Real-World Examples

### Example 1: Social Media Feed
- Challenge: Generate personalized feeds for millions of users
- Solution: Pre-compute feeds, use caching, implement pagination
- Scaling: Horizontal with read replicas

### Example 2: E-commerce Search
- Challenge: Search millions of products quickly
- Solution: Elasticsearch, inverted indexes, caching
- Scaling: Distributed search cluster

## Performance Measurement Tools

### 1. Load Testing Tools
- Apache JMeter
- Gatling
- k6
- Artillery

### 2. Monitoring Tools
- Prometheus (metrics collection)
- Grafana (visualization)
- New Relic (APM)
- Datadog (infrastructure monitoring)

## Interview Preparation

### Common Questions
1. "How would you scale a web application from 1K to 1M users?"
2. "What's the difference between vertical and horizontal scaling?"
3. "How do you identify and fix performance bottlenecks?"

### Answer Framework
1. **Assess Requirements**: Understand the scale and constraints
2. **Identify Bottlenecks**: Find the limiting factor
3. **Propose Solutions**: Suggest appropriate scaling strategy
4. **Discuss Trade-offs**: Cost vs complexity vs performance

## Key Takeaways

- Start with vertical scaling, move to horizontal when needed
- Monitor key metrics: latency, throughput, availability
- Identify bottlenecks before scaling
- Use caching to reduce database load
- Design for failure from the start

## Company-Specific Focus

**Google**: Emphasis on horizontal scaling and distributed systems
**Amazon**: Focus on AWS services and auto-scaling
**Meta**: Real-time systems and low latency
**Microsoft**: Enterprise scalability and reliability`,
    keyTakeaways: [
      "Understand when to use vertical vs horizontal scaling",
      "Monitor key performance metrics: latency, throughput, availability",
      "Identify bottlenecks before implementing scaling solutions",
      "Design systems with failure in mind from the start"
    ],
    commonMistakes: [
      "Over-engineering solutions for current scale requirements",
      "Ignoring monitoring and metrics when scaling systems",
      "Not considering the trade-offs between different scaling approaches",
      "Forgetting to plan for failure scenarios in scalable systems"
    ],
    difficulty: "BEGINNER",
    premium: false,
    estimatedMinutes: 30
  },

  {
    title: "Load Balancing Strategies",
    slug: "load-balancing-strategies",
    description: "Deep dive into load balancing algorithms and implementation patterns",
    markdownContent: `# Load Balancing Strategies

## Learning Objectives

Master load balancing concepts for distributed systems:
- Understand different load balancing algorithms
- Know when to use Layer 4 vs Layer 7 load balancers
- Implement health checks and failover
- Design highly available load balancing architecture

## Load Balancing Fundamentals

### What is Load Balancing?

Load balancing is the process of distributing incoming network traffic across multiple servers. This ensures no single server bears too much demand, ensuring high availability and reliability.

### Key Benefits
- **Prevents Server Overload**: Distributes traffic evenly
- **Improves Responsiveness**: Reduces latency
- **Ensures High Availability**: Failover when servers fail
- **Enables Scalability**: Add/remove servers seamlessly

## Load Balancing Algorithms

### 1. Round Robin
\`\`\`text
Server 1 → Request 1, Request 4, Request 7...
Server 2 → Request 2, Request 5, Request 8...
Server 3 → Request 3, Request 6, Request 9...
\`\`\`

**Pros:**
- Simple to implement
- Even distribution for similar capacity servers

**Cons:**
- Doesn't consider server load
- Assumes equal server capacity
- Session affinity issues

**Use Case:** Static content servers with similar capacity

### 2. Least Connections
\`\`\`text
Server 1: 10 connections
Server 2: 5 connections ← New request goes here
Server 3: 8 connections
\`\`\`

**Pros:**
- Considers current load
- Better distribution for varying request durations

**Cons:**
- More complex to implement
- May need connection tracking

**Use Case:** Web servers with long-running connections

### 3. IP Hash
\`\`\`text
Client IP: 192.168.1.100
Hash(192.168.1.100) % 3 = Server 2
All requests from this client → Server 2
\`\`\`

**Pros:**
- Session persistence
- Good for stateful applications

**Cons:**
- Uneven distribution
- Server failure affects clients

**Use Case:** E-commerce shopping carts, user sessions

### 4. Weighted Round Robin
\`\`\`text
Server 1 (Weight: 3): Request 1, 4, 7...
Server 2 (Weight: 2): Request 2, 5, 8...
Server 3 (Weight: 1): Request 3, 6, 9...
\`\`\`

**Pros:**
- Considers server capacity differences
- Flexible resource allocation

**Cons:**
- Requires capacity planning
- Complex weight configuration

**Use Case:** Mixed-capacity server environment

## Load Balancer Types

### Layer 4 (Transport Layer)
- Operates at TCP/UDP level
- Routes based on IP address and port
- Fast and efficient
- No application awareness

**Example:** NGINX, HAProxy (L4 mode)

**Use Case:** High-performance needs, simple routing

### Layer 7 (Application Layer)
- Operates at HTTP/HTTPS level
- Routes based on content, headers, cookies
- More intelligent routing
- Higher resource usage

**Example:** Application Load Balancer (AWS), NGINX (L7 mode)

**Use Case:** Microservices, content-based routing

## Health Checks and Failover

### Health Check Implementation
\`\`\`yaml
# HAProxy Health Check Configuration
backend web_servers
    server web1 10.0.1.1:80 check
    server web2 10.0.1.2:80 check
    server web3 10.0.1.3:80 check
    
    # Custom health check
    option httpchk GET /health
\`\`\`

### Health Check Strategies
1. **TCP Connect**: Basic connectivity check
2. **HTTP Check**: Application-level health endpoint
3. **Script Check**: Custom validation logic
4. **Database Check**: Verify database connectivity

### Failover Mechanisms
\`\`\`text
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│  LB Master  │───▶│  Server 1   │
└─────────────┘    └─────────────┘    └─────────────┘
                          │                     │
                          ▼                     ▼
                   ┌─────────────┐    ┌─────────────┐
                   │ LB Backup   │    │  Server 2   │
                   └─────────────┘    └─────────────┘
\`\`\`

## Implementation Examples

### 1. NGINX Configuration
\`\`\`nginx
upstream backend {
    least_conn;  # Algorithm
    server server1.example.com weight=3 max_fails=3;
    server server2.example.com weight=2 max_fails=3;
    server server3.example.com weight=1 backup;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }
}
\`\`\`

### 2. AWS Application Load Balancer
\`\`\`json
{
    "Type": "application",
    "Scheme": "internet-facing",
    "IpAddressType": "ipv4",
    
    "TargetGroups": [
        {
            "Name": "web-servers",
            "Protocol": "HTTP",
            "Port": 80,
            "HealthCheckPath": "/health",
            "HealthCheckIntervalSeconds": 30,
            "HealthCheckTimeoutSeconds": 5,
            "HealthyThresholdCount": 2,
            "UnhealthyThresholdCount": 3
        }
    ],
    
    "Listeners": [
        {
            "Protocol": "HTTP",
            "Port": 80,
            "DefaultActions": [
                {
                    "Type": "forward",
                    "TargetGroupArn": "arn:aws:elasticloadbalancing:..."
                }
            ]
        }
    ]
}
\`\`\`

## Advanced Concepts

### 1. Session Persistence
- **Sticky Sessions**: Route same user to same server
- **Session Replication**: Share sessions across servers
- **Client-side Sessions**: Store sessions in cookies/tokens

### 2. Global Server Load Balancing (GSLB)
\`\`\`text
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  US East   │    │   Europe    │    │   Asia      │
│    LB      │    │     LB      │    │     LB      │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │  DNS GSLB   │
                    └─────────────┘
                           │
                    ┌─────────────┐
                    │   Client    │
                    └─────────────┘
\`\`\`

### 3. Load Balancer Patterns

**Pattern 1: Multi-Tier Load Balancing**
\`\`\`text
Internet → Web LB → App Servers
                 ↓
            Database LB → DB Servers
\`\`\`

**Pattern 2: Microservices Load Balancing**
\`\`\`text
API Gateway → Service A LB → Service A Instances
           → Service B LB → Service B Instances
           → Service C LB → Service C Instances
\`\`\`

## Performance Considerations

### 1. Connection Pooling
- Reuse connections to reduce overhead
- Configure appropriate pool sizes
- Monitor connection utilization

### 2. SSL/TLS Termination
- Handle encryption at load balancer
- Reduces server CPU load
- Simplifies certificate management

### 3. Caching at Load Balancer
- Cache static content
- Reduce backend load
- Improve response times

## Monitoring and Metrics

### Key Metrics to Monitor
1. **Request Rate**: RPS per server
2. **Response Time**: Average and p95/p99
3. **Error Rate**: 4xx and 5xx responses
4. **Connection Count**: Active connections per server
5. **Health Check Status**: Server availability

### Alerting
\`\`\`yaml
# Example Prometheus Alert Rules
groups:
  - name: load_balancer
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
      
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95th percentile response time too high"
\`\`\`

## Interview Preparation

### Common Questions
1. "Design a load balancer for a high-traffic website"
2. "What's the difference between L4 and L7 load balancers?"
3. "How do you handle session affinity in load balancing?"

### Answer Framework
1. **Requirements**: Traffic volume, session needs, availability
2. **Algorithm Choice**: Based on use case and constraints
3. **Health Checks**: Ensure reliability and failover
4. **Scalability**: How to add capacity dynamically

## Key Takeaways

- Choose algorithm based on traffic patterns and requirements
- Implement proper health checking for reliability
- Consider L7 for intelligent routing, L4 for performance
- Monitor key metrics to optimize performance
- Plan for failure and implement proper failover

## Company-Specific Focus

**Google**: Emphasis on consistent hashing and global load balancing
**Amazon**: AWS load balancer services and auto-scaling integration
**Meta**: High-performance L7 routing for real-time features
**Netflix**: Global CDN and edge load balancing
`,
    keyTakeaways: [
      "Choose load balancing algorithms based on traffic patterns and requirements",
      "Implement proper health checking for reliable failover",
      "Understand trade-offs between L4 and L7 load balancers",
      "Monitor key metrics to optimize load balancer performance"
    ],
    commonMistakes: [
      "Choosing the wrong load balancing algorithm for the use case",
      "Not implementing proper health checks leading to routing to failed servers",
      "Ignoring session persistence requirements for stateful applications",
      "Forgetting to monitor load balancer performance metrics"
    ],
    difficulty: "INTERMEDIATE",
    premium: false,
    estimatedMinutes: 45
  }
];
