import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateGreeting from './pages/CreateGreeting';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/create" element={<CreateGreeting />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
