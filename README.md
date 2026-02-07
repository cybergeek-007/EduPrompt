# EduPrompt: AI-Powered Training Platform

**An open-source platform for generating, managing, and tracking educational content, quizzes, and AI-powered learning simulations.**


---

## 🚀 Features

* **Dynamic Content Management**: Create, update, and organize training topics, subtopics, and educational content.
* **Interactive Quizzes**: Generate quizzes and track user attempts for progress analysis.
* **AI Integration**: Use Groq API for AI-generated content, learning prompts, or simulation scenarios.
* **User Authentication**: Secure JWT-based login and profile management.
* **Progress Tracking**: Monitor user progress through courses and assessments.

---

## 🛠 Tech Stack

| Component          | Technology       |
| :----------------- | :--------------- |
| **Backend** | Node.js, Express |
| **Database** | MongoDB          |
| **Frontend** | React.js         |
| **AI** | Groq API         |
| **Authentication** | JWT              |
| **Linting** | ESLint           |
| **CI/CD** | GitHub Actions   |

---

## 📦 Installation

### Backend Setup

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/cybergeek-007/EduPrompt.git](https://github.com/cybergeek-007/EduPrompt.git)
    cd EduPrompt/backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the `backend` directory:
    ```env
    DB_URI=mongodb://localhost:27017/eduprompt
    GROQ_API_KEY=your_groq_api_key
    JWT_SECRET=your_jwt_secret
    ```

4.  **Start the server**:
    ```bash
    node server.js
    ```

### Frontend Setup

1.  **Navigate to the frontend**:
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

---

## 📡 API Endpoints

| Endpoint            | Method | Description                       |
| :------------------ | :----- | :-------------------------------- |
| `/api/auth/login`   | `POST` | User login                        |
| `/api/content`      | `GET`  | Fetch educational content         |
| `/api/quiz`         | `POST` | Create a quiz                     |
| `/api/quiz/attempt` | `GET`  | Fetch quiz attempts for a user    |

---

## 💡 Usage Examples

### Backend (Node.js)
Generate AI content for training using the Groq utility:
```javascript
const { generateContent } = require('./utils/groq');

const initAI = async () => {
  const content = await generateContent("Generate a training simulation prompt");
  console.log(content);
};
