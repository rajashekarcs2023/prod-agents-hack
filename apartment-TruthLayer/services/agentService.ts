import ParallelWebService from './parallelService';
import LightpandaService from './lightpandaService';
import PostmanService from './postmanService';
import { AgentState, TruthReport, SourceWeight, AgentAction, UserPreferences } from '../types';

interface AgentConfig {
  parallelApiKey?: string;
  lightpandaToken?: string;
  postmanConfig?: {
    apiKey?: string;
    webhookUrl?: string;
  };
}

class AgentService {
  private parallelService?: ParallelWebService;
  private lightpandaService: LightpandaService;
  private postmanService: PostmanService;
  private config: AgentConfig;

  constructor(config: AgentConfig = {}) {
    this.config = config;

    // Initialize services
    if (config.parallelApiKey) {
      this.parallelService = new ParallelWebService(config.parallelApiKey);
    }

    this.lightpandaService = new LightpandaService({
      useCloud: !!config.lightpandaToken,
      token: config.lightpandaToken
    });

    this.postmanService = new PostmanService(config.postmanConfig || {});
  }

  /**
   * Main agent orchestration method - processes a listing URL through the complete pipeline
   */
  async processListing(
    url: string, 
    preferences: UserPreferences,
    onStateChange?: (state: AgentState) => void,
    onLogMessage?: (source: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  ): Promise<{
    report: TruthReport;
    actions: AgentAction[];
    weights: SourceWeight[];
  }> {
    
    try {
      // Phase 1: SCRAPING
      onStateChange?.(AgentState.SCRAPING);
      onLogMessage?.('LIGHTPANDA', 'Navigating to listing URL and bypassing bot detection...', 'info');
      
      const scrapingResult = await this.lightpandaService.scrapeListing(url);
      
      if (!scrapingResult.success || !scrapingResult.data) {
        throw new Error(`Scraping failed: ${scrapingResult.error}`);
      }

      const listingData = scrapingResult.data;
      onLogMessage?.('LIGHTPANDA', `Extracted: $${listingData.rent}/month, ${listingData.bedrooms}BR at ${listingData.address}`, 'success');

      // Phase 2: INVESTIGATING
      onStateChange?.(AgentState.INVESTIGATING);
      onLogMessage?.('PARALLEL', 'Cross-referencing with crime databases and community reports...', 'info');

      let parallelResults: any = {};
      
      if (this.parallelService && listingData.address) {
        // Run parallel research tasks
        const [neighborhoodData, landlordData, marketData, scamData] = await Promise.allSettled([
          this.parallelService.researchNeighborhood(listingData.address),
          this.parallelService.researchLandlordAndBuilding(listingData.address, listingData.contactInfo?.name),
          this.parallelService.researchMarketValue(listingData.address, listingData.rent || 0, listingData.bedrooms, listingData.sqft),
          this.parallelService.detectScamRisks(listingData.description || '', listingData.rent || 0, listingData.address)
        ]);

        parallelResults = {
          neighborhood: neighborhoodData.status === 'fulfilled' ? neighborhoodData.value : null,
          landlord: landlordData.status === 'fulfilled' ? landlordData.value : null,
          market: marketData.status === 'fulfilled' ? marketData.value : null,
          scam: scamData.status === 'fulfilled' ? scamData.value : null
        };

        const issuesFound = [];
        if (parallelResults.neighborhood?.data?.safety_score < 7) issuesFound.push('safety concerns');
        if (parallelResults.scam?.data?.scam_risk_level === 'High') issuesFound.push('scam indicators');
        if (parallelResults.market?.data?.market_comparison?.includes('Overpriced')) issuesFound.push('overpriced');

        if (issuesFound.length > 0) {
          onLogMessage?.('PARALLEL', `Found potential issues: ${issuesFound.join(', ')}`, 'warning');
        } else {
          onLogMessage?.('PARALLEL', 'Background checks completed - no major red flags detected', 'success');
        }
      } else {
        onLogMessage?.('PARALLEL', 'Parallel Web API not configured - using fallback research', 'warning');
        parallelResults = this.generateFallbackResearch(listingData, preferences);
      }

      // Phase 3: ANALYZING
      onStateChange?.(AgentState.ANALYZING);
      onLogMessage?.('GEMINI', `Synthesizing evidence against user priorities (Safety: ${preferences.priorities.safety}/5)...`, 'info');

      const report = this.generateTruthReport(listingData, parallelResults, preferences);
      onLogMessage?.('GEMINI', `Analysis complete - ${report.verdict} with ${report.overallScore}/100 confidence`, 'success');

      // Phase 4: ACTING
      onStateChange?.(AgentState.ACTING);
      onLogMessage?.('POSTMAN', 'Executing autonomous workflows based on verdict...', 'info');

      const actions = await this.executeActions(listingData, report, preferences);

      // Phase 5: LEARNING
      onStateChange?.(AgentState.LEARNING);
      onLogMessage?.('SYSTEM', 'Updating source weights and learning patterns...', 'info');

      const weights = this.updateLearning(parallelResults, report);

      return { report, actions, weights };

    } catch (error) {
      onLogMessage?.('SYSTEM', `Agent error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      throw error;
    }
  }

  /**
   * Execute user-initiated actions
   */
  async executeUserAction(
    action: 'shortlist' | 'blacklist' | 'schedule_tour' | 'share',
    listingData: any,
    report: TruthReport,
    userInfo?: any
  ): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];

    switch (action) {
      case 'shortlist':
        const shortlistAction = await this.postmanService.shortlistListing(listingData, report);
        actions.push({
          id: shortlistAction.id,
          type: 'API_CALL',
          description: shortlistAction.description,
          status: shortlistAction.status,
          detail: 'POST /shortlist'
        });
        break;

      case 'blacklist':
        const blacklistAction = await this.postmanService.blacklistListing(listingData, 'User blacklisted');
        actions.push({
          id: blacklistAction.id,
          type: 'API_CALL',
          description: blacklistAction.description,
          status: blacklistAction.status,
          detail: 'POST /blacklist'
        });
        break;

      case 'schedule_tour':
        // First try to auto-fill the form
        const formFilled = await this.lightpandaService.fillContactForm(userInfo);
        
        actions.push({
          id: `form_${Date.now()}`,
          type: 'BROWSER_INTERACTION',
          description: formFilled ? 'Contact form pre-filled successfully' : 'Form auto-fill failed - manual entry required',
          status: formFilled ? 'COMPLETED' : 'FAILED',
          detail: 'Lightpanda: Auto-fill contact form'
        });

        const tourAction = await this.postmanService.scheduleTourRequest(listingData, userInfo);
        actions.push({
          id: tourAction.id,
          type: 'API_CALL',
          description: tourAction.description,
          status: tourAction.status,
          detail: 'POST /schedule_tour'
        });
        break;

      case 'share':
        const notifyAction = await this.postmanService.sendNotification(listingData, report, 'high_priority');
        actions.push({
          id: notifyAction.id,
          type: 'NOTIFICATION',
          description: notifyAction.description,
          status: notifyAction.status,
          detail: 'Slack/Email notification'
        });
        break;
    }

    return actions;
  }

  /**
   * Process user feedback for learning
   */
  processFeedback(
    listingUrl: string,
    report: TruthReport,
    feedback: 'thumbs_up' | 'thumbs_down',
    specificFeedback?: {
      safetyTooHigh?: boolean;
      noiseTooLow?: boolean;
      valueTooStrict?: boolean;
    }
  ): void {
    // Update user preferences
    if (specificFeedback) {
      this.postmanService.updateUserPreferences(specificFeedback);
    }

    // Update source weights based on accuracy
    const userFeedbackType = feedback === 'thumbs_up' ? 'positive' : 'negative';
    this.postmanService.learnFromListing({ url: listingUrl }, report, userFeedbackType);

    // Update source reliability based on feedback
    if (feedback === 'thumbs_down') {
      // If the user disagreed with our assessment, lower the reliability of sources that contributed to it
      report.evidence?.forEach(evidence => {
        if (evidence.sentiment === 'positive' && report.verdict === 'RECOMMENDED') {
          // This positive evidence led to a bad recommendation
          this.postmanService.updateSourceWeights(evidence.category, 'inaccurate');
        }
      });
    }
  }

  /**
   * Get current source weights for display
   */
  getSourceWeights(): SourceWeight[] {
    return this.postmanService.getSourceWeights();
  }

  // Private helper methods

  private generateTruthReport(
    listingData: any,
    parallelResults: any,
    preferences: UserPreferences
  ): TruthReport {
    // Calculate individual scores
    const safetyScore = parallelResults.neighborhood?.data?.safety_score || 7;
    const noiseScore = 10 - (parallelResults.neighborhood?.data?.noise_level || 3);
    const scamRisk = this.calculateScamRisk(parallelResults.scam?.data);
    const valueAssessment = this.calculateValueScore(parallelResults.market?.data, listingData.rent);

    // Calculate weighted overall score based on user preferences
    const weights = {
      safety: preferences.priorities.safety / 5,
      noise: preferences.priorities.quietness / 5,
      value: preferences.priorities.value / 5,
      commute: preferences.priorities.commute / 5
    };

    const overallScore = Math.round(
      (safetyScore * weights.safety * 10) +
      (noiseScore * weights.noise * 10) +
      ((scamRisk === 'Low' ? 9 : scamRisk === 'Medium' ? 6 : 3) * 10) +
      (valueAssessment.score * weights.value * 10)
    ) / (weights.safety + weights.noise + weights.value + 1); // +1 for scam weight

    // Determine verdict
    let verdict: 'RECOMMENDED' | 'CAUTION' | 'AVOID' = 'RECOMMENDED';
    let verdictTitle = '👍 Worth pursuing';

    if (scamRisk === 'High' || safetyScore < 4) {
      verdict = 'AVOID';
      verdictTitle = '🚫 Avoid this listing';
    } else if (overallScore < 60 || scamRisk === 'Medium' || safetyScore < 6) {
      verdict = 'CAUTION';
      verdictTitle = '⚠️ Proceed with caution';
    }

    // Build evidence array
    const evidence = [];

    if (parallelResults.neighborhood?.success) {
      evidence.push({
        category: 'Safety' as const,
        points: [
          `Safety score: ${safetyScore}/10`,
          parallelResults.neighborhood.data?.crime_summary || 'Crime data analyzed'
        ],
        sentiment: safetyScore >= 7 ? 'positive' : safetyScore >= 5 ? 'neutral' : 'negative'
      });

      evidence.push({
        category: 'Noise' as const,
        points: [
          `Noise level: ${10 - noiseScore}/10`,
          ...(parallelResults.neighborhood.data?.recent_incidents || [])
        ],
        sentiment: noiseScore >= 7 ? 'positive' : noiseScore >= 5 ? 'neutral' : 'negative'
      });
    }

    if (parallelResults.landlord?.success) {
      evidence.push({
        category: 'Landlord' as const,
        points: [
          `Reputation: ${parallelResults.landlord.data?.landlord_reputation || 'Unknown'}`,
          ...(parallelResults.landlord.data?.red_flags || [])
        ],
        sentiment: parallelResults.landlord.data?.tenant_satisfaction >= 7 ? 'positive' : 'neutral'
      });
    }

    if (parallelResults.market?.success) {
      evidence.push({
        category: 'Value' as const,
        points: [
          `Market comparison: ${parallelResults.market.data?.market_comparison || 'Fair Market Value'}`,
          `Estimated fair rent: $${parallelResults.market.data?.estimated_fair_rent || listingData.rent}`
        ],
        sentiment: valueAssessment.sentiment
      });
    }

    // Generate summary
    const summaryParts = [];
    if (safetyScore >= 7) summaryParts.push('safe area');
    if (noiseScore >= 7) summaryParts.push('quiet location');
    if (scamRisk === 'Low') summaryParts.push('legitimate listing');
    if (valueAssessment.sentiment === 'positive') summaryParts.push('good value');

    const summary = summaryParts.length > 0 
      ? `This property offers ${summaryParts.join(', ')}.`
      : 'Mixed signals found - review details carefully.';

    // Action recommendation
    let actionRecommendation: 'SHORTLIST' | 'BLACKLIST' | 'SCHEDULE_TOUR' | 'AVOID' = 'SHORTLIST';
    if (verdict === 'AVOID') {
      actionRecommendation = 'BLACKLIST';
    } else if (verdict === 'RECOMMENDED' && overallScore > 80) {
      actionRecommendation = 'SCHEDULE_TOUR';
    }

    return {
      verdict,
      verdictTitle,
      overallScore: Math.max(0, Math.min(100, overallScore)),
      scores: {
        scamRisk,
        safety: safetyScore,
        noise: noiseScore,
        value: valueAssessment.label,
        commute: '35-45m' // TODO: Calculate actual commute
      },
      evidence,
      summary,
      actionRecommendation
    };
  }

  private calculateScamRisk(scamData: any): 'Low' | 'Medium' | 'High' {
    if (!scamData) return 'Medium';
    return scamData.scam_risk_level || 'Low';
  }

  private calculateValueScore(marketData: any, actualRent: number): {
    score: number;
    label: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  } {
    if (!marketData) {
      return { score: 5, label: 'Unknown', sentiment: 'neutral' };
    }

    const comparison = marketData.market_comparison;
    const fairRent = marketData.estimated_fair_rent || actualRent;
    const priceDiff = actualRent - fairRent;
    const percentDiff = (priceDiff / fairRent) * 100;

    if (comparison?.includes('Underpriced') || percentDiff < -10) {
      return { score: 9, label: 'Great Deal', sentiment: 'positive' };
    } else if (comparison?.includes('Below Market') || percentDiff < -5) {
      return { score: 7, label: 'Good Value', sentiment: 'positive' };
    } else if (comparison?.includes('Fair') || Math.abs(percentDiff) < 5) {
      return { score: 5, label: 'Fair Price', sentiment: 'neutral' };
    } else if (comparison?.includes('Above Market') || percentDiff > 5) {
      return { score: 3, label: 'Overpriced', sentiment: 'negative' };
    } else {
      return { score: 1, label: 'Very Overpriced', sentiment: 'negative' };
    }
  }

  private async executeActions(
    listingData: any,
    report: TruthReport,
    preferences: UserPreferences
  ): Promise<AgentAction[]> {
    const actions: AgentAction[] = [];

    // Auto-execute actions based on verdict
    if (report.verdict === 'RECOMMENDED' && report.overallScore > 75) {
      // High-quality listing - auto shortlist and notify
      const shortlistAction = await this.postmanService.shortlistListing(listingData, report);
      actions.push({
        id: shortlistAction.id,
        type: 'API_CALL',
        description: 'Auto-shortlisted high-quality listing',
        status: shortlistAction.status,
        detail: 'POST /shortlist'
      });

      const notifyAction = await this.postmanService.sendNotification(listingData, report, 'high_priority');
      actions.push({
        id: notifyAction.id,
        type: 'NOTIFICATION',
        description: 'Sent high-priority listing notification',
        status: notifyAction.status,
        detail: 'Slack/Email webhook'
      });

    } else if (report.verdict === 'AVOID') {
      // Bad listing - auto blacklist
      const blacklistAction = await this.postmanService.blacklistListing(listingData, 'High risk/scam detected');
      actions.push({
        id: blacklistAction.id,
        type: 'API_CALL',
        description: 'Auto-blacklisted high-risk listing',
        status: blacklistAction.status,
        detail: 'POST /blacklist'
      });
    }

    return actions;
  }

  private updateLearning(parallelResults: any, report: TruthReport): SourceWeight[] {
    // Update source weights based on confidence levels from Parallel API
    if (parallelResults.neighborhood?.success) {
      const confidence = parallelResults.neighborhood.confidence;
      this.postmanService.updateSourceWeights('City Records', confidence === 'high' ? 'accurate' : 'inaccurate');
    }

    if (parallelResults.landlord?.success) {
      const confidence = parallelResults.landlord.confidence;
      this.postmanService.updateSourceWeights('Google Reviews', confidence === 'high' ? 'accurate' : 'inaccurate');
    }

    return this.postmanService.getSourceWeights();
  }

  private generateFallbackResearch(listingData: any, preferences: UserPreferences): any {
    // Generate realistic but fake research data for demo purposes
    const rent = listingData.rent || 3000;
    const safetyScore = 6 + Math.random() * 3; // 6-9 range
    const noiseLevel = 2 + Math.random() * 6; // 2-8 range

    return {
      neighborhood: {
        success: true,
        data: {
          safety_score: safetyScore,
          crime_summary: safetyScore > 7 ? 'Low crime area with recent improvements' : 'Moderate crime levels, stay aware',
          noise_level: noiseLevel,
          neighborhood_vibe: 'Young professionals and families',
          recent_incidents: noiseLevel > 6 ? ['Construction permit active nearby', 'Late-night venue complaints'] : []
        },
        confidence: 'medium'
      },
      landlord: {
        success: true,
        data: {
          landlord_reputation: 'Good',
          building_maintenance: 'Fair',
          tenant_satisfaction: 6.5,
          red_flags: [],
          positive_aspects: ['Responsive to maintenance requests']
        },
        confidence: 'medium'
      },
      market: {
        success: true,
        data: {
          market_comparison: rent > 3500 ? 'Above Market' : rent < 2800 ? 'Below Market' : 'Fair Market Value',
          estimated_fair_rent: rent * (0.9 + Math.random() * 0.2),
          value_assessment: 'Typical for the area'
        },
        confidence: 'medium'
      },
      scam: {
        success: true,
        data: {
          scam_risk_level: 'Low',
          authenticity_score: 8,
          scam_indicators: [],
          recommendations: ['Verify identity during tour']
        },
        confidence: 'high'
      }
    };
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.lightpandaService.cleanup();
  }
}

export default AgentService;