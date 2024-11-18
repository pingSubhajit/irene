'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {expenseVendor, ExpenseVendorInsert} from '@/db/schema'

export const addExpenseVendorToDB = async (vendorValues: (typeof expenseVendor.$inferInsert)) => {
	const params = ExpenseVendorInsert.parse(vendorValues)
	return db.insert(expenseVendor).values(params).returning()
}

export const getExpenseVendorsFromDB = async (userId: string) => {
	return db.query.expenseVendor.findMany({
		where: eq(expenseVendor.userId, userId)
	})
}

export const getExpenseVendorByIdFromDB = async (vendorId: string) => {
	return db.query.expenseVendor.findFirst({
		where: eq(expenseVendor.id, vendorId)
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
