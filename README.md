# 🛡️ VAULT CORE - Gestor de Contraseñas de Alto Nivel

> **Estado del Proyecto: 🟢 COMPLETADO**

**VAULT CORE** es una solución Full Stack de grado profesional diseñada para la administración centralizada y segura de credenciales digitales. Con una interfaz "Glassmorphism" inspirada en sistemas de seguridad tácticos, permite gestionar llaves maestras con máxima eficiencia y elegancia visual.

---

## 🚀 Propósito y Valor

La aplicación funciona como un búnker de datos desacoplado que garantiza que la lógica de persistencia y la interfaz de usuario operen de forma independiente, maximizando la seguridad y escalabilidad.

### ✨ Funcionalidades Clave
* **🔐 Autenticación de Núcleo**: Acceso restringido por "Master Key" con validación de estado local.
* **🎲 Generador de Entropía**: Creación instantánea de claves seguras de 8, 12 o 16 bits.
* **📋 Búfer de Seguridad**: Notificaciones inteligentes al copiar datos con limpieza de memoria visual.
* **⚡ Gestión Dinámica**: Visualización "on-demand" y eliminación definitiva con validación por ID.
* **📱 UI Adaptable**: Diseño optimizado para resoluciones móviles y de escritorio.

---

## 🛠️ Stack Tecnológico

[Image of a software architecture diagram showing a React frontend communicating with a PHP Laravel API and a MySQL database]

### 💻 Frontend (`password-manager-front`)
* **Framework**: Next.js 14 (App Router).
* **Lenguaje**: TypeScript (Tipado estricto e inferencia dinámica).
* **Estilos**: Tailwind CSS con filtros de desenfoque (`backdrop-blur`).
* **Iconografía**: Lucide React para feedback visual intuitivo.

### ⚙️ Backend (`password-manager-api`)
* **Framework**: Laravel 10 (Restful API).
* **Base de Datos**: MySQL con gestión mediante Laravel Migrations.
* **ORM**: Eloquent para la gestión eficiente de las tablas `passwords` y `users`.
* **Comunicación**: Axios para peticiones asíncronas seguras.

---

## 📂 Arquitectura de Archivos

La estructura está diseñada para un despliegue independiente en servicios como Render:

```bash
.
├── password-manager-api/   # 🐘 Backend: API, Modelos y Migraciones
│   ├── database/migrations/ # Estructura de tablas (passwords, users, etc)
│   └── routes/api.php      # Endpoints de la aplicación
└── password-manager-front/ # ⚛️ Frontend: UI, Estados y Componentes
    ├── app/page.tsx        # Núcleo de la interfaz y lógica de cliente
    └── tailwind.config.js  # Configuraciones de diseño personalizado