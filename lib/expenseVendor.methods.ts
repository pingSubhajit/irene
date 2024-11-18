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
