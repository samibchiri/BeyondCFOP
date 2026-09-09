
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { ThemeContext } from '../context/DarkThemeContext.jsx'
import { OllProvider } from '../context/OllContext.jsx';
import { PllProvider } from '../context/PllContext.jsx';
import { AlgProvider  } from '../context/AlgContext.jsx'


import { seedDatabaseIfEmpty } from '../data/NewGeneratedData/db.js'
import '../styling/App.css'
import '../styling/index.css'
import NavBar from './NavBar.jsx'


function AppLayout() {
  const [darkMode, setDarkMode] = useState(true)

  function toggleDarkMode() {
    setDarkMode(darkMode => !darkMode)
  }

  useEffect(() => {
    document.body.className = darkMode ? "text-white" : "text-dark";
    document.body.style.backgroundColor = darkMode ? "#191d21" : "#f8f9fa";
    document.body.style.paddingTop = "60px"
  }, [darkMode])

  useEffect(() => {
    seedDatabaseIfEmpty();
  }, []);



  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
          <OllProvider >
            <AlgProvider >
                    <NavBar />
                    <Outlet />
            </AlgProvider >
          </OllProvider >
      </ThemeContext.Provider>
  )
}

export default AppLayout