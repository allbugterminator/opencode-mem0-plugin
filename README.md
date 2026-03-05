# Mem0 Plugin for OpenCode

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) [![OpenCode](https://img.shields.io/badge/OpenCode-1.0+-orange.svg)](https://opencode.ai) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/) [![Mem0](https://img.shields.io/badge/Mem0-v1.0+-FF6B6B.svg)](https://mem0.ai)

Integrates [Mem0](https://mem0.ai) universal memory layer with OpenCode for intelligent long-term memory capabilities.

## Why Mem0?

Traditional AI assistants have no memory - they forget everything after each conversation. Mem0 changes this by providing:

- **Multi-Level Memory**: Adaptive personalization across users, sessions, and agents
- **Semantic Search**: Retrieve relevant memories using natural language queries
- **Cost Efficient**: Reduces token usage by 90% compared to full context
- **Developer-Friendly**: Intuitive API, cross-platform SDKs, and fully managed service option
- **Continuous Learning**: Remembers user preferences and adapts to individual needs over time

## Features

- **Add Memory**: Store user preferences, facts, and information
- **Semantic Search**: Retrieve relevant memories using natural language
- **Get All Memories**: Retrieve all memories for a user, agent, or session
- **Delete Memory**: Delete specific memories or all matching memories
- **Memory History**: Get all versions and changes of memories
- **Session Compaction**: Auto-inject memory context during session compaction

## Quick Start

### 1. Clone or Copy the Plugin

```bash
# Clone the repository
git clone https://github.com/allbugterminator/opencode-mem0-plugin.git

# Copy to global plugin directory
mkdir -p ~/.config/opencode/plugins/
cp -r opencode-mem0-plugin ~/.config/opencode/plugins/mem0

# Or place in project-level
mkdir -p .opencode/plugins/
cp -r opencode-mem0-plugin .opencode/plugins/mem0
```

### 2. Configure API Key

Sign up at [Mem0 Platform](https://app.mem0.ai) to get your API key.

Create `mem0-config.json` in the plugin directory:

```json
{
  "apiKey": "your-mem0-api-key"
}
```

Or via environment variables:

```bash
export MEM0_API_KEY=your-api-key
```

### 3. Install Dependencies

```bash
cd ~/.config/opencode/plugins/mem0
bun install 
# or use: npm install
```

### 4. Restart OpenCode

The plugin will load automatically on next startup.

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | - | Mem0 Cloud API key (required) |
| `orgId` | string | - | Mem0 Organization ID (optional, for multi-tenant) |
| `projectId` | string | - | Mem0 Project ID (optional, for project isolation) |
| `host` | string | `https://api.mem0.ai` | Self-hosted Mem0 server URL |

## Available Tools

### mem0_add

Store information in Mem0 memory. Use to remember facts, preferences, skills, and important context.

```
mem0_add memory="User prefers using VS Code for development" userId="user123"
mem0_add memory="User prefers dark theme" userId="user123" metadata={"category": "preference"}
```

### mem0_search

Retrieve relevant memories using natural language query. Fast embedding-based retrieval.

```
mem0_search query="What development tools does user prefer" userId="user123" limit=5
mem0_search query="User's work preferences" agentId="assistant" sessionId="session1"
```

### mem0_get_all

Get all memories for a user, agent, or session. Complete listing of stored memories.

```
mem0_get_all userId="user123" limit=10
mem0_get_all sessionId="session1"
```

### mem0_delete

Delete a specific single memory.

```
mem0_delete memoryId="mem_xxx"
```

### mem0_delete_all

Delete all memories matching criteria. Must specify at least one filter.

```
mem0_delete_all userId="user123"
mem0_delete_all sessionId="session1"
```

### mem0_get_history

Get history of a memory - all changes and versions.

```
mem0_get_history memoryId="mem_xxx"
```

## Usage Examples

### Example 1: Remembering User Preferences

```
User: I prefer receiving project progress summaries in the afternoon.
Agent: I'll remember that you prefer afternoon summaries. Let me store this preference.
```

Call `mem0_add` to store this preference for future reference.

### Example 2: Context-Aware Responses

When user asks "What did I work on last time?", the Agent:

1. Calls `mem0_search` to query relevant memories
2. Gets memories about past projects
3. Provides personalized, context-aware response

### Example 3: Memory in Session Compaction

During session compaction, the Mem0 plugin automatically retrieves relevant memories and injects them into context, ensuring:

- New agents can resume from where they left off
- Important context is not lost
- Conversation continuity is maintained

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│    OpenCode     │     │     Mem0        │
│      Agent      │────►│    Memory       │
│                 │     │     Service     │
└─────────────────┘     └─────────────────┘
        │                       │
        │ Tools:                │ Storage:
        │ - mem0_add            │ - Vector Store
        │ - mem0_search         │   (Qdrant, Chroma, etc.)
        │ - mem0_get_all        │
        │ - mem0_delete         │ LLM Providers:
        │                       │ - OpenAI
                               │ - Anthropic
                               │ - Custom
```

## Self-Hosted Mem0

To use self-hosted Mem0 service:

```json
{
  "apiKey": "your-api-key",
  "host": "http://localhost:8000"
}
```

See [Mem0 docs](https://docs.mem0.ai/installation/self-hosted) for detailed self-hosted guide.

## Requirements

- Bun (to run OpenCode)
- Mem0 npm package: `mem0ai`
- Mem0 API Key (for cloud) or self-hosted Mem0 server

## Troubleshooting

### Plugin Not Loading

Check if plugin directory exists:
```bash
ls ~/.config/opencode/plugins/
```

### API Key Error

Ensure `mem0-config.json` is correct, or set environment variables:
```bash
echo $MEM0_API_KEY
```

### Dependency Installation Failed

Manually install dependencies:
```bash
cd ~/.config/opencode/plugins/mem0
bun add mem0ai
```

### Memories Not Found

- Verify `userId`, `agentId`, `sessionId` parameters are correct
- Check if Mem0 Cloud account has sufficient quota

## Related Projects

- [Mem0](https://github.com/mem0ai/mem0) - Universal memory layer for AI Agents
- [OpenCode Plugins Docs](https://opencode.ai/docs/plugins/) - OpenCode plugin development guide
- [mem0ai npm](https://www.npmjs.com/package/mem0ai) - Mem0 JavaScript SDK

## License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

---

If you find this plugin useful, please star the [Mem0 repository](https://github.com/mem0ai/mem0)!
