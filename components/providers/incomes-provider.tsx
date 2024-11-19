'use client'

import {createContext, ReactNode, startTransition, useContext, useEffect, useState} from 'react'
import {income as incomeModel, incomeCategory, incomeVendor} from '@/db/schema'
import {createClient} from '@/utils/supabase/client'
import {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
	RealtimePostgresChangesFilter
} from '@supabase/realtime-js/src/RealtimeChannel'
import {useSelectedFilters} from '@/components/providers/filter-provider'
import {getIncomeByIdFromDB} from '@/lib/income.methods'

type IncomesContextValueType = {
	incomes: ((typeof incomeModel.$inferSelect) & {
		category: (typeof incomeCategory.$inferSelect)} & {
		vendor: (typeof incomeVendor.$inferSelect)
	})[]
}

type AddToStateFunctionType = (expense: (typeof incomeModel.$inferSelect) & {
	category: (typeof incomeCategory.$inferSelect)} & {
	vendor: (typeof incomeVendor.$inferSelect)
}) => void

type RemoveFromStateFunctionType = (expenseId: string) => void

export type IncomesContextType = [IncomesContextValueType, {
	addToState: AddToStateFunctionType,
	removeFromState: RemoveFromStateFunctionType
}]

const defaultIncomesContext: IncomesContextValueType = {
	incomes: []
}

const IncomesContext = createContext(
	[
		defaultIncomesContext,
		{
			addToState: () => {},
			removeFromState: () => {}
		}
	] as IncomesContextType
)

export const IncomesProvider = ({children, initialIncomes}: {
	children: ReactNode,
	initialIncomes: ((typeof incomeModel.$inferSelect) & {
		category: (typeof incomeCategory.$inferSelect)} & {
		vendor: (typeof incomeVendor.$inferSelect)
	})[]
}) => {

	const [incomesContext, setIncomesContext] = useState<IncomesContextValueType>({
		...defaultIncomesContext,
		incomes: initialIncomes
	})

	const {filters} = useSelectedFilters()

	const [filteredIncomes, setFilteredIncomes] = useState<IncomesContextValueType>({incomes: []})
	const [sortedIncomes, setSortedIncomes] = useState<IncomesContextValueType>({incomes: []})

	useEffect(() => {
		const filteredIncomes = incomesContext.incomes.filter(income => {
			const incomeDate = new Date(income.createdAt!)
			const incomeMonth = incomeDate.getMonth()
			const incomeYear = incomeDate.getFullYear()

			return incomeMonth === filters.selectedMonth && incomeYear === filters.selectedYear
		})

		setFilteredIncomes({incomes: filteredIncomes})
	}, [filters.selectedMonth, filters.selectedYear, incomesContext.incomes])

	const addToState = (income: (typeof incomeModel.$inferSelect) & {
		category: (typeof incomeCategory.$inferSelect)} & {
		vendor: (typeof incomeVendor.$inferSelect)
	}) => {
		setIncomesContext({...incomesContext, incomes: [income, ...incomesContext.incomes]})
	}

	const removeFromState = (incomeId: string) => {
		setIncomesContext({
			...incomesContext,
			incomes: incomesContext.incomes.filter(income => income.id !== incomeId)
		})
	}

	const supabase = createClient()

	const supabaseSubscribeConfig = {
		event: '*',
		schema: 'public',
		table: 'income'
	}


	useEffect(() => {
		const unsortedIncomes = filteredIncomes.incomes
		const sortedIncomes = unsortedIncomes.sort((a, b) => {
			return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
		})

		setSortedIncomes({incomes: sortedIncomes})
	}, [filteredIncomes])


	useEffect(() => {
		const channel = supabase
			.channel('INCOME::ALL')
			.on(
				'postgres_changes',
				supabaseSubscribeConfig as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
				(payload) => {
					switch (payload.eventType) {
					case 'INSERT':
						startTransition(async () => {
							const income = await getIncomeByIdFromDB(payload.new.id)

							addToState(income as (typeof incomeModel.$inferSelect) & {
									category: (typeof incomeCategory.$inferSelect)} & {
									vendor: (typeof incomeVendor.$inferSelect)
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
		<IncomesContext.Provider value={
			[sortedIncomes, {
				addToState, removeFromState
			}]
		}>
			{children}
		</IncomesContext.Provider>
	)
}

export const useIncomes = () => {
	const context = useContext(IncomesContext)

	if (!context) {
		throw new Error('useIncomes must be used within a IncomesProvider')
	}

	return {
		incomes: context[0].incomes,
		addToState: context[1].addToState,
		removeFromState: context[1].removeFromState
	}
}
