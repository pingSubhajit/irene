import {redirect} from 'next/navigation'
import {ReactNode} from 'react'
import {createClient} from '@/utils/supabase/server'
import {DialogsProvider} from '@/components/providers/dialog-provider'
import {getExpenseVendorsFromDB} from '@/lib/expenseVendor.methods'
import {getExpenseCategoriesFromDB} from '@/lib/expenseCategory.methods'
import {getExpensesFromDB} from '@/lib/expense.methods'
import {ExpensesProvider} from '@/components/providers/expenses-provider'
import {ExpenseVendorsProvider} from '@/components/providers/expense-vendors-provider'
import {ExpenseCategoriesProvider} from '@/components/providers/expense-categories-provider'
import {FilterProvider} from '@/components/providers/filter-provider'

const AppLayout = async ({children}: { children: ReactNode }) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	if (!user) return redirect('/')

	const expenses = await getExpensesFromDB(user!.id)
	const expenseVendors = await getExpenseVendorsFromDB(user!.id)
	const expenseCategories = await getExpenseCategoriesFromDB(user!.id)

	return (
		<FilterProvider>
			<ExpenseVendorsProvider initialVendors={expenseVendors}>
				<ExpenseCategoriesProvider initialCategories={expenseCategories}>
					<ExpensesProvider initialExpenses={expenses}>
						<DialogsProvider>
							{children}
						</DialogsProvider>
					</ExpensesProvider>
				</ExpenseCategoriesProvider>
			</ExpenseVendorsProvider>
		</FilterProvider>
	)
}

export default AppLayout
