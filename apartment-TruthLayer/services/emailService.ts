import emailjs from '@emailjs/browser';

interface EmailNotification {
  type: 'high_priority' | 'weekly_summary' | 'action_confirmation';
  listing?: {
    address: string;
    rent: number;
    url: string;
  };
  truthReport?: {
    summary: string;
    overallScore: number;
    verdict: string;
    evidence?: any[];
  };
  action?: string;
  timestamp: string;
}

class EmailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private userEmail: string;
  private isInitialized: boolean = false;

  constructor() {
    // Get config from environment variables
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
    this.userEmail = import.meta.env.VITE_USER_EMAIL || 'rajashekarvennavelli@gmail.com';

    // Initialize EmailJS if keys are provided
    if (this.publicKey) {
      emailjs.init(this.publicKey);
      this.isInitialized = true;
    }
  }

  /**
   * Send a high-priority listing notification
   */
  async sendListingAlert(notification: EmailNotification): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('EmailJS not configured - would send:', notification);
      return false;
    }

    try {
      const emailParams = {
        to_email: this.userEmail,
        subject: this.generateSubject(notification),
        ...this.formatEmailContent(notification)
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        emailParams
      );

      console.log('Email sent successfully:', response);
      return true;

    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send action confirmation email
   */
  async sendActionConfirmation(
    action: string,
    listingAddress: string,
    details?: string
  ): Promise<boolean> {
    const notification: EmailNotification = {
      type: 'action_confirmation',
      action,
      listing: {
        address: listingAddress,
        rent: 0,
        url: ''
      },
      timestamp: new Date().toISOString()
    };

    return this.sendListingAlert(notification);
  }

  /**
   * Check if email service is properly configured
   */
  isConfigured(): boolean {
    return this.isInitialized && !!this.serviceId && !!this.templateId;
  }

  /**
   * Get configuration status for debugging
   */
  getStatus(): {
    configured: boolean;
    userEmail: string;
    hasServiceId: boolean;
    hasTemplateId: boolean;
    hasPublicKey: boolean;
  } {
    return {
      configured: this.isConfigured(),
      userEmail: this.userEmail,
      hasServiceId: !!this.serviceId,
      hasTemplateId: !!this.templateId,
      hasPublicKey: !!this.publicKey
    };
  }

  // Private helper methods

  private generateSubject(notification: EmailNotification): string {
    const emoji = this.getVerdictEmoji(notification.truthReport?.verdict);
    
    switch (notification.type) {
      case 'high_priority':
        return `${emoji} RentCheck Alert: High-Quality Listing Found`;
      case 'action_confirmation':
        return `✅ RentCheck: ${notification.action} completed`;
      case 'weekly_summary':
        return `📊 RentCheck Weekly Summary`;
      default:
        return `🏠 RentCheck Notification`;
    }
  }

  private formatEmailContent(notification: EmailNotification): any {
    const { listing, truthReport, action } = notification;
    const emoji = this.getVerdictEmoji(truthReport?.verdict);
    
    if (notification.type === 'high_priority' && listing && truthReport) {
      return {
        listing_address: listing.address,
        listing_rent: `$${listing.rent.toLocaleString()}`,
        listing_url: listing.url,
        truth_score: `${truthReport.overallScore}/100`,
        verdict_emoji: emoji,
        verdict_text: truthReport.verdict,
        summary: truthReport.summary,
        evidence_points: this.formatEvidence(truthReport.evidence),
        action_recommendation: this.getActionText(truthReport.verdict),
        timestamp: new Date().toLocaleString()
      };
    }

    if (notification.type === 'action_confirmation' && listing) {
      return {
        action_taken: action,
        listing_address: listing.address,
        timestamp: new Date().toLocaleString(),
        message: `Your ${action} action has been processed successfully.`
      };
    }

    return {
      message: 'RentCheck notification',
      timestamp: new Date().toLocaleString()
    };
  }

  private formatEvidence(evidence?: any[]): string {
    if (!evidence || evidence.length === 0) return 'No specific evidence found.';

    return evidence
      .map(item => {
        const sentiment = item.sentiment === 'positive' ? '✅' : 
                        item.sentiment === 'negative' ? '❌' : '⚪';
        const points = item.points.slice(0, 2).join(', '); // Limit to 2 points
        return `${sentiment} ${item.category}: ${points}`;
      })
      .slice(0, 4) // Limit to 4 evidence items
      .join('\n');
  }

  private getVerdictEmoji(verdict?: string): string {
    switch (verdict) {
      case 'RECOMMENDED': return '✅';
      case 'CAUTION': return '⚠️';
      case 'AVOID': return '🚫';
      default: return '🏠';
    }
  }

  private getActionText(verdict?: string): string {
    switch (verdict) {
      case 'RECOMMENDED': return 'Consider shortlisting and scheduling a tour';
      case 'CAUTION': return 'Review carefully before proceeding';
      case 'AVOID': return 'Recommended to skip this listing';
      default: return 'Review the details carefully';
    }
  }
}

// Create singleton instance
export const emailService = new EmailService();

// Export for direct use
export default emailService;