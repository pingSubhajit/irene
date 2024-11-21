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
import IncomeProvider from '@/components/providers/income-provider'
import AppHeader from '@/components/AppHeader'

const AppLayout = async ({children}: { children: ReactNode }) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	if (!user) return redirect('/')

	const expenses = await getExpensesFromDB()
	const expenseVendors = await getExpenseVendorsFromDB()
	const expenseCategories = await getExpenseCategoriesFromDB()

	const incomes = await getIncomesFromDB()
	const incomeVendors = await getIncomeVendorsFromDB()
	const incomeCategories = await getIncomeCategoriesFromDB()

	return (
		<FilterProvider>
			<ExpenseProvider initialVendors={expenseVendors} initialCategories={expenseCategories} initialExpenses={expenses}>
				<IncomeProvider initialVendors={incomeVendors} initialCategories={incomeCategories} initialIncomes={incomes}>
					<DialogsProvider>
						<div className="pt-8 space-y-8">
							<AppHeader title="Irene" profileUrl={user!.user_metadata.avatar_url} />
							{children}
						</div>
					</DialogsProvider>
				</IncomeProvider>
			</ExpenseProvider>
		</FilterProvider>
	)
}

export default AppLayout
