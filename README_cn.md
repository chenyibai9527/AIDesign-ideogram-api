# AIDesign

AIDesign 是一个基于 Next.js 和 React 构建的 AI 驱动的图像生成网站。用户可以使用 Ideogram API 从文本描述创建独特的图像。

## 功能特性

- 基于文本提示的 AI 图像生成
- 使用 Google 登录的用户认证
- 图像生成的积分系统
- 生成图像的公共画廊
- 适应各种设备的响应式设计

## 技术栈

- 前端：Next.js, React
- 后端：Next.js API 路由
- 数据库：PostgreSQL 配合 Prisma ORM
- 认证：NextAuth.js
- 支付：Stripe
- API 集成：Ideogram API

## 快速开始

1. 克隆仓库
2. 安装依赖：
   ```
   npm install
   ```
3. 设置环境变量（参见 `.env.example`）
4. 运行开发服务器：
   ```
   npm run dev
   ```

## 项目结构

- `/src/app`：Next.js 应用路由和页面组件
- `/src/components`：可复用的 React 组件
- `/src/lib`：实用函数和配置
- `/public`：静态资源

## API 路由

- `/api/generate`：图像生成端点
- `/api/user/credits`：用户积分管理
- `/api/purchase-credits`：积分购买端点

## 部署

本项目设置为在 Vercel 上部署。请使用必要的环境变量配置您的 Vercel 项目。

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

本项目是开源的，遵循 [MIT 许可证](LICENSE)。