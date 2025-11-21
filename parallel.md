Search API Quickstart

Copy page

Get started with Search

The Search API takes a natural language objective and returns relevant excerpts optimized for LLMs, replacing multiple keyword searches with a single call for broad or complex queries.
Available via MCP: Search is available as a tool as part of the Parallel Search MCP. Our MCP is optimized for best practices on Search and Extract usage. Start here with MCP for your use case. If you’re interested in direct use of the API, follow the steps below.
​
1. Set up Prerequisites
Generate your API key on Platform. Then, set up with the TypeScript SDK, Python SDK or with cURL:

cURL

Python

TypeScript

Copy

Ask AI
echo "Install curl and jq via brew, apt, or your favorite package manager"
export PARALLEL_API_KEY="PARALLEL_API_KEY"
​
2. Execute your First Search
​
Sample Request

cURL

Python

TypeScript

Copy

Ask AI
curl https://api.parallel.ai/v1beta/search \
  -H "Content-Type: application/json" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -H "parallel-beta: search-extract-2025-10-10" \
  -d '{
    "objective": "When was the United Nations established? Prefer UN'\''s websites.",
    "search_queries": [
      "Founding year UN",
      "Year of founding United Nations"
    ],
    "max_results": 10,
    "excerpts": {
      "max_chars_per_result": 10000
    }
  }'
​
Sample Response

Copy

Ask AI
{
  "search_id": "search_e749586f-00f0-43a0-9f33-730a574d32b9",
  "results": [
    {
      "url": "http://un.org/",
      "title": "Welcome to the United Nations",
      "publish_date": null,
      "excerpts": [
        "Last updated before: 2025-06-10\nUNICEF/UNI510119/Truong Viet Hung\n儿基会/UNI510119/Truong Viet Hung\nUNICEF/UNI510119/Truong Viet Hung\nUNICEF/UNI510119/Truong Viet Hung\nЮНИСЕФ/UNI510119/Труонг Вьет Хонг\nUNICEF/UNI510119/Truong Viet Hung\n[اليوم الدولي للّعب - 11 حزيران/ يونيه](https://www.un.org/ar/observances/international-day-of-play)\n[国际游玩日 - 6月11日](https://www.un.org/zh/observances/international-day-of-play)\n[International Day of Play - 11 June](https://www.un.org/en/observances/international-day-of-play)\n[Journée internationale du jeu - 11 juin](https://www.un.org/fr/observances/international-day-of-play)\n[Международный день игры — 11 июня](https://www.un.org/ru/observances/international-day-of-play)\n[Día Internacional del Juego – 11 de junio](https://www.un.org/es/observances/international-day-of-play)\nUNICEF/UNI510119/Truong Viet Hung\n儿基会/UNI510119/Truong Viet Hung\nUNICEF/UNI510119/Truong Viet Hung\nUNICEF/UNI510119/Truong Viet Hung\nЮНИСЕФ/UNI510119/Труонг Вьет Хонг\nUNICEF/UNI510119/Truong Viet Hung\nاليوم الدولي للّعب - 11 حزيران/ يونيه\n国际游玩日 - 6月11日\nInternational Day of Play - 11 June\nJournée internationale du jeu - 11 juin\nМеждународный день игры — 11 июня\nDía Internacional del Juego – 11 de junio\n[عربي](/ar/)\n[中文](/zh/)\n[English](/en/)\n[Français](/fr/)\n[Русский](/ru/)\n[Español](/es/)\n"
      ]
    },
    {
      "url": "https://www.un.org/en/about-us/history-of-the-un",
      "title": "History of the United Nations",
      "publish_date": "2001-01-01",
      "excerpts": [
        "Last updated: 20010101\n[Skip to main content]()\n\nToggle navigation [Welcome to the United Nations](/)\n\n+ [العربية](/ar/about-us/history-of-the-un \"تاريخ الأمم المتحدة\")\n    + [中文](/zh/about-us/history-of-the-un \"联合国历史\")\n    + Nederlands\n    + [English](/en/about-us/history-of-the-un \"History of the United Nations\")\n    + [Français](/fr/about-us/history-of-the-un \"L'histoire des Nations Unies\")\n    + Kreyòl\n    + हिन्दी\n    + Bahasa Indonesia\n    + Polski\n    + Português\n    + [Русский](/ru/about-us/history-of-the-un \"История Организации Объединенных Наций\")\n    + [Español](/es/about-us/history-of-the-un \"Historia de las Naciones Unidas\")\n    + Kiswahili\n    + Türkçe\n    + Українська\n\n... (truncated for brevity)"
      ]
    },
    {
      "url": "https://research.un.org/en/unmembers/founders",
      "title": "UN Founding Members - UN Membership",
      "publish_date": "2018-11-08",
      "excerpts": [
        "Last updated: 20181108\n[Skip to Main Content]()\n\nToggle navigation [Welcome to the United Nations](https://www.un.org/en)\n\n... (content omitted for brevity)"
      ]
    },
    {
      "url": "https://www.un.org/en/about-us/un-charter",
      "title": "UN Charter | United Nations",
      "publish_date": "2025-01-01",
      "excerpts": [
        "Last updated: 20250101\n[Skip to main content]()\n\n... (content omitted for brevity)"
      ]
    },
    {
      "url": "https://www.un.org/en/video/founding-united-nations-1945",
      "title": "Founding of the United Nations 1945",
      "publish_date": "2023-11-01",
      "excerpts": [
        "Last updated: 20231101\n[Skip to main content]()\n\n... (content omitted for brevity)"
      ]
    },
    {
      "url": "https://www.un.org/en/about-us",
      "title": "About Us | United Nations",
      "publish_date": "2017-01-01",
      "excerpts": [
        "Last updated: 20170101\n[Skip to main content]()\n\n... (content omitted for brevity)"
      ]
    },
    {
      "url": "https://www.facebook.com/unitednationsfoundation/posts/eighty-years-of-the-united-nations-on-this-day-in-1945-the-un-charter-came-into-/1404295104587053/",
      "title": "Eighty years of the United Nations. On this day in 1945, the UN ...",
      "publish_date": "2025-10-24",
      "excerpts": [
        "The United Nations officially came into existence on 24 October 1945, when the Charter had been ratified by China, France, the Soviet Union, the United Kingdom, the United States and by a majority of other signatories."
      ]
    },
    {
      "url": "https://www.un.org/en/model-united-nations/history-united-nations",
      "title": "History of the United Nations",
      "publish_date": null,
      "excerpts": [
        "Last updated before: 2025-11-05\nThe purpose of this conference was ..."
      ]
    },
    {
      "url": "https://en.wikipedia.org/wiki/United_Nations",
      "title": "United Nations - Wikipedia",
      "publish_date": "2025-11-03",
      "excerpts": [
        "Last updated: 20251103\nIt took the [conference at Yalta] ... (content truncated)"
      ]
    },
    {
      "url": "https://www.un.org/en/about-us/history-of-the-un/preparatory-years",
      "title": "Preparatory Years: UN Charter History | United Nations",
      "publish_date": "2001-01-01",
      "excerpts": [
        "Last updated: 20010101\n[Skip to main content]()\n\n... (content truncated)"
      ]
    }
  ],
  "warnings": null,
  "usage": [
    {
      "name": "sku_search",
      "count": 1
    }
  ]
}

Task
Task API Quickstart

Copy page

Start building web-based enrichment flows with Parallel Tasks

​
What is a Task?
A Task is a defined web research query with structured inputs and outputs. Any information retrieval that can be done on the open web is in scope for the Task API.
Examples include programmatic CRM enrichment, compliance checks for insurance underwriting, and financial opportunity research.
​
1. Set up Prerequisites
Generate your API key on Platform. Then, set up with the TypeScript SDK, Python SDK or with cURL:

cURL

Python

TypeScript

Python (Async)

Copy

Ask AI
echo "Install curl and jq via brew, apt, or your favorite package manager"
export PARALLEL_API_KEY="PARALLEL_API_KEY"
​
2. Execute your First Task Run
Make your first API request with one of these examples:
You can learn about our available Processors here ->

cURL

Python

TypeScript

Python (Async)

Copy

Ask AI
echo "Creating the run:"
RUN_JSON=$(curl -s "https://api.parallel.ai/v1/tasks/runs" \
-H "x-api-key: ${PARALLEL_API_KEY}" \
-H "Content-Type: application/json" \
-d '{
    "task_spec": {
        "output_schema": "The founding date of the company in the format MM-YYYY"
    },
    "input": "United Nations",
    "processor": "base"
}')
echo "$RUN_JSON" | jq .
RUN_ID=$(echo "$RUN_JSON" | jq -r '.run_id')

echo "Retrieving the run result, blocking until the result is available:"
curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN_ID}/result" \
  -H "x-api-key: ${PARALLEL_API_KEY}" | jq .

​
Sample Response
Immediately after a Task Run is created, the Task Run object, including the status of the Task Run, is returned. On completion, the Task Run Result object is returned.
Basis, including citations, reasoning, confidence, and excerpts - is returned with every Task Run Result.

Task Run Creation

Task Run Result

Copy

Ask AI
{
  "run_id": "trun_9907962f83aa4d9d98fd7f4bf745d654",
  "status": "queued",
  "is_active": true,
  "warnings": null,
  "processor": "base",
  "metadata": null,
  "created_at": "2025-04-23T20:21:48.037943Z",
  "modified_at": "2025-04-23T20:21:48.037943Z"
}
​
3. From Simple to Complex Tasks
The Task API supports a progression of task complexity:
1
Simple Query -> Simple Answer

Simply ask “What was the founding date of the United Nations?” and receive an answer based on web research in plain text. This straightforward approach is illustrated above.
2
Simple Query -> Structured Output

Define a structured output format with founding date, employee count and other desired details for a company, passing in the company name as input.

cURL

TypeScript

Python

Python (Async)

Copy

Ask AI
echo "Creating the run:"
RUN_JSON=$(curl -s 'https://api.parallel.ai/v1/tasks/runs' \
-H "x-api-key: ${PARALLEL_API_KEY}" \
-H 'Content-Type: application/json' \
-d '{
"input": "United Nations",
"processor": "core",
"task_spec": {
"output_schema": {
  "type": "json",
  "json_schema": {
    "type": "object",
    "properties": {
      "founding_date": {
        "type": "string",
        "description": "The official founding date of the company in the format MM-YYYY"
      },
      "employee_count": {
        "type": "string",
        "enum": [
          "1-10 employees",
          "11-50 employees",
          "51-200 employees",
          "201-500 employees",
          "501-1000 employees",
          "1001-5000 employees",
          "5001-10000 employees",
          "10001+ employees"
        ],
        "description": "The range of employees working at the company. Choose the most accurate range possible and make sure to validate across multiple sources."
      },
      "funding_sources": {
        "type": "string",
        "description": "A detailed description, containing 1-4 sentences, of the company's funding sources, including their estimated value."
      }
    },
    "required": ["founding_date", "employee_count", "funding_sources"],
    "additionalProperties": false
  }
}
}
}'
)
echo "$RUN_JSON" | jq .
RUN_ID=$(echo "$RUN_JSON" | jq -r '.run_id')

echo "Retrieving the run result, blocking until the result is available:"
curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN_ID}/result" \
  -H "x-api-key: ${PARALLEL_API_KEY}" | jq .
See all 49 lines
3
Structured Input -> Structured Output

Define structured input and output schemas providing founding date, employee count and other desired details for a company name and company website.

cURL

TypeScript

Python

Python (Async)

Copy

Ask AI
echo "Creating the run:"
RUN_JSON=$(curl -s 'https://api.parallel.ai/v1/tasks/runs' \
-H "x-api-key: ${PARALLEL_API_KEY}" \
-H 'Content-Type: application/json' \
-d '{
"input": {
"company_name": "United Nations",
"company_website": "www.un.org"
},
"processor": "core",
"task_spec": {
"output_schema": {
  "type": "json",
  "json_schema": {
    "type": "object",
    "properties": {
      "founding_date": {
        "type": "string",
        "description": "The official founding date of the company in the format MM-YYYY"
      },
      "employee_count": {
        "type": "string",
        "enum":[
          "1-10 employees",
          "11-50 employees",
          "51-200 employees",
          "201-500 employees",
          "501-1000 employees",
          "1001-5000 employees",
          "5001-10000 employees",
          "10001+ employees"
        ],
        "description": "The range of employees working at the company. Choose the most accurate range possible and make sure to validate across multiple sources."
      },
      "funding_sources": {
        "type": "string",
        "description": "A detailed description, containing 1-4 sentences, of the company's funding sources, including their estimated value."
      }
    },
    "required": ["founding_date", "employee_count", "funding_sources"],
    "additionalProperties": false
  }
},
"input_schema": {
  "type": "json",
  "json_schema": {
    "type": "object",
    "properties": {
      "company_name": {
        "type": "string",
        "description": "The name of the company to research"
      },
      "company_website": {
        "type": "string",
        "description": "The website of the company to research"
      }
    },
    "required": ["company_name", "company_website"]
  }
}
}
}'
)
echo "$RUN_JSON" | jq .
RUN_ID=$(echo "$RUN_JSON" | jq -r '.run_id')

echo "Retrieving the run result, blocking until the result is available:"
curl -s "https://api.parallel.ai/v1/tasks/runs/${RUN_ID}/result" \
  -H "x-api-key: ${PARALLEL_API_KEY}" | jq .
See all 69 lines
​
Sample Structured Task Result

Copy

Ask AI
{
  "run": {
    "run_id": "trun_0824bb53c79c407b89614ba22e9db51c",
    "status": "completed",
    "is_active": false,
    "warnings": [],
    "processor": "core",
    "metadata": null,
    "created_at": "2025-04-24T16:05:03.403102Z",
    "modified_at": "2025-04-24T16:05:33.099450Z"
  },
  "output": {
    "content": {
      "funding_sources": "The United Nations' funding comes from governments, multilateral partners, and other non-state entities. This funding is acquired through assessed and voluntary contributions from its member states.",
      "employee_count": "10001+ employees",
      "founding_date": "10-1945"
    },
    "basis": [
      {
        "field": "funding_sources",
        "citations": [
          {
            "title": "Funding sources",
            "url": "https://www.financingun.report/un-financing/un-funding/funding-entity",
            "excerpts": [
              "The UN system is funded by a diverse set of partners: governments, multilateral partners, and other non-state funding."
            ]
          },
          {
            "title": "US Funding for the UN",
            "url": "https://betterworldcampaign.org/us-funding-for-the-un",
            "excerpts": [
              "Funding from Member States for the UN system comes from two main sources: assessed and voluntary contributions."
            ]
          }
        ],
        "reasoning": "The United Nations' funding is derived from a diverse set of partners, including governments, multilateral organizations, and other non-state entities, as stated by financingun.report. According to betterworldcampaign.org, the funding from member states is acquired through both assessed and voluntary contributions.",
        "confidence": "high"
      },
      {
        "field": "employee_count",
        "citations": [
          {
            "title": "Funding sources",
            "url": "https://www.financingun.report/un-financing/un-funding/funding-entity",
            "excerpts": []
          }
        ],
        "reasoning": "The UN employs approximately 37,000 people, with a total personnel count of 133,126 in 2023.",
        "confidence": "low"
      },
      {
        "field": "founding_date",
        "citations": [
          {
            "title": "Funding sources",
            "url": "https://www.financingun.report/un-financing/un-funding/funding-entity",
            "excerpts": []
          },
          {
            "title": "History of the United Nations",
            "url": "https://www.un.org/en/about-us/history-of-the-un",
            "excerpts": [
              "The United Nations officially began, on 24 October 1945, when it came into existence after its Charter had been ratified by China, France, the Soviet Union, ..."
            ]
          },
          {
            "title": "The Formation of the United Nations, 1945",
            "url": "https://history.state.gov/milestones/1937-1945/un",
            "excerpts": [
              "The United Nations came into existence on October 24, 1945, after 29 nations had ratified the Charter. Table of Contents. 1937–1945: Diplomacy and the Road to ..."
            ]
          }
        ],
        "reasoning": "The United Nations officially began on October 24, 1945, as stated in multiple sources including the UN's official history and the US Department of State's historical milestones. This date is when the UN came into existence after its Charter was ratified by key member states.",
        "confidence": "high"
      }
    ],
    "type": "json"
  }
}
See all 81 lines
​
4. Run Multiple Tasks
For many use cases, scaling beyond a single Task Run is essential. To execute multiple Task Runs concurrently, we recommend using Task Groups.
Ask a question...

https://github.com/parallel-web/parallel-cookbook/tree/main

