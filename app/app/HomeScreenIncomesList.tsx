'use client'

import IncomeList from '@/components/income/IncomeList'
import {useIncomes} from '@/components/providers/incomes-provider'

const HomeScreenIncomesList = () => {
	const {incomes} = useIncomes()

	return (
		<IncomeList incomes={incomes} />
	)
}

export default HomeScreenIncomesList
