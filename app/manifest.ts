import {MetadataRoute} from 'next'

const manifest = (): MetadataRoute.Manifest => ({
	name: 'Irene: Simple finance tracker',
	short_name: 'Irene',
	description: 'Irene is a small tool for recording your incomes and expenses. Designed to be simple, fast, ' +
		'and mobile-first. No integrations, no fancy analytics, just simply add your expenses and incomes and ' +
		'get a clear picture of where your money goes.',
	start_url: '/',
	display: 'standalone',
	background_color: '#0a0a0a',
	theme_color: '#0a0a0a',
	icons: [
		{
			src: '/logo144.png',
			sizes: '144x144',
			type: 'image/png'
		},
		{
			src: '/logo512.png',
			sizes: '512x512',
			type: 'image/png'
		}
	],
	orientation: 'portrait'
})

export default manifest
