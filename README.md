# S&J-GEEK API

API REST para películas, series y anime desarrollada con Node.js, Express y MySQL.
Incluye autenticación JWT, roles, validaciones, Swagger, transacciones y ranking ponderado.

## Requisitos
- Node.js 18 o posterior.
- MySQL 8.
- Una base MySQL administrada en Aiven para producción.

## Instalación local
```bash
npm install
copy .env.example .env
npm start
```
Importar primero `database/schema.sql` y después `database/seeds.sql`.
Para una base ya creada, ejecutar `database/migration-classificacion.sql`.

## Variables de entorno
| Variable | Descripción |
|---|---|
| PORT | Puerto HTTP |
| JWT_SECRET | Secreto aleatorio para firmar JWT |
| FRONTEND_URL | Origen permitido por CORS; separar varios con comas |
| DB_HOST | Host MySQL |
| DB_PORT | Puerto MySQL |
| DB_USER | Usuario MySQL |
| DB_PASSWORD | Contraseña MySQL |
| DB_NAME | Nombre de la base de datos |
| DB_SSL | `true` para conexiones TLS, como las de Aiven |
| DB_SSL_REJECT_UNAUTHORIZED | Validación del certificado TLS |

## Uso
- API: `http://localhost:3000/api`
- Estado: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/api-docs`

Ejemplo de registro:
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"nombre\":\"Usuario\",\"email\":\"usuario@example.com\",\"password\":\"12345678\"}"
```

Ejemplo de login:
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"usuario@example.com\",\"password\":\"12345678\"}"
```

Usar el token recibido:
```bash
curl http://localhost:3000/api/auth/me -H "Authorization: Bearer TOKEN"
```

## Colección Postman

Importar [docs/SJ-GEEK.postman_collection.json](docs/SJ-GEEK.postman_collection.json) desde Postman:

1. Abrir **Import** y seleccionar el archivo JSON.
2. Establecer la variable `baseUrl` en `http://localhost:3000`.
3. Ejecutar **Autenticación > Registrar usuario**.
4. Ejecutar **Iniciar sesión usuario** para guardar automáticamente el token.

Para probar operaciones administrativas debe existir un usuario con rol `ADMIN`; configure después las variables `adminEmail` y `adminPassword`.

## Despliegue
1. Crear la base MySQL en Aiven e importar el esquema y las semillas.
2. Desplegar este backend en Render, Railway, Fly.io u otro proveedor Node.js.
3. Cargar las variables de entorno con los datos de Aiven.
4. Configurar `FRONTEND_URL` con el dominio de GitHub Pages.
5. Configurar `window.SJ_GEEK_API_URL` en el frontend con la URL pública del backend.
6. Publicar la carpeta `sj-geek-frontend` mediante GitHub Pages.

GitHub Pages solo publica HTML, CSS y JavaScript estático. El backend y MySQL deben alojarse por separado.

## Estructura principal
- `src/routes`: definición de endpoints.
- `src/config`: Express, Passport y MySQL.
- `src/middlewares`: autenticación, permisos, validación y errores.
- `database`: esquema, semillas y migraciones.
- `docs`: planeación del proyecto.

## Anexos

Estructura de la base de datos

![Estructura de la base de datos](docs/diagrama.png)

Repositorio separado: [sj-geek-frontend](https://github.com/JakelinMishelQuinoMartinez/sj-geek-frontend)

Planeación: [Documento SCRUM](docs/Planificacion-Express.pdf).

Para ver el video: [Click aquí](https://drive.google.com/drive/folders/1B3p7-greeX1weUkIKLfGqY3Ky5kM_n9H?usp=sharing)
