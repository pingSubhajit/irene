'use client'

import {createContext, ReactNode, startTransition, useContext, useEffect, useState} from 'react'
import {expense as expenseModel, expenseCategory, expenseVendor} from '@/db/schema'
import {createClient} from '@/utils/supabase/client'
import {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
	RealtimePostgresChangesFilter
} from '@supabase/realtime-js/src/RealtimeChannel'
import {getExpenseByIdFromDB} from '@/lib/expense.methods'
import {useSelectedFilters} from '@/components/providers/filter-provider'

type ExpensesContextValueType = {
	expenses: ((typeof expenseModel.$inferSelect) & {
		category: (typeof expenseCategory.$inferSelect)} & {
		vendor: (typeof expenseVendor.$inferSelect)
	})[]
}

type AddToStateFunctionType = (expense: (typeof expenseModel.$inferSelect) & {
	category: (typeof expenseCategory.$inferSelect)} & {
	vendor: (typeof expenseVendor.$inferSelect)
}) => void

type RemoveFromStateFunctionType = (expenseId: string) => void

export type ExpensesContextType = [ExpensesContextValueType, {
	addToState: AddToStateFunctionType,
	removeFromState: RemoveFromStateFunctionType
}]

const defaultExpensesContext: ExpensesContextValueType = {
	expenses: []
}

const ExpensesContext = createContext(
	[
		defaultExpensesContext,
		{
			addToState: () => {},
			removeFromState: () => {}
		}
	] as ExpensesContextType
)

export const ExpensesProvider = ({children, initialExpenses}: {
	children: ReactNode,
	initialExpenses: ((typeof expenseModel.$inferSelect) & {
		category: (typeof expenseCategory.$inferSelect)} & {
		vendor: (typeof expenseVendor.$inferSelect)
	})[]
}) => {

	const [expensesContext, setExpensesContext] = useState<ExpensesContextValueType>({
		...defaultExpensesContext,
		expenses: initialExpenses
	})

	const {filters} = useSelectedFilters()

	const [filteredExpenses, setFilteredExpenses] = useState<ExpensesContextValueType>({expenses: []})
	const [sortedExpenses, setSortedExpenses] = useState<ExpensesContextValueType>({expenses: []})

	useEffect(() => {
		const filteredExpenses = expensesContext.expenses.filter(expense => {
			const expenseDate = new Date(expense.createdAt!)
			const expenseMonth = expenseDate.getMonth()
			const expenseYear = expenseDate.getFullYear()

			return expenseMonth === filters.selectedMonth && expenseYear === filters.selectedYear
		})

		setFilteredExpenses({expenses: filteredExpenses})
	}, [filters.selectedMonth, filters.selectedYear, expensesContext.expenses])

	const addToState = (expense: (typeof expenseModel.$inferSelect) & {
		category: (typeof expenseCategory.$inferSelect)} & {
		vendor: (typeof expenseVendor.$inferSelect)
	}) => {
		setExpensesContext({...expensesContext, expenses: [expense, ...expensesContext.expenses]})
	}

	const removeFromState = (expenseId: string) => {
		setExpensesContext({
			...expensesContext,
			expenses: expensesContext.expenses.filter(expense => expense.id !== expenseId)
		})
	}

	const supabase = createClient()

	const supabaseSubscribeConfig = {
		event: '*',
		schema: 'public',
		table: 'expense'
	}


	useEffect(() => {
		const unsortedExpenses = filteredExpenses.expenses
		const sortedExpenses = unsortedExpenses.sort((a, b) => {
			return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
		})

		setSortedExpenses({expenses: sortedExpenses})
	}, [filteredExpenses])


	useEffect(() => {
		const channel = supabase
			.channel('EXPENSE::ALL')
			.on(
				'postgres_changes',
				supabaseSubscribeConfig as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
				(payload) => {
					switch (payload.eventType) {
					case 'INSERT':
						startTransition(async () => {
							const expense = await getExpenseByIdFromDB(payload.new.id)

							addToState(expense as (typeof expenseModel.$inferSelect) & {
								category: (typeof expenseCategory.$inferSelect)} & {
								vendor: (typeof expenseVendor.$inferSelect)
							})
						})
						break

					case 'DELETE':
						startTransition(() => {
							removeFromState(payload.old.id)
						})
						break

					case 'UPDATE':
						/*
						 * startTransition(() => {
						 * 	setTimers((prevTimers) => {
						 * 		if (prevTimers.find((timer) => timer.id === payload.new.id)) {
						 * 			return prevTimers.map((timer) => timer.id === payload.new.id ? payload.new as Timer : timer)
						 * 		} else {
						 * 			return [payload.new as Timer, ...prevTimers]
						 * 		}
						 * 	})
						 * })
						 */
						break
					}
				}
			)
			.subscribe()

		return () => {
			channel.unsubscribe()
		}
	}, [])

	return (
		<ExpensesContext.Provider value={
			[sortedExpenses, {
				addToState, removeFromState
			}]
		}>
			{children}
		</ExpensesContext.Provider>
	)
}

export const useExpenses = () => {
	const context = useContext(ExpensesContext)

	if (!context) {
		throw new Error('useExpenses must be used within a ExpensesProvider')
	}

	return {
		expenses: context[0].expenses,
		addToState: context[1].addToState,
		removeFromState: context[1].removeFromState
	}
}
