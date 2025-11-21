import emailService from './emailService';

interface PostmanEnvironmentVariable {
  key: string;
  value: string;
  enabled: boolean;
}

interface PostmanAction {
  id: string;
  type: 'SHORTLIST' | 'BLACKLIST' | 'NOTIFY' | 'SCHEDULE_TOUR';
  description: string;
  endpoint?: string;
  payload?: any;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  result?: any;
}

interface AgentMemory {
  sourceWeights: {
    [source: string]: {
      reliability: number;
      trend: 'up' | 'down' | 'stable';
      lastUpdated: string;
    };
  };
  userPreferences: {
    safetyWeight: number;
    noiseWeight: number;
    valueWeight: number;
    commuteWeight: number;
  };
  listingHistory: {
    url: string;
    verdict: string;
    userFeedback?: 'positive' | 'negative';
    timestamp: string;
  }[];
  patterns: {
    scamIndicators: string[];
    noisePatterns: string[];
    valuePatterns: string[];
  };
}

class PostmanService {
  private apiKey?: string;
  private webhookUrl?: string;
  private agentMemory: AgentMemory;

  constructor(config: { apiKey?: string; webhookUrl?: string }) {
    this.apiKey = config.apiKey;
    this.webhookUrl = config.webhookUrl;
    
    // Initialize agent memory
    this.agentMemory = this.loadAgentMemory();
  }

  /**
   * Execute a shortlist action
   */
  async shortlistListing(listingData: any, truthReport: any): Promise<PostmanAction> {
    const action: PostmanAction = {
      id: `shortlist_${Date.now()}`,
      type: 'SHORTLIST',
      description: `Adding listing to shortlist: ${listingData.address}`,
      status: 'PENDING'
    };

    try {
      action.status = 'EXECUTING';

      // Store in local shortlist (simulate database)
      const shortlistItem = {
        listing: listingData,
        report: truthReport,
        addedAt: new Date().toISOString(),
        status: 'active'
      };

      // In a real implementation, this would call a database API
      // For now, store in localStorage or send to webhook
      if (this.webhookUrl) {
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'shortlist',
            data: shortlistItem
          })
        });

        if (!response.ok) throw new Error('Webhook failed');
        action.result = await response.json();
      } else {
        // Store locally
        this.storeInLocalStorage('shortlist', shortlistItem);
        action.result = { success: true, stored: 'locally' };
      }

      action.status = 'COMPLETED';
      
      // Update agent memory
      this.updateListingHistory(listingData.url, 'SHORTLISTED');

    } catch (error) {
      action.status = 'FAILED';
      action.result = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    return action;
  }

  /**
   * Execute a blacklist action
   */
  async blacklistListing(listingData: any, reason: string): Promise<PostmanAction> {
    const action: PostmanAction = {
      id: `blacklist_${Date.now()}`,
      type: 'BLACKLIST',
      description: `Blacklisting listing: ${reason}`,
      status: 'PENDING'
    };

    try {
      action.status = 'EXECUTING';

      const blacklistItem = {
        listing: listingData,
        reason,
        blacklistedAt: new Date().toISOString()
      };

      if (this.webhookUrl) {
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'blacklist',
            data: blacklistItem
          })
        });

        if (!response.ok) throw new Error('Webhook failed');
        action.result = await response.json();
      } else {
        this.storeInLocalStorage('blacklist', blacklistItem);
        action.result = { success: true, stored: 'locally' };
      }

      action.status = 'COMPLETED';
      this.updateListingHistory(listingData.url, 'BLACKLISTED');

    } catch (error) {
      action.status = 'FAILED';
      action.result = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    return action;
  }

  /**
   * Send notification about a listing
   */
  async sendNotification(listingData: any, truthReport: any, type: 'high_priority' | 'weekly_summary'): Promise<PostmanAction> {
    const action: PostmanAction = {
      id: `notify_${Date.now()}`,
      type: 'NOTIFY',
      description: `Sending ${type} notification`,
      status: 'PENDING'
    };

    try {
      action.status = 'EXECUTING';

      const notification = {
        type,
        listing: {
          address: listingData.address,
          rent: listingData.rent,
          url: listingData.url
        },
        summary: truthReport.summary,
        overallScore: truthReport.overallScore,
        verdict: truthReport.verdict,
        timestamp: new Date().toISOString()
      };

      // Send email notification
      const emailSent = await emailService.sendListingAlert({
        type: type,
        listing: {
          address: listingData.address,
          rent: listingData.rent,
          url: listingData.url
        },
        truthReport: {
          summary: truthReport.summary,
          overallScore: truthReport.overallScore,
          verdict: truthReport.verdict,
          evidence: truthReport.evidence
        },
        timestamp: new Date().toISOString()
      });

      if (!emailSent && !emailService.isConfigured()) {
        console.log('Email service not configured - notification stored locally');
      }

      // Also send to general webhook if configured
      if (this.webhookUrl) {
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'notify',
            data: notification
          })
        });

        if (!response.ok) throw new Error('Webhook failed');
        action.result = await response.json();
      } else {
        action.result = { 
          success: true, 
          notification,
          emailSent,
          emailConfigured: emailService.isConfigured()
        };
      }

      action.status = 'COMPLETED';

    } catch (error) {
      action.status = 'FAILED';
      action.result = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    return action;
  }

  /**
   * Schedule a tour request
   */
  async scheduleTourRequest(listingData: any, userInfo: any): Promise<PostmanAction> {
    const action: PostmanAction = {
      id: `tour_${Date.now()}`,
      type: 'SCHEDULE_TOUR',
      description: `Preparing tour request for ${listingData.address}`,
      status: 'PENDING'
    };

    try {
      action.status = 'EXECUTING';

      const tourRequest = {
        listing: listingData,
        requester: userInfo,
        message: `Hi, I'm interested in viewing this property. I'm looking for a ${userInfo.priorities?.bedrooms || 1} bedroom apartment in this area. When would be a good time for a tour?`,
        requestedAt: new Date().toISOString(),
        status: 'pending_contact'
      };

      // Store tour request
      if (this.webhookUrl) {
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'schedule_tour',
            data: tourRequest
          })
        });

        if (!response.ok) throw new Error('Webhook failed');
        action.result = await response.json();
      } else {
        this.storeInLocalStorage('tour_requests', tourRequest);
        action.result = { success: true, tourRequest };
      }

      action.status = 'COMPLETED';

    } catch (error) {
      action.status = 'FAILED';
      action.result = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    return action;
  }

  /**
   * Update source weights based on feedback
   */
  updateSourceWeights(source: string, accuracyFeedback: 'accurate' | 'inaccurate'): void {
    if (!this.agentMemory.sourceWeights[source]) {
      this.agentMemory.sourceWeights[source] = {
        reliability: 50,
        trend: 'stable',
        lastUpdated: new Date().toISOString()
      };
    }

    const weight = this.agentMemory.sourceWeights[source];
    const oldReliability = weight.reliability;

    if (accuracyFeedback === 'accurate') {
      weight.reliability = Math.min(100, weight.reliability + 5);
    } else {
      weight.reliability = Math.max(0, weight.reliability - 10);
    }

    // Update trend
    if (weight.reliability > oldReliability) {
      weight.trend = 'up';
    } else if (weight.reliability < oldReliability) {
      weight.trend = 'down';
    } else {
      weight.trend = 'stable';
    }

    weight.lastUpdated = new Date().toISOString();
    this.saveAgentMemory();
  }

  /**
   * Update user preferences based on feedback
   */
  updateUserPreferences(feedback: {
    safetyTooHigh?: boolean;
    noiseTooLow?: boolean;
    valueTooStrict?: boolean;
    commuteTooImportant?: boolean;
  }): void {
    const prefs = this.agentMemory.userPreferences;

    if (feedback.safetyTooHigh) prefs.safetyWeight *= 0.9;
    if (feedback.noiseTooLow) prefs.noiseWeight *= 1.1;
    if (feedback.valueTooStrict) prefs.valueWeight *= 0.9;
    if (feedback.commuteTooImportant) prefs.commuteWeight *= 0.9;

    this.saveAgentMemory();
  }

  /**
   * Learn patterns from listings
   */
  learnFromListing(listingData: any, truthReport: any, userFeedback: 'positive' | 'negative'): void {
    // Update listing history
    this.updateListingHistory(listingData.url, truthReport.verdict, userFeedback);

    // Learn patterns based on feedback
    if (userFeedback === 'negative') {
      // If user didn't like a listing we recommended, learn what went wrong
      if (truthReport.verdict === 'RECOMMENDED') {
        // Maybe our scoring was off - reduce weights of sources that led to this recommendation
        truthReport.evidence?.forEach((evidence: any) => {
          if (evidence.sentiment === 'positive') {
            // This positive evidence led to a bad recommendation
            this.agentMemory.patterns.scamIndicators.push(
              `False positive: ${evidence.category} - ${evidence.points[0]}`
            );
          }
        });
      }
    }

    this.saveAgentMemory();
  }

  /**
   * Get current agent memory for frontend display
   */
  getSourceWeights(): Array<{ source: string; reliability: number; trend: 'up' | 'down' | 'stable' }> {
    return Object.entries(this.agentMemory.sourceWeights).map(([source, data]) => ({
      source,
      reliability: data.reliability,
      trend: data.trend
    }));
  }

  /**
   * Get listing history
   */
  getListingHistory(): any[] {
    return this.agentMemory.listingHistory;
  }

  // Private helper methods
  private updateListingHistory(url: string, verdict: string, userFeedback?: 'positive' | 'negative'): void {
    const existing = this.agentMemory.listingHistory.find(h => h.url === url);
    
    if (existing) {
      existing.verdict = verdict;
      existing.userFeedback = userFeedback;
    } else {
      this.agentMemory.listingHistory.push({
        url,
        verdict,
        userFeedback,
        timestamp: new Date().toISOString()
      });
    }

    // Keep only last 100 entries
    if (this.agentMemory.listingHistory.length > 100) {
      this.agentMemory.listingHistory = this.agentMemory.listingHistory.slice(-100);
    }
  }

  private storeInLocalStorage(key: string, data: any): void {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(data);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  }

  // Removed Slack formatting - using email instead

  private loadAgentMemory(): AgentMemory {
    try {
      const stored = localStorage.getItem('agentMemory');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load agent memory:', error);
    }

    // Return default memory
    return {
      sourceWeights: {
        'City Records': { reliability: 95, trend: 'stable', lastUpdated: new Date().toISOString() },
        'Reddit Community': { reliability: 65, trend: 'up', lastUpdated: new Date().toISOString() },
        'Google Reviews': { reliability: 70, trend: 'stable', lastUpdated: new Date().toISOString() },
        'Official Listing': { reliability: 80, trend: 'down', lastUpdated: new Date().toISOString() }
      },
      userPreferences: {
        safetyWeight: 1.0,
        noiseWeight: 1.0,
        valueWeight: 1.0,
        commuteWeight: 1.0
      },
      listingHistory: [],
      patterns: {
        scamIndicators: [],
        noisePatterns: [],
        valuePatterns: []
      }
    };
  }

  private saveAgentMemory(): void {
    try {
      localStorage.setItem('agentMemory', JSON.stringify(this.agentMemory));
    } catch (error) {
      console.error('Failed to save agent memory:', error);
    }
  }
}

export default PostmanService;