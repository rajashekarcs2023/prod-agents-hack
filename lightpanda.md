A new browser
built for machines
Not a fork. Not a patch.

Get Started in Under 10 Minutes
Lightpanda is purpose-built for AI and automation workflows.

10x faster. 10x less RAM.

100x better than Chrome headless.

Scrape at scale
Handle resource-intensive web scraping
Minimal CPU and memory footprint
Build AI agents
Empower AI agents with web capabilities
Instant startup and fully embeddable
Automate any website
Transform any website into a programmatic interface
JavaScript execution and web APIs
LLMs
deserve a 100x better web browser
Built from scratch
Not reliant on existing browsers.

Created with Zig
Developed in a low-level system programming language designed for performance and efficiency.

Focused and opinionated
Purpose-built for headless operation, without rendering overhead.

Execution time -
11x
faster
2.3s
25.2s
Memory peak -
9x
less memory used
24MB
207MB
Puppeteer requesting 100 pages from a local website on a AWS EC2 m5.large instance. See benchmark details
Cloud Offer
Engineered for your workflows
Scale effortlessly with your existing tools (Puppeteer, Playwright)

Lightpanda innovation,
Chrome reliability
Choose from Chrome or Lightpanda's browser to ensure all use cases are covered

hello@lightpanda.io

Request API Access
import puppeteer from "puppeteer"

// Replace puppeteer.launch with puppeteer.connect.
const browser = await puppeteer.connect({
  browserWSEndpoint: "wss://euwest.cloud.lightpanda.io/ws?token=YOUR_TOKEN",
})

// The rest of your script remains the same.
const page = await browser.newPage()
About Lightpanda
Building a web browser from scratch is a monumental challenge, one that few have attempted.

We took it on because automation and AI demand a fresh foundation, not wrappers on a legacy tech stack.

At our previous company, we scraped millions of web pages a day, and spent years navigating the pain of scaling scraping infrastructure with Chrome.

We knew the only real solution was to start over.

Lightpanda is here to change the game. We want to enable developers and businesses to do more with less.

We're building something ambitious and unconventional.

Join us.

What is Lightpanda?
Lightpanda is an AI-native web browser built from scratch for machines. Fast, scalable web automation with a minimal memory footprint.

Made for headless usage:

Javascript execution
Support of Web APIs
Compatible with Playwright , Puppeteer  through CDP
Fast web automation for AI agents, LLM training, scraping and testing:

Ultra-low memory footprint (10x less than Chrome)
Exceptionally fast execution (10x faster than Chrome)
Instant startup
When using Lightpanda, we recommend that you respect robots.txt files and avoid high frequency requesting websites. DDOS could happen fast for small infrastructures.

Next step: Installation and setup

uickstart
In this Quickstart, you’ll set up your first project with Lightpanda browser  and run it locally in under 10 minutes. By the end of this guide, you’ll have:

A working Node.js  project configured with Lightpanda
A browser instance that starts and stops programmatically
The foundation for running automated scripts using either Puppeteer  or Playwright  to control the browser
Installation and setup
Your first test
Extract data
Go to production with Lightpanda cloud
1. Installation and setup
Prerequisites
You’ll need Node.js  installed on your computer.

Initialize the Node.js project
Create a hn-scraper directory and initialize a new Node.js project.


mkdir hn-scraper && \
  cd hn-scraper && \
  npm init
You can accept all the default values in the npm init prompts. When done, your directory should look like this:

Install Lightpanda dependency
Install Lightpanda by using the official npm package .


npm install --save @lightpanda/browser
Create an index.js file with the following content:


'use strict'
 
const { lightpanda } = require('@lightpanda/browser');
 
const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};
 
(async () => {
  // Start Lightpanda browser in a separate process.
  const proc = await lightpanda.serve(lpdopts);
 
  // Do your magic ✨
 
  // Stop Lightpanda browser process.
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
Run your script to start and stop a Lightpanda browser.


node index.js
Starting and stopping the browser is almost instant.

$ node index.js
🐼 Running Lightpanda's CDP server... { pid: 4084512 }
Step 2: Your first test

2. Your first test
Lightpanda is a headless browser built from scratch. Unlike Headless Chrome, it has no UI or graphical rendering for humans, which allows it to start instantly and execute pages up to 10x faster.

Unlike curl , which only fetches raw HTML, Lightpanda can execute JavaScript and run query selectors directly in the browser.

It’s ideal for crawling, testing, and running AI agents that need to interact with dynamic web pages, and it’s fully compatible with libraries like Puppeteer  and Playwright .

In this example, you’ll connect cd CDP client, Puppeteer  or Playwright  to Lightpanda and extract all reference links from a Wikipedia page .

Connect CDP Client to Lightpanda
Install the puppeteer-core or playwright-core npm package.

Unlike puppeteer and playwright npm packages, puppeteer-core and playwright-core don’t download a Chromium browser.


npm install -save puppeteer-core
Edit your index.js to connect to Lightpanda:


'use strict'
 
const { lightpanda } = require('@lightpanda/browser');
const puppeteer = require('puppeteer-core');
 
const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};
 
const puppeteeropts = {
  browserWSEndpoint: 'ws://' + lpdopts.host + ':' + lpdopts.port,
};
 
(async () => {
  // Start Lightpanda browser in a separate process.
  const proc = await lightpanda.serve(lpdopts);
 
  // Connect Puppeteer to the browser.
  const browser = await puppeteer.connect(puppeteeropts);
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
 
  // Do your magic ✨
  console.log("CDP connection is working");
 
  // Disconnect Puppeteer.
  await page.close();
  await context.close();
  await browser.disconnect();
 
  // Stop Lightpanda browser process.
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
Run the script to test the connection between Puppeteer or Playwright and Lightpanda:


node index.js
$ node index.js
🐼 Running Lightpanda's CDP server... { pid: 31371 }
CDP connection is working
Extract all reference links from Wikipedia
Update index.js using page.goto to navigate to a Wikipedia page and extract all the reference links:


  // Go to Wikipedia page.
  await page.goto("https://en.wikipedia.org/wiki/Web_browser");
Execute a query selector on the browser to extract the links:


  // Extract all links from the references list of the page.
  const reflist = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.reflist a.external')).map(row => {
      return row.getAttribute('href');
    });
  });
Here’s the full index.js file:


'use strict'
 
const { lightpanda } = require('@lightpanda/browser');
const puppeteer = require('puppeteer-core');
 
const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};
 
const puppeteeropts = {
  browserWSEndpoint: 'ws://' + lpdopts.host + ':' + lpdopts.port,
};
 
(async () => {
  // Start Lightpanda browser in a separate process.
  const proc = await lightpanda.serve(lpdopts);
 
  // Connect Puppeteer to the browser.
  const browser = await puppeteer.connect(puppeteeropts);
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
 
  // Go to Wikipedia page.
  await page.goto("https://en.wikipedia.org/wiki/Web_browser");
 
  // Extract all links from the references list of the page.
  const reflist = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.reflist a.external')).map(row => {
      return row.getAttribute('href');
    });
  });
 
  // Display the result.
  console.log("all reference links", reflist);
 
  // Disconnect Puppeteer.
  await page.close();
  await context.close();
  await browser.disconnect();
 
  // Stop Lightpanda browser process.
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
Execute the link extraction
Execute index.js to see the links directly in your console:


node index.js
$ node index.js
🐼 Running Lightpanda's CDP server... { pid: 34389 }
all reference links [
  'https://gs.statcounter.com/browser-market-share',
  'https://radar.cloudflare.com/reports/browser-market-share-2024-q1',
  'https://web.archive.org/web/20240523140912/https://www.internetworldstats.com/stats.htm',
  'https://www.internetworldstats.com/stats.htm',
  'https://www.reference.com/humanities-culture/purpose-browser-e61874e41999ede',
Step 3: Extract data

3. Extract data
We will now use the browser to run a search on the HackerNews website . We need Lightpanda here because the website uses XHR requests to display search results. We will also run query selectors directly in the browser to extract and structure the data.

HackerNews

Navigate and search
Similar to the Wikipedia example, edit index.js to navigate to HackerNews:


  await page.goto("https://news.ycombinator.com/");
Type the term lightpanda in the search input at the bottom of the page and press the Enter key to submit the search:


  await page.type('input[name="q"]','lightpanda');
  await page.keyboard.press('Enter');
Wait for the search results to be displayed, with a timeout limit of 5 seconds:


  await page.waitForFunction(() => {
      return document.querySelector('.Story_container') != null;
  }, {timeout: 5000});
Extract the data
We will loop over the search results to extract the title, the URL, and a list of metadata including the author, the number of points, and comments:


  // Loop over search results to extract data.
  const res = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.Story_container')).map(row => {
      return {
        // Extract the title.
        title: row.querySelector('.Story_title span').textContent,
        // Extract the URL.
        url: row.querySelector('.Story_title a').getAttribute('href'),
        // Extract the list of meta data.
        meta: Array.from(row.querySelectorAll('.Story_meta > span:not(.Story_separator, .Story_comment)')).map(row => {
          return row.textContent;
        }),
      }
    });
  });
The final script
Here is the full version of index.js updated to run the search and extract results:


'use strict'
 
const { lightpanda } = require('@lightpanda/browser');
const puppeteer = require('puppeteer-core');
 
const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};
 
const puppeteeropts = {
  browserWSEndpoint: 'ws://' + lpdopts.host + ':' + lpdopts.port,
};
 
(async () => {
  // Start Lightpanda browser in a separate process.
  const proc = await lightpanda.serve(lpdopts);
 
  // Connect Puppeteer to the browser.
  const browser = await puppeteer.connect(puppeteeropts);
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
 
  // Go to hackernews home page.
  await page.goto("https://news.ycombinator.com/");
 
  // Find the search box at the bottom of the page and type the term lightpanda
  // to search.
  await page.type('input[name="q"]','lightpanda');
  // Press enter key to run the search.
  await page.keyboard.press('Enter');
 
  // Wait until the search results are loaded on the page, with a 5 seconds
  // timeout limit.
  await page.waitForFunction(() => {
      return document.querySelector('.Story_container') != null;
  }, {timeout: 5000});
 
  // Loop over search results to extract data.
  const res = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.Story_container')).map(row => {
      return {
        // Extract the title.
        title: row.querySelector('.Story_title span').textContent,
        // Extract the URL.
        url: row.querySelector('.Story_title a').getAttribute('href'),
        // Extract the list of meta data.
        meta: Array.from(row.querySelectorAll('.Story_meta > span:not(.Story_separator, .Story_comment)')).map(row => {
          return row.textContent;
        }),
      }
    });
  });
 
  // Display the result.
  console.log(res);
 
  // Disconnect Puppeteer.
  await page.close();
  await context.close();
  await browser.disconnect();
 
  // Stop Lightpanda browser process.
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
})();
Run the script
You can run it to see the result immediately:


node index.js
$ node index.js
🐼 Running Lightpanda's CDP server… { pid: 598201 }
[
  {
    title: 'Show HN: Lightpanda, an open-source headless browser in Zig',
    url: 'https://news.ycombinator.com/item?id=42817439',
    meta: [ '319 points', 'fbouvier', '9 months ago', '137 comments' ]
  },
  {
    title: 'Lightpanda: Headless browser designed for AI and automation',
    url: 'https://news.ycombinator.com/item?id=42812859',
    meta: [ '154 points', 'tosh', '9 months ago', '1 comments' ]
  },
  {
    title: 'Show HN: Lightpanda, an open-source headless browser in Zig',
    url: 'https://news.ycombinator.com/item?id=42430629',
    meta: [ '7 points', 'fbouvier', '10 months ago', '0 comments' ]
  },
  {
    title: 'Lightpanda: Fast headless browser from scratch in Zig for AI and automation',
    url: 'https://news.ycombinator.com/item?id=44900394',
    meta: [ '5 points', 'lioeters', '2 months ago', '0 comments' ]
  },
  {
    title: 'Lightpanda – The Headless Browser',
    url: 'https://news.ycombinator.com/item?id=42745150',
    meta: [ '4 points', 'vladkens', '9 months ago', '2 comments' ]
  },
  {
    title: 'Lightpanda raises pre-seed to develop first browser built for machines and AI',
    url: 'https://news.ycombinator.com/item?id=44263271',
    meta: [ '1 points', 'cpeterso', '4 months ago', '0 comments' ]
  }
]
Step 4: Go to production

title: Go to production with Lightpanda cloud description: Learn how to use a remote Lightpanda browser
4. Go to production
Use Lightpanda’s cloud offer  to switch from a local browser to a remotely managed version.

Create a new account and an API token here .

To connect, the script will use an environment variable named LPD_TOKEN. First export the variable with your token.


export LPD_TOKEN="paste your token here"
Edit index.js to change the Puppeteer connection options:


const puppeteeropts = {
  browserWSEndpoint: 'wss://euwest.cloud.lightpanda.io/ws?token=' + process.env.LPD_TOKEN,
};
Depending on your location, you can connect using the url wss://euwest.cloud.lightpanda.io/ws or wss//uswest.cloud.lightpanda.io/ws.

Clean up local-only lines
You no longer need to start a local browser process because you are using the cloud version. You can remove these parts of the script to simplify it:

const { lightpanda } = require('@lightpanda/browser')
const lpdopts = {
  host: '127.0.0.1',
  port: 9222,
};
  // Start Lightpanda browser in a separate process.
  const proc = await lightpanda.serve(lpdopts);
  // Stop Lightpanda browser process.
  proc.stdout.destroy();
  proc.stderr.destroy();
  proc.kill();
Final version
Here is the final script using the cloud browser version:


'use strict'
 
const puppeteer = require('puppeteer-core');
 
const puppeteeropts = {
  browserWSEndpoint: 'wss://euwest.cloud.lightpanda.io/ws?token=' + process.env.LPD_TOKEN,
};
 
(async () => {
  // Connect Puppeteer to the browser.
  const browser = await puppeteer.connect(puppeteeropts);
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
 
  // Go to hackernews home page.
  await page.goto("https://news.ycombinator.com/");
 
  // Find the search box at the bottom of the page and type the term lightpanda
  // to search.
  await page.type('input[name="q"]','lightpanda');
  // Press enter key to run the search.
  await page.keyboard.press('Enter');
 
  // Wait until the search results are loaded on the page, with a 5 seconds
  // timeout limit.
  await page.waitForFunction(() => {
      return document.querySelector('.Story_container') != null;
  }, {timeout: 5000});
 
  // Loop over search results to extract data.
  const res = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.Story_container')).map(row => {
      return {
        // Extract the title.
        title: row.querySelector('.Story_title span').textContent,
        // Extract the URL.
        url: row.querySelector('.Story_title a').getAttribute('href'),
        // Extract the list of meta data.
        meta: Array.from(row.querySelectorAll('.Story_meta > span:not(.Story_separator, .Story_comment)')).map(row => {
          return row.textContent;
        }),
      }
    });
  });
 
  // Display the result.
  console.log(res);
 
  // Disconnect Puppeteer.
  await page.close();
  await context.close();
  await browser.disconnect();
})();
Interested in on premise deployment?
The core Lightpanda browser will always remain open source, including JavaScript execution, CDP compatibility, proxy support, and request interception.

If you require on premise deployment, proprietary licensing, or enterprise features such as multi-context tabs and sandboxing, reach out to us at hello@lightpanda.io.

