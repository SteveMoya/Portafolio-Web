export interface Skill {
	name: string;
	level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	category: string;
	icon?: string;
}

export const skills: Skill[] = [
	// Frontend
	{
		name: 'HTML/CSS',
		level: 'expert',
		category: 'Frontend',
		icon: '🎨',
	},
	{
		name: 'JavaScript',
		level: 'advanced',
		category: 'Frontend',
		icon: '⚡',
	},
	{
		name: 'TypeScript',
		level: 'advanced',
		category: 'Frontend',
		icon: '📘',
	},
	{
		name: 'React',
		level: 'advanced',
		category: 'Frontend',
		icon: '⚛️',
	},
	{
		name: 'Astro',
		level: 'expert',
		category: 'Frontend',
		icon: '🚀',
	},
	{
		name: 'Tailwind CSS',
		level: 'expert',
		category: 'Frontend',
		icon: '🎯',
	},

	// Backend
	{
		name: 'Node.js',
		level: 'advanced',
		category: 'Backend',
		icon: '🟢',
	},
	{
		name: 'Python',
		level: 'advanced',
		category: 'Backend',
		icon: '🐍',
	},
	{
		name: 'PostgreSQL',
		level: 'intermediate',
		category: 'Backend',
		icon: '🗄️',
	},
	{
		name: 'MongoDB',
		level: 'intermediate',
		category: 'Backend',
		icon: '🍃',
	},

	// AI & Data
	{
		name: 'Machine Learning',
		level: 'intermediate',
		category: 'AI & Data',
		icon: '🤖',
	},
	{
		name: 'Data Analysis',
		level: 'intermediate',
		category: 'AI & Data',
		icon: '📊',
	},
	{
		name: 'TensorFlow',
		level: 'beginner',
		category: 'AI & Data',
		icon: '🧠',
	},
	{
		name: 'Pandas',
		level: 'intermediate',
		category: 'AI & Data',
		icon: '🐼',
	},

	// DevOps & Tools
	{
		name: 'Git',
		level: 'advanced',
		category: 'DevOps & Tools',
		icon: '📦',
	},
	{
		name: 'Docker',
		level: 'intermediate',
		category: 'DevOps & Tools',
		icon: '🐳',
	},
	{
		name: 'Vercel',
		level: 'advanced',
		category: 'DevOps & Tools',
		icon: '▲',
	},
	{
		name: 'GitHub',
		level: 'advanced',
		category: 'DevOps & Tools',
		icon: '🐙',
	},

	// Marketing & Soft Skills
	{
		name: 'Digital Marketing',
		level: 'advanced',
		category: 'Marketing',
		icon: '📱',
	},
	{
		name: 'SEO',
		level: 'intermediate',
		category: 'Marketing',
		icon: '🔍',
	},
	{
		name: 'WordPress',
		level: 'advanced',
		category: 'Marketing',
		icon: '📝',
	},
	{
		name: 'Google Analytics',
		level: 'intermediate',
		category: 'Marketing',
		icon: '📈',
	},
];

export const categories = [
	'Frontend',
	'Backend',
	'AI & Data',
	'DevOps & Tools',
	'Marketing',
];

export const getSkillsByCategory = (category: string) => {
	return skills.filter((skill) => skill.category === category);
};

export const getSkillsByLevel = (level: string) => {
	return skills.filter((skill) => skill.level === level);
};
