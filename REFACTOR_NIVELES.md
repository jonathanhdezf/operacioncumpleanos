# Plan de refactor en 3 niveles

Este documento propone una evolución gradual del proyecto para mejorar mantenibilidad sin perder la experiencia visual actual.

## 1) Nivel mínimo (bajo riesgo, 1-2 horas)

Objetivo: ordenar el código sin cambiar comportamiento.

- Separar estilos embebidos en `styles.css`.
- Separar JavaScript embebido en `app.js`.
- Mantener `index.html` como plantilla principal con estructura de pantallas.
- Validar que funciones inline (`onclick`) sigan funcionando.

**Resultado esperado:** cambios de diseño/lógica más fáciles de ubicar y revisar.

## 2) Nivel intermedio (riesgo moderado, 0.5-1 día)

Objetivo: reducir acoplamiento en JS y evitar errores por configuración.

- Dividir `app.js` por responsabilidades:
  - `config.js` (datos de evento)
  - `audio.js` (volumen, play seguro, stop global)
  - `screens.js` (transiciones de pantallas)
  - `effects.js` (canvas fondo + partículas)
- Crear un init central (`main.js`) que cablee los módulos.
- Agregar validaciones de configuración (ej. `musicaFondo` opcional con fallback).
- Reemplazar `onclick` inline por `addEventListener`.

**Resultado esperado:** menos regresiones al tocar una parte del flujo.

## 3) Nivel pro (alto impacto, 1-3 días)

Objetivo: dejar la base lista para crecer, testear y desplegar con confianza.

- Migrar a TypeScript + Vite (o similar) para módulos nativos y build optimizado.
- Modelar el flujo como máquina de estados (`start`, `drop`, `invite`).
- Añadir testing:
  - unitario para utilidades (audio/config)
  - e2e básico para flujo visual principal
- Añadir linter/formatter (ESLint + Prettier) y CI.
- Opcional: externalizar contenido del evento a JSON para reutilizar plantilla.

**Resultado esperado:** arquitectura escalable para nuevas invitaciones/temas.
