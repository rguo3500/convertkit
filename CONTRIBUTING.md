# Contributing to ConvertKit

## Pull requests

每个 Pull Request 都必须通过 `quality` GitHub Actions job。该 job 会执行 conversion 数据校验、Vitest、TypeScript 检查、生产构建和 Lighthouse。请在描述中说明受影响的页面、数据 pair 和验证命令。

## Branch protection

仓库管理员在 GitHub 的 **Settings → Branches → Branch protection rules** 中为 `main` 创建规则，并启用以下选项：要求 Pull Request、要求至少一次 review、要求状态检查通过后合并、将 `quality` 设为 required check、要求分支与 `main` 保持最新、禁止 force push、禁止删除分支，以及禁止绕过上述规则。

如果使用 GitHub CLI，可先确认工作流名称和检查上下文，再在仓库设置中将 `quality` 设为 required status check。当前私有仓库使用 GitHub Free，GitHub 不允许为私有仓库启用上述分支保护 API；因此本次仅完成工作流、文档和徽章配置，未伪称保护规则已生效。若需要强制 required check，请将仓库升级到支持分支保护的计划，或将仓库改为公开后再按上述步骤启用。

## Data changes

单位 pair 只能通过 `data/conversion-pairs.json` 修改。不要手动修改 `client/src/data/conversionRegistry.ts`，因为它是生成文件。提交前运行 `pnpm run validate:conversions`，并确保新的 slug、category、from、to 字段完整且唯一。
