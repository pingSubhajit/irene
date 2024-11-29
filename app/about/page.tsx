import logo from '@/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import {githubRepo, portfolio} from '@/lib/constants'
import {Metadata} from 'next'
import {Suspense} from 'react'
import {Separator} from '@/components/ui/separator'
import LoginButton from '@/components/utilities/LoginButton'

export const metadata: Metadata = {
	title: 'About Irene - Motivation, Creator, License, and more',
	description: 'Learn about the motivation behind Irene, a simple, mobile-first, finance app to record your incomes and expenses. ' +
		'Discover the creator, the MIT license, and credits. Irene is free, open-source, and designed for ' +
		'everyone who wants to understand better where their money goes.',
	keywords: ['Irene', 'about Irene', 'finance motivation', 'Irene creator', 'Irene license', 'MIT license',
		'finance app credits', 'open source finance app', 'free finance app', 'expense tracker',
		'cloud-synced expenses', 'real-time expenses', 'mobile-first finance app', 'minimalistic finance app'
	]
}

const AboutPage = () => {
	return (
		<main className="flex flex-col items-start justify-center gap-8">
			<header className="flex justify-between items-center w-full">
				<Link href="/"><Image src={logo} alt="Irene logo" className="w-8 h-8"/></Link>
				<Suspense>
					<LoginButton />
				</Suspense>
			</header>

			<div>
				<h2 className="text-lg text-neutral-200 font-medium">Irene: Simple finance tracker</h2>
				<p className="mt-2 text-[15px] font-medium text-neutral-400 font-sans leading-relaxed">
					A small tool for recording your incomes and expenses. Designed to be simple, fast, and mobile-first.
					No integrations, no fancy analytics, just simply add your expenses and incomes and get a clear
					picture of where your money goes.
				</p>
			</div>

			<div>
				<h2 className="text-lg text-neutral-200 font-medium">About</h2>
				<p className="mt-2 text-[15px] font-medium text-neutral-400 font-sans leading-relaxed">
					Built for personal usage, designed with personal preferences. The application is bare-featured with
					minimalistic design and functionality. Loads fast and animated appropriately. Mobile first design.
					No onboarding. No tracking. No ads, ever.
				</p>
			</div>

			<div>
				<h2 className="text-lg text-neutral-200 font-medium">Contribute</h2>
				<p className="mt-2 text-[15px] font-medium text-neutral-400 font-sans leading-relaxed">
					The product is free to use. However, no new features, bug fixes, or any meaningful support will be
					guaranteed. The project is open source and can be found
					on <a href={githubRepo} target="_blank"
						className="text-emerald-400 hover:text-emerald-500 transition">
						GitHub
					</a>. Feel free to fork, modify and host your own version. No attribution required.
				</p>
			</div>

			<div>
				<h2 className="text-lg text-neutral-200 font-medium">Terms</h2>
				<p className="mt-2 text-[15px] font-medium text-neutral-400 font-sans leading-relaxed">
					To verify the product on Google, I had to create documents such as <a href="/terms" target="_blank"
						className="text-emerald-400 hover:text-emerald-500 transition">Terms of Service</a> and <a
						href="/privacy" target="_blank" className="text-emerald-400 hover:text-emerald-500 transition">
							Privacy Policy</a> and needed to be displayed prominently. So here you have it.
				</p>
			</div>

			<Separator />

			<footer className="flex justify-between items-center w-full font-Cirka">
				<p className="mt-2 text-sm font-medium text-neutral-400 italic">v0.01</p>
				<a href={portfolio} target="_blank" className="text-emerald-400 hover:text-emerald-500 transition">
					<p className="mt-2 text-right text-lg font-semibold">Subhajit</p>
				</a>
			</footer>
		</main>
	)
}

export default AboutPage
