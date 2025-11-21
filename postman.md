first explain me how exactly i can use postman
Here’s a concise, practical way to think about using Postman end to end—especially for an “agents that act” project. I’ll map capabilities to your hackathon goals, then suggest a demo-ready workflow you can run in front of judges.

How you can use Postman, in plain terms

Design and document your API surface

Model the endpoints your agent will call (data sources) and the endpoints it will hit to take action (webhooks, automations).
Add descriptions/examples so your workspace itself is living documentation judges can execute.
Send and orchestrate requests

Build HTTP, GraphQL, WebSocket, gRPC, or MQTT requests and run them live.
Chain requests with variables so outputs from one feed the next (agent pipelines).
Store and reuse state with variables

Environment/global/vault variables store API keys, thresholds, learned parameters, and IDs.
Use {{variable}} in URLs, headers, and bodies to make your collection portable.
Add logic, tests, and side-effects with scripts

Pre-request and Test scripts (JavaScript) let you:
Parse responses, compute decisions, mutate variables (your “agent memory”).
Assert correctness and record metrics.
Visualize results in-line.
This turns collections into executable workflows, not just static calls.
Automate runs and prove autonomy

Collection Runner: run your whole agent loop locally, repeatedly.
Monitors: schedule unattended runs in the cloud; show history and pass/fail stats during judging.
Mock servers to simulate actions or unavailable APIs

Create a mock server from saved examples to simulate third-party systems or your own action endpoints.
Great for demos when you don’t control the downstream system.
Flows to build agents visually

Drag-and-drop blocks to connect data sources, decision logic, and actions.
Useful to show “agent architecture” visually and still run it live.
Observability and Insights

View logs, assertions, and variables during and after runs.
Optionally install Insights to stream your backend logs into Postman for a single-pane demo.
Collaboration and publishing

Everything lives in a workspace—easy to share with judges or publish a read-only version.
Notebooks provide a scripted, runnable narrative.
A concrete way to use Postman for your agent challenge

Create an Agent collection

Requests:
Fetch signals from real-time APIs (e.g., a news sentiment API + a JSON status feed).
Decide Next Action: compute decision entirely in a Test script using variables.
Act: call a webhook; default to a Postman Mock if no real system is ready.
Learn: evaluate outcome and update thresholds/weights stored in environment variables.
Scripts:
Extract features from responses, compute a reward, and update policy parameters.
Save a compact outcome_history to track improvement over time.
Create an environment

Variables like DATA_FEEDS, ACTION_WEBHOOK_URL, LEARNING_RATE, SENTIMENT_THRESHOLD, outcome_history, last_run_timestamp.
Add any API keys (in vault variables if sensitive).
Build a Notebook as your judge-friendly demo

Sections: Setup -> Fetch -> Decide -> Act -> Learn -> Run unattended -> Show metrics.
Buttons that run the exact requests; text that explains what’s happening and why it proves “autonomous, improving agents.”
Add a Monitor

Schedule disabled by default; trigger manually in judging to show unattended execution and run logs.
Add a Mock server

Back your action webhook so you always have a reliable target; examples return structured results with latency and status so your learn step has signal.
Optional: Flows for a live visual agent loop

Build a Flow that calls the same requests in sequence and persists state via variables.
Judges can watch data flow and decisions evolve.
What this looks like in practice during your demo

Open Notebook, click “Setup” to initialize variables.
Click “Fetch signals” and show fresh data coming in.
Click “Decide” and show the computed decision object and reasoning.
Click “Act” and show the action being posted (mock or real).
Click “Learn” and show thresholds changing and outcome history growing.
Trigger the Monitor run and open the run history; show repeated improvements.
Open Flows to visualize the loop.
If you want, I can create a ready-to-run collection, environment, notebook, mock, monitor, and a simple Flow with defaults. You can then swap in any real data feeds and a real webhook for your project. Would you like me to set that up now with generic public feeds and a mocked action endpoint?

also the dev rel was talking about mcp servers - what can I do with postman related to mcp
Great question. In Postman, MCP (Model Context Protocol) ties directly into building and running agents with Postman Flows and Collections. Here’s what you can do related to MCP and how it helps your hackathon project.

What MCP means for Postman users

Build agents visually in Flows, then export as an MCP server

A Flow is a graph of blocks (requests, logic, variables, loops, timers).
You can export this Flow as an MCP server so other tools/agents can call its “capabilities” as tools via MCP.
This turns your Postman Flow into a reusable, callable agent service.
Use Collections as callable tools behind your MCP server

Your Flow can orchestrate Collection requests (HTTP/GraphQL/WebSocket/gRPC), mocks, and scripts.
The MCP export wraps those orchestrations so external LLM agents can “ask” your agent to fetch data, take action, or run a whole workflow.
Keep state via Postman variables

Your MCP server (exported Flow) can read/write environment or collection variables to persist policy params, thresholds, run history, tokens, etc.
Safe, demo-friendly actions

You can back risky actions with Mock Servers and switch to real endpoints with a variable toggle. Judges can run the same MCP-enabled agent without your private keys.
Observability and automation

Run the Flow in Postman, via Monitor, or invoke its underlying requests; review logs, assertions, and run histories to show autonomy and improvement.
Example uses you can implement fast

“Web Intel Agent” MCP server

Flow orchestrates: fetch news sentiment, detect anomalies, decide action, post to Slack/GitHub, learn from outcomes.
Export Flow as MCP server so an LLM app (or your own CLI) can call tools like fetch_signals, decide_action, act, learn.
“Ops Remediator” MCP server

Flow listens to a status feed or error API, runs playbooks, opens incidents, retries jobs, and adjusts future thresholds.
“Data Enricher” MCP server

Receives an entity, calls multiple APIs (Maps, Weather, Finance), dedupes/merges, caches results, and returns a unified object.
How to do this in Postman (high level)

Build the agent logic in a Flow
Blocks: Request (to call APIs), Evaluate (TypeScript) for decisions, Variables for memory, Loop/Delay for autonomy, Branch for policy.
Test the entire loop in the Flow canvas.
Connect Collections and Mocks
Create a collection with your API calls and saved examples.
Create a Mock Server for your action endpoint(s).
Use variables like ACTION_TARGET to switch between mock and real.
Add learning/memory
In Evaluate blocks or Test scripts, compute reward and update ENV vars (e.g., SENTIMENT_THRESHOLD, outcome_history).
Export the Flow as an MCP server
From the Flow, export as MCP server.
You’ll get a runnable MCP service that exposes your Flow’s capabilities as MCP tools.
Integrate with your agent runner
Point your external agent (or LLM IDE that supports MCP) to the MCP server.
Now your agent can call your Postman-powered capabilities programmatically.
What I can set up for you next

Create a Flow “AgentOps Agent Loop” with:
fetch_signals -> decide_action -> act -> evaluate_and_learn -> loop
Variables for memory and a toggle for mock vs real actions
Export it as an MCP server so you can run it as your hackathon agent backend
Provide a minimal README in the Notebook with:
How to run the MCP server locally
What tools/capabilities are exposed
Example calls from an LLM agent
If you want, I can go ahead and create:

A collection for your requests
A Flow wired to those requests with the agent loop
Saved examples and a Mock server for the “act” step
A Notebook that explains and runs it
Then export the Flow as an MCP server
Tell me if you prefer a specific action channel (Slack, GitHub, email/webhook), and I’ll wire that into the MCP-exposed tools.Postman MCP Server
The Postman MCP Server connects Postman to AI tools, giving AI agents and assistants the ability to access workspaces, manage collections and environments, evaluate APIs, and automate workflows through natural language interactions.

Postman supports the following tool configurations:

Minimal — (Default) Only includes essential tools for basic Postman operations This offers faster performance and simplifies use for those who only need basic Postman operations. Ideal for users who want to modify a single Postman elements, such as collections, workspaces, or environments.
Full — Includes all available Postman API tools (100+ tools). This configuration is ideal for users who engage in advanced collaboration and Postman's Enterprise features.
For a complete list of the Postman MCP Server's tools, see the Postman MCP Server collection. This collection offers both the remote full and minimal servers, and the local server.

Postman also offers servers as an npm package.

Note: Before getting started, ensure that you have a valid Postman API key.

Use Cases
Code synchronization - Effortlessly keep your code in sync with your Postman Collections and specs.
Collection management - Create and tag collections, update collection and request documentation, add comments, or perform actions across multiple collections without leaving your editor.
Workspace and environment management - Create workspaces and environments, plus manage your environment variables.
Automatic spec creation - Create specs from your code and use them to generate collections.
Designed for developers who want to integrate their AI tools with Postman’s context and features. Supports quick natural language queries queries to advanced agent workflows.

Support for EU
The Postman MCP Server supports the EU region for remote and local servers:

For streamable HTTP, the remote server is available at https://mcp.eu.postman.com.
For our STDIO public package, use the --region flag to specify the Postman API region (us or eu), or set the POSTMAN_API_BASE_URL environment variable directly.
Contents
Remote server
VS Code
Cursor
Claude Code
Local server
VS Code
Cursor
Claude
Claude Code
Gemini CLI
Docker
Questions and support
Migration from Postman MCP Server v1 to v2
Remote server
The remote Postman MCP Server is hosted by Postman over streamable HTTP and provides the easiest method for getting started. If your MCP host doesn't support remote MCP servers, you can use the local Postman MCP Server.

The remote server supports the following tool configurations:

Minimal — (Default) Only includes essential tools for basic Postman operations, available at https://mcp.postman.com/minimal and https://mcp.eu.postman.com/minimal for EU users.
Full — Includes all available Postman API tools (100+ tools), available at https://mcp.postman.com/mcp and https://mcp.eu.postman.com/mcp for EU users.
Install in Cursor
Install in Cursor

To install the remote Postman MCP Server in Cursor, click the install button.

Note: Ensure that the Authorization header uses the Bearer <YOUR_API_KEY> format.

By default, the server uses Minimal mode. To access Full mode, change the url value to https://mcp.postman.com/mcp in the mcp.json file.

Install in Visual Studio Code
Install in VS Code

To install the remote Postman MCP Server in VS Code, click the install button or use the Postman VS Code Extension.

By default, the server uses Minimal mode. To access Full mode, change the url value to https://mcp.postman.com/mcp in the mcp.json file.

Manual configuration
You can use the Postman MCP Server with MCP-compatible extensions in VS Code, such as GitHub Copilot, Claude for VS Code, or other AI assistants that support MCP. To do so, add the following JSON block to the .vscode/mcp.json configuration file:

{
    "servers": {
        "postman-api-http-server": {
            "type": "http",
            "url": "https://mcp.postman.com/{minimal OR mcp}",
            // Use "https://mcp.postman.com/mcp" for full or "https://mcp.postman.com/minimal" for minimal mode.
            // For the EU server, use the "https://mcp.eu.postman.com" URL.
            "headers": {
                "Authorization": "Bearer ${input:postman-api-key}"
            }
        }
    },
    "inputs": [
        {
            "id": "postman-api-key",
            "type": "promptString",
            "description": "Enter your Postman API key"
        }
    ]
}
When prompted, enter your Postman API key.

Install in Claude Code
To install the MCP server in Claude Code, run the following command in your terminal:

For Minimal mode:

claude mcp add --transport http postman https://mcp.postman.com/minimal --header "Authorization: Bearer <POSTMAN_API_KEY>"
For Full mode:

claude mcp add --transport http postman https://mcp.postman.com/mcp --header "Authorization: Bearer <POSTMAN_API_KEY>"
Local server
If remote MCP servers aren't supported by your MCP host, you can install the Postman MCP Server to your local machine.

STDIO is a lightweight solution that's ideal for integration with editors and tools like Visual Studio Code. Install an MCP-compatible VS Code extension, such as GitHub Copilot, Claude for VS Code, or other AI assistants that support MCP.

Note: To run the server as a Node application, install Node.js.

The local server supports the following tool configurations:

Minimal — (Default) Only includes essential tools for basic Postman operations.
Full — Includes all available Postman API tools (100+ tools). Use the --full flag to enable this configuration.
Note: Use the --region flag to specify the Postman API region (us or eu), or set the POSTMAN_API_BASE_URL environment variable directly. By default, the server uses the us option.

Install in Visual Studio Code
Install with Node in VS Code

To install the local Postman MCP Server in VS Code, click the install button.

By default, the server uses Full mode. To access Minimal mode, remove the --full flag from the mcp.json configuration file.

Manual configuration
You can manually integrate your MCP server with Cursor or VS Code to use it with extensions that support MCP. To do this, create a mcp.json file in your project and add the following JSON block to it:

{
    "servers": {
        "postman-api-mcp": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "@postman/postman-mcp-server",
                "--full" // (optional) Use this flag to enable full mode.
                "--region us" // (optional) Use this flag to specify the Postman API region (us or eu). Defaults to us.
            ],
            "env": {
                "POSTMAN_API_KEY": "${input:postman-api-key}"
            }
        }
    },
    "inputs": [
        {
            "id": "postman-api-key",
            "type": "promptString",
            "description": "Enter your Postman API key"
        }
    ]
}
Install in Cursor
Install with Node in Cursor

To install the local Postman MCP Server in Cursor, click the install button.

By default, the server uses Full mode. To access Minimal mode, remove the --full flag from the mcp.json configuration file.

Claude integration
To integrate the MCP server with Claude, check the latest Postman MCP Server release and get the .mcpb file.

Minimal - postman-api-mcp-minimal.mcpb
Full - postman-api-mcp-full.mcpb
For more information, see the Claude Desktop Extensions documentation.

Install in Claude Code
To install the MCP server in Claude Code, run the following command in your terminal:

For Minimal mode:

claude mcp add postman --env POSTMAN_API_KEY=YOUR_KEY -- npx @postman/postman-mcp-server@latest 
For Full mode:

claude mcp add postman --env POSTMAN_API_KEY=YOUR_KEY -- npx @postman/postman-mcp-server@latest --full 
Use as a Gemini CLI extension
To install the MCP server as a Gemini CLI extension, run the following command in your terminal:

gemini extensions install https://github.com/postmanlabs/postman-mcp-server
Install in Docker
For Docker set up and installation, see DOCKER.md.

Migration from v1.x to v2.x
If you're migrating from Postman MCP Server version 1.x to 2.x, be aware of the following:

Tool naming changes - All tool names changed from kebab-case to camelCase. For example:
create-collection → createCollection
get-workspaces → getWorkspaces
delete-environment → deleteEnvironment
Tool availability changes
The default (minimal) behavior provides only 37 essential tools.
The --full flag provides access to all tools.
Questions and support
See the Postman Agent Generator page for updates and new capabilities.
See Add your MCP requests to your collections to learn how to use Postman to perform MCP requests.
Visit the Postman Community to share what you've built, ask questions, and get help.
You can connect to both the remote and local servers and test them using the Postman MCP Server collection.