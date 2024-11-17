import {redirect} from 'next/navigation'
import {ReactNode} from 'react'
import {createClient} from '@/utils/supabase/server'

const AppLayout = async ({children}: { children: ReactNode }) => {
	const supabase = await createClient()

	const {data: {user}} = await supabase.auth.getUser()

	if (!user) {
		return redirect('/')
	}

	return (
		<>
			{children}
		</>
	)
}

export default AppLayout
