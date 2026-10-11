
import { useState } from 'react'
import './App.css'

import Starfield from './components/Starfield'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Projects from './components/Projects'
import Issues from './components/Issues'
import Login from './components/Login'
import Register from './components/Register'
import Astro from './components/Astro'

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')

    return token ? { username, role } : null
  })

  const [showRegister, setShowRegister] = useState(false)

  function handleLogin(data) {
    setUser(data)
    setActivePage('Dashboard')
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')

    setUser(null)
    setActivePage('Dashboard')
  }

  // Login and registration pages
  if (!user) {
    return (
      <>
        <Starfield />
        <Navbar name="DevBoard" />

        {showRegister ? (
          <Register
            onRegister={() => setShowRegister(false)}
            onShowLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onShowRegister={() => setShowRegister(true)}
          />
        )}

        <Astro />
      </>
    )
  }

  // Main DevBoard application
  return (
    <>
      <Starfield />
      <Navbar name="DevBoard" />

      <h1>Welcome to DevBoard, {user.username}!</h1>
      <p>Team Project & Issue Tracking System</p>

      <button onClick={handleLogout}>
        Logout
      </button>

      <nav>
        <button onClick={() => setActivePage('Dashboard')}>
          Dashboard
        </button>

        <button onClick={() => setActivePage('Projects')}>
          Projects
        </button>

        <button onClick={() => setActivePage('Issues')}>
          Issues
        </button>
      </nav>

      <main>
        {activePage === 'Dashboard' && <Dashboard />}
        {activePage === 'Projects' && <Projects />}
        {activePage === 'Issues' && <Issues />}
      </main>

      <Astro />
    </>
  )
}

export default App
