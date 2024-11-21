'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {expenseVendor, ExpenseVendorInsert} from '@/db/schema'
import {createClient} from '@/utils/supabase/server'

export const addExpenseVendorToDB = async (vendorValues: (typeof expenseVendor.$inferInsert)) => {
	const params = ExpenseVendorInsert.parse(vendorValues)
	return db.insert(expenseVendor).values(params).returning()
}

export const getExpenseVendorsFromDB = async () => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.expenseVendor.findMany({
		where: eq(expenseVendor.userId, user!.id)
	})
}

export const getExpenseVendorByIdFromDB = async (vendorId: string) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.expenseVendor.findFirst({
		where: (expenseVendor, {eq, and}) => and(
			eq(expenseVendor.id, vendorId),
			eq(expenseVendor.userId, user!.id)
		)
	})
}

export type LogoResult = {
	domain: string
	logo_url: string
	name: string
}

export const searchLogos = async (searchTerm: string): Promise<LogoResult[]> => {
	const response = await fetch(`https://api.logo.dev/search?q=${searchTerm}`, {
		headers: {
			'Authorization': `Bearer ${process.env.LOGO_DEV_SECRET}`
		}
	})
	const data = await response.json()

	return data
}
