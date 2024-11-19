'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {incomeVendor, IncomeVendorInsert} from '@/db/schema'

export const addIncomeVendorToDB = async (vendorValues: (typeof incomeVendor.$inferInsert)) => {
	const params = IncomeVendorInsert.parse(vendorValues)
	return db.insert(incomeVendor).values(params).returning()
}

export const getIncomeVendorsFromDB = async (userId: string) => {
	return db.query.incomeVendor.findMany({
		where: eq(incomeVendor.userId, userId)
	})
}

export const getIncomeVendorByIdFromDB = async (vendorId: string) => {
	return db.query.incomeVendor.findFirst({
		where: eq(incomeVendor.id, vendorId)
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
