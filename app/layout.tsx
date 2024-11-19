import type {Metadata} from 'next'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import {ReactNode} from 'react'
import circa from '@/app/fonts/cirka/cirka'
import gilroy from '@/app/fonts/gilroy/gilroy'
import {Overpass_Mono} from 'next/font/google'
import {Toaster} from '@/components/ui/sonner'

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app'
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

					<div className="[&>main]:min-h-svh w-full mx-auto max-w-[600px] [&>main]:py-6">
						{children}
					</div>

					<Toaster richColors />
				</div>
			</body>
		</html>
	)
}

export default RootLayout
