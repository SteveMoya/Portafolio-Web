export interface Education {
	id: string;
	institution: string;
	degree: string;
	major: string;
	startDate: string;
	endDate?: string;
	isOngoing: boolean;
	gpa?: string;
	activities?: string[];
	achievements?: string[];
}

export const education: Education[] = [
	{
		id: 'edu-1',
		institution: 'Instituto de Educación Superior (Universidad)',
		degree: 'Licenciatura',
		major: 'Informática / Ingeniería de Sistemas',
		startDate: '2022-09-01',
		isOngoing: true,
		gpa: '3.8/4.0',
		activities: [
			'Desarrollo Web',
			'Inteligencia Artificial',
			'Análisis de Datos',
		],
		achievements: [
			'Proyectos destacados en desarrollo full-stack',
			'Participación en hackathons y competencias',
			'Investigación en IA y ML',
		],
	},
	{
		id: 'edu-2',
		institution: 'Instituto Técnico Profesional',
		degree: 'Diplomado',
		major: 'Marketing Digital y Publicidad',
		startDate: '2021-01-01',
		endDate: '2021-12-31',
		isOngoing: false,
		activities: ['Google Ads', 'SEO', 'Social Media'],
		achievements: [
			'Certificación en Google Ads',
			'Proyectos de marketing digital exitosos',
		],
	},
	{
		id: 'edu-3',
		institution: 'Plataformas Online',
		degree: 'Certificaciones',
		major: 'Tecnología y Desarrollo',
		startDate: '2020-01-01',
		isOngoing: true,
		achievements: [
			'Astro & Tailwind CSS Mastery',
			'Full Stack Web Development',
			'Data Analysis with Python',
		],
	},
];
