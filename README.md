# Proyecto Vite Roshi Kinematic

## Descripción

Este proyecto permite crear y editar datos cinemáticos de grupos de servos. Incluye funcionalidades para importar y exportar datos, así como trabajar en modo local.

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior) o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/vite-roshi-kinematic.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd vite-roshi-kinematic/rk-Web
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
   o
   ```bash
   yarn install
   ```

## Uso

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   o
   ```bash
   yarn dev
   ```
2. Abre tu navegador y navega a `http://localhost:3000`.

## Estructura del proyecto

```
rk-Web/
├── public/                 # Archivos públicos
├── src/                    # Código fuente
│   ├── assets/             # Recursos estáticos
│   ├── components/         # Componentes Vue
│   ├── stores/             # Almacenamiento de estado (Pinia)
│   ├── views/              # Vistas de la aplicación
│   ├── App.vue             # Componente principal
│   ├── main.ts             # Punto de entrada de la aplicación
│   └── ...                 # Otros archivos y carpetas
├── index.html              # Archivo HTML principal
├── package.json            # Dependencias y scripts del proyecto
└── README.md               # Documentación del proyecto
```

## Contribución

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Agregar nueva funcionalidad'`).
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
