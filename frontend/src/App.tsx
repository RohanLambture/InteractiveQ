import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoggedInPage from './pages/LoggedInPage';
import RoomOwnerInterface from './pages/RoomOwnerInterface';
import RoomParticipantInterface from './pages/RoomParticipantInterface';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<LoggedInPage />} />
          <Route path="/room/owner" element={<RoomOwnerInterface />} />
          <Route path="/room/participant" element={<RoomParticipantInterface />} />
          <Route path="/SignIn" element={<SignInPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
