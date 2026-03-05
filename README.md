# Mem0 Plugin for OpenCode

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE) [![OpenCode](https://img.shields.io/badge/OpenCode-1.0+-orange.svg)](https://opencode.ai) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/) [![Mem0](https://img.shields.io/badge/Mem0-v1.0+-FF6B6B.svg)](https://mem0.ai)

为 OpenCode 集成 [Mem0](https://mem0.ai) 通用内存层，提供智能长期记忆功能。

## 为什么选择 Mem0?

传统 AI 助手没有记忆 - 每次对话后都会忘记所有内容。Mem0 改变了这一点:

- **多层次记忆**: 跨用户、会话和代理状态的自适应个性化
- **语义搜索**: 使用自然语言查询检索相关记忆
- **成本高效**: 比完整上下文减少 90% 的 Token 使用
- **开发者友好**: 直观的 API、跨平台 SDK 和完全托管服务选项
- **持续学习**: 随着时间推移记住用户偏好、适应个体需求

## 特性

- **添加记忆**: 存储用户偏好、事实和信息
- **语义搜索**: 使用自然语言检索相关记忆
- **获取所有记忆**: 获取用户、代理或会话的全部记忆
- **删除记忆**: 删除特定记忆或符合条件的所有记忆
- **记忆历史**: 获取记忆的所有版本和更改
- **会话压缩**: 自动在会话压缩时注入记忆上下文

## 快速开始

### 1. 克隆或复制插件

```bash
# 克隆仓库
git clone https://github.com/allbugterminator/opencode-mem0-plugin.git

# 复制到全局插件目录
mkdir -p ~/.config/opencode/plugins/
cp -r opencode-mem0-plugin ~/.config/opencode/plugins/mem0

# 或放置在项目级
mkdir -p .opencode/plugins/
cp -r opencode-mem0-plugin .opencode/plugins/mem0
```

### 2. 配置 API 密钥

创建 `mem0-config.json` 在插件目录中:

```json
{
  "apiKey": "your-mem0-api-key",
  "orgId": "your-org-id",
  "projectId": "your-project-id"
}
```

或通过环境变量:

```bash
export MEM0_API_KEY=your-api-key
export MEM0_ORG_ID=your-org-id
export MEM0_PROJECT_ID=your-project-id
```

### 3. 安装依赖

```bash
cd ~/.config/opencode/plugins/mem0
bun install
```

### 4. 重启 OpenCode

插件将在下次启动时自动加载。

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `apiKey` | string | - | Mem0 Cloud API 密钥 |
| `orgId` | string | - | Mem0 组织 ID |
| `projectId` | string | - | Mem0 项目 ID |
| `host` | string | `https://api.mem0.ai` | 自托管 Mem0 服务器地址 |

## 可用工具

### mem0_add

将信息存储到 Mem0 记忆库。用于记住事实、偏好、技能和重要上下文。

```
mem0_add memory="用户喜欢使用VS Code进行开发" userId="user123"
mem0_add memory="记住用户偏好深色主题" userId="user123" metadata={"category": "preference"}
```

### mem0_search

使用自然语言查询检索相关记忆。基于语义相似性的快速检索。

```
mem0_search query="用户喜欢什么开发工具" userId="user123" limit=5
mem0_search query="用户的工作偏好是什么" agentId="assistant" sessionId="session1"
```

### mem0_get_all

获取用户、代理或会话的所有记忆。完整列出存储的记忆。

```
mem0_get_all userId="user123" limit=10
mem0_get_all sessionId="session1"
```

### mem0_delete

删除指定的单条记忆。

```
mem0_delete memoryId="mem_xxx"
```

### mem0_delete_all

删除符合条件的所有记忆。必须指定至少一个过滤条件。

```
mem0_delete_all userId="user123"
mem0_delete_all sessionId="session1"
```

### mem0_get_history

获取记忆的历史版本 - 所有更改和版本。

```
mem0_get_history memoryId="mem_xxx"
```

## 使用示例

### 示例 1: 记住用户偏好

```
User: 我喜欢在下午收到项目进度总结。
Agent: 我会记住你偏好下午收到进度总结。让我存储这个偏好。
```

调用 `mem0_add` 存储此偏好，以便将来参考。

### 示例 2: 上下文感知响应

当用户问 "我上次做什么工作了?", Agent:

1. 调用 `mem0_search` 查询相关记忆
2. 获取关于过去项目的记忆
3. 提供个性化的上下文感知响应

### 示例 3: 会话压缩中的记忆

在会话压缩时，Mem0 插件自动检索相关记忆并注入到上下文中，确保:

- 新 Agent 可以从中断处继续工作
- 重要上下文不会丢失
- 保持对话的连续性

## 架构

```
┌─────────────────┐     ┌─────────────────┐
│    OpenCode     │     │     Mem0        │
│      Agent      │────►│    Memory       │
│                 │     │     Service      │
└─────────────────┘     └─────────────────┘
        │                       │
        │ 工具:                  │ 存储:
        │ - mem0_add            │ - 向量存储
        │ - mem0_search         │   (Qdrant, Chroma, etc.)
        │ - mem0_get_all        │
        │ - mem0_delete         │ LLM 提供商:
        │                       │ - OpenAI
                               │ - Anthropic
                               │ - 自定义
```

## 自托管 Mem0

如需使用自托管的 Mem0 服务:

```json
{
  "apiKey": "your-api-key",
  "host": "http://localhost:8000"
}
```

详细自托管指南请参考 [Mem0 文档](https://docs.mem0.ai/installation/self-hosted)。

## 依赖

- Bun (运行 OpenCode)
- Mem0 npm 包: `mem0ai`
- Mem0 API Key (使用云服务) 或自托管 Mem0 服务器

## 故障排除

### 插件未加载

检查插件目录是否存在:
```bash
ls ~/.config/opencode/plugins/
```

### API 密钥错误

确保 `mem0-config.json` 格式正确，或设置环境变量:
```bash
echo $MEM0_API_KEY
```

### 依赖安装失败

手动安装依赖:
```bash
cd ~/.config/opencode/plugins/mem0
bun add mem0ai
```

### 记忆未找到

- 确认 `userId`, `agentId`, `sessionId` 参数正确
- 检查 Mem0 Cloud 账户是否有足够的配额

## 相关项目

- [Mem0](https://github.com/mem0ai/mem0) - AI Agent 的通用内存层
- [OpenCode 插件文档](https://opencode.ai/docs/zh-cn/plugins/) - OpenCode 插件开发指南
- [mem0ai npm](https://www.npmjs.com/package/mem0ai) - Mem0 JavaScript SDK

## 许可证

Apache License 2.0 - 查看 [LICENSE](LICENSE) 了解更多详情。

---

如果觉得这个插件有帮助, 请给 [Mem0 仓库](https://github.com/mem0ai/mem0) 点个 star!
