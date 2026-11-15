
import './Login.css'
import { useState } from 'react'

export default function Login({ onLogin, onVolver }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function ingresar(e) {
    e.preventDefault()

    if (usuario === 'admin' && password === '123456') {
      setError('')
      onLogin()
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <main className="login-pagina">
      <section className="login-panel">
        <button className="login-volver" onClick={onVolver}>
          ← Volver al inicio
        </button>

        <div className="login-logo">L</div>

        <h1>Bienvenido a LabDesk</h1>
        <p className="login-descripcion">
          Ingresa tus datos para acceder al sistema
        </p>

        <form onSubmit={ingresar}>
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button className="login-boton" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="login-pie">
          Sistema de gestión de incidencias
        </p>
      </section>
    </main>
  )
}
