# YouQuery - AI Portfolio Chatbot Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest 2025](https://img.shields.io/badge/Hacktoberfest-2025-orange?logo=hackthebox&logoColor=white)](https://hacktoberfest.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

YouQuery transforms your portfolio website with an intelligent AI chatbot that can answer questions about your skills, experience, and projects. Create and customize your AI assistant to showcase your professional background in an interactive and engaging way.

## ✨ Features

- **Easy Integration**: Simple widget integration for any website
- **Multimodal Content**: Upload text, images, and documents to train your chatbot
- **Customizable Interface**: Match the chat widget to your website's design
- **Real-time Interaction**: Visitors get instant responses to their questions
- **Analytics Dashboard**: Track visitor interactions and popular queries
- **Multi-user Support**: Each user gets their own personalized chatbot instance

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Python 3.9+
- OpenAI API key or Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/you-query.git
   cd you-query
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   Create a `.env` file in both frontend and backend directories with your API keys and configuration.

### Running Locally

1. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🔧 Configuration

### Backend Configuration

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_chatbot
OPENAI_API_KEY=your_openai_api_key
# or
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-3.5/4 or Google Gemini
- **Authentication**: JWT
- **Deployment**: Docker, AWS/GCP (optional)

## 📚 Documentation

For detailed documentation, please visit our [Wiki](https://github.com/yourusername/you-query/wiki).

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for their powerful language models
- [React](https://reactjs.org/) and [FastAPI](https://fastapi.tiangolo.com/) communities
- All contributors who help improve this project

---

💡 **Note**: This is an MVP version. We're continuously working on adding more features and improvements. Your feedback is valuable!