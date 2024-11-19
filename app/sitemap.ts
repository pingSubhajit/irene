import {MetadataRoute} from 'next'

const sitemap = (): MetadataRoute.Sitemap => [
	{
		url: 'https://irene.wtf',
		lastModified: new Date(),
		changeFrequency: 'monthly',
		priority: 1
	},
	{
		url: 'https://irene.wtf/about',
		lastModified: new Date(),
		changeFrequency: 'monthly',
		priority: 0.8
	},
	{
		url: 'https://irene.wtf/privacy',
		lastModified: new Date(),
		changeFrequency: 'yearly',
		priority: 0.2
	},
	{
		url: 'https://irene.wtf/terms',
		lastModified: new Date(),
		changeFrequency: 'yearly',
		priority: 0.2
	}
]

export default sitemap
