'use client'

import {createContext, ReactNode, useContext, useState} from 'react'

type FilterContextValueType = {
	selectedMonth: number,
	selectedYear: number
}

type SelectTimeFrameFunctionType = (timeFrame: number) => void

export type FilterContextType = [FilterContextValueType, {
	selectMonth: SelectTimeFrameFunctionType,
	selectYear: SelectTimeFrameFunctionType
}]

const defaultFilterContext: FilterContextValueType = {
	selectedMonth: new Date().getMonth(),
	selectedYear: new Date().getFullYear()
}

export const months = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
]

const FilterContext = createContext(
	[
		defaultFilterContext,
		{
			selectMonth: () => {},
			selectYear: () => {}
		}
	] as FilterContextType
)

export const FilterProvider = ({children}: {children: ReactNode}) => {
	const [filterContext, setFilterContext] = useState<FilterContextValueType>(defaultFilterContext)

	const selectMonth = (month: number) => {
		setFilterContext({...filterContext, selectedMonth: month})
	}

	const selectYear = (year: number) => {
		setFilterContext({...filterContext, selectedYear: year})
	}

	return (
		<FilterContext.Provider value={
			[filterContext, {
				selectMonth, selectYear
			}]
		}>
			{children}
		</FilterContext.Provider>
	)
}

export const useSelectedFilters = () => {
	const context = useContext(FilterContext)

	if (!context) {
		throw new Error('useSelectedFilters must be used within a FilterProvider')
	}

	return {
		filters: context[0],
		selectMonth: context[1].selectMonth,
		selectYear: context[1].selectYear
	}
}
