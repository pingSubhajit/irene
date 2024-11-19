import {redirect} from 'next/navigation'
import {ReactNode} from 'react'
import {createClient} from '@/utils/supabase/server'
import {DialogsProvider} from '@/components/providers/dialog-provider'
import {getExpenseVendorsFromDB} from '@/lib/expenseVendor.methods'
import {getExpenseCategoriesFromDB} from '@/lib/expenseCategory.methods'
import {getExpensesFromDB} from '@/lib/expense.methods'
import {FilterProvider} from '@/components/providers/filter-provider'
import {getIncomesFromDB} from '@/lib/income.methods'
import {getIncomeVendorsFromDB} from '@/lib/incomeVendor.methods'
import {getIncomeCategoriesFromDB} from '@/lib/incomeCategory.methods'
import ExpenseProvider from '@/components/providers/expense-provider'

const AppLayout = async ({children}: { children: ReactNode }) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	if (!user) return redirect('/')

	const expenses = await getExpensesFromDB(user!.id)
	const expenseVendors = await getExpenseVendorsFromDB(user!.id)
	const expenseCategories = await getExpenseCategoriesFromDB(user!.id)

	const incomes = await getIncomesFromDB(user!.id)
	const incomeVendors = await getIncomeVendorsFromDB(user!.id)
	const incomeCategories = await getIncomeCategoriesFromDB(user!.id)

	return (
		<FilterProvider>
			<ExpenseProvider initialVendors={expenseVendors} initialCategories={expenseCategories} initialExpenses={expenses}>
				<DialogsProvider>
					{children}
				</DialogsProvider>
			</ExpenseProvider>
		</FilterProvider>
	)
}

export default AppLayout
