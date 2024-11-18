import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'

export const GET = async () => {
	const supabase = await createClient()
	await supabase.auth.signOut()
	return redirect('/')
}
