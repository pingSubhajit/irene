import {expense as expenseModel, expenseCategory, expenseVendor} from '@/db/schema'
import {ReactNode} from 'react'
import {ExpenseCategoriesProvider} from '@/components/providers/expense-categories-provider'
import {ExpensesProvider} from '@/components/providers/expenses-provider'
import {ExpenseVendorsProvider} from '@/components/providers/expense-vendors-provider'

const ExpenseProvider = ({initialVendors, initialCategories, initialExpenses, children}: {
	initialVendors: (typeof expenseVendor.$inferSelect)[],
	initialCategories: (typeof expenseCategory.$inferSelect)[],
	initialExpenses: ((typeof expenseModel.$inferSelect) & {
		category: (typeof expenseCategory.$inferSelect)} & {
		vendor: (typeof expenseVendor.$inferSelect)
	})[],
	children: ReactNode
}) => {
	return (
		<ExpenseVendorsProvider initialVendors={initialVendors}>
			<ExpenseCategoriesProvider initialCategories={initialCategories}>
				<ExpensesProvider initialExpenses={initialExpenses}>
					{children}
				</ExpensesProvider>
			</ExpenseCategoriesProvider>
		</ExpenseVendorsProvider>
	)
}

export default ExpenseProvider
