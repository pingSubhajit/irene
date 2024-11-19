'use client'

import {createContext, ReactNode, startTransition, useContext, useEffect, useState} from 'react'
import {incomeCategory} from '@/db/schema'
import {createClient} from '@/utils/supabase/client'
import {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
	RealtimePostgresChangesFilter
} from '@supabase/realtime-js/src/RealtimeChannel'
import {getIncomeCategoryByIdFromDB} from '@/lib/incomeCategory.methods'

type CategoriesContextValueType = {
	categories: (typeof incomeCategory.$inferSelect)[]
}

type AddToStateFunctionType = (category: typeof incomeCategory.$inferSelect) => void

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

export const IncomeCategoriesProvider = ({children, initialCategories}: {
	children: ReactNode,
	initialCategories: (typeof incomeCategory.$inferSelect)[]
}) => {
	const [categoriesContext, setCategoriesContext] = useState<CategoriesContextValueType>({
		...defaultCategoriesContext,
		categories: initialCategories
	})

	const addToState = (category: typeof incomeCategory.$inferSelect) => {
		setCategoriesContext({...categoriesContext, categories: [category, ...categoriesContext.categories]})
	}

	const removeFromState = (categoryId: string) => {
		setCategoriesContext({
			...categoriesContext,
			categories: categoriesContext.categories.filter(category => category.id !== categoryId)
		})
	}

	const supabase = createClient()

	const supabaseSubscribeConfig = {
		event: '*',
		schema: 'public',
		table: 'income_category'
	}

	useEffect(() => {
		const channel = supabase
			.channel('INCOME:CATEGORIES::ALL')
			.on(
				'postgres_changes',
				supabaseSubscribeConfig as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
				(payload) => {
					switch (payload.eventType) {
					case 'INSERT':
						startTransition(async () => {
							const category = await getIncomeCategoryByIdFromDB(payload.new.id)
							addToState(category as (typeof incomeCategory.$inferSelect))
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

export const useIncomeCategories = () => {
	const context = useContext(CategoriesContext)

	if (!context) {
		throw new Error('useIncomeCategories must be used within a IncomeCategoriesProvider')
	}

	return {
		categories: context[0].categories,
		addToState: context[1].addToState,
		removeFromState: context[1].removeFromState
	}
}
