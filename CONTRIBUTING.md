# Contributing to ConvertKit

## Pull requests

每个 Pull Request 都必须通过 `quality` GitHub Actions job。该 job 会执行 conversion 数据校验、Vitest、TypeScript 检查、生产构建和 Lighthouse。请在描述中说明受影响的页面、数据 pair 和验证命令。

## Branch protection

仓库管理员在 GitHub 的 **Settings → Branches → Branch protection rules** 中为 `main` 创建规则，并启用以下选项：要求 Pull Request、要求至少一次 review、要求状态检查通过后合并、将 `quality` 设为 required check、要求分支与 `main` 保持最新、禁止 force push、禁止删除分支，以及禁止绕过上述规则。

如果使用 GitHub CLI，可先确认工作流名称和检查上下文，再在仓库设置中将 `quality` 设为 required status check。当前项目不会自动修改远程仓库保护规则，以避免在未知仓库权限下改变团队设置。

## Data changes

单位 pair 只能通过 `data/conversion-pairs.json` 修改。不要手动修改 `client/src/data/conversionRegistry.ts`，因为它是生成文件。提交前运行 `pnpm run validate:conversions`，并确保新的 slug、category、from、to 字段完整且唯一。
