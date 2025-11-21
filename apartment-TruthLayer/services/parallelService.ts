interface ParallelTaskRequest {
  task_spec: {
    output_schema: string | {
      type: string;
      json_schema: object;
    };
    input_schema?: {
      type: string;
      json_schema: object;
    };
  };
  input: string | object;
  processor: 'base' | 'core';
}

interface ParallelTaskResponse {
  run_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  is_active: boolean;
  warnings: string[] | null;
  processor: string;
  metadata: any;
  created_at: string;
  modified_at: string;
}

interface ParallelTaskResult {
  run: ParallelTaskResponse;
  output: {
    content: any;
    basis: {
      field: string;
      citations: {
        title: string;
        url: string;
        excerpts: string[];
      }[];
      reasoning: string;
      confidence: 'high' | 'medium' | 'low';
    }[];
    type: 'json' | 'text';
  };
}

class ParallelWebService {
  private apiKey: string;
  private baseUrl = 'https://api.parallel.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Research neighborhood safety and characteristics
   */
  async researchNeighborhood(address: string): Promise<any> {
    const taskRequest: ParallelTaskRequest = {
      task_spec: {
        output_schema: {
          type: "json",
          json_schema: {
            type: "object",
            properties: {
              safety_score: {
                type: "number",
                description: "Safety score from 1-10 based on crime data, police reports, and community feedback"
              },
              crime_summary: {
                type: "string",
                description: "Brief summary of recent crime activity in the area"
              },
              noise_level: {
                type: "number", 
                description: "Noise level from 1-10 based on construction, traffic, and community complaints"
              },
              neighborhood_vibe: {
                type: "string",
                description: "Description of the neighborhood character and demographics"
              },
              recent_incidents: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of notable recent incidents or concerns in the area"
              }
            },
            required: ["safety_score", "crime_summary", "noise_level", "neighborhood_vibe"],
            additionalProperties: false
          }
        }
      },
      input: `Research the safety, noise levels, and general neighborhood characteristics for ${address}. Look for crime statistics, noise complaints, construction activity, and community discussions about this area.`,
      processor: 'core'
    };

    return this.executeTask(taskRequest);
  }

  /**
   * Research landlord reputation and building history
   */
  async researchLandlordAndBuilding(address: string, landlordName?: string): Promise<any> {
    const searchQuery = landlordName 
      ? `Research landlord "${landlordName}" and building at ${address} for reputation, reviews, complaints, and maintenance issues`
      : `Research the building management and landlord reputation for ${address}, including tenant reviews, maintenance complaints, and management quality`;

    const taskRequest: ParallelTaskRequest = {
      task_spec: {
        output_schema: {
          type: "json",
          json_schema: {
            type: "object",
            properties: {
              landlord_reputation: {
                type: "string",
                enum: ["Excellent", "Good", "Fair", "Poor", "Very Poor"],
                description: "Overall landlord reputation based on reviews and complaints"
              },
              building_maintenance: {
                type: "string",
                enum: ["Excellent", "Good", "Fair", "Poor", "Very Poor"], 
                description: "Building maintenance quality based on tenant feedback"
              },
              tenant_satisfaction: {
                type: "number",
                description: "Tenant satisfaction score from 1-10"
              },
              red_flags: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of any concerning issues found about the landlord or building"
              },
              positive_aspects: {
                type: "array",
                items: {
                  type: "string"  
                },
                description: "List of positive aspects mentioned in reviews"
              }
            },
            required: ["landlord_reputation", "building_maintenance", "tenant_satisfaction"],
            additionalProperties: false
          }
        }
      },
      input: searchQuery,
      processor: 'core'
    };

    return this.executeTask(taskRequest);
  }

  /**
   * Research market pricing and value analysis
   */
  async researchMarketValue(address: string, rent: number, bedrooms?: number, sqft?: number): Promise<any> {
    const taskRequest: ParallelTaskRequest = {
      task_spec: {
        output_schema: {
          type: "json", 
          json_schema: {
            type: "object",
            properties: {
              market_comparison: {
                type: "string",
                enum: ["Significantly Underpriced", "Below Market", "Fair Market Value", "Above Market", "Significantly Overpriced"],
                description: "How this listing compares to market rates"
              },
              estimated_fair_rent: {
                type: "number",
                description: "Estimated fair market rent for this property"
              },
              price_per_sqft: {
                type: "number", 
                description: "Price per square foot if available"
              },
              hidden_fees_common: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "Common hidden fees or additional costs for similar properties in this area"
              },
              value_assessment: {
                type: "string",
                description: "Overall value assessment and recommendation"
              }
            },
            required: ["market_comparison", "estimated_fair_rent", "value_assessment"],
            additionalProperties: false
          }
        }
      },
      input: `Analyze the rental value for ${address} at $${rent}/month${bedrooms ? ` with ${bedrooms} bedrooms` : ''}${sqft ? ` and ${sqft} sqft` : ''}. Compare to similar properties in the area and identify any typical hidden fees or additional costs.`,
      processor: 'core'
    };

    return this.executeTask(taskRequest);
  }

  /**
   * Detect potential scams or red flags
   */
  async detectScamRisks(listingText: string, rent: number, address: string): Promise<any> {
    const taskRequest: ParallelTaskRequest = {
      task_spec: {
        output_schema: {
          type: "json",
          json_schema: {
            type: "object", 
            properties: {
              scam_risk_level: {
                type: "string",
                enum: ["Very Low", "Low", "Medium", "High", "Very High"],
                description: "Overall scam risk assessment"
              },
              scam_indicators: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of potential scam warning signs found"
              },
              authenticity_score: {
                type: "number",
                description: "Authenticity score from 1-10"
              },
              recommendations: {
                type: "array", 
                items: {
                  type: "string"
                },
                description: "Recommendations for verifying this listing"
              }
            },
            required: ["scam_risk_level", "authenticity_score"],
            additionalProperties: false
          }
        }
      },
      input: `Analyze this rental listing for potential scam indicators:\n\nAddress: ${address}\nRent: $${rent}\nListing Description: ${listingText}\n\nCheck for common rental scam patterns, unrealistic pricing, suspicious language, and authenticity issues.`,
      processor: 'core'
    };

    return this.executeTask(taskRequest);
  }

  /**
   * Execute a Parallel task and wait for completion
   */
  private async executeTask(taskRequest: ParallelTaskRequest): Promise<any> {
    try {
      // Create task
      const createResponse = await fetch(`${this.baseUrl}/tasks/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify(taskRequest)
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create task: ${createResponse.statusText}`);
      }

      const taskResponse: ParallelTaskResponse = await createResponse.json();
      const runId = taskResponse.run_id;

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max wait
      const pollInterval = 5000; // 5 seconds

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        const resultResponse = await fetch(`${this.baseUrl}/tasks/runs/${runId}/result`, {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey
          }
        });

        if (resultResponse.ok) {
          const result: ParallelTaskResult = await resultResponse.json();
          
          if (result.run.status === 'completed') {
            return {
              success: true,
              data: result.output.content,
              citations: result.output.basis,
              confidence: this.getOverallConfidence(result.output.basis)
            };
          } else if (result.run.status === 'failed') {
            throw new Error('Task failed to complete');
          }
        }

        attempts++;
      }

      throw new Error('Task timed out');

    } catch (error) {
      console.error('Parallel API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      };
    }
  }

  private getOverallConfidence(basis: any[]): 'high' | 'medium' | 'low' {
    if (!basis || basis.length === 0) return 'low';
    
    const confidenceLevels = basis.map(b => b.confidence);
    const highCount = confidenceLevels.filter(c => c === 'high').length;
    const mediumCount = confidenceLevels.filter(c => c === 'medium').length;
    
    if (highCount / confidenceLevels.length > 0.6) return 'high';
    if ((highCount + mediumCount) / confidenceLevels.length > 0.6) return 'medium';
    return 'low';
  }
}

export default ParallelWebService;