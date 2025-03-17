# rk-Web

Este proyecto proporciona un servicio CRUD para cinemáticas de servomotores, con un enfoque en los servomotores Dynamixel utilizados en el OpenBot V1. La web facilita el almacenamiento de datos en un servidor externo.

## Funcionalidades

- Importar datos desde un archivo `.txt`.
- Exportar datos a un servidor externo (Supabase).
- Crear, editar y eliminar registros de datos cinemáticos.

## Configuración del Proyecto

1. Instalar dependencias:

   ```sh
   bun install
   ```

2. Compilar y recargar en caliente para desarrollo:

   ```sh
   bun dev
   ```

3. Compilar y minificar para producción:
   ```sh
   bun run build
   ```

## Variables de Entorno

Configura las siguientes variables en el archivo `.env`:

```
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_KEY=tu_supabase_key
```

## Licencia

Este proyecto está bajo la licencia MIT.
