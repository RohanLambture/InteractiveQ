import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoggedInPage from './pages/LoggedInPage';
import RoomOwnerInterface from './pages/RoomOwnerInterface';
import RoomParticipantInterface from './pages/RoomParticipantInterface';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AuthRoute from './components/auth/AuthRoute';
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/dashboard" 
            element={
              <AuthRoute requireAuth>
                <LoggedInPage />
              </AuthRoute>
            } 
          />
          <Route 
            path="/room/owner" 
            element={
              <AuthRoute requireAuth>
                <RoomOwnerInterface />
              </AuthRoute>
            } 
          />
          <Route 
            path="/room/participant" 
            element={
              <AuthRoute requireAuth>
                <RoomParticipantInterface />
              </AuthRoute>
            } 
          />
          <Route 
            path="/SignIn" 
            element={
              <AuthRoute>
                <SignInPage />
              </AuthRoute>
            } 
          />
          <Route 
            path="/SignUp" 
            element={
              <AuthRoute>
                <SignUpPage />
              </AuthRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
