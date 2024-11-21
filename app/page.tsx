import Image from 'next/image'
import Link from 'next/link'
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import banner from '@/public/banner.png'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'

const Home = async () => {
	const supabase = await createClient()

	const {data: {user}} = await supabase.auth.getUser()
	if (user) return redirect('/app') // Redirect to app if user is logged in

	return (
		<main className="h-screen flex flex-col justify-end relative">
			<Image src={banner} alt="Banner" className="translate-y-1/4" />

			<div className="w-full bg-neutral-950/60 backdrop-blur-md p-8 pb-0 flex flex-col items-center gap-6">
				<h1 className="font-Cirka text-4xl font-bold text-center">Measure and manage your expenses like never before</h1>
				<p className="text-sm opacity-80 max-w-xs text-center">Keep a track of you finances by recording your incomes and expenses and get a clear picture of where your money is and where your money goes.</p>
				<Link href="/auth/login" className="w-full max-w-xs">
					<Button className="w-full">Get Started</Button>
				</Link>

				<div className="mt-6 flex items-center gap-4">
					<Link href="/terms" className="text-xs opacity-80">Terms of use</Link>
					<Separator orientation="vertical" className="h-4" />
					<Link href="/privacy" className="text-xs opacity-80">Privacy policy</Link>
				</div>
			</div>
		</main>
	)
}
export default Home
