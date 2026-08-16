# pnpm 10 配置迁移

本项目使用 pnpm 10。pnpm 10 的项目级依赖解析设置应放在根目录 `pnpm-workspace.yaml`，而不是 `package.json` 的 `pnpm` 字段。

当前迁移内容如下：

| 设置                  | 新位置                | 作用                                                       |
| --------------------- | --------------------- | ---------------------------------------------------------- |
| `patchedDependencies` | `pnpm-workspace.yaml` | 应用 `patches/wouter@3.7.1.patch`                          |
| `overrides`           | `pnpm-workspace.yaml` | 将 `tailwindcss` 的 `nanoid` 依赖固定为 `3.3.7`            |
| `packageManager`      | `package.json`        | 保留 pnpm 10.4.1 及其完整校验摘要，供 Actions 唯一识别版本 |

验证要求是：`pnpm install --frozen-lockfile` 不产生“pnpm field ignored”警告；`pnpm why nanoid` 能显示受 override 约束的解析结果；lockfile 保留 patch 与 override 影响；项目自动化测试、类型检查和生产构建均通过。

参考：

- [pnpm 10 Settings](https://pnpm.io/10.x/settings)
- [pnpm package.json](https://pnpm.io/package_json)
- [pnpm 10 patch](https://pnpm.io/10.x/cli/patch)
