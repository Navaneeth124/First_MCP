import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
    { name: "antigravity-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

// Define a simple tool that the AI can call
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "get_system_echo",
            description: "Returns a message from the Antigravity server",
            inputSchema: {
                type: "object",
                properties: {
                    message: { type: "string" }
                }
            },
        },
    ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "get_system_echo") {
        const message = request.params.arguments?.message ?? "No message provided";
        return {
            content: [{ type: "text", text: `Antigravity Server Received: ${message}` }],
        };
    }
    throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);