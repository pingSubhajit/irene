import type {Metadata} from 'next'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import {ReactNode} from 'react'
import circa from '@/app/fonts/cirka/cirka'
import gilroy from '@/app/fonts/gilroy/gilroy'
import {Overpass_Mono} from 'next/font/google'
import {Toaster} from '@/components/ui/sonner'
import {defaultUrl, portfolio} from '@/lib/constants'

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Irene - Simple finance tracker',
	description: 'Irene is a small tool for recording your incomes and expenses. Designed to be simple, fast, ' +
		'and mobile-first. No integrations, no fancy analytics, just simply add your expenses and incomes and ' +
		'get a clear picture of where your money goes',
	keywords: [
		'finance', 'income tracker', 'budgeting', 'cloud synced', 'open source', 'mobile first', 'minimalistic',
		'Irene', 'open source finance app', 'free finance app', 'expense tracker',
		'cloud-synced expenses', 'real-time expenses', 'mobile-first finance app', 'minimalistic finance app'
	],
	generator: 'Next.js',
	manifest: '/manifest.webmanifest',
	icons: [
		{rel: 'apple-touch-icon', url: 'logo.png'},
		{rel: 'icon', url: 'logo.png'}
	],
	authors: [{name: 'Subhajit Kundu', url: portfolio}]
}

const overpassMono = Overpass_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-overpass-mono'
})

const RootLayout = ({children}: Readonly<{ children: ReactNode }>) => {
	return (
		<html lang="en" className={`${gilroy.variable} ${circa.variable} ${overpassMono.className}`}>
			<body className="font-Gilroy custom-scroll antialiased">
				<div vaul-drawer-wrapper="" className="bg-background">
					{/* PROGRESS BAR */}
					<NextTopLoader showSpinner={false} color="#34d399"/>

					<div className="[&>main]:min-h-svh w-full mx-auto max-w-[600px] px-6 [&>main]:py-6">
						{children}
					</div>

					<Toaster richColors />
				</div>
			</body>
		</html>
	)
}

export default RootLayout
