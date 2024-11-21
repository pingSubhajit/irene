'use client'

import {createContext, ReactNode, startTransition, useContext, useEffect, useState} from 'react'
import {expenseCategory} from '@/db/schema'
import {createClient} from '@/utils/supabase/client'
import {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
	RealtimePostgresChangesFilter
} from '@supabase/realtime-js/src/RealtimeChannel'
import {getExpenseCategoriesFromDB} from '@/lib/expenseCategory.methods'

type CategoriesContextValueType = {
	categories: (typeof expenseCategory.$inferSelect)[]
}

type AddToStateFunctionType = (category: typeof expenseCategory.$inferSelect) => void

type RemoveFromStateFunctionType = (category: string) => void

type CategoriesContextType = [CategoriesContextValueType, {
	addToState: AddToStateFunctionType,
	removeFromState: RemoveFromStateFunctionType
}]

const defaultCategoriesContext: CategoriesContextValueType = {
	categories: []
}

const CategoriesContext = createContext(
	[
		defaultCategoriesContext,
		{
			addToState: () => {},
			removeFromState: () => {}
		}
	] as CategoriesContextType
)

export const ExpenseCategoriesProvider = ({children, initialCategories}: {
	children: ReactNode,
	initialCategories: (typeof expenseCategory.$inferSelect)[]
}) => {
	const [categoriesContext, setCategoriesContext] = useState<CategoriesContextValueType>({
		...defaultCategoriesContext,
		categories: initialCategories
	})

	const addToState = (category: typeof expenseCategory.$inferSelect) => {
		setCategoriesContext({...categoriesContext, categories: [category, ...categoriesContext.categories]})
	}

	const removeFromState = (categoryId: string) => {
		setCategoriesContext({
			...categoriesContext,
			categories: categoriesContext.categories.filter(category => category.id !== categoryId)
		})
	}

	const updateEntireState = (categories: (typeof expenseCategory.$inferSelect)[]) => {
		setCategoriesContext({...categoriesContext, categories})
	}

	const supabase = createClient()

	const supabaseSubscribeConfig = {
		event: '*',
		schema: 'public',
		table: 'expense_category'
	}

	useEffect(() => {
		const channel = supabase
			.channel('EXPENSE:CATEGORIES::ALL')
			.on(
				'postgres_changes',
				supabaseSubscribeConfig as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
				(payload) => {
					switch (payload.eventType) {
					case 'INSERT':
						startTransition(async () => {
							try {
								const categories = await getExpenseCategoriesFromDB()
								if (categories) updateEntireState(categories)
							} catch (error: any) {}
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
		<CategoriesContext.Provider value={
			[categoriesContext, {
				addToState, removeFromState
			}]
		}>
			{children}
		</CategoriesContext.Provider>
	)
}

export const useExpenseCategories = () => {
	const context = useContext(CategoriesContext)

	if (!context) {
		throw new Error('useExpenseCategories must be used within a ExpenseCategoriesProvider')
	}

	return {
		categories: context[0].categories,
		addToState: context[1].addToState,
		removeFromState: context[1].removeFromState
	}
}
