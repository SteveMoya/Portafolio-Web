// src/data/categories.ts
var CATEGORIES = [
  "Caso de Estudio",
  "Tecnologia",
  "Programaci\xF3n",
  "Marketing",
  "Dise\xF1o",
  "Productividad",
  "Fotografia",
  "Otros"
];

// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
var config_default = defineConfig({
  branch,
  clientId: null,
  // Get this from tina.io
  token: null,
  // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "/public/",
      publicFolder: "/"
    }
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Mis Blogs",
        path: "src/content/blog",
        format: "mdx",
        fields: [
          {
            type: "image",
            label: "Imagen de portada",
            required: true,
            name: "heroImage",
            description: "La imagen usada en la portada del post"
          },
          {
            type: "string",
            required: true,
            name: "category",
            label: "Categoria",
            description: "Seleciona una categoria para el post",
            options: [...CATEGORIES]
          },
          {
            type: "string",
            label: "Descripcion",
            required: true,
            name: "description",
            description: "Una breve descripcion del post"
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Fecha de publicacion",
            required: true
          },
          {
            type: "datetime",
            name: "updateDate",
            label: "Fecha de actualizacion",
            required: false
          },
          {
            name: "draft",
            label: "Borrador",
            type: "boolean",
            description: "Si esta marcado, el post no se mostrara en la pagina principal"
          },
          {
            type: "string",
            name: "tags",
            required: true,
            label: "Tags",
            description: "Tags para el post",
            list: true,
            ui: {
              component: "tags"
            }
          },
          {
            type: "string",
            name: "title",
            label: "Titulo",
            isTitle: true,
            required: true
          },
          {
            type: "rich-text",
            label: "Contenido",
            name: "SButton",
            isBody: true,
            templates: [
              // Custom Components aqui se pueden colocar los compónentes personalizados de MDX que gustes
              {
                label: "SButton",
                name: "SButton",
                fields: [
                  {
                    type: "rich-text",
                    label: "SButton",
                    name: "children",
                    isBody: true
                  }
                ]
              },
              {
                label: "LiteYoutube",
                name: "LiteYoutube",
                fields: [
                  {
                    type: "string",
                    label: "Id del video",
                    name: "videoId",
                    description: "Id del video de youtube",
                    required: true
                  },
                  {
                    type: "string",
                    label: "Titulo",
                    name: "title",
                    description: "Titulo del video",
                    required: true
                  },
                  {
                    type: "image",
                    label: "Imagen de portada",
                    name: "backgroundImage",
                    description: "Imagen de portada del video"
                  }
                ]
              },
              {
                label: "SVG",
                name: "SVG",
                fields: [
                  {
                    type: "string",
                    label: "SVG",
                    name: "svg",
                    description: "Coloca el SVG aqui",
                    required: true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
