<div align="center">
    <img src="public/LogoFinal.png" height="150px"/> 
    <h1>El Blog de Leandro - Backend API</h1>
    <p>Este proyecto representa el backend de "El Blog de Leandro", diseñado como una API RESTful...</p>
</div>

## Tabla de Contenidos
- [Arquitectura y Tecnologías](#-arquitectura-y-tecnologías)
- [Configuración de Entorno y Requisitos](#-configuración-de-entorno-y-requisitos)
- [Empezar](#-empezar)
- [Documentación Swagger](#-documentación-swagger)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Autenticación y Autorización](#-autenticación-y-autorización)
- [Acceso de Administrador](#-acceso-de-administrador)
- [Conexión a la Base de Datos MongoDB](#-conexión-a-la-base-de-datos-mongodb)
- [Testing](#-testing)

## 🏗️ Arquitectura y Tecnologías

El backend está construido siguiendo el patrón de diseño MVC, utilizando:

- **NestJS**: Un framework progresivo de Node.js para construir aplicaciones de servidor eficientes y escalables.
- **MongoDB**: Como base de datos para almacenar usuarios y posts.
- **JWT (JSON Web Tokens)**: Para la autenticación y autorización de usuarios.

## ⚙️ Configuración de Entorno y Requisitos

Asegúrate de tener instalado Node.js (versión 12.x o superior) y MongoDB. Después de clonar el repositorio, sigue estos pasos para configurar tu entorno de desarrollo:

1. Instalar dependencias con `npm install`.
2. Configura las variables de entorno necesarias en un archivo `.env`, ya que utilizamos JWT_SECRET.
3. Iniciar el servidor de desarrollo con `npm run start:dev`.

## 🚀 Empezar

1. **Clonar el repositorio:**

    ```bash
    git clone git@github.com:darthdoppel/blog-app.git
    ```

2. **Instalar las dependencias:**

    ```bash
    npm install
    ```

3. **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run start:dev
    ```

## 📘 Documentación Swagger

La documentación detallada de todos los endpoints de la API está disponible a través de Swagger. Esto incluye descripciones de los endpoints, parámetros requeridos, formatos de solicitud y respuesta, y códigos de estado HTTP. Puedes acceder a esta documentación en:

[http://localhost:3000/api](http://localhost:3000/api)

Esta documentación es tu guía de referencia para integrar y consumir la API.

## 🌟 Ejemplos de Uso

Para ejemplos prácticos de cómo interactuar con la API, consulta la documentación de Swagger mencionada anteriormente. Allí encontrarás ejemplos específicos para cada endpoint, que te ayudarán a entender cómo realizar peticiones y qué respuestas esperar.

## 🔒 Autenticación y Autorización

El sistema utiliza JWT para la autenticación y autorización de los usuarios. Los tokens se obtienen al iniciar sesión y deben incluirse en las solicitudes a los endpoints protegidos. Para más detalles sobre cómo usar estos tokens, consulta la documentación de Swagger.

## 🚀 Acceso de Administrador

Para facilitar las pruebas y la demostración, el siguiente conjunto de credenciales puede utilizarse para acceder al sistema con privilegios de administrador:

### 🔒 Credenciales de Administrador para pruebas

```json
POST http://localhost:3000/users/login
Content-Type: application/json

{
    "username": "Admin",
    "password": "12341234"
}
```

Te responderá con un token, que luego se puede utilizar para las pruebas de Administrador. Igualmente, es posible crear un usuario Administrador facilitando el booleano 'isAdmin' como true, al crear un nuevo usuario.

## 📦 Conexión a la Base de Datos MongoDB

Este proyecto se conecta a una base de datos MongoDB preconfigurada, que he creado específicamente para este proyecto. La cadena de conexión a esta base de datos ya está configurada en el código del proyecto.

### Uso de la Base de Datos Preconfigurada

Para utilizar esta base de datos:

1. **No es necesario configurar la cadena de conexión:**
   - La cadena de conexión para acceder a la base de datos ya está establecida en el `AppModule` del proyecto. No es necesario realizar ninguna configuración adicional para conectar con la base de datos.

2. **Acceso directo a la Base de Datos:**
   - Al iniciar el servidor de desarrollo, la aplicación se conectará automáticamente a la base de datos MongoDB configurada.

3. **Manejo de datos:**
   - Se pueden utilizar los endpoints proporcionados por la API para interactuar con la base de datos (crear, leer, actualizar, eliminar datos).

## 🧪 Testing

Para ejecutar pruebas automatizadas, utiliza el comando `npm test`. Estas pruebas te ayudarán a verificar que los diferentes componentes de la API funcionan como se espera.