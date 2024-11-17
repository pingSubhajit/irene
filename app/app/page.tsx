import {createClient} from '@/utils/supabase/server'
import {getExpensesFromDB} from '@/lib/expense.methods'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

const AppHome = async () => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	const expenses = await getExpensesFromDB(user!.id)

	console.log(expenses)

	return (
		<main className="flex flex-col gap-16">
			<div>
				<h1 className="flex flex-col truncate font-Cirka">
					<span className="text-yellow-400 text-4xl">Welcome</span>
					<span className="text-6xl truncate font-medium">{user!.user_metadata.name.split(' ')[0]}</span>
				</h1>
			</div>

			<Tabs defaultValue="expense" className="w-full">
				<TabsList className="w-full">
					<TabsTrigger value="expense" className="w-1/2">Expenses</TabsTrigger>
					<TabsTrigger value="income" className="w-1/2">Incomes</TabsTrigger>
				</TabsList>
				<TabsContent value="expense">Make changes to your account here.</TabsContent>
				<TabsContent value="income">Change your password here.</TabsContent>
			</Tabs>
		</main>
	)
}

export default AppHome
