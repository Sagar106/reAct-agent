import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import dotnev from "dotenv";
import z from "zod";
import { writeFileSync } from "node:fs";
import readline from "node:readline/promises";

import { MemorySaver } from "@langchain/langgraph";

dotnev.config();

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
  });

  const search = new TavilySearch({
    maxResults: 5,
    topic: "general",
  });

  const calendarEvents = tool(
    async ({ query }) => {
      // Google calendar logic goes here
      return JSON.stringify([
        { title: "Meeting with Sujoy", time: "2 PM", location: "Google Meet" },
      ]);
    },
    {
      name: "get-calendar-events",
      description: "Call to get the calendar events.",
      schema: z.object({
        query: z
          .string()
          .describe("The query to use in calendar event search."),
      }),
    },
  );

  const checkpointer = new MemorySaver();

  const agent = createReactAgent({
    llm: model,
    tools: [search, calendarEvents],
    checkpointer: checkpointer,
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userQuery = await rl.question("You: ");

    if (userQuery === "Bye") break;

    const result = await agent.invoke(
      {
        messages: [
          {
            role: "system",
            content: `You are a personal assistant. Use the provided tools to get the information if you don't have it. Current date: ${new Date().toUTCString()}`,
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
      },
      {
        configurable: { thread_id: "1" },
      },
    );

    console.log(
      "Assistant : ",
      result.messages[result.messages.length - 1].content,
    );
  }

  rl.close();

  // const drawableGraphGraphState = await agent.getGraphAsync();
  // const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
  // const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

  // const filePath = "./graphState.png";
  // writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));
}

main();
