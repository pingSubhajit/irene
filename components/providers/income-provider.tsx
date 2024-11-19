import {income as incomeModel, incomeCategory, incomeVendor} from '@/db/schema'
import {ReactNode} from 'react'
import {IncomeVendorsProvider} from '@/components/providers/income-vendors-provider'
import {IncomeCategoriesProvider} from '@/components/providers/income-categories-provider'
import {IncomesProvider} from '@/components/providers/incomes-provider'

const IncomeProvider = ({initialVendors, initialCategories, initialIncomes, children}: {
	initialVendors: (typeof incomeVendor.$inferSelect)[],
	initialCategories: (typeof incomeCategory.$inferSelect)[],
	initialIncomes: ((typeof incomeModel.$inferSelect) & {
		category: (typeof incomeCategory.$inferSelect)} & {
		vendor: (typeof incomeVendor.$inferSelect)
	})[],
	children: ReactNode
}) => {
	return (
		<IncomeVendorsProvider initialVendors={initialVendors}>
			<IncomeCategoriesProvider initialCategories={initialCategories}>
				<IncomesProvider initialIncomes={initialIncomes}>
					{children}
				</IncomesProvider>
			</IncomeCategoriesProvider>
		</IncomeVendorsProvider>
	)
}

export default IncomeProvider
