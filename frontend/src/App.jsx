import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Your main content will go here */}
      </main>
      <Footer />
    </div>
  )
}

export default App
