import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import {NextRequest, NextResponse} from 'next/server'

export const GET = async (req: NextRequest, res: NextResponse) => {
	const supabase = await createClient()
	await supabase.auth.signOut()
	return redirect('/')
}
