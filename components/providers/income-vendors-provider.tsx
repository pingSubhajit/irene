'use client'

import {createContext, ReactNode, startTransition, useContext, useEffect, useState} from 'react'
import {createClient} from '@/utils/supabase/client'
import {
	REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
	RealtimePostgresChangesFilter
} from '@supabase/realtime-js/src/RealtimeChannel'
import {expenseVendor, incomeVendor} from '@/db/schema'
import {getIncomeVendorsFromDB} from '@/lib/incomeVendor.methods'

type VendorsContextValueType = {
	vendors: (typeof incomeVendor.$inferSelect)[]
}

type AddToStateFunctionType = (vendor: typeof incomeVendor.$inferSelect) => void

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

export const IncomeVendorsProvider = ({children, initialVendors}: {
	children: ReactNode,
	initialVendors: (typeof incomeVendor.$inferSelect)[]
}) => {
	const [vendorsContext, setVendorsContext] = useState<VendorsContextValueType>({
		...defaultVendorsContext,
		vendors: initialVendors
	})

	const addToState = (vendor: typeof incomeVendor.$inferSelect) => {
		setVendorsContext({...vendorsContext, vendors: [vendor, ...vendorsContext.vendors]})
	}

	const removeFromState = (vendorId: string) => {
		setVendorsContext({
			...vendorsContext,
			vendors: vendorsContext.vendors.filter(vendor => vendor.id !== vendorId)
		})
	}

	const updateEntireState = (vendors: (typeof expenseVendor.$inferSelect)[]) => {
		setVendorsContext({...vendorsContext, vendors})
	}

	const supabase = createClient()

	const supabaseSubscribeConfig = {
		event: '*',
		schema: 'public',
		table: 'income_vendor'
	}

	useEffect(() => {
		const channel = supabase
			.channel('INCOME:VENDORS::ALL')
			.on(
				'postgres_changes',
				supabaseSubscribeConfig as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
				(payload) => {
					switch (payload.eventType) {
					case 'INSERT':
						startTransition(async () => {
							try {
								const vendors = await getIncomeVendorsFromDB()
								if (vendors) updateEntireState(vendors)
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
		<VendorsContext.Provider value={
			[vendorsContext, {
				addToState, removeFromState
			}]
		}>
			{children}
		</VendorsContext.Provider>
	)
}

export const useIncomeVendors = () => {
	const context = useContext(VendorsContext)

	if (!context) {
		throw new Error('useIncomeVendors must be used within a IncomeVendorsProvider')
	}

	return {
		vendors: context[0].vendors,
		addToState: context[1].addToState,
		removeFromState: context[1].removeFromState
	}
}
