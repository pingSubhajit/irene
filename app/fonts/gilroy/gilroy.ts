import localFont from 'next/font/local'

const gilroy = localFont({
	src: [
		{
			path: './Gilroy-Thin.ttf',
			weight: '100',
			style: 'normal'
		},
		{
			path: './Gilroy-ThinItalic.ttf',
			weight: '100',
			style: 'italic'
		},
		{
			path: './Gilroy-UltraLight.ttf',
			weight: '200',
			style: 'normal'
		},
		{
			path: './Gilroy-UltraLightItalic.ttf',
			weight: '200',
			style: 'italic'
		},
		{
			path: './Gilroy-Light.ttf',
			weight: '300',
			style: 'normal'
		},
		{
			path: './Gilroy-LightItalic.ttf',
			weight: '300',
			style: 'italic'
		},
		{
			path: './Gilroy-Regular.ttf',
			weight: '400',
			style: 'normal'
		},
		{
			path: './Gilroy-RegularItalic.ttf',
			weight: '400',
			style: 'italic'
		},
		{
			path: './Gilroy-Medium.ttf',
			weight: '500',
			style: 'normal'
		},
		{
			path: './Gilroy-MediumItalic.ttf',
			weight: '500',
			style: 'italic'
		},
		{
			path: './Gilroy-SemiBold.ttf',
			weight: '600',
			style: 'normal'
		},
		{
			path: './Gilroy-SemiBoldItalic.ttf',
			weight: '600',
			style: 'italic'
		},
		{
			path: './Gilroy-Bold.ttf',
			weight: '700',
			style: 'normal'
		},
		{
			path: './Gilroy-BoldItalic.ttf',
			weight: '700',
			style: 'italic'
		},
		{
			path: './Gilroy-ExtraBold.ttf',
			weight: '800',
			style: 'normal'
		},
		{
			path: './Gilroy-ExtraBoldItalic.ttf',
			weight: '800',
			style: 'italic'
		},
		{
			path: './Gilroy-Black.ttf',
			weight: '900',
			style: 'normal'
		},
		{
			path: './Gilroy-BlackItalic.ttf',
			weight: '900',
			style: 'italic'
		}
	],
	variable: '--font-gilroy'
})

export default gilroy
