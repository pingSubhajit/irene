import {createClient} from '@/utils/supabase/server'
import {getExpensesFromDB} from '@/lib/expense.methods'
import {Tabs, TabsContent} from '@/components/ui/tabs'
import IncomeExpenseTabList from '@/app/app/IncomeExpenseTabList'
import ExpenseList from '@/components/expense/ExpenseList'

const AppHome = async () => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	const expenses = await getExpensesFromDB(user!.id)

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
					<ExpenseList expenses={expenses} />
				</TabsContent>
				<TabsContent value="income">Change your password here.</TabsContent>
			</Tabs>
		</main>
	)
}

export default AppHome
