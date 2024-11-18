import {createClient} from '@/utils/supabase/server'
import {Tabs, TabsContent} from '@/components/ui/tabs'
import IncomeExpenseTabList from '@/app/app/IncomeExpenseTabList'
import HomeScreenExpensesList from '@/app/app/HomeScreenExpensesList'

const AppHome = async () => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return (
		<main className="flex flex-col gap-10">
			<div>
				<h1 className="flex flex-col truncate font-Cirka">
					<span className="text-emerald-400 text-3xl font-medium">Welcome</span>
					<span className="text-6xl truncate font-bold">{user!.user_metadata.name.split(' ')[0]}</span>
				</h1>
			</div>

			<Tabs defaultValue="expense" className="w-full">
				<IncomeExpenseTabList />

				{/* EXPENSE LIST */}
				<TabsContent value="expense" className="pt-4">
					<HomeScreenExpensesList />
				</TabsContent>
				<TabsContent value="income">Change your password here.</TabsContent>
			</Tabs>
		</main>
	)
}

export default AppHome
