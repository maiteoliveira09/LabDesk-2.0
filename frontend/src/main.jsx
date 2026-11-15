


import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Inicio from './inicio.jsx'
import Login from './login.jsx'
import './App.css'

function Principal() {
  const [pantalla, setPantalla] = useState('inicio')

  // Navegación entre las pantallas
  const irAInicio = () => setPantalla('inicio')
  const irALogin = () => setPantalla('login')
  const ingresarDashboard = () => setPantalla('dashboard')
  const cerrarSesion = () => setPantalla('login')

  return (
    <>
      {pantalla === 'inicio' && (
        <Inicio onIngresar={irALogin} />
      )}

      {pantalla === 'login' && (
        <Login
          onLogin={ingresarDashboard}
          onVolver={irAInicio}
        />
      )}

      {pantalla === 'dashboard' && (
        <App
          onVolver={irAInicio}
          onCerrarSesion={cerrarSesion}
        />
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Principal />
  </React.StrictMode>
)


