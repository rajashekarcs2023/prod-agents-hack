# 🏠 Apartment Truth Layer Agent

**Challenge:** Build autonomous, self-improving AI agents that don't just think, they act.

**Solution:** An AI agent that uncovers the real story behind rental listings by researching crime, safety, landlord reputation, market value, and scam indicators across multiple data sources.

## ✨ What It Does

1. **🔍 Scrapes Listings** - Extracts data from Zillow, Craigslist, Apartments.com using Lightpanda
2. **🕵️ Investigates Truth** - Researches neighborhood safety, crime data, landlord reviews using Parallel Web
3. **🧠 Analyzes & Scores** - Generates truth scores and scam risk assessments
4. **⚡ Takes Actions** - Auto-shortlists good listings, blacklists bad ones, sends notifications via Postman
5. **🎓 Learns & Improves** - Updates source reliability and user preferences based on feedback

## 🚀 Quick Start

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up API keys (Optional - works in demo mode without keys):**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Open http://localhost:5173** and paste a listing URL!

### 📧 Email Notifications Setup (Optional)
Want email alerts when good listings are found? See [EMAILJS_SETUP.md](../EMAILJS_SETUP.md) for 2-minute setup guide.

## 🔧 Configuration

### Required for Real Data (Optional)
- **Parallel Web API Key** - For neighborhood research and safety data
- **Lightpanda Token** - For cloud browser automation (or run local browser)

### Optional Integrations
- **EmailJS** - For consumer-friendly email notifications (2-minute setup)
- **Custom Webhooks** - For shortlist/blacklist actions

See [.env.example](.env.example) for all configuration options.

## 🎯 Demo URLs to Try

- `https://www.zillow.com/homedetails/[any-zillow-listing]`
- `https://craigslist.org/[any-rental-listing]` 
- `https://www.apartments.com/[any-apartment-listing]`

## 🏗️ Architecture

### Agent Pipeline
1. **SCRAPING** (Lightpanda) → Extract listing data
2. **INVESTIGATING** (Parallel Web) → Research background  
3. **ANALYZING** (Gemini) → Score and synthesize
4. **ACTING** (Postman) → Execute actions
5. **LEARNING** → Update weights and preferences

### Self-Improvement
- **Source Reliability Learning** - Tracks which data sources are accurate
- **Pattern Detection** - Learns scam indicators and neighborhood issues  
- **User Feedback Loop** - Personalizes scoring based on your preferences
- **Error Correction** - Adapts to website changes automatically

## 📊 Technologies Used

- **Frontend:** React 19 + TypeScript + TailwindCSS
- **Browser Automation:** Lightpanda (10x faster than Chrome)
- **Web Research:** Parallel Web API 
- **Workflow Orchestration:** Postman Collections
- **AI Analysis:** Google Gemini 2.5 Flash

## 🏆 Hackathon Features

✅ **Autonomous** - Runs end-to-end without human intervention  
✅ **Self-Improving** - Gets better with each listing analyzed  
✅ **Action-Taking** - Actually shortlists, blacklists, and notifies  
✅ **Real-Time** - Uses live data from multiple sources  
✅ **Integrated** - Showcases all sponsor tools working together  

## 🔍 How It Solves Real Problems

**Before:** Spend 45 minutes manually verifying each listing → still get scammed  
**After:** Paste URL → get truth report with evidence in 30 seconds → take informed action

**Real Value Added:**
- Prevents rental scams (saves $1000s)
- Finds hidden issues before viewing
- Saves 90% of research time  
- Learns your preferences over time

## 🧪 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview
```

## 📝 License

Built for the AI Agents Hackathon - demonstrating autonomous, self-improving agents that act on real-world data.
