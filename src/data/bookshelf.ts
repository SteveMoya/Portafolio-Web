/**
 * The reference library behind the Education hero.
 *
 * One entry per shelf of the 3D bookcase (`src/components/sections/education/
 * ShelfHero.astro`). The same data paints the spine atlas, sizes the piles and
 * feeds the screen-reader list, so the scene and the text can never disagree.
 *
 * `thickness` is in scene units (1 unit ≈ 10 cm) and decides how tall the pile
 * grows; it follows the real relative bulk of each edition, not a formula.
 * `cloth` is this volume's own binding: five different tones per shelf, within
 * the category's family, because a real shelf is never monochrome. `accent`
 * stays the shelf's single colour and only paints its plate.
 */
export interface ShelfBook {
	/** Original title. Book titles are not translated. */
	title: string
	author: string
	year: number
	/** Spine thickness in scene units. */
	thickness: number
	/** Binding colour of this volume. */
	cloth: string
	/** Short stamp for the spine when the full title would not fit. */
	spine?: string
}

export interface ShelfCategory {
	id: string
	/** Shelf plate label, in the language of the page. */
	label: string
	/** Colour of the shelf plate and of its accent tick. */
	accent: string
	books: ShelfBook[]
}

export const bookshelf: ShelfCategory[] = [
	{
		id: 'marketing',
		label: 'Marketing',
		accent: '#c98f3f',
		books: [
			{
				title: 'Influence',
				author: 'Robert B. Cialdini',
				year: 1984,
				thickness: 0.16,
				cloth: '#a8442e'
			},
			{
				title: 'Positioning',
				author: 'Al Ries & Jack Trout',
				year: 1981,
				thickness: 0.14,
				cloth: '#c9a24a'
			},
			{
				title: 'Ogilvy on Advertising',
				author: 'David Ogilvy',
				year: 1983,
				thickness: 0.18,
				cloth: '#8d5a2b',
				spine: 'Ogilvy on Ads'
			},
			{
				title: 'Contagious',
				author: 'Jonah Berger',
				year: 2013,
				thickness: 0.13,
				cloth: '#b0723a'
			},
			{
				title: 'Building a StoryBrand',
				author: 'Donald Miller',
				year: 2017,
				thickness: 0.14,
				cloth: '#d9c9a8',
				spine: 'StoryBrand'
			}
		]
	},
	{
		id: 'programming',
		label: 'Programación',
		accent: '#4b7fa8',
		books: [
			{
				title: 'The Pragmatic Programmer',
				author: 'Andrew Hunt & David Thomas',
				year: 1999,
				thickness: 0.15,
				cloth: '#2f5f8f',
				spine: 'Pragmatic Prog.'
			},
			{
				title: 'Clean Code',
				author: 'Robert C. Martin',
				year: 2008,
				thickness: 0.17,
				cloth: '#6f93b8'
			},
			{
				title: 'Refactoring',
				author: 'Martin Fowler',
				year: 1999,
				thickness: 0.18,
				cloth: '#3f7fa8',
				spine: 'Refactoring'
			},
			{
				title: 'Design Patterns',
				author: 'Gamma, Helm, Johnson & Vlissides',
				year: 1994,
				thickness: 0.16,
				cloth: '#1f3d55',
				spine: 'Design Patterns'
			},
			{
				title: 'Structure and Interpretation of Computer Programs',
				author: 'Abelson & Sussman',
				year: 1985,
				thickness: 0.19,
				cloth: '#24506e',
				spine: 'SICP'
			}
		]
	},
	{
		id: 'data',
		label: 'Análisis de datos',
		accent: '#4f8f6b',
		books: [
			{
				title: 'Storytelling with Data',
				author: 'Cole Nussbaumer Knaflic',
				year: 2015,
				thickness: 0.15,
				cloth: '#5e8f6a',
				spine: 'Storytelling'
			},
			{
				title: 'Python for Data Analysis',
				author: 'Wes McKinney',
				year: 2012,
				thickness: 0.19,
				cloth: '#3f7355',
				spine: 'Python for Data'
			},
			{
				title: 'Practical Statistics for Data Scientists',
				author: 'Bruce & Bruce',
				year: 2017,
				thickness: 0.16,
				cloth: '#8fa27a',
				spine: 'Practical Stats'
			},
			{
				title: 'Designing Data-Intensive Applications',
				author: 'Martin Kleppmann',
				year: 2017,
				thickness: 0.2,
				cloth: '#2f5a45',
				spine: 'Data-Intensive'
			},
			{
				title: 'Naked Statistics',
				author: 'Charles Wheelan',
				year: 2013,
				thickness: 0.12,
				cloth: '#d8d2b8',
				spine: 'Naked Stats'
			}
		]
	},
	{
		id: 'ai',
		label: 'IA & ML',
		accent: '#a8324a',
		books: [
			{
				title: 'Artificial Intelligence: A Modern Approach',
				author: 'Russell & Norvig',
				year: 1995,
				thickness: 0.21,
				cloth: '#6e2440',
				spine: 'AI: Modern Appr'
			},
			{
				title: 'Deep Learning',
				author: 'Goodfellow, Bengio & Courville',
				year: 2016,
				thickness: 0.19,
				cloth: '#8d2f42'
			},
			{
				title: 'Pattern Recognition and Machine Learning',
				author: 'Christopher Bishop',
				year: 2006,
				thickness: 0.2,
				cloth: '#4d2a3a',
				spine: 'Pattern Recog.'
			},
			{
				title: 'Hands-On Machine Learning',
				author: 'Aurélien Géron',
				year: 2017,
				thickness: 0.19,
				cloth: '#a8324a',
				spine: 'Hands-On ML'
			},
			{
				title: 'The Alignment Problem',
				author: 'Brian Christian',
				year: 2020,
				thickness: 0.13,
				cloth: '#c98b8f',
				spine: 'Alignment'
			}
		]
	}
]
