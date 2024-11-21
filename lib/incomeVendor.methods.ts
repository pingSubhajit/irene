'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {incomeVendor, IncomeVendorInsert} from '@/db/schema'
import {createClient} from '@/utils/supabase/server'

export const addIncomeVendorToDB = async (vendorValues: (typeof incomeVendor.$inferInsert)) => {
	const params = IncomeVendorInsert.parse(vendorValues)
	return db.insert(incomeVendor).values(params).returning()
}

export const getIncomeVendorsFromDB = async () => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.incomeVendor.findMany({
		where: eq(incomeVendor.userId, user!.id)
	})
}

export const getIncomeVendorByIdFromDB = async (vendorId: string) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.incomeVendor.findFirst({
		where: (incomeVendor, {eq, and}) => and(
			eq(incomeVendor.id, vendorId),
			eq(incomeVendor.userId, user!.id)
		)
	})
}

export type LogoResult = {
	domain: string
	logo_url: string
	name: string
}

export const searchIcons = async (searchTerm: string): Promise<LogoResult[]> => {
	const response = await fetch(`https://api.logo.dev/search?q=${searchTerm}`, {
		headers: {
			'Authorization': `Bearer ${process.env.LOGO_DEV_SECRET}`
		}
	})
	const data = await response.json()

	return data
}
