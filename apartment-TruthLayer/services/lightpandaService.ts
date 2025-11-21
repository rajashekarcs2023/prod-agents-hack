interface LightpandaConfig {
  host?: string;
  port?: number;
  browserWSEndpoint?: string;
  useCloud?: boolean;
  token?: string;
}

interface ListingData {
  url: string;
  title?: string;
  address?: string;
  rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  description?: string;
  amenities?: string[];
  photos?: string[];
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  listingDate?: string;
  availability?: string;
}

interface ScrapingResult {
  success: boolean;
  data?: ListingData;
  error?: string;
  timestamp: string;
}

class LightpandaService {
  private config: LightpandaConfig;
  private browser: any = null;
  private page: any = null;

  constructor(config: LightpandaConfig = {}) {
    this.config = {
      host: '127.0.0.1',
      port: 9222,
      useCloud: false,
      ...config
    };
  }

  /**
   * Initialize Lightpanda browser connection
   */
  async initialize(): Promise<boolean> {
    try {
      // Dynamic import to avoid build issues if puppeteer-core isn't installed
      const puppeteer = await import('puppeteer-core');
      
      let browserWSEndpoint: string;
      
      if (this.config.useCloud && this.config.token) {
        // Use Lightpanda cloud
        browserWSEndpoint = `wss://euwest.cloud.lightpanda.io/ws?token=${this.config.token}`;
      } else {
        // Use local Lightpanda
        browserWSEndpoint = `ws://${this.config.host}:${this.config.port}`;
      }

      this.browser = await puppeteer.connect({
        browserWSEndpoint
      });

      this.page = await this.browser.newPage();
      
      // Set realistic user agent and viewport
      await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await this.page.setViewport({ width: 1280, height: 720 });
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Lightpanda:', error);
      return false;
    }
  }

  /**
   * Scrape a rental listing from various platforms
   */
  async scrapeListing(url: string): Promise<ScrapingResult> {
    if (!this.page) {
      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'Failed to initialize browser',
          timestamp: new Date().toISOString()
        };
      }
    }

    try {
      await this.page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });

      // Wait for dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      let listingData: ListingData;

      if (url.includes('zillow.com')) {
        listingData = await this.scrapeZillow(url);
      } else if (url.includes('craigslist.org')) {
        listingData = await this.scrapeCraigslist(url);
      } else if (url.includes('apartments.com')) {
        listingData = await this.scrapeApartments(url);
      } else {
        listingData = await this.scrapeGeneric(url);
      }

      return {
        success: true,
        data: listingData,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Scraping failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown scraping error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Scrape Zillow listing
   */
  private async scrapeZillow(url: string): Promise<ListingData> {
    const data: ListingData = { url };

    try {
      // Title/Address
      data.title = await this.page.$eval('h1[data-testid="property-details-address"]', 
        (el: Element) => el.textContent?.trim()).catch(() => undefined);
      
      data.address = data.title;

      // Price
      const priceText = await this.page.$eval('[data-testid="property-details-price"]', 
        (el: Element) => el.textContent).catch(() => '');
      data.rent = this.extractPrice(priceText);

      // Bedrooms/Bathrooms
      const bedsText = await this.page.$eval('[data-testid="property-details-beds"]', 
        (el: Element) => el.textContent).catch(() => '');
      data.bedrooms = this.extractNumber(bedsText);

      const bathsText = await this.page.$eval('[data-testid="property-details-baths"]', 
        (el: Element) => el.textContent).catch(() => '');
      data.bathrooms = this.extractNumber(bathsText);

      // Square footage
      const sqftText = await this.page.$eval('[data-testid="property-details-sqft"]', 
        (el: Element) => el.textContent).catch(() => '');
      data.sqft = this.extractNumber(sqftText);

      // Description
      data.description = await this.page.$eval('.property-details-description', 
        (el: Element) => el.textContent?.trim()).catch(() => undefined);

      // Photos
      data.photos = await this.page.$$eval('img[data-testid*="photo"]', 
        (imgs: Element[]) => imgs.map(img => (img as HTMLImageElement).src)
          .filter(src => src && !src.includes('data:'))).catch(() => []);

    } catch (error) {
      console.warn('Zillow scraping error:', error);
    }

    return data;
  }

  /**
   * Scrape Craigslist listing
   */
  private async scrapeCraigslist(url: string): Promise<ListingData> {
    const data: ListingData = { url };

    try {
      // Title
      data.title = await this.page.$eval('#titletextonly', 
        (el: Element) => el.textContent?.trim()).catch(() => undefined);

      // Price
      const priceText = await this.page.$eval('.price', 
        (el: Element) => el.textContent).catch(() => '');
      data.rent = this.extractPrice(priceText);

      // Housing info (bedrooms/sqft)
      const housingText = await this.page.$eval('.housing', 
        (el: Element) => el.textContent).catch(() => '');
      data.bedrooms = this.extractBedroomsFromText(housingText);
      data.sqft = this.extractNumber(housingText);

      // Description
      data.description = await this.page.$eval('#postingbody', 
        (el: Element) => el.textContent?.trim()).catch(() => undefined);

      // Photos
      data.photos = await this.page.$$eval('#thumbs img', 
        (imgs: Element[]) => imgs.map(img => (img as HTMLImageElement).src)
          .filter(src => src && !src.includes('data:'))).catch(() => []);

      // Contact info
      const phoneText = await this.page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const phoneLink = links.find(link => link.href.includes('tel:'));
        return phoneLink?.textContent?.trim();
      }).catch(() => undefined);

      if (phoneText) {
        data.contactInfo = { phone: phoneText };
      }

    } catch (error) {
      console.warn('Craigslist scraping error:', error);
    }

    return data;
  }

  /**
   * Scrape Apartments.com listing  
   */
  private async scrapeApartments(url: string): Promise<ListingData> {
    const data: ListingData = { url };

    try {
      // Title/Address
      data.title = await this.page.$eval('.property-title h1', 
        (el: Element) => el.textContent?.trim()).catch(() => undefined);

      // Price
      const priceText = await this.page.$eval('.pricing-details .price-range', 
        (el: Element) => el.textContent).catch(() => '');
      data.rent = this.extractPrice(priceText);

      // Bed/Bath info
      const bedBathText = await this.page.$eval('.bed-bath-sqft', 
        (el: Element) => el.textContent).catch(() => '');
      data.bedrooms = this.extractBedroomsFromText(bedBathText);
      data.bathrooms = this.extractBathroomsFromText(bedBathText);
      data.sqft = this.extractNumber(bedBathText);

    } catch (error) {
      console.warn('Apartments.com scraping error:', error);
    }

    return data;
  }

  /**
   * Generic scraping fallback
   */
  private async scrapeGeneric(url: string): Promise<ListingData> {
    const data: ListingData = { url };

    try {
      // Try to find title
      data.title = await this.page.title();

      // Look for price patterns
      const pageText = await this.page.evaluate(() => document.body.innerText);
      data.rent = this.extractPriceFromText(pageText);

      // Try to extract other info from page text
      data.bedrooms = this.extractBedroomsFromText(pageText);
      data.bathrooms = this.extractBathroomsFromText(pageText);
      data.sqft = this.extractNumber(pageText);

    } catch (error) {
      console.warn('Generic scraping error:', error);
    }

    return data;
  }

  /**
   * Auto-fill contact forms on listings
   */
  async fillContactForm(userInfo: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  }): Promise<boolean> {
    if (!this.page) return false;

    try {
      // Look for common form selectors
      const nameSelectors = ['input[name*="name"]', '#name', '.name', 'input[placeholder*="name" i]'];
      const emailSelectors = ['input[name*="email"]', '#email', '.email', 'input[type="email"]'];
      const phoneSelectors = ['input[name*="phone"]', '#phone', '.phone', 'input[type="tel"]'];
      const messageSelectors = ['textarea[name*="message"]', '#message', '.message', 'textarea'];

      // Fill name
      for (const selector of nameSelectors) {
        try {
          await this.page.type(selector, userInfo.name, { delay: 100 });
          break;
        } catch {}
      }

      // Fill email
      for (const selector of emailSelectors) {
        try {
          await this.page.type(selector, userInfo.email, { delay: 100 });
          break;
        } catch {}
      }

      // Fill phone if provided
      if (userInfo.phone) {
        for (const selector of phoneSelectors) {
          try {
            await this.page.type(selector, userInfo.phone, { delay: 100 });
            break;
          } catch {}
        }
      }

      // Fill message if provided
      if (userInfo.message) {
        for (const selector of messageSelectors) {
          try {
            await this.page.type(selector, userInfo.message, { delay: 100 });
            break;
          } catch {}
        }
      }

      return true;
    } catch (error) {
      console.error('Form filling failed:', error);
      return false;
    }
  }

  /**
   * Clean up browser resources
   */
  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.browser) {
        await this.browser.disconnect();
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  // Helper methods for text extraction
  private extractPrice(text: string): number | undefined {
    const priceMatch = text.match(/\$[\d,]+/);
    if (priceMatch) {
      return parseInt(priceMatch[0].replace(/[$,]/g, ''));
    }
    return undefined;
  }

  private extractPriceFromText(text: string): number | undefined {
    const priceMatches = text.match(/\$\s*[\d,]+(?:\.\d{2})?/g);
    if (priceMatches) {
      // Look for the largest price (likely rent)
      const prices = priceMatches.map(p => parseInt(p.replace(/[$,\s]/g, '')));
      return Math.max(...prices);
    }
    return undefined;
  }

  private extractNumber(text: string): number | undefined {
    const numMatch = text.match(/\d+/);
    return numMatch ? parseInt(numMatch[0]) : undefined;
  }

  private extractBedroomsFromText(text: string): number | undefined {
    const bedMatch = text.match(/(\d+)\s*(?:bed|br|bedroom)/i);
    return bedMatch ? parseInt(bedMatch[1]) : undefined;
  }

  private extractBathroomsFromText(text: string): number | undefined {
    const bathMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:bath|ba|bathroom)/i);
    return bathMatch ? parseFloat(bathMatch[1]) : undefined;
  }
}

export default LightpandaService;