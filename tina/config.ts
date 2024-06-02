
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
			mediaRoot: '/public/',
			publicFolder: '/'
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
						type: 'image',
						label: 'Imagen de portada',
						required: true,
						name: 'heroImage',
						description: 'La imagen usada en la portada del post'
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
						type: 'string',
						label: 'Descripcion',
						required: true,
						name: 'description',
						description: 'Una breve descripcion del post'
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
						name: 'draft',
						label: 'Borrador',
						type: 'boolean',
						description: 'Si esta marcado, el post no se mostrara en la pagina principal',
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
						type: 'string',
						name: 'title',
						label: 'Titulo',
						isTitle: true,
						required: true
					},
					{
						type: 'rich-text',
						label: 'Contenido',
						name: 'SButton',
						isBody: true,
						templates: [
							// Custom Components
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
							}
						]
					}
				]
			}
		]
	}
})
