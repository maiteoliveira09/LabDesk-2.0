# LabDesk 2.0
## Sistema de gestión de incidencias del laboratorio

Proyecto académico Full Stack desarrollado con Django REST Framework, React y SQLite.

## 1. Tecnologías
- Python
- Django REST Framework
- React
- Vite
- SQLite
- JavaScript y CSS

## 2. Funcionalidades

- Registrar, consultar, editar y eliminar incidencias.
- Asignar responsable, ubicación y fecha límite.
- Gestionar estados: Pendiente, En proceso y Resuelto.
- Filtrar incidencias por estado y prioridad.
- Registrar y consultar historial de comentarios con fecha y hora.
- Alertas para incidencias vencidas y próximas a vencer en 24 horas.
- Dashboard con estadísticas y porcentaje de resolución.
- Validación de campos obligatorios.
- Estados de carga y error.
- Diseño adaptable a diferentes pantallas.

## 3. Estructura

- backend/: API desarrollada con Django.
- frontend/: interfaz desarrollada con React.
- README.md: documentación del proyecto.
- .gitignore: archivos excluidos de Git.

## 4. Requisitos

- Python 3.10 o superior.
- Node.js y npm.
- PowerShell en Windows.

## 5. Ejecutar el backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API: http://127.0.0.1:8000/api/incidencias/

## 6. Ejecutar el frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Aplicación: http://127.0.0.1:5173/

## 7. Pruebas

- Registrar una incidencia.
- Editar una incidencia.
- Agregar y consultar comentarios.
- Verificar alertas de vencimiento.
- Comprobar que las incidencias resueltas no aparezcan como vencidas.
- Verificar estadísticas del dashboard.
- Probar filtros y validaciones.
- Comprobar el diseño adaptable.

## 8. Evidencias

- Formulario de registro.
- Edición de incidencias.
- Historial de comentarios.
- Alertas.
- Dashboard.
- Pruebas de visualización adaptable.

## 9. Base de datos

Se utiliza SQLite. La base de datos local está excluida de Git. Para crear las tablas se ejecuta `python manage.py migrate`.

## 10. Consideraciones

Proyecto desarrollado con fines académicos y para ejecución local. Antes de utilizarlo en producción se deben configurar correctamente las credenciales, DEBUG, SECRET_KEY, autenticación y seguridad.