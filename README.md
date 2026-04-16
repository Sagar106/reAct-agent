# ToolLM ReAct Agent

A ReAct (Reasoning + Acting) agent built with LangChain that intelligently processes user queries by reasoning through problems and utilizing external tools to gather information.

## Overview

This project implements an AI agent that follows the ReAct paradigm - combining reasoning and tool usage to handle complex queries. The agent can make decisions about which tools to use based on the user's input, execute those tools, and synthesize the results into coherent responses.

## Features

- **LLM-Powered Reasoning**: Uses Groq's fast gpt-oss-120b model for intelligent decision-making
- **Web Search Integration**: Powered by Tavily Search API to fetch real-time information
- **Custom Tools**: Extensible tool system for adding domain-specific capabilities
- **Calendar Integration**: Mock calendar tool (ready for real Google Calendar API integration)
- **LangGraph Orchestration**: Robust agent workflow management using LangGraph

## Prerequisites

- Node.js
- npm or yarn
- API Keys for:
  - **Groq**: Get from [console.groq.com](https://console.groq.com)
  - **Tavily Search**: Get from [tavily.com](https://tavily.com)

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd ToolLM-ReAct-Agent
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Setup

### Environment Variables

Create a `.env` file in the project root with your API keys:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

## Usage

Run the agent:

```bash
node agent.js
```

The agent will start an interactive chat session. Enter your queries, and the agent will respond using available tools. Type "Bye" to exit.

Example interaction:

```
You: What is the weather today?
Assistant: [Agent response using tools if needed]
You: Bye
```

## How It Works

### ReAct Loop

1. **Think**: The LLM analyzes the user's query and decides which tools are needed
2. **Act**: Selected tools are executed (web search, calendar lookup, etc.)
3. **Observe**: Results from tools are fed back to the LLM
4. **Repeat**: The LLM synthesizes information or makes additional tool calls if needed

### Architecture

```
User Query
    ↓
LLM (Groq) - Reasoning
    ↓
Tool Selection
    ↓
Tool Execution
    ├→ Tavily Search (Web)
    ├→ Calendar Events
    └→ [More tools can be added]
    ↓
LLM - Response Synthesis
    ↓
Final Response
```

### Memory and Persistence

The agent uses LangGraph's `MemorySaver` to maintain conversation history across interactions within the same session, allowing for context-aware multi-turn conversations.

## Configuration

### Model Settings

In `agent.js`, modify the LLM parameters:

```javascript
const model = new ChatGroq({
  model: "openai/gpt-oss-120b", // Change model
  temperature: 0, // 0 = deterministic, 1 = creative
});
```

### Search Settings

Customize Tavily Search behavior:

```javascript
const search = new TavilySearch({
  maxResults: 5, // Number of results to return
  topic: "general", // general, news, or academic
});
```

## Extending the Agent

### Adding Custom Tools

To add a new tool, create a tool definition using the `tool` function:

```javascript
const customTool = tool(
  async ({ parameter }) => {
    // Tool logic here
    return "Tool result";
  },
  {
    name: "tool-name",
    description: "What this tool does",
    schema: z.object({
      parameter: z.string().describe("Parameter description"),
    }),
  },
);

// Add to agent
tools: [search, calendarEvents, customTool];
```

## Current Limitations

- **Mock Calendar Data**: Calendar tool returns hardcoded mock data - integrate with Google Calendar API for production use
- **Session-Based Memory**: Conversation history is maintained per session but not persisted across restarts

## Future Improvements

- [ ] Google Calendar API integration
- [x] Multi-turn conversation support (implemented)
- [ ] Persistent conversation history across sessions
- [ ] Additional tools (email, weather, news feeds, etc.)
- [ ] Custom tool marketplace
- [ ] Rate limiting and error handling
- [ ] Logging and observability
- [ ] Graph visualization (code commented out in agent.js)

## Dependencies

- `@langchain/groq`: Groq LLM integration
- `@langchain/langgraph`: Agent orchestration framework
- `@langchain/tavily`: Web search integration
- `@langchain/core`: Core LangChain utilities
- `zod`: Schema validation
- `dotenv`: Environment variable management

## Troubleshooting

**Error: "Invalid API key"**

- Verify your API keys in the `.env` file
- Check that `.env` is in the project root directory
- Ensure there are no extra spaces in your API keys

**Error: "Tool not found"**

- Make sure all required dependencies are installed: `npm install`
- Verify the tool is added to the `tools` array in `createReactAgent`

## License

ISC

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Note**: This is a demonstration project. For production use, add proper error handling, logging, authentication, and security measures.
