export interface Experience {
	id: string;
	company: string;
	position: string;
	description: string;
	responsibilities: string[];
	skills: string[];
	startDate: string;
	endDate?: string | null;
	isOngoing: boolean;
	location: string;
	type: 'internship' | 'freelance' | 'contract' | 'full-time' | 'part-time';
	externalLink?: string | string[];
	logo?: string;
}

export const experiences: Experience[] = [
	{
		id: 'exp-1',
		company: 'International Contact Center (ICC)',
		position: 'Junior WebMaster - Marketing Department',
		description:
			'Create and manage effective digital campaigns for clients. Analyze campaign performance and adjust strategies as needed to maximize results.',
		responsibilities: [
			'Manage backups for client websites',
			'Update and maintain client websites using WordPress and other CMS platforms',
			'Attend advertising strategy follow-up meetings',
			'Manage supplier requests and inventory',
			'Conduct market and competitor analysis to identify growth opportunities',
			'Assist in monthly and quarterly reports and budgets',
		],
		skills: [
			'WordPress',
			'Digital Marketing',
			'Web Management',
			'CMS',
			'SEO',
			'Analytics',
		],
		startDate: '2025-09-09',
		isOngoing: true,
		location: 'Santo Domingo, Dominican Republic',
		type: 'full-time',
		externalLink: 'https://icontactcenter.com/',
	},
	{
		id: 'exp-2',
		company: 'Freelance Projects',
		position: 'Full Stack Developer',
		description:
			'Developed custom web solutions for various clients, including Astro-based static sites and dynamic applications.',
		responsibilities: [
			'Build responsive web applications',
			'Design and implement database schemas',
			'Optimize performance and user experience',
			'Deploy and maintain production applications',
		],
		skills: [
			'Astro',
			'React',
			'TypeScript',
			'Tailwind CSS',
			'Node.js',
			'PostgreSQL',
		],
		startDate: '2024-01-01',
		isOngoing: true,
		location: 'Remote',
		type: 'freelance',
	},
	{
		id: 'exp-3',
		company: 'AI & Data Analysis Project',
		position: 'Machine Learning Developer',
		description:
			'Developed machine learning models and data analysis pipelines for business intelligence projects.',
		responsibilities: [
			'Build and train ML models',
			'Perform exploratory data analysis',
			'Create data visualizations and dashboards',
			'Deploy models and APIs',
		],
		skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow', 'Pandas'],
		startDate: '2023-06-01',
		endDate: '2024-12-31',
		isOngoing: false,
		location: 'Remote',
		type: 'contract',
	},
];
