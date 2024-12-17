import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import WhyChooseCrazyPaisa from './pages/WhyChooseCrazyPaisa';
import CasinoContactPage from './pages/CasinoContactPage';
import AboutPage from './pages/AboutPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Play } from './pages/Play';
import { Deposit } from './pages/Deposit';
import { LimboGame } from './pages/games/LimboGame';
import { MinesGame } from './pages/games/MinesGame';
import { BlackjackGame } from './pages/games/BlackjackGame';
import { useAuthStore } from './store/useAuthStore';
import CasinoDashboard from './pages/CasinoDashboard';
function App() {
  const { initializeFromCookie } = useAuthStore();

  useEffect(() => {
    initializeFromCookie();
  }, [initializeFromCookie]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
        <Route path="/" element={
            <>
              <Home />
              <AboutPage/>
              <WhyChooseCrazyPaisa />
              <CasinoDashboard/>
              <CasinoContactPage/>
            
       
            </>
          } />
          <Route path='/whyus' element={<WhyChooseCrazyPaisa/>}/>
          <Route path='/contact' element={<CasinoContactPage/>}/>
          <Route path='/about' element={<AboutPage/>}/>
          <Route path='/stats' element={<CasinoDashboard/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/play" element={<Play />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/games/limbo" element={<LimboGame />} />
          <Route path="/games/mines" element={<MinesGame />} />
          <Route path="/games/blackjack" element={<BlackjackGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;