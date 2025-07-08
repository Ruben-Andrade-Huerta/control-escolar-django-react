# 🎓 Sistema de Control Escolar

El Sistema de Control Escolar es una aplicación web diseñada para gestionar eficientemente las operaciones académicas y administrativas de una institución educativa de nivel secundaria o bachillerato. Su objetivo es centralizar la información de estudiantes, docentes, materias, calificaciones y horarios, facilitando el acceso y la organización para todos los actores involucrados.

Este sistema busca mejorar los procesos tradicionales mediante una interfaz intuitiva, roles diferenciados de acceso (administrador, docente, estudiante) y herramientas modernas que permiten una gestión digital, segura y en tiempo real de la vida escolar.

## 🚀 Tecnologías principales

- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **Despliegue:** (por definir: Render, Railway, etc.)

## 🧩 Funcionalidades clave (MVP)

- Gestión de usuarios (administradores, docentes, estudiantes)
- Control de materias, horarios y grupos
- Registro de evaluaciones y calificaciones
- Panel de control administrativo
- Acceso seguro y autenticado para cada rol
- Reportes básicos (PDF, CSV o similares)

## 📁 Estructura general del proyecto

control-escolar/
├── backend/ # Proyecto Django
├── frontend/ # Proyecto React
├── docs/ # Documentación, wireframes, etc.
└── README.md

## 🛠️ Instalación (modo desarrollo)

**Backend:**

```bash
cd backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
Frontend:

bash
Copiar
Editar
cd frontend/
npm install
npm run dev