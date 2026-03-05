import type { Plugin } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";

interface Mem0Config {
  apiKey?: string;
  orgId?: string;
  projectId?: string;
  host?: string;
}

interface MemoryEntry {
  id: string;
  memory: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

let mem0Client: any = null;
let pluginConfig: Mem0Config = {};

async function getMem0Client(config: Mem0Config) {
  if (mem0Client) return mem0Client;
  
  try {
    const { MemoryClient } = await import("mem0ai");
    mem0Client = new MemoryClient({
      apiKey: config.apiKey,
      orgId: config.orgId,
      projectId: config.projectId,
      host: config.host
    });
    return mem0Client;
  } catch (error) {
    throw new Error(`Failed to initialize Mem0 client: ${error}`);
  }
}

export const Mem0Plugin: Plugin = async ({ client, $, directory }) => {
  const configPath = `${directory}/.opencode/mem0-config.json`;
  
  try {
    const { readFile } = await import("fs/promises");
    const configData = await readFile(configPath, "utf-8");
    pluginConfig = JSON.parse(configData);
  } catch {
    pluginConfig = {
      apiKey: process.env.MEM0_API_KEY,
      orgId: process.env.MEM0_ORG_ID,
      projectId: process.env.MEM0_PROJECT_ID,
    };
  }

  return {
    tool: {
      mem0_add: tool({
        description: "Add a memory to Mem0 memory store. Stores facts, preferences, or information that should be remembered for a user or agent.",
        args: {
          memory: tool.schema.string(),
          userId: tool.schema.string().optional().default("default"),
          agentId: tool.schema.string().optional(),
          sessionId: tool.schema.string().optional(),
          metadata: tool.schema.record(tool.schema.string(), tool.schema.any()).optional(),
        },
        async execute(args, context) {
          try {
            const client = await getMem0Client(pluginConfig);
            const result = await client.add(args.memory, {
              user_id: args.userId,
              agent_id: args.agentId,
              session_id: args.sessionId,
              metadata: args.metadata,
            });
            return `Memory added successfully: ${JSON.stringify(result)}`;
          } catch (error) {
            return `Error adding memory: ${error}`;
          }
        },
      }),

      mem0_search: tool({
        description: "Search memories in Mem0 using natural language query. Retrieves relevant memories based on semantic similarity.",
        args: {
          query: tool.schema.string(),
          userId: tool.schema.string().optional(),
          agentId: tool.schema.string().optional(),
          sessionId: tool.schema.string().optional(),
          limit: tool.schema.number().optional().default(5),
          version: tool.schema.string().optional().default("v2"),
        },
        async execute(args, context) {
          try {
            const client = await getMem0Client(pluginConfig);
            const filters: Record<string, any> = {};
            
            if (args.userId) filters.user_id = args.userId;
            if (args.agentId) filters.agent_id = args.agentId;
            if (args.sessionId) filters.session_id = args.sessionId;

            const result = await client.search(args.query, {
              version: args.version,
              filters: Object.keys(filters).length > 0 ? filters : undefined,
              limit: args.limit,
            });
            
            if (!result.results || result.results.length === 0) {
              return "No memories found matching the query.";
            }
            
            const memories = result.results
              .map((r: any) => `- ${r.memory}`)
              .join("\n");
            return `Found ${result.results.length} memories:\n${memories}`;
          } catch (error) {
            return `Error searching memories: ${error}`;
          }
        },
      }),

      mem0_get_all: tool({
        description: "Get all memories for a user, agent, or session. Retrieves the complete memory store.",
        args: {
          userId: tool.schema.string().optional(),
          agentId: tool.schema.string().optional(),
          sessionId: tool.schema.string().optional(),
          limit: tool.schema.number().optional().default(10),
          version: tool.schema.string().optional().default("v2"),
        },
        async execute(args, context) {
          try {
            const client = await getMem0Client(pluginConfig);
            const filters: Record<string, any> = {};
            
            if (args.userId) filters.user_id = args.userId;
            if (args.agentId) filters.agent_id = args.agentId;
            if (args.sessionId) filters.session_id = args.sessionId;

            const result = await client.getAll({
              version: args.version,
              filters: Object.keys(filters).length > 0 ? filters : undefined,
              limit: args.limit,
            });
            
            if (!result.results || result.results.length === 0) {
              return "No memories found.";
            }
            
            const memories = result.results
              .map((r: any) => `- ${r.memory} (${r.created_at})`)
              .join("\n");
            return `Memories:\n${memories}`;
          } catch (error) {
            return `Error getting memories: ${error}`;
          }
        },
      }),

      mem0_delete: tool({
        description: "Delete a specific memory by ID from Mem0 store.",
        args: {
          memoryId: tool.schema.string(),
        },
        async execute(args, context) {
          try {
            const client = await getMem0Client(pluginConfig);
            await client.delete(args.memoryId);
            return `Memory ${args.memoryId} deleted successfully.`;
          } catch (error) {
            return `Error deleting memory: ${error}`;
          }
        },
      }),

      mem0_delete_all: tool({
        description: "Delete all memories for a user, agent, or session.",
        args: {
          userId: tool.schema.string().optional(),
          agentId: tool.schema.string().optional(),
          sessionId: tool.schema.string().optional(),
        },
        async execute(args, context) {
          try {
            const client = await getMem0Client(pluginConfig);
            const filters: Record<string, any> = {};
            
            if (args.userId) filters.user_id = args.userId;
            if (args.agentId) filters.agent_id = args.agentId;
            if (args.sessionId) filters.session_id = args.sessionId;

            if (Object.keys(filters).length === 0) {
              return "Error: Must specify at least one of userId, agentId, or sessionId.";
            }

            await client.deleteAll(filters);
            return "All matching memories deleted successfully.";
          } catch (error) {
            return `Error deleting memories: ${error}`;
          }
        },
      }),

      mem0_get_history: tool({
        description: "Get memory history - all versions and changes for a specific memory.",
        args: {
          memoryId: tool.schema.string(),
        },
        async execute(args, context) {
          try {
            const client = await getMem0Client(pluginConfig);
            const result = await client.getHistory(args.memoryId);
            return JSON.stringify(result, null, 2);
          } catch (error) {
            return `Error getting memory history: ${error}`;
          }
        },
      }),
    },

    "session.created": async ({ session }) => {
      await client.app.log({
        body: {
          service: "mem0-plugin",
          level: "info",
          message: `Mem0 plugin initialized for session: ${session.id}`,
        },
      });
    },

    "session.compacting": async (input, output) => {
      const sessionId = input.session?.id || "default";
      
      try {
        const client = await getMem0Client(pluginConfig);
        const result = await client.search("recent context and important information", {
          user_id: sessionId,
          limit: 5,
          version: "v2",
        });
        
        if (result.results && result.results.length > 0) {
          const memories = result.results
            .map((r: any) => r.memory)
            .join("\n");
          
          output.context.push(`## Mem0 Memory Context\n${memories}`);
        }
      } catch (error) {
        await client.app.log({
          body: {
            service: "mem0-plugin",
            level: "warn",
            message: `Failed to retrieve memories for compaction: ${error}`,
          },
        });
      }
    },
  };
};

export default Mem0Plugin;
