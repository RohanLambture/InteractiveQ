# InteractiveQ

InteractiveQ is a real-time Q&A and polling platform that enables interactive sessions between presenters and participants. Perfect for meetings, events, classrooms, and conferences.

## Features

- **Live Q&A Sessions**: Enable real-time questions from participants
- **Anonymous Questions**: Option for participants to ask questions anonymously
- **Live Polling**: Create instant polls and visualize results in real-time
- **Room Management**: Create and manage multiple Q&A sessions
- **User Authentication**: Secure user accounts and session management
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Express Validator

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Setting Up the Backend

1. Clone the repository
    ```bash
    git clone https://github.com/RohanLambture/InteractiveQ.git
    cd interactiveq
    ```

2. Install backend dependencies
    ```bash
    cd backend
    npm install
    ```

3. Create a `.env` file in the backend directory
    ```plaintext
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret_key
    ```

4. Start the backend server
    ```bash
    npm run dev
    ```

### Setting Up the Frontend

1. Open a new terminal and navigate to the frontend directory
    ```bash
    cd frontend
    ```

2. Install frontend dependencies
    ```bash
    npm install
    ```
3. Start the frontend development server
    ```bash
    npm run dev
    ```


## Project Structure

```plaintext
interactiveq/
├── backend/
│   ├── middleware/     # Authentication and error handling middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── utils/      # Utility functions
│   │   └── App.tsx     # Main App component
│  
```

