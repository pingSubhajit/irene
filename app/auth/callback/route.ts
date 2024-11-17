import {createClient} from '@/utils/supabase/server'
import {NextResponse} from 'next/server'
import {defaultUrl} from '@/lib/constants'

export const GET = async (req: Request) => {
	/*
	 * The `/auth/callback` route is required for the server-side auth flow implemented
	 * by the SSR package. It exchanges an auth code for the user's session.
	 */
	const requestUrl = new URL(req.url)
	const code = requestUrl.searchParams.get('code')

	if (code) {
		const supabase = await createClient()
		await supabase.auth.exchangeCodeForSession(code)
	}

	// URL to redirect to after sign up process completes
	return NextResponse.redirect(`${defaultUrl}/app`)
}
