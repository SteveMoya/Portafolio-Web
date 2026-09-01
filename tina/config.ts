
import { CATEGORIES } from '../src/data/categories'
import { defineConfig } from 'tinacms'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || 'main'

export default defineConfig({
	branch,
	clientId: null, // Get this from tina.io
	token: null, // Get this from tina.io

	build: {
		outputFolder: 'admin',
		publicFolder: 'public'
	},
	media: {
		tina: {
			mediaRoot: '/public/assets/',
			publicFolder: 'public',
		}
	},
	schema: {
		collections: [
			{
				name: 'post',
				label: 'Mis Blogs',
				path: 'src/content/blog',
				format: 'mdx',
				fields: [
					{
						type: 'string',
						name: 'title',
						label: 'Titulo',
						isTitle: true,
						required: true
					},

					{
						type: 'string',
						label: 'Descripcion',
						required: true,
						name: 'description',
						description: 'Una breve descripcion del post'
					},
					{
						type: 'image',
						label: 'Imagen de portada',
						required: true,
						name: 'heroImage',
						description: 'La imagen usada en la portada del post'
					},
					{
						name: 'draft',
						label: 'Borrador',
						type: 'boolean',
						description: 'Si esta marcado, el post no se mostrara en la pagina principal',
					},
					{
						type: 'string',
						required: true,
						name: 'category',
						label: 'Categoria',
						description: 'Seleciona una categoria para el post',
						options: [...CATEGORIES]
					},
					{
						type: 'datetime',
						name: 'pubDate',
						label: 'Fecha de publicacion',
						required: true
					},
					{
						type: "datetime",
						name: "updateDate",
						label: "Fecha de actualizacion",
						required: false,
					},
					{
						type: 'string',
						name: 'tags',
						required: true,
						label: 'Tags',
						description: 'Tags para el post',
						list: true,
						ui: {
							component: 'tags'
						}
					},
					{
						type: 'rich-text',
						label: 'Contenido',
						name: 'SButton',
						isBody: true,
						templates: [
							// Custom Components aqui se pueden colocar los compónentes personalizados de MDX que gustes
							{
								label: 'SButton',
								name: 'SButton',
								fields: [
									{
										type: 'rich-text',
										label: 'SButton',
										name: 'children',
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
										required: true,
									},
									{
										type: "string",
										label: "Titulo",
										name: "title",
										description: "Titulo del video",
										required: true,
									},
									{
										type: "image",
										label: "Imagen de portada",
										name: "backgroundImage",
										description: "Imagen de portada del video",
									}
									
								],
							},
							{
								label: "Diagrama",
								name: "Diagram",
								fields: [
									{
										type: "string",
										name: "json",
										label: "JSON",
										description: "JSON del diagrama",
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
										required: true,
									},
								]
							},
						]
					},
				]
			},
			{
				name: 'project',
				label: 'Mis Proyectos (Webs)',
				path: 'src/content/projects',
				format: 'md',
				fields: [
					{
						type: 'string',
						name: 'title',
						label: 'Titulo',
						isTitle: true,
						required: true
					},
					{
						type: 'string',
						name: 'description',
						label: 'Descripcion',
						required: true,
						ui: { component: 'textarea' }
					},
					{
						type: 'image',
						name: 'image',
						label: 'Imagen del proyecto',
						required: false,
						description: 'Captura/screenshot del proyecto (usa ImageUrl si prefieres una URL externa)'
					},
					{
						type: 'string',
						name: 'imageUrl',
						label: 'URL de imagen externa',
						required: false,
						description: 'Alternativa a "Imagen del proyecto": URL absoluta de la captura'
					},
					{
						type: 'string',
						name: 'demo',
						label: 'Demo (URL)',
						required: false,
						description: 'Link a la demo en vivo'
					},
					{
						type: 'string',
						name: 'repository',
						label: 'Repositorio (URL)',
						required: false,
						description: 'Dejar vacio si es un proyecto privado/cliente'
					},
					{
						type: 'string',
						name: 'technologies',
						label: 'Tecnologias',
						required: false,
						list: true,
						ui: { component: 'tags' }
					},
					{
						type: 'boolean',
						name: 'draft',
						label: 'Borrador',
						required: false,
						description: 'Si esta marcado, el proyecto no se muestra en la web'
					},
					{
						type: 'boolean',
						name: 'featured',
						label: 'Destacado',
						required: false
					},
					{
						type: 'number',
						name: 'order',
						label: 'Orden',
						required: false
					},
					{
						type: 'datetime',
						name: 'date',
						label: 'Fecha',
						required: true
					},
					{
						type: 'string',
						name: 'company',
						label: 'Empresa',
						required: false
					},
					{
						type: 'string',
						name: 'client',
						label: 'Cliente',
						required: false
					},
					{
						type: 'string',
						name: 'role',
						label: 'Rol',
						required: false
					},
					{
						type: 'string',
						name: 'status',
						label: 'Estado',
						required: false,
						options: ['active', 'completed', 'in_progress', 'archived']
					},
					{
						type: 'boolean',
						name: 'private',
						label: 'Proyecto privado',
						required: false,
						description: 'Marca para proyectos de clientes/confidenciales (no muestra link de codigo)'
					},
					{
						type: 'string',
						name: 'category',
						label: 'Categoria',
						required: false,
						options: ['web', 'mobile', 'api', 'ai', 'backend', 'devops', 'frontend', 'fullstack', 'other']
					},
					{
						type: 'string',
						name: 'badges',
						label: 'Badges',
						required: false,
						list: true,
						options: ['private', 'client', 'company', 'open_source', 'ai', 'devops', 'freelance', 'work', 'personal']
					}
				]
			}
		]
	}
})
