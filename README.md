# OpenCode Mem0 Plugin

为 OpenCode 集成 Mem0 内存层，提供长期记忆功能。

## 功能

- **添加记忆**: 使用 `mem0_add` 工具存储用户偏好、事实和信息
- **搜索记忆**: 使用自然语言查询检索相关记忆
- **获取所有记忆**: 获取用户、代理或会话的全部记忆
- **删除记忆**: 删除特定记忆或符合条件的所有记忆
- **记忆历史**: 获取记忆的所有版本和更改
- **会话压缩**: 自动在会话压缩时包含记忆上下文

## 安装

### 1. 克隆或复制插件

```bash
mkdir -p ~/.config/opencode/plugins/
cp -r opencode-mem0-plugin ~/.config/opencode/plugins/mem0
```

或放置在项目级:
```bash
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

在插件目录中安装 npm 依赖:

```bash
cd ~/.config/opencode/plugins/mem0
bun install
```

## 使用方法

### 添加记忆

```
mem0_add memory="用户喜欢使用VS Code进行开发" userId="user123"
```

### 搜索记忆

```
mem0_search query="用户喜欢什么开发工具" userId="user123" limit=5
```

### 获取所有记忆

```
mem0_get_all userId="user123" limit=10
```

### 删除记忆

```
mem0_delete memoryId="mem_xxx"
```

### 删除所有记忆

```
mem0_delete_all userId="user123"
```

### 获取记忆历史

```
mem0_get_history memoryId="mem_xxx"
```

## 自托管 Mem0

如果使用自托管的 Mem0 服务，配置 `host` 指向你的 API 地址:

```json
{
  "apiKey": "your-api-key",
  "host": "http://localhost:8000"
}
```

## 工具说明

| 工具 | 描述 |
|------|------|
| `mem0_add` | 添加记忆到 Mem0 存储 |
| `mem0_search` | 使用自然语言搜索记忆 |
| `mem0_get_all` | 获取用户/代理/会话的所有记忆 |
| `mem0_delete` | 删除指定记忆 |
| `mem0_delete_all` | 删除符合条件的所有记忆 |
| `mem0_get_history` | 获取记忆的历史版本 |

## 依赖

- Bun (运行 OpenCode)
- Mem0 API Key (使用云服务) 或 自托管 Mem0 服务器
