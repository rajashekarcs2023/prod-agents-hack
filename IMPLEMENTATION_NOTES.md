# Apartment Truth Layer - Implementation Notes

## Project Overview

**Problem**: People can't trust rental listings and verifying them takes hours of manual research.

**Solution**: An autonomous agent that takes a listing URL and uncovers the real story by researching across multiple data sources and taking automated actions.

## Agent Architecture

### Core Agent Loop
1. **SCRAPING** (Lightpanda) - Extract listing data from dynamic websites
2. **INVESTIGATING** (Parallel Web) - Research neighborhood, safety, landlord reputation
3. **ANALYZING** (Gemini) - Score and synthesize findings
4. **ACTING** (Postman + Lightpanda) - Take automated actions (shortlist, notifications, form filling)
5. **LEARNING** - Update source weights and preferences based on feedback

### Self-Improvement Mechanisms
1. **Source Reliability Learning** - Track which sources are accurate over time
2. **Pattern Detection** - Learn what indicates scams, noise issues, etc.
3. **User Feedback Loop** - Personalize based on user ratings and preferences
4. **Error Correction** - Adapt to website changes and broken selectors

## Current Frontend Implementation

### Tech Stack
- React 19 + TypeScript
- Vite build system
- TailwindCSS for styling
- Lucide React for icons
- Recharts for data visualization
- Google GenAI for backend processing

### File Structure
```
apartment-TruthLayer/
├── App.tsx                    # Main application component
├── types.ts                   # TypeScript type definitions
├── services/
│   └── geminiService.ts       # AI service integration
└── components/
    ├── AgentTerminal.tsx      # Live agent logs
    ├── ReportCard.tsx         # Truth report display
    ├── LearningPanel.tsx      # Source weight visualization
    ├── StatusBadge.tsx        # Current agent state
    ├── ActionFeed.tsx         # Live actions display
    └── MetricsChart.tsx       # Not yet implemented
```

### Current Status
- ✅ Complete UI framework built
- ✅ Agent state machine implemented
- ✅ Autonomous loop with timing
- ✅ Gemini AI integration (basic)
- ❌ **Real data integration missing**
- ❌ **Parallel Web API not integrated**
- ❌ **Lightpanda browser automation not implemented**
- ❌ **Postman workflow orchestration missing**
- ❌ **No actual web scraping**

### Current Limitations
1. **Mock Data Only**: Currently shows hardcoded/AI-generated results
2. **No Real Scraping**: URLs are not actually scraped
3. **No Real Research**: No actual neighborhood/safety data gathered
4. **No Real Actions**: Buttons don't perform actual API calls
5. **Offline Demo**: Works without real integrations for demo purposes

## Implementation Plan

### Phase 1: Real Data Integration

#### 1.1 Lightpanda Integration
- Install and configure Lightpanda browser
- Create scraping service for:
  - Zillow listings
  - Craigslist posts
  - Facebook Marketplace (if possible)
- Extract: price, address, photos, amenities, contact info

#### 1.2 Parallel Web Integration
- Set up Parallel API client
- Create research tasks for:
  - Neighborhood safety data
  - Crime statistics
  - Reddit discussions about area
  - Google reviews for building/landlord
  - Construction permits
  - Noise complaints (311 data)

#### 1.3 Postman Workflow
- Create Postman collection for agent orchestration
- Set up workflows for:
  - Data aggregation
  - Scoring calculations
  - Action execution (notifications, shortlisting)
- Implement webhook endpoints for actions

### Phase 2: Action Implementation

#### 2.1 System Actions (via Postman)
- `POST /shortlist` - Save good listings
- `POST /blacklist` - Mark bad listings
- `POST /notify` - Send notifications (Slack/email)
- State management with environment variables

#### 2.2 Web Actions (via Lightpanda)
- Auto-fill contact forms
- Schedule tour requests
- Check availability calendars
- Monitor price changes

#### 2.3 User Actions
- Feedback collection system
- Preference learning
- Report sharing functionality

### Phase 3: Learning System

#### 3.1 Source Weight Management
- Track source accuracy over time
- Update reliability scores based on outcomes
- Store in Postman environment or JSON file

#### 3.2 Pattern Recognition
- Detect scam indicators
- Learn neighborhood-specific issues
- Build correlation models

#### 3.3 Personalization
- User preference learning
- Custom scoring weights
- Personalized recommendations

## API Integrations Needed

### Parallel Web API
```typescript
interface ParallelTaskRequest {
  task_spec: {
    output_schema: string | object;
  };
  input: string | object;
  processor: 'base' | 'core';
}
```

### Lightpanda Browser API
```typescript
interface LightpandaConfig {
  host: string;
  port: number;
  browserWSEndpoint: string;
}
```

### Postman API
```typescript
interface PostmanWorkflow {
  collection: string;
  environment: string;
  webhooks: string[];
}
```

## Environment Variables Needed
- `PARALLEL_API_KEY` - Parallel Web API key
- `POSTMAN_API_KEY` - Postman API key (if using API)
- `LPD_TOKEN` - Lightpanda cloud token (optional)
- `SLACK_WEBHOOK_URL` - For notifications
- `GEMINI_API_KEY` - Google AI API key

## Next Steps Priority
1. Set up Parallel Web API integration
2. Set up Lightpanda for web scraping
3. Create real scraping service for listings
4. Build Postman workflow orchestration
5. Connect frontend to real backend services
6. Implement actual action buttons
7. Add learning/feedback systems

## Demo Strategy
1. Show working agent loop with real data
2. Demonstrate self-improvement through source learning
3. Show real actions being taken (shortlist, notifications)
4. Highlight how it solves the "trust" problem with citations
5. Show learning adaptation based on user feedback

## Success Metrics
- Speed: Truth report generated in <30 seconds
- Accuracy: High confidence scores with proper citations
- Actions: Real automated actions executed
- Learning: Demonstrable improvement in source weighting
- User Value: Clear before/after comparison of manual vs automated verification