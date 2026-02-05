# 🚀 Website Builder AI

An AI-powered website builder that transforms natural language descriptions into fully functional React or Node.js applications. Simply describe your dream website, and watch as AI generates production-ready code in real-time.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- **🤖 AI-Powered Generation**: Leverages LLaMA 4 Maverick model to generate complete project structures from natural language prompts
- **🎨 Beautiful UI**: Modern, dark-themed interface built with React and Tailwind CSS
- **📝 Monaco Editor**: VS Code-like code editing experience with syntax highlighting
- **📁 File Explorer**: Interactive file tree navigation for generated projects
- **📊 Build Progress**: Real-time step-by-step progress tracking of the generation process
- **🔄 Auto-Detection**: Automatically determines whether to generate a React or Node.js project based on your description
- **💅 Production-Ready Code**: Generates fully-featured, beautiful designs using Tailwind CSS and Lucide React icons

## 🏗️ Project Structure

```
bolt_project/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── index.ts        # Main server entry point
│   │   ├── promts.ts       # AI prompt templates
│   │   ├── constants.ts    # Configuration constants
│   │   ├── stripindents.ts # String utility functions
│   │   └── default/
│   │       ├── node.ts     # Node.js project template
│   │       └── react.ts    # React project template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── App.tsx        # Main app component with routing
│   │   ├── main.tsx       # Application entry point
│   │   ├── config.ts      # Frontend configuration
│   │   ├── steps.ts       # XML parsing utilities
│   │   ├── index.css      # Global styles
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx   # Home page with prompt input
│   │   │   └── BuilderPage.tsx   # Code generation & preview
│   │   └── types/
│   │       └── index.ts   # TypeScript type definitions
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **OpenAI SDK** - AI integration (compatible with OpenRouter)
- **TypeScript** - Type-safe development
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Monaco Editor** - Code editor component
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- An API key from OpenRouter (for LLaMA model access)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bolt_project
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
touch .env

# Add your API key to .env
echo "AI_API_KEY=your_openrouter_api_key_here" >> .env

# Build and start the server
npm run dev
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Configure backend URL in src/config.ts
# Set backendUrl to 'http://localhost:3000'

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
AI_API_KEY=your_openrouter_api_key_here
```

### Frontend Configuration

Update `frontend/src/config.ts` to point to your backend:

```typescript
export const backendUrl = 'http://localhost:3000';
```

## 📡 API Endpoints

### POST `/tamplet`

Determines the project type (React or Node.js) based on the user's prompt.

**Request Body:**
```json
{
  "promt": "Create a todo app with user authentication"
}
```

**Response:**
```json
{
  "promt": ["base_prompts", "context_prompts"],
  "uipromt": ["initial_file_structure"]
}
```

### POST `/chat`

Generates code based on the conversation context.

**Request Body:**
```json
{
  "message": [
    { "role": "user", "content": "Create a landing page" }
  ]
}
```

**Response:**
```json
{
  "answer": "<boltArtifact>...generated code...</boltArtifact>"
}
```

## 🎯 Usage

1. **Open the Application**: Navigate to `http://localhost:5173` in your browser

2. **Describe Your Project**: On the landing page, enter a detailed description of the website you want to create

3. **Generate**: Click "Generate Website" to start the AI code generation

4. **View Progress**: Watch the build progress in the left sidebar as steps complete

5. **Explore Code**: Use the file explorer to navigate generated files and view code in the Monaco editor

6. **Preview**: Switch to the Preview tab to see your generated website (coming soon)

## 🎨 Example Prompts

- *"Create a modern portfolio website for a photographer with a gallery, about section, and contact form"*
- *"Build an e-commerce landing page with product cards, testimonials, and a newsletter signup"*
- *"Design a SaaS dashboard with sidebar navigation, charts, and user settings"*
- *"Create a blog homepage with featured posts, categories, and a search bar"*

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**
```bash
cd backend
tsc -b
node dist/index.js
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Type Definitions

### Step Types
```typescript
enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript
}
```

### File Item
```typescript
interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
  path: string;
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI model access
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editing experience
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

<p align="center">Made with ❤️ and Punya</p>
