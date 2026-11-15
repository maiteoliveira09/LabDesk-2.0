
import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://127.0.0.1:8000/api/incidencias/'

const vacio = {
  titulo: '',
  descripcion: '',
  categoria: 'hardware',
  prioridad: 'media',
  estado: 'pendiente',
  responsable: '',
  ubicacion: '',
  fecha_limite: ''
}

function fechaParaInput(fecha) {
  if (!fecha) return ''
  const valor = new Date(fecha)
  if (Number.isNaN(valor.getTime())) return ''
  const local = new Date(valor.getTime() - valor.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

function alertaFecha(item) {
  if (!item.fecha_limite || item.estado === 'resuelto') return ''
  const ahora = new Date()
  const limite = new Date(item.fecha_limite)
  if (Number.isNaN(limite.getTime())) return ''
  if (limite < ahora) return 'Vencida'
  if (limite <= new Date(ahora.getTime() + 24 * 60 * 60 * 1000)) {
    return 'Próxima a vencer'
  }
  return ''
}

async function leerError(respuesta, mensaje) {
  if (respuesta.ok) return
  let detalle = mensaje
  try {
    const datos = await respuesta.json()
    detalle = Object.entries(datos)
      .map(([campo, valor]) => `${campo}: ${Array.isArray(valor) ? valor.join(', ') : valor}`)
      .join(' | ') || mensaje
  } catch {
    // Mantener el mensaje general si la respuesta no contiene JSON.
  }
  throw new Error(detalle)
}

export default function App({ onVolver, onCerrarSesion }) {
  const [datos, setDatos] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroPrioridad, setFiltroPrioridad] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [comentarioAbierto, setComentarioAbierto] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [textoComentario, setTextoComentario] = useState('')
  const [cargandoComentarios, setCargandoComentarios] = useState(false)

  async function cargar() {
    try {
      setCargando(true)
      const [respuesta, respuestaDashboard] = await Promise.all([
        fetch(API),
        fetch(`${API}dashboard/`)
      ])

      await leerError(respuesta, 'No se pudieron cargar las incidencias.')
      await leerError(respuestaDashboard, 'No se pudo cargar el dashboard.')

      const resultado = await respuesta.json()
      const estadisticas = await respuestaDashboard.json()

      setDatos(Array.isArray(resultado) ? resultado : resultado.results || [])
      setDashboard(estadisticas)
      setError('')
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function cambiarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')

    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setError('El título y la descripción son obligatorios.')
      return
    }

    const url = editando ? `${API}${editando}/` : API
    const metodo = editando ? 'PUT' : 'POST'
    const datosEnviar = {
      ...form,
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      fecha_limite: form.fecha_limite || null
    }

    try {
      setGuardando(true)
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEnviar)
      })

      await leerError(respuesta, 'No se pudo guardar la incidencia.')
      setForm(vacio)
      setEditando(null)
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  function editar(item) {
    setForm({
      titulo: item.titulo || '',
      descripcion: item.descripcion || '',
      categoria: item.categoria || 'hardware',
      prioridad: item.prioridad || 'media',
      estado: item.estado || 'pendiente',
      responsable: item.responsable || '',
      ubicacion: item.ubicacion || '',
      fecha_limite: fechaParaInput(item.fecha_limite)
    })
    setEditando(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelar() {
    setForm(vacio)
    setEditando(null)
    setError('')
  }

  async function eliminar(id) {
    if (!window.confirm('¿Deseas eliminar esta incidencia?')) return

    try {
      const respuesta = await fetch(`${API}${id}/`, { method: 'DELETE' })
      await leerError(respuesta, 'No se pudo eliminar la incidencia.')
      if (comentarioAbierto === id) {
        setComentarioAbierto(null)
        setComentarios([])
      }
      await cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  async function actualizarEstado(id, estado) {
    try {
      const respuesta = await fetch(`${API}${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      })
      await leerError(respuesta, 'No se pudo actualizar el estado.')
      await cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  async function abrirComentarios(id) {
    if (comentarioAbierto === id) {
      setComentarioAbierto(null)
      setComentarios([])
      setTextoComentario('')
      return
    }

    try {
      setComentarioAbierto(id)
      setCargandoComentarios(true)
      setTextoComentario('')
      const respuesta = await fetch(`${API}${id}/comentarios/`)
      await leerError(respuesta, 'No se pudo cargar el historial.')
      const resultado = await respuesta.json()
      setComentarios(resultado)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargandoComentarios(false)
    }
  }

  async function agregarComentario(id) {
    if (!textoComentario.trim()) {
      setError('Escribe un comentario antes de enviarlo.')
      return
    }

    try {
      const respuesta = await fetch(`${API}${id}/comentarios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: textoComentario.trim() })
      })
      await leerError(respuesta, 'No se pudo registrar el comentario.')
      setTextoComentario('')
      const historial = await fetch(`${API}${id}/comentarios/`)
      await leerError(historial, 'No se pudo actualizar el historial.')
      setComentarios(await historial.json())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const filtrados = datos.filter(item => {
    const texto = `${item.titulo} ${item.descripcion} ${item.responsable || ''} ${item.ubicacion || ''}`.toLowerCase()
    return (
      texto.includes(busqueda.toLowerCase()) &&
      (!filtroEstado || item.estado === filtroEstado) &&
      (!filtroPrioridad || item.prioridad === filtroPrioridad)
    )
  })

  const total = dashboard?.total ?? datos.length
  const pendientes = dashboard?.pendientes ?? datos.filter(x => x.estado === 'pendiente').length
  const proceso = dashboard?.en_proceso ?? datos.filter(x => x.estado === 'en_proceso').length
  const resueltas = dashboard?.resueltas ?? datos.filter(x => x.estado === 'resuelto').length
  const vencidas = dashboard?.vencidas ?? datos.filter(x => alertaFecha(x) === 'Vencida').length
  const proximas = dashboard?.proximas_a_vencer ?? datos.filter(x => alertaFecha(x) === 'Próxima a vencer').length
  const porcentaje = dashboard?.porcentaje_resolucion ?? (total ? (resueltas / total) * 100 : 0)
  const prioridades = dashboard?.prioridades || { baja: 0, media: 0, alta: 0 }

  return (
    <main className="app">
      <nav className="botones-superiores">
        <button type="button" onClick={onVolver}>← Volver a pantalla principal</button>
        <button type="button" className="cerrar-sesion" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </nav>

      <header className="encabezado">
        <div>
          <small>PROYECTO FULL STACK · LABDESK 2.0</small>
          <h1>LabDesk</h1>
          <p>Gestión de incidencias del laboratorio</p>
        </div>
        <span className="tecnologias">Django API + React</span>
      </header>

      {error && <p className="mensaje-error">{error}</p>}

      <section className="estadisticas">
        <article className="estadistica">
          <h2>{total}</h2>
          <p>Total de incidencias</p>
        </article>
        <article className="estadistica">
          <h2>{pendientes}</h2>
          <p>Pendientes</p>
        </article>
        <article className="estadistica">
          <h2>{proceso}</h2>
          <p>En proceso</p>
        </article>
        <article className="estadistica">
          <h2>{resueltas}</h2>
          <p>Resueltas</p>
        </article>
        <article className="estadistica estadistica-alerta">
          <h2>{vencidas}</h2>
          <p>Vencidas</p>
        </article>
        <article className="estadistica estadistica-aviso">
          <h2>{proximas}</h2>
          <p>Próximas a vencer</p>
        </article>
        <article className="estadistica">
          <h2>{Number(porcentaje).toFixed(1)}%</h2>
          <p>Porcentaje de resolución</p>
        </article>
        <article className="estadistica">
          <h2>{prioridades.alta}</h2>
          <p>Prioridad alta</p>
        </article>
      </section>

      <section className="panel-dashboard">
        <h2>Resumen de prioridades</h2>
        <div className="resumen-prioridades">
          <span>Baja: <strong>{prioridades.baja}</strong></span>
          <span>Media: <strong>{prioridades.media}</strong></span>
          <span>Alta: <strong>{prioridades.alta}</strong></span>
        </div>
      </section>

      <section className="contenido">
        <form className="formulario" onSubmit={guardar}>
          <h2>{editando ? 'Editar incidencia' : 'Nueva incidencia'}</h2>

          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={cambiarCampo}
            placeholder="PC no enciende"
            maxLength={120}
            required
          />

          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={cambiarCampo}
            placeholder="Describe el problema..."
            required
          />

          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" value={form.categoria} onChange={cambiarCampo}>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="red">Red</option>
            <option value="otro">Otro</option>
          </select>

          <label htmlFor="prioridad">Prioridad</label>
          <select id="prioridad" name="prioridad" value={form.prioridad} onChange={cambiarCampo}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" value={form.estado} onChange={cambiarCampo}>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="resuelto">Resuelto</option>
          </select>

          <label htmlFor="responsable">Responsable</label>
          <input
            id="responsable"
            name="responsable"
            value={form.responsable}
            onChange={cambiarCampo}
            placeholder="Nombre del responsable"
          />

          <label htmlFor="ubicacion">Ubicación</label>
          <input
            id="ubicacion"
            name="ubicacion"
            value={form.ubicacion}
            onChange={cambiarCampo}
            placeholder="Ej. Laboratorio 1"
          />

          <label htmlFor="fecha_limite">Fecha límite</label>
          <input
            id="fecha_limite"
            name="fecha_limite"
            type="datetime-local"
            value={form.fecha_limite}
            onChange={cambiarCampo}
          />

          <button type="submit" className="btn-registrar" disabled={guardando}>
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Registrar incidencia'}
          </button>

          {editando && (
            <button type="button" className="btn-cancelar" onClick={cancelar}>
              Cancelar edición
            </button>
          )}
        </form>

        <section className="incidencias">
          <div className="titulo-incidencias">
            <h2>Incidencias</h2>
            <span>{filtrados.length} mostradas</span>
          </div>

          <div className="filtros">
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar incidencias..."
              aria-label="Buscar incidencias"
            />
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
            </select>
            <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
              <option value="">Todas las prioridades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {cargando ? (
            <p className="sin-resultados">Cargando incidencias...</p>
          ) : (
            <div className="lista-incidencias">
              {filtrados.map(item => {
                const alerta = alertaFecha(item)
                return (
                  <article className={`incidencia ${alerta === 'Vencida' ? 'incidencia-vencida' : ''}`} key={item.id}>
                    <div className="incidencia-cabecera">
                      <h3>{item.titulo}</h3>
                      <span className={`prioridad ${item.prioridad}`}>{item.prioridad}</span>
                    </div>

                    {alerta && (
                      <div className={`alerta-fecha ${alerta === 'Vencida' ? 'alerta-roja' : 'alerta-amarilla'}`}>
                        {alerta === 'Vencida' ? '⚠ Incidencia vencida' : '◷ Próxima a vencer en 24 horas'}
                      </div>
                    )}

                    <p>{item.descripcion}</p>
                    <small className="detalle">
                      Categoría: {item.categoria} · ID #{item.id}
                    </small>
                    <p className="dato-extra"><strong>Responsable:</strong> {item.responsable || 'Sin asignar'}</p>
                    <p className="dato-extra"><strong>Ubicación:</strong> {item.ubicacion || 'No indicada'}</p>
                    <p className="dato-extra">
                      <strong>Fecha límite:</strong>{' '}
                      {item.fecha_limite ? new Date(item.fecha_limite).toLocaleString('es-PE') : 'Sin fecha'}
                    </p>

                    <div className="acciones">
                      <select
                        aria-label={`Estado de ${item.titulo}`}
                        value={item.estado}
                        onChange={e => actualizarEstado(item.id, e.target.value)}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En proceso</option>
                        <option value="resuelto">Resuelto</option>
                      </select>
                      <button type="button" className="btn-editar" onClick={() => editar(item)}>Editar</button>
                      <button type="button" className="btn-eliminar" onClick={() => eliminar(item.id)}>Eliminar</button>
                      <button type="button" className="btn-comentarios" onClick={() => abrirComentarios(item.id)}>
                        {comentarioAbierto === item.id ? 'Cerrar historial' : 'Comentarios'}
                      </button>
                    </div>

                    {comentarioAbierto === item.id && (
                      <div className="panel-comentarios">
                        <h4>Historial de comentarios</h4>
                        {cargandoComentarios ? (
                          <p>Cargando historial...</p>
                        ) : comentarios.length === 0 ? (
                          <p className="sin-resultados">Todavía no hay comentarios.</p>
                        ) : (
                          comentarios.map(comentario => (
                            <div className="comentario" key={comentario.id}>
                              <p>{comentario.texto}</p>
                              <small>{new Date(comentario.creado_en).toLocaleString('es-PE')}</small>
                            </div>
                          ))
                        )}
                        <textarea
                          value={textoComentario}
                          onChange={e => setTextoComentario(e.target.value)}
                          placeholder="Escribe una actualización o comentario..."
                          rows="3"
                        />
                        <button type="button" className="btn-registrar" onClick={() => agregarComentario(item.id)}>
                          Agregar comentario
                        </button>
                      </div>
                    )}
                  </article>
                )
              })}

              {filtrados.length === 0 && (
                <p className="sin-resultados">No hay incidencias para mostrar.</p>
              )}
            </div>
          )}
        </section>
      </section>

      <footer>LabDesk 2.0 · Actividad académica · Datos guardados en SQLite</footer>
    </main>
  )
}
