-----

# Interactive Mind Map UI / 交互式思维导图界面

An advanced, web-based mind mapping tool built with React and D3.js, focusing on unique layouts and rich user interactions.
一个基于 React 和 D3.js 构建的高级、网页版思维导图工具，专注于独特的布局和丰富的用户交互。

## Table of Contents / 目录

  * [Project Description / 项目描述](https://www.google.com/search?q=%23project-description--%E9%A1%B9%E7%9B%AE%E6%8F%8F%E8%BF%B0)
  * [Key Features / 核心功能](https://www.google.com/search?q=%23key-features--%E6%A0%B8%E5%BF%83%E5%8A%9F%E8%83%BD)
  * [Live Demo & Screenshots / 演示与截图](https://www.google.com/search?q=%23live-demo--screenshots--%E6%BC%94%E7%A4%BA%E4%B8%8E%E6%88%AA%E5%9B%BE)
  * [Technology Stack / 技术栈](https://www.google.com/search?q=%23technology-stack--%E6%8A%80%E6%9C%AF%E6%A0%88)
  * [Project Setup / 项目设置](https://www.google.com/search?q=%23project-setup--%E9%A1%B9%E7%9B%AE%E8%AE%BE%E7%BD%AE)
  * [Running the Project / 运行项目](https://www.google.com/search?q=%23running-the-project--%E8%BF%90%E8%A1%8C%E9%A1%B9%E7%9B%AE)
  * [Usage / 如何使用](https://www.google.com/search?q=%23usage--%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8)
  * [Project Structure / 项目结构](https://www.google.com/search?q=%23project-structure--%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84)
  * [Deployment / 部署](https://www.google.com/search?q=%23deployment--%E9%83%A8%E7%BD%B2)
  * [Contribution Guidelines /贡献指南](https://www.google.com/search?q=%23contribution-guidelines--%E8%B4%A1%E7%8C%AE%E6%8C%87%E5%8D%97)
  * [License / 许可证](https://www.google.com/search?q=%23license--%E8%AE%B8%E5%8F%AF%E8%AF%81)

## Project Description / 项目描述

This project is a sophisticated user interface for creating, viewing, and interacting with mind maps. It is designed for performance, customizability, and a fluid user experience. The application's core is a powerful rendering engine that supports complex layouts and real-time updates.
该项目是一个用于创建、查看和交互思维导图的复杂用户界面。它在设计上注重性能、可定制性和流畅的用户体验。应用程序的核心是一个强大的渲染引擎，支持复杂的布局和实时更新。

This UI is intended to be decoupled from data sources. While it provides a way to generate maps from text, it can also ingest pre-formatted JSON data, making it compatible with external services, such as a separate PDF table conversion microservice.
此 UI 在设计上与数据源解耦。虽然它提供了一种从文本生成导图的方法，但它也可以接收预先格式化好的 JSON 数据，使其能够与外部服务（例如一个独立的 PDF 表格转换微服务）兼容。

## Key Features / 核心功能

This application implements several unique and powerful features:
此应用程序实现了几个独特而强大的功能：

  * **Parent-Path Highlighting / 父节点路径高亮**:
    When hovering over any child node, the entire parental path back to the root node is instantly highlighted. All other unrelated nodes are de-emphasized, providing clear visual focus on the selected branch's lineage.
    当鼠标悬停在任何子节点上时，其返回到根节点的整个父路径会立即高亮显示。所有其他不相关的节点都会被弱化，从而清晰地在视觉上聚焦于所选分支的谱系。

  * **Left-to-Right Tree Layout / 从左到右的树状布局**:
    A clean, standard tree layout that organizes the mind map logically from left (root) to right (children).
    一种清晰、标准的树状布局，将思维导图从左（根节点）到右（子节点）进行逻辑组织。

  * **Vertical Leaf Node Alignment / 叶节点垂直对齐**:
    A highly specialized layout feature that automatically aligns all "leaf" nodes (nodes without any children) into a single vertical column on the far right. This occurs regardless of their individual depth in the hierarchy, creating a clean and organized final-level view.
    一个高度专业化的布局功能，可将所有“叶”节点（没有任何子节点的节点）自动对齐到最右侧的同一个垂直列中。无论它们在层级结构中的深度如何，都会进行对齐，从而创造出整洁有序的最终层级视图。

  * **Declarative Map Generation / 声明式导图生成**:
    Users can define a mind map's structure using a simple, intuitive, Markdown-like text syntax in a dedicated editor panel. The visual mind map is then automatically generated from this text, enabling a "code-first" approach to mind mapping.
    用户可以在专用的编辑器面板中使用简单、直观、类似 Markdown 的文本语法来定义思维导图的结构。然后，可视化的思维导图会根据此文本自动生成，实现了“代码优先”的思维导图创建方式。

  * **Data-Driven Visualization / 数据驱动的可视化**:
    The core rendering component is designed to accept hierarchical JSON data. This allows for easy integration with any backend or data-processing service that can output in the required format.
    核心渲染组件被设计为可接收层级化的 JSON 数据。这使得与任何能够输出所需格式的后端或数据处理服务进行集成变得非常容易。

## Live Demo & Screenshots / 演示与截图

*(This section should be updated with a link to the live deployment and screenshots of the application in action.)*
*（此部分应更新为在线演示的链接以及应用的实际运行截图。）*

**Example Screenshot:**
**截图示例：**

## Technology Stack / 技术栈

  * **Framework**: React (v18+) with TypeScript
  * **Visualization Engine**: D3.js (v7) for dynamic and custom SVG rendering.
  * **Styling**: Tailwind CSS for a utility-first styling workflow.
  * **State Management**: React Hooks (`useReducer` for complex state).
  * **Deployment**: Firebase Hosting.

## Project Setup / 项目设置

Follow these steps to get the project running locally.
请按照以下步骤在本地设置并运行此项目。

1.  **Prerequisites / 先决条件**:

      * Node.js (v18 or later)
      * npm or yarn

2.  **Clone the Repository / 克隆仓库**:

    ```bash
    git clone https://github.com/your-username/interactive-mind-map.git
    cd interactive-mind-map
    ```

3.  **Install Dependencies / 安装依赖**:

    ```bash
    npm install
    ```

    or / 或

    ```bash
    yarn install
    ```

## Running the Project / 运行项目

Once the dependencies are installed, you can run the local development server.
安装完依赖后，您可以运行本地开发服务器。

```bash
npm start
```

or / 或

```bash
yarn start
```

The application will be available at `http://localhost:3000`. The page will auto-reload when you make changes.
应用程序将在 `http://localhost:3000` 上可用。当您进行代码更改时，页面会自动重新加载。

## Usage / 如何使用

The user interface is divided into two main sections:
用户界面分为两个主要部分：

1.  **Editor Panel (Left) / 编辑器面板（左侧）**:

      * Use the text area to write your mind map using the declarative syntax.
      * Each level of indentation creates a new level in the mind map.
      * A "Generate" button will update the visualization based on the text.
      * 使用文本区域通过声明式语法编写您的思维导图。
      * 每一级缩进会在思维导图中创建一个新的层级。
      * 点击“生成”按钮将根据文本内容更新可视化视图。

2.  **Canvas (Right) / 画布（右侧）**:

      * This area displays the interactive mind map.
      * Hover over nodes to see the path-highlighting feature.
      * Click and drag on the canvas background to pan the view.
      * Use the mouse wheel to zoom in and out.
      * 此区域显示交互式思维导图。
      * 将鼠标悬停在节点上以查看路径高亮功能。
      * 在画布背景上单击并拖动以平移视图。
      * 使用鼠标滚轮进行缩放。

## Project Structure / 项目结构

The `src` folder is organized to maintain a clean and scalable architecture.
`src` 文件夹的组织结构旨在保持清晰和可扩展的架构。

```
src/
├── assets/         # Static assets like images and fonts / 静态资源（如图标和字体）
├── components/     # Reusable React components / 可复用的 React 组件
│   ├── ui/         # Generic UI elements (Button, Input, etc.) / 通用 UI 元素
│   └── MindMap/    # The core mind map visualization component / 核心思维导图组件
├── d3/             # D3.js specific logic and helpers / D3.js 相关的逻辑和辅助函数
├── hooks/          # Custom React hooks / 自定义 React 钩子
├── styles/         # Global styles and Tailwind CSS configuration / 全局样式和 Tailwind 配置
├── data/           # Mock data and data interfaces / 模拟数据和数据接口
├── App.tsx         # Main application component / 主应用组件
└── index.tsx       # Application entry point / 应用入口点
```

## Deployment / 部署

This project is configured for easy deployment to Firebase Hosting.
该项目已配置好，可轻松部署到 Firebase Hosting。

1.  **Set up Firebase / 设置 Firebase**:

      * Create a new project in the [Firebase Console](https://console.firebase.google.com/).
      * Install the Firebase CLI: `npm install -g firebase-tools`.
      * Login to Firebase: `firebase login`.
      * Initialize Firebase in the project root: `firebase init hosting`. Follow the prompts, setting the public directory to `build`.
      * 在 [Firebase 控制台](https://console.firebase.google.com/) 中创建一个新项目。
      * 安装 Firebase CLI: `npm install -g firebase-tools`。
      * 登录 Firebase: `firebase login`。
      * 在项目根目录中初始化 Firebase: `firebase init hosting`。根据提示操作，将公共目录设置为 `build`。

2.  **Build the Project / 构建项目**:
    Create a production-ready build of the application.
    创建应用的生产版本。

    ```bash
    npm run build
    ```

3.  **Deploy / 部署**:
    Deploy the contents of the `build` folder to Firebase Hosting.
    将 `build` 文件夹的内容部署到 Firebase Hosting。

    ```bash
    firebase deploy --only hosting
    ```

## Contribution Guidelines / 贡献指南

Contributions are welcome\! Please follow these steps to contribute.
欢迎贡献代码！请遵循以下步骤进行贡献。

1.  **Fork the repository** / **复刻 (Fork) 本仓库**
2.  **Create a new branch** (`git checkout -b feature/your-feature-name`) / **创建一个新分支** (`git checkout -b feature/your-feature-name`)
3.  **Make your changes and commit them** (`git commit -m 'Add some feature'`) / **进行更改并提交** (`git commit -m 'Add some feature'`)
4.  **Push to the branch** (`git push origin feature/your-feature-name`) / **推送到分支** (`git push origin feature/your-feature-name`)
5.  **Create a new Pull Request** / **创建一个新的拉取请求 (Pull Request)**

## License / 许可证

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
该项目根据 MIT 许可证授权。详情请参阅 [LICENSE](https://www.google.com/search?q=LICENSE) 文件。