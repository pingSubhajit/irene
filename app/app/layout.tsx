import {redirect} from 'next/navigation'
import {ReactNode} from 'react'
import {createClient} from '@/utils/supabase/server'
import {DialogsProvider} from '@/components/providers/dialog-provider'
import {getExpenseVendorsFromDB} from '@/lib/expenseVendor.methods'
import {getExpenseCategoriesFromDB} from '@/lib/expenseCategory.methods'
import {getExpensesFromDB} from '@/lib/expense.methods'
import {ExpensesProvider} from '@/components/providers/expenses-provider'

const AppLayout = async ({children}: { children: ReactNode }) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	if (!user) return redirect('/')

	const expenses = await getExpensesFromDB(user!.id)
	const expenseVendors = await getExpenseVendorsFromDB(user!.id)
	const expenseCategories = await getExpenseCategoriesFromDB(user!.id)

	return (
		<ExpensesProvider initialExpenses={expenses}>
			<DialogsProvider expenseVendors={expenseVendors} expenseCategories={expenseCategories}>
				{children}
			</DialogsProvider>
		</ExpensesProvider>
	)
}

export default AppLayout
