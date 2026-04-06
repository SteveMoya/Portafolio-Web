# Portafolio Personal 🚀

![stevemoya me_](https://github.com/SteveMoya/Portafolio/assets/114698709/f4dd59b4-0153-444b-920f-698cfea4f566)

## 🌐 Sitio en Vivo

[![Website](https://img.shields.io/badge/Portafolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://stevemoya.me)

## 📑 Descripción

Portafolio personal y CV interactivo desarrollado con Astro. Presenta mi experiencia profesional, proyectos, habilidades y educación con un diseño moderno, optimizado para SEO y totalmente responsive. Incluye funcionalidades como búsqueda de contenido, gestión de blog con MDX, y modo de impresión profesional para CV.

## ✨ Características

- ⚡ **Rendimiento excepcional** - Construido con Astro para carga ultra-rápida
- 🎨 **Diseño moderno** - UI elegante con Tailwind CSS y efectos interactivos
- 📱 **Totalmente responsive** - Optimizado para todos los dispositivos
- 🔍 **Búsqueda integrada** - Búsqueda de contenido con Pagefind
- 📝 **Blog con MDX** - Soporte para contenido enriquecido con componentes React
- 🖨️ **Modo impresión** - CV optimizado para impresión profesional
- ⌨️ **Paleta de comandos** - Navegación rápida con atajos de teclado (Ctrl+K)
- 🎯 **SEO optimizado** - Meta tags, sitemap y RSS feed
- 🎭 **Temas personalizables** - Sistema de colores basado en CSS variables
- 📊 **CMS integrado** - Gestión de contenido con TinaCMS
- 🚀 **Deploy automático** - Configurado para Vercel

## 🛠️ Tecnologías

### Core
![Astro](https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### Estilos
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![AlpineJS](https://img.shields.io/badge/Alpine.js-8BC0D0?style=for-the-badge&logo=alpine.js&logoColor=black)

### CMS y Contenido
![MDX](https://img.shields.io/badge/MDX-1B1F24?style=for-the-badge&logo=mdx&logoColor=white)
![TinaCMS](https://img.shields.io/badge/TinaCMS-EC4815?style=for-the-badge&logo=tinacms&logoColor=white)

### Herramientas
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

## 📁 Estructura del Proyecto

```
/
├── public/
│   ├── img/                # Imágenes estáticas
│   ├── sitemap.xml         # Sitemap generado
│   └── admin/              # Panel de TinaCMS
├── src/
│   ├── assets/             # Assets optimizados
│   │   ├── blog/           # Imágenes del blog
│   │   └── img/            # Imágenes del portafolio
│   ├── components/         # Componentes de Astro/React
│   │   ├── sections/       # Secciones principales (Hero, Experience, etc.)
│   │   ├── ui/             # Componentes UI reutilizables
│   │   └── mdx/            # Componentes para MDX
│   ├── content/            # Contenido del sitio
│   │   ├── config.ts       # Configuración de colecciones
│   │   └── blog/           # Posts del blog
│   ├── layouts/            # Layouts de página
│   ├── pages/              # Páginas del sitio
│   │   ├── index.astro     # Página principal
│   │   ├── about.astro     # CV/About
│   │   └── blog/           # Blog
│   ├── styles/             # Estilos globales
│   │   ├── global.css      # Estilos principales
│   │   └── globalprint.css # Estilos de impresión
│   └── utils/              # Utilidades y helpers
├── tina/                   # Configuración de TinaCMS
├── cv.json                 # Datos del CV (JSON Schema)
├── astro.config.mjs        # Configuración de Astro
├── tailwind.config.mjs     # Configuración de Tailwind
└── package.json
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18.0 o superior
- pnpm (recomendado) o npm

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/SteveMoya/Portafolio-Web.git
cd Portafolio-Web
```

2. **Instalar dependencias**
```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**

El sitio está configurado en `astro.config.mjs`. Actualiza la URL:
```javascript
site: 'https://tu-dominio.com'
```

4. **Personalizar tu CV**

Edita el archivo `cv.json` con tu información:
```json
{
  "basics": {
    "name": "Tu Nombre",
    "label": "Tu Profesión",
    "email": "tu@email.com",
    ...
  },
  "work": [...],
  "education": [...],
  "skills": [...],
  "projects": [...]
}
```

5. **Personalizar colores**

Edita `src/styles/global.css` para cambiar los colores del tema:
```css
:root {
  --primary: #c70039;        /* Color principal */
  --secondary: #b11141;      /* Color secundario */
  --dark: #101010;           /* Fondo oscuro */
  --color: 199, 0, 57;       /* Color de acento (RGB) */
}
```

## 🖥️ Comandos Disponibles

| Comando | Acción |
|---------|--------|
| `pnpm dev` | Inicia servidor de desarrollo con TinaCMS |
| `pnpm start` | Inicia servidor de desarrollo sin TinaCMS |
| `pnpm build` | Construye el sitio para producción |
| `pnpm preview` | Previsualiza la build de producción |
| `pnpm check` | Verifica errores de TypeScript |

## 📝 Gestión de Contenido

### Blog

1. Crea archivos `.mdx` en `src/content/blog/`
2. Usa el frontmatter:
```yaml
---
title: "Título del post"
description: "Descripción"
pubDate: 2024-03-10
heroImage: "/img/post.jpg"
tags: ["tag1", "tag2"]
---
```

### TinaCMS

Accede al CMS en desarrollo: `http://localhost:4321/admin`

## 🌐 Deploy

El proyecto está configurado para Vercel:

1. Conecta tu repositorio a Vercel
2. Configura el comando de build: `pnpm build`
3. Directorio de salida: `dist`
4. ✅ ¡Deploy automático en cada push!

## ⌨️ Atajos de Teclado

- `Ctrl + K` (o `Cmd + K`) - Abre la paleta de comandos
- `Ctrl + P` - Imprimir CV
- `Ctrl + [G/L/X]` - Enlaces a redes sociales

## 🎨 Personalización del Diseño

### Tailwind CSS

El proyecto usa un sistema de diseño personalizado con Tailwind. Las clases principales:

- `text-skin-hue` - Color de acento
- `bg-skin-fill` - Color de fondo
- `text-skin-muted` - Texto secundario
- `border-skin-hue` - Bordes con color de acento

### Componentes

Los componentes están organizados por tipo:
- **Sections**: Secciones completas de página
- **UI**: Componentes reutilizables
- **MDX**: Componentes para contenido enriquecido

## 📄 Licencia

Este proyecto es de código abierto para uso personal y educativo.

---

## ✒️ Autor

**Steve Moya Cepeda**

Pionero en la tendencia del Marketing 5.0 en República Dominicana

[![instagram](https://img.shields.io/static/v1?label=&message=instagram&color=5B51D8&logo=instagram&logoColor=white&style=for-the-badge)](https://www.instagram.com/steve_moya_cepeda/)
[![linkedin](https://img.shields.io/static/v1?label=&message=linkedin&color=0e76a8&logo=linkedin&logoColor=white&style=for-the-badge)](https://www.linkedin.com/in/steve-moya-cepeda-549469227/)
[![github](https://img.shields.io/static/v1?label=&message=github&color=171515&logo=github&logoColor=white&style=for-the-badge)](https://github.com/SteveMoya)
[![Website](https://img.shields.io/badge/Portafolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://stevemoya.me)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:steve@stevemoya.me)

## 🎁 Apoyo

Si te gusta este proyecto y quieres apoyar mi trabajo:

<p>
  <a href="https://www.buymeacoffee.com/stevemoya">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50" width="210" alt="Buy me a coffee" />
  </a>
</p>

<p>
  <a href="https://paypal.me/Stevemoyacepeda?country.x=DO&locale.x=es_XC">
    <img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" height="50" width="210" alt="PayPal" />
  </a>
</p>

---

<p align="center">Hecho con ❤️ por Steve Moya</p>