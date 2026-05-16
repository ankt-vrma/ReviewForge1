# ReviewForge 👑

ReviewForge is an AI-powered code review platform built to help developers instantly analyze, review, and improve their code using intelligent feedback.

Users can paste code snippets, receive AI-generated reviews, manage previous reviews, and organize snippets inside a clean modern dashboard.

---

## 🚀 Features

- 🔍 AI-powered code reviews
- 💬 Structured code input with formatting preservation
- 📁 Workspace for managing saved snippets
- 📊 Dashboard with recent review history
- 🔐 Authentication system
- 🎨 Modern responsive UI
- ⚡ Fast Vite + React frontend
- 🌙 Dark-themed developer interface
- 🧠 Intelligent review responses

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### AI
- Gemini API / AI Integration

---

## 📂 Project Structure

```bash
reviewforge/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend `.env`

```env
VITE_API_URL=your_backend_url
```

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_api_key
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/reviewforge.git
```

---

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

---

### 3. Install backend dependencies

```bash
cd backend
npm install
```

---

## ▶️ Running the Project

### Start frontend

```bash
cd frontend
npm run dev
```

### Start backend

```bash
cd backend
npm start
```

---

## 🔐 Authentication

ReviewForge uses JWT-based authentication for secure login and protected routes.

---

## 🎯 Future Improvements

- Multi-language code analysis
- Syntax highlighting improvements
- Real-time collaborative reviews
- Review export system
- AI chat assistant
- Theme customization
- Mobile responsive enhancements

---

## 📸 Screenshots

_Add screenshots here later_

---

## 👨‍💻 Author

Developed by Ankit Verma.

---

## 📄 License

This project is licensed under the MIT License.