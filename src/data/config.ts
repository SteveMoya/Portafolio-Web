interface SiteConfig {
    author: string
    title: string
    description: string
    lang: string
    ogLocale: string
    shareMessage: string
    paginationSize: number
    keywords: string
    favicon: string
    ogImage: string
}

export const siteConfig: SiteConfig = {
    author: 'Steve Moya', // Site author
    title: 'Steve Moya - Personal Portafolio Web', // Site title.
    description: 'Steve Moya - Personal Web Personal, Este es mi portafolio con mucho amor y dedicacion.Hecho por un marketero amante a la tecnologia',
    keywords: 'blog, Steve Moya Cepeda, Marketer, Steve  Moya, creative, creative portfolio, cv, portafolio, professional cv, responsive portafolio',
    favicon: "/img/logo.svg",
    ogImage: "/img/Steve-Moya-OG.jpg",
     // Description to display in the meta tags
    lang: 'es-DO',
    ogLocale: 'es_DO',
    shareMessage: 'Comparte este Post', // Social share message
    paginationSize: 6 // Number of posts per page
}
