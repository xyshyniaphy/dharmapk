# Interactive Mind Map UI

This document provides a comprehensive overview of the Interactive Mind Map UI project, including its architecture, technical specifications, and implementation guidelines.

---

# 交互式思维导图用户界面

本文档全面概述了交互式思维导图用户界面项目，包括其架构、技术规格和实施指南。

---

## 1. Project Overview (项目概述)

### English

This project is an advanced, web-based mind mapping tool built with React and D3.js. It is designed to provide a sophisticated user interface for creating, viewing, and interacting with mind maps, with a focus on performance, customizability, and a fluid user experience.

**Problem Solved:**
This project addresses the need for a highly interactive and visually clear mind mapping tool. Key problems solved include:
- **Visual Clarity**: The parent-path highlighting and vertical leaf node alignment features provide a clear view of the mind map's structure.
- **Data Portability**: The application can render mind maps from various sources like text files and JSON data.
- **Ease of Use**: Declarative text-based map generation allows users to quickly create mind maps.

**How the Product Works:**
The application is a Single Page Application (SPA).
1.  A user provides a URL to a mind map file.
2.  The application fetches, parses, and renders the data.
3.  The user can interact with the mind map by panning, zooming, and hovering over nodes to see relationships.
4.  Rendering is handled by D3.js.
5.  State is managed globally using Jotai.

**Core Requirements:**
- Visualize hierarchical data.
- Implement unique layouts.
- Provide an interactive UI.
- Decouple the data source from the UI.
- Enable declarative map generation.

### 中文

本项目是一个基于 React 和 D3.js 构建的高级网页版思维导图工具。它旨在提供一个复杂的用户界面，用于创建、查看和交互思维导图，重点关注性能、可定制性和流畅的用户体验。

**解决的问题:**
该项目解决了对高度互动和视觉清晰的思维导图工具的需求。主要解决的问题包括：
- **视觉清晰度**: 父路径高亮和叶节点垂直对齐功能提供了清晰的思维导图结构视图。
- **数据可移植性**: 应用程序可以从各种来源（如文本文件和JSON数据）渲染思维导图。
- **易用性**: 基于声明式文本的导图生成方式允许用户快速创建思维导图。

**产品工作原理:**
该应用程序是一个单页应用程序 (SPA)。
1.  用户提供一个思维导图文件的URL。
2.  应用程序获取、解析和渲染数据。
3.  用户可以通过平移、缩放和悬停在节点上与思维导图进行交互，以查看关系。
4.  渲染由 D3.js 处理。
5.  状态使用 Jotai 进行全局管理。

**核心要求:**
- 可视化层次结构数据。
- 实现独特的布局。
- 提供交互式用户界面。
- 将数据源与用户界面分离。
- 支持声明式导图生成。

---

## 2. How to Run the Project (如何运行项目)

### English

1.  Install dependencies: `npm install`
2.  Start the development server: `npm start`
3.  The application will be available at `http://localhost:3000`.

### 中文

1.  安装依赖: `npm install`
2.  启动开发服务器: `npm start`
3.  应用程序将在 `http://localhost:3000` 上可用。

---

## 3. Technology Stack (技术栈)

### English

- **React**: v18+ with TypeScript
- **Jotai**: For state management
- **React Router**: For client-side routing
- **D3.js**: v7 for data visualization and SVG rendering
- **Tailwind CSS**: For utility-first styling
- **Node.js**: v18 or later
- **Vite**: As the build tool

### 中文

- **React**: v18+ with TypeScript
- **Jotai**: 用于状态管理
- **React Router**: 用于客户端路由
- **D3.js**: v7 用于数据可视化和 SVG 渲染
- **Tailwind CSS**: 用于功能优先的样式设计
- **Node.js**: v18 或更高版本
- **Vite**:作为构建工具

---

## 4. System Architecture and Patterns (系统架构与模式)

### English

**System Architecture:**
The application is a Single Page Application (SPA) with a component-based architecture. The core is a data-driven visualization engine powered by D3.js.

**Design Patterns:**
- **Component-Based Architecture**: The UI is broken down into reusable React components.
- **Hooks**: Custom hooks encapsulate and reuse logic.
- **Data-Driven Visualization**: The D3.js implementation is a direct representation of the application's state.
- **Global State Management**: A central Jotai store manages the application's global state.

### 中文

**系统架构:**
该应用程序是一个采用基于组件架构的单页应用程序 (SPA)。其核心是一个由 D3.js 驱动的数据驱动可视化引擎。

**设计模式:**
- **基于组件的架构**: 用户界面被分解为可重用的 React 组件。
- **Hooks**: 自定义 Hooks 用于封装和重用逻辑。
- **数据驱动的可视化**: D3.js 的实现是应用程序状态的直接表示。
- **全局状态管理**: 中央 Jotai 存储用于管理应用程序的全局状态。

---

## 5. Layout Algorithm (布局算法)

### English

The project uses a custom auto-layout algorithm with the following key features:
- **Orientation**: Left-to-right tree structure.
- **Node Sizing**: Leaf and non-leaf nodes have distinct, fixed widths. Node height is dynamic based on content.
- **Columnar Alignment**:
    - All leaf nodes are aligned in the rightmost column.
    - Non-leaf nodes are positioned based on their depth.
    - A parent node is vertically centered relative to its children.
- **Connection Lines**: Supports straight, elbow, and curved connectors.

### 中文

该项目使用自定义的自动布局算法，具有以下主要特点：
- **方向**: 从左到右的树形结构。
- **节点大小**: 叶节点和非叶节点具有不同且固定的宽度。节点高度根据内容动态变化。
- **列对齐**:
    - 所有叶节点都在最右边的列中对齐。
    - 非叶节点根据其深度定位。
    - 父节点相对于其子节点垂直居中。
- **连接线**: 支持直线、肘形和曲线连接器。

---

## 6. File Parsing Implementation (文件解析实现)

### English

The application supports parsing multiple mind map formats. The goal is to convert the source file into a standardized `Node` object.

- **FreeMind (.mm)**: Parsed using a standard XML parser (`DOMParser`).
- **MindMeister (.mind)**: Parsed by mapping the hierarchical JSON to the standard `Node` structure.
- **XMind (.xmind)**: Modern `.xmind` files are parsed by unzipping the file, reading `metadata.json` to check the version, and then parsing `content.json`. Older files fall back to parsing `content.xml`. The `JSZip` library is used for unzipping.

A factory pattern in the `Viewer` component determines which parser to use based on the file extension.

### 中文

该应用程序支持解析多种思维导图格式。目标是将源文件转换为标准化的 `Node` 对象。

- **FreeMind (.mm)**: 使用标准 XML 解析器 (`DOMParser`) 进行解析。
- **MindMeister (.mind)**: 通过将分层 JSON 映射到标准 `Node` 结构进行解析。
- **XMind (.xmind)**: 现代的 `.xmind` 文件通过解压缩文件，读取 `metadata.json` 来检查版本，然后解析 `content.json` 来进行解析。旧文件则回退到解析 `content.xml`。`JSZip` 库用于解压缩。

`Viewer` 组件中的工厂模式根据文件扩展名确定使用哪个解析器。

---

## 7. D3.js Implementation Guide (D3.js 实现指南)

### English

- **Version**: Use D3.js v7.x.
- **Modularity**: Import only the necessary modules (e.g., `d3-selection`, `d3-hierarchy`).
- **Code Style**: Use modern JavaScript (ES6+), arrow functions, and readable method chaining.
- **Data Binding**: Prefer the `.join()` method for concise enter-update-exit operations.
- **Hierarchy**: Use `d3.hierarchy()` to create the tree structure and `d3.tree()` for the layout generation.
- **Shapes**: Use shape generators like `d3.linkHorizontal()` to draw connection paths.

### 中文

- **版本**: 使用 D3.js v7.x。
- **模块化**: 只导入必要的模块（例如 `d3-selection`, `d3-hierarchy`）。
- **代码风格**: 使用现代 JavaScript (ES6+), 箭头函数和可读的方法链。
- **数据绑定**: 优先使用 `.join()` 方法进行简洁的 enter-update-exit 操作。
- **层次结构**: 使用 `d3.hierarchy()` 创建树结构，使用 `d3.tree()` 生成布局。
- **形状**: 使用 `d3.linkHorizontal()` 等形状生成器绘制连接路径。

---

## 8. Tool Panel (工具面板)

### English

The application includes a tool panel at the bottom of the screen with the following features:
- **Node Column Width**: Adjust the spacing between columns of nodes.
- **Vertical Text**: Toggle vertical text display for non-leaf nodes.
- **Line Type**: Switch between different connector line styles (curved, straight, right-angled, rounded-angled).

All settings are saved to the browser's LocalStorage and persist between sessions.

### 中文

应用程序在屏幕底部包含一个工具面板，具有以下功能：
- **节点列宽**: 调整节点列之间的间距。
- **垂直文本**: 切换非叶节点的垂直文本显示。
- **连线类型**: 在不同的连接线样式（曲线、直线、直角折线、圆角折线）之间切换。

所有设置都保存到浏览器的 LocalStorage 中，并在会话之间保持不变。

---

## 9. Component and Styling Guide (组件与样式指南)

### English

**Component Architecture:**
- **Primitive Components**: Basic, reusable UI elements like `Button`, `Input`.
- **Composite Components**: Assemble primitives into functional UI sections like `LoginForm`.

**Styling with Tailwind CSS:**
- Embrace utility classes directly in JSX.
- Use `tailwind-merge` to handle conditional classes and resolve style conflicts.
- Co-locate complex class strings as constants within the component file.
- Use `@apply` sparingly for custom reusable classes or styling third-party components.

### 中文

**组件架构:**
- **原始组件**: 基础的、可重用的 UI 元素，如 `Button`, `Input`。
- **复合组件**: 将原始组件组装成功能性的 UI 部分，如 `LoginForm`。

**使用 Tailwind CSS 进行样式设计:**
- 直接在 JSX 中使用功能类。
- 使用 `tailwind-merge` 处理条件类并解决样式冲突。
- 将复杂的类字符串作为常量放在组件文件中。
- 谨慎使用 `@apply`，主要用于自定义可重用类或为第三方组件设置样式。

---

## 10. Project Status (项目状态)

### English

**What Works:**
- The project has a defined architecture and technology stack.
- The core data flow and component structure have been planned.

**What Works:**
- The project has a defined architecture and technology stack.
- The core data flow and component structure have been planned.
- All parsers for `.xmind`, `.mm`, and `.mind` files are implemented.
- Interactive features like hover highlighting, click-to-pin, and zoom/pan are fully functional.
- A navigation panel that displays the path to the parent of the hovered node, and lists all of the parent's siblings.

**What's Left to Build:**
- Styling improvements.
- Robust error handling.
- A solution for potential CORS issues when fetching files from external domains.

### 中文

**已完成的工作:**
- 项目已定义了架构和技术栈。
- 核心数据流和组件结构已规划好。

**已完成的工作:**
- 项目已定义了架构和技术栈。
- 核心数据流和组件结构已规划好。
- `.xmind`、`.mm` 和 `.mind` 文件的所有解析器均已实现。
- 悬停高亮、点击固定和缩放/平移等交互功能已完全实现。
- 一个导航面板，显示到悬停节点父级的路径，并列出父级的所有同级节点。

**待构建的内容:**
- 样式改进。
- 强大的错误处理。
- 针对从外部域获取文件时可能出现的 CORS 问题的解决方案。
