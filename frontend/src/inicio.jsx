import './Inicio.css'
export default function Inicio({ onIngresar }) {
    
  return (
    <div className="inicio">
      <nav className="nav-inicio">
        <div className="marca">
          <span className="marca-icono">L</span>
          <span>LabDesk</span>
        </div>

        <div className="nav-enlaces">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <a href="#nosotros">Nosotros</a>
          <button onClick={onIngresar}>Ingresar</button>
        </div>
      </nav>

      <section className="hero-inicio" id="inicio">
        <div className="hero-texto">
          <span className="etiqueta-inicio">
            SISTEMA DE GESTIÓN DE LABORATORIO
          </span>

          <h1>
            Gestiona las incidencias
            <span> de tu laboratorio</span>
          </h1>

          <p>
            Una plataforma para registrar, organizar y dar seguimiento
            a los problemas técnicos de tu laboratorio de manera rápida
            y sencilla.
          </p>

          <button className="boton-inicio" onClick={onIngresar}>
            Ingresar al sistema →
          </button>

          <div className="beneficios">
            <span>✓ Registro de incidencias</span>
            <span>✓ Seguimiento en tiempo real</span>
          </div>
        </div>

        <div className="hero-ilustracion">
          <div className="tarjeta-visual">
            <div className="visual-cabecera">
              <span>●</span><span>●</span><span>●</span>
            </div>
            <div className="visual-icono">🖥️</div>
            <h3>Panel de control</h3>
            <p>Todo tu laboratorio organizado</p>
            <div className="visual-datos">
              <div><strong>01</strong><span>Registrar</span></div>
              <div><strong>02</strong><span>Gestionar</span></div>
              <div><strong>03</strong><span>Resolver</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="servicios-inicio" id="servicios">
        <div className="titulo-seccion">
          <span>¿QUÉ PUEDES HACER?</span>
          <h2>Todo lo que necesitas en un solo lugar</h2>
        </div>

        <div className="servicios-grid">
          <article className="servicio-card">
            <span>📝</span>
            <h3>Registrar incidencias</h3>
            <p>Registra problemas de hardware, software y red.</p>
          </article>

          <article className="servicio-card">
            <span>📊</span>
            <h3>Control y seguimiento</h3>
            <p>Consulta las incidencias pendientes, en proceso y resueltas.</p>
          </article>

          <article className="servicio-card">
            <span>⚙️</span>
            <h3>Gestión sencilla</h3>
            <p>Edita, actualiza y elimina registros fácilmente.</p>
          </article>
        </div>
      </section>

      <section className="nosotros-inicio" id="nosotros">
        <h2>LabDesk</h2>
        <p>
          Una solución digital para mejorar la organización y atención
          de incidencias dentro del laboratorio.
        </p>
      </section>

      <footer className="footer-inicio">
        © 2026 LabDesk · Sistema de gestión de incidencias
      </footer>
    </div>
  )
}
