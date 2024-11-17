import type {Metadata} from 'next'
import './globals.css'
import NextTopLoader from 'nextjs-toploader'
import {ReactNode} from 'react'
import {DialogsProvider} from '@/components/providers/dialog-provider'
import circa from '@/app/fonts/cirka/cirka'
import gilroy from '@/app/fonts/gilroy/gilroy'
import {Overpass_Mono} from 'next/font/google'

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app'
}

const overpassMono = Overpass_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-overpass-mono'
})

const RootLayout = ({children}: Readonly<{ children: ReactNode }>) => (
	<html lang="en" className={`${gilroy.variable} ${circa.variable} ${overpassMono.className}`}>
		<body className="font-Gilroy custom-scroll antialiased">
			<div vaul-drawer-wrapper="" className="bg-background">
				<DialogsProvider>
					{/* PROGRESS BAR */}
					<NextTopLoader showSpinner={false} color="#facc15"/>
					<div className="[&>main]:min-h-svh w-full mx-auto max-w-[600px] px-6 [&>main]:py-6">
						{children}
					</div>
				</DialogsProvider>
			</div>
		</body>
	</html>
)

export default RootLayout
