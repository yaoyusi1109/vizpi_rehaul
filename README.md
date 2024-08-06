# VizGroup: An AI-Assisted Event-Driven System for Real-Time Collaborative Programming Learning Analytics

## TODO:
Due Aug 9 10:00AM EST：
1. 项目介绍页面前置：用户在登录之前应先看到项目介绍然后再登录
2. 完善之前答案生成的问题
3. 添加一个学生个人资料页面，学生可以在其中填写他们的基本信息（例如，年级、专业、性别，甚至上传个人照片）。将所有这些信息存储在我们的 AWS 数据库中，而不是 Firebase。这个可以拖到下周，不急这周四。
4. 可以考虑优化下整体UI美学风格,视频再讨论。




## Introduction

Programming instructors often conduct collaborative learning activities, like Peer Instruction, to foster a deeper understanding in students and enhance their engagement with learning. These activities, however, may not always yield productive outcomes due to the diversity of student mental models and their ineffective collaboration. In this work, we introduce VizGroup, an AI-assisted system that enables programming instructors to easily oversee students’ real-time collaborative learning behaviors during large programming courses. VizGroup leverages Large Language Models (LLMs) to recommend event specifications for instructors so that they can simultaneously track and receive alerts about key correlation patterns between various collaboration metrics and ongoing coding tasks.

## Table of Contents

- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Key Components](#key-components)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The Task Management System frontend is built using React and provides a user-friendly interface for managing tasks. It integrates with AI services to enhance task descriptions and generate quiz questions to ensure a thorough understanding of tasks before proceeding.

This project aims to improve task management efficiency and user experience by leveraging AI technology to automate and enhance various aspects of task handling. Key features include automated task description refinement and the generation of pre-coding quiz questions to help users understand tasks better.

## Architecture Diagram

```
Frontend Architecture
------------------------------
|         Project Root        |
|----------------------------|
| .vscode/                   | # VSCode configuration files
| node_modules/              | # Project dependencies
| public/                    | # Public assets
|  ├── dist/                 |    # Distribution files
|  ├── fonts/                |    # Font files
|  ├── lib/                  |    # Library files
|  ├── src/                  |    # Source files
|  └── index.html            |    # Main HTML file
| src/                       | # Main source directory
|  ├── component/            |    # React components
|  |   ├── audioSTU/         |       # Handles audio-related student functionalities
|  |   ├── chat/             |       # Manages chat functionalities
|  |   ├── code/             |       # Code editor and related utilities
|  |   ├── commonUnit/       |       # Shared components and utilities used across the app
|  |   ├── group/            |       # Group management components
|  |   ├── session/          |       # Session management components
|  |   ├── student-components/|      # Components specific to student functionalities
|  |   └── topBar/           |       # Top bar navigation components
|  ├── context/              |    # Context providers for global state management
|  ├── css/                  |    # Stylesheets for the app
|  ├── icon/                 |    # Icons used in the app
|  ├── pages/                |    # Main pages of the application
|  ├── service/              |    # Services for API calls and backend interactions
|  ├── test/                 |    # Testing utilities and test files
|  ├── tool/                 |    # Utility functions and helpers
|  ├── App.js                |    # Main app component
|  ├── App.test.js           |    # Test file for the main app component
|  ├── index.js              |    # Entry point of the application
|  ├── reportWebVitals.js    |    # Performance reporting
|  └── setupTests.js         |    # Test setup file
|----------------------------|
| .env                       | # Environment variables
| .gitignore                 | # Git ignore file
| package-lock.json          | # Lockfile for npm dependencies
| package.json               | # Project metadata and dependencies
| README.md                  | # Project overview and instructions
| webpack.config.js          | # Webpack configuration file
------------------------------
```

## Setup Instructions

### Prerequisites

- Node.js (>= 12.x)
- npm

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/task-management-frontend.git
   cd task-management-frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. To start the development server:

   ```
   npm start
   ```

The application will be available at \`http://localhost:3000\`.


## Key Components

### \`TaskCard.jsx\`

The \`TaskCard\` component is responsible for displaying and managing individual tasks. It includes functionalities for:

- Editing task descriptions.
- Using AI to refine task descriptions.
- Generating and displaying quiz questions based on tasks.

### \`FixTaskModal.jsx\`

The \`FixTaskModal\` component provides a modal dialog for refining task descriptions using AI. It integrates with the backend AI services to generate refined descriptions and quiz questions.

### \`aiAssistant.js\`

Contains functions to interact with AI services for generating task descriptions and quiz questions.

## Features

- **Task Management**: Create, edit, and manage tasks.
- **AI Integration**: Refine task descriptions and generate quiz questions using AI.
- **Pre-coding Questions**: Ensure understanding of tasks with AI-generated quiz questions.
- **Responsive Design**: Works well on different screen sizes.

## Usage

### Editing a Task

1. Click the "Edit" button to enable editing of the task description.
2. Modify the task description as needed.
3. Click "Update" to save changes.

### Using AI Assistant

1. Click the "AI Assistant" button to open the \`FixTaskModal\`.
2. The AI will generate a refined task description.
3. Review and accept the refined task description.

### Generating Quiz Questions

1. After updating the task description, the AI will automatically generate quiz questions.
2. View the quiz questions in the "Pre-coding Questions" section.

## Guidelines for Code Refactoring

- Every member involved in refactoring must have a dedicated branch for this purpose: `ec2-yourName`.
- Before starting any development work, always pull from the `ec2` branch and merge into your current branch.
- All refactoring-related code can only be committed to branch `ec2` after thorough testing.
- When you decide to refactor a service, document it in the progress part below for tracking refactoring progress.
- If you encounter a feature that cannot be implemented via the backend API, submit an issue in the backend project, specifying the method name and location.
- If implementing a feature requires calling at least two APIs, submit an issue in the backend project, specifying the method name and location.
- Since it may not be possible to deploy normally until all interfaces have been rewritten, please ensure to commit correct code to branch `ec2`.
- Before using any backend API, test it with Postman to ensure you are aware of all the data it returns.
- We use Axios to send the HTTP requests.
- You can change the parameter list of the functions. But, do not change the name of the functions.
- If you have any other thoughts or suggestions regarding these guidelines, please submit an issue in the backend project.
