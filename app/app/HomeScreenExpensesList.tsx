'use client'

import ExpenseList from '@/components/expense/ExpenseList'
import {useExpenses} from '@/components/providers/expenses-provider'

const HomeScreenExpensesList = () => {
	const {expenses} = useExpenses()

	return (
		<ExpenseList expenses={expenses} />
	)
}

export default HomeScreenExpensesList
