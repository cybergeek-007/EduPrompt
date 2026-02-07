export interface Topic {
  id: string;
  title: string;
  totalDays: number;
  completedDays: number;
  progress: number;
}

export interface DayContent {
  day: number;
  title: string;
  explanation: string;
  completed: boolean;
}

export interface Quiz {
  id: string;
  topicId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const mockTopics: Topic[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    totalDays: 10,
    completedDays: 7,
    progress: 70,
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    totalDays: 8,
    completedDays: 3,
    progress: 37.5,
  },
  {
    id: "3",
    title: "Data Structures and Algorithms",
    totalDays: 10,
    completedDays: 10,
    progress: 100,
  },
];

export const mockStudyPlans: Record<string, DayContent[]> = {
  "1": [
    {
      day: 1,
      title: "What is Machine Learning?",
      explanation: "Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves.",
      completed: true,
    },
    {
      day: 2,
      title: "Types of Machine Learning",
      explanation: "There are three main types: Supervised Learning (learning from labeled data), Unsupervised Learning (finding patterns in unlabeled data), and Reinforcement Learning (learning through trial and error with rewards).",
      completed: true,
    },
    {
      day: 3,
      title: "Linear Regression",
      explanation: "Linear regression is a fundamental supervised learning algorithm used to predict continuous values. It finds the best-fitting straight line through the data points to make predictions.",
      completed: true,
    },
    {
      day: 4,
      title: "Classification Algorithms",
      explanation: "Classification is about predicting categorical outcomes. Common algorithms include Logistic Regression, Decision Trees, and Support Vector Machines (SVM).",
      completed: true,
    },
    {
      day: 5,
      title: "Model Evaluation Metrics",
      explanation: "Understanding metrics like accuracy, precision, recall, and F1-score is crucial for evaluating model performance and choosing the right model for your problem.",
      completed: true,
    },
    {
      day: 6,
      title: "Overfitting and Underfitting",
      explanation: "Overfitting occurs when a model learns training data too well, including noise. Underfitting happens when a model is too simple. Balance is achieved through proper regularization and validation.",
      completed: true,
    },
    {
      day: 7,
      title: "Feature Engineering",
      explanation: "Feature engineering is the process of creating new features or transforming existing ones to improve model performance. It's often more important than the choice of algorithm.",
      completed: true,
    },
    {
      day: 8,
      title: "Neural Networks Basics",
      explanation: "Neural networks are inspired by biological neurons. They consist of layers of interconnected nodes that process information and learn complex patterns through backpropagation.",
      completed: false,
    },
    {
      day: 9,
      title: "Cross-Validation Techniques",
      explanation: "Cross-validation helps assess how well a model generalizes to unseen data. K-fold cross-validation is a popular technique that divides data into K subsets for training and testing.",
      completed: false,
    },
    {
      day: 10,
      title: "Real-world ML Applications",
      explanation: "Machine Learning powers recommendation systems, image recognition, natural language processing, autonomous vehicles, and fraud detection systems across industries.",
      completed: false,
    },
  ],
};

export const mockQuizzes: Record<string, Quiz> = {
  "1": {
    id: "quiz-1",
    topicId: "1",
    questions: [
      {
        question: "What is the main purpose of Machine Learning?",
        options: [
          "To replace human intelligence completely",
          "To enable systems to learn from data without explicit programming",
          "To create robots",
          "To process data faster than traditional computers"
        ],
        correctAnswer: "To enable systems to learn from data without explicit programming"
      },
      {
        question: "Which type of learning uses labeled data?",
        options: [
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Supervised Learning",
          "Deep Learning"
        ],
        correctAnswer: "Supervised Learning"
      },
      {
        question: "What does overfitting mean?",
        options: [
          "Model performs well on all data",
          "Model is too simple",
          "Model learns training data too well including noise",
          "Model cannot learn from data"
        ],
        correctAnswer: "Model learns training data too well including noise"
      },
      {
        question: "Linear regression is used for:",
        options: [
          "Predicting categorical outcomes",
          "Predicting continuous values",
          "Clustering data",
          "Image recognition"
        ],
        correctAnswer: "Predicting continuous values"
      },
      {
        question: "What is feature engineering?",
        options: [
          "Building neural networks",
          "Creating or transforming features to improve model performance",
          "Collecting data",
          "Debugging code"
        ],
        correctAnswer: "Creating or transforming features to improve model performance"
      }
    ]
  }
};
