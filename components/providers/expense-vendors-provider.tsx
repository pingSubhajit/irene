'use client'

import {createContext, ReactNode, startTransition, useContext, useEffect, useState} from 'react'
import {expenseVendor} from '@/db/expenseVendor.schema'
import {createClient} from '@/utils/supabase/client'
import {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
	RealtimePostgresChangesFilter
} from '@supabase/realtime-js/src/RealtimeChannel'
import {getExpenseVendorByIdFromDB} from '@/lib/expenseVendor.methods'

type VendorsContextValueType = {
	vendors: (typeof expenseVendor.$inferSelect)[]
}

type AddToStateFunctionType = (vendor: typeof expenseVendor.$inferSelect) => void

type RemoveFromStateFunctionType = (vendorId: string) => void

type VendorsContextType = [VendorsContextValueType, {
	addToState: AddToStateFunctionType,
	removeFromState: RemoveFromStateFunctionType
}]

const defaultVendorsContext: VendorsContextValueType = {
	vendors: []
}

const VendorsContext = createContext(
	[
		defaultVendorsContext,
		{
			addToState: () => {},
			removeFromState: () => {}
		}
	] as VendorsContextType
)

export const ExpenseVendorsProvider = ({children, initialVendors}: {
	children: ReactNode,
	initialVendors: (typeof expenseVendor.$inferSelect)[]
}) => {
	const [vendorsContext, setVendorsContext] = useState<VendorsContextValueType>({
		...defaultVendorsContext,
		vendors: initialVendors
	})

	const addToState = (vendor: typeof expenseVendor.$inferSelect) => {
		setVendorsContext({...vendorsContext, vendors: [vendor, ...vendorsContext.vendors]})
	}

	const removeFromState = (vendorId: string) => {
		setVendorsContext({
			...vendorsContext,
			vendors: vendorsContext.vendors.filter(vendor => vendor.id !== vendorId)
		})
	}

	const supabase = createClient()

	const supabaseSubscribeConfig = {
		event: '*',
		schema: 'public',
		table: 'expense_vendor'
	}

	useEffect(() => {
		const channel = supabase
			.channel('VENDORS::ALL')
			.on(
				'postgres_changes',
				supabaseSubscribeConfig as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
				(payload) => {
					switch (payload.eventType) {
					case 'INSERT':
						startTransition(async () => {
							const vendor = await getExpenseVendorByIdFromDB(payload.new.id)
							addToState(vendor as (typeof expenseVendor.$inferSelect))
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
		<VendorsContext.Provider value={
			[vendorsContext, {
				addToState, removeFromState
			}]
		}>
			{children}
		</VendorsContext.Provider>
	)
}

export const useExpenseVendors = () => {
	const context = useContext(VendorsContext)

	if (!context) {
		throw new Error('useExpenseVendors must be used within a ExpenseVendorsProvider')
	}

	return {
		vendors: context[0].vendors,
		addToState: context[1].addToState,
		removeFromState: context[1].removeFromState
	}
}
