'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {incomeCategory, IncomeCategoryInsert} from '@/db/schema'

export const addIncomeCategoryToDB = async (categoryValues: (typeof incomeCategory.$inferInsert)) => {
	const params = IncomeCategoryInsert.parse(categoryValues)
	return db.insert(incomeCategory).values(params).returning()
}

export const getIncomeCategoriesFromDB = async (userId: string) => {
	return db.query.incomeCategory.findMany({
		where: eq(incomeCategory.userId, userId)
	})
}

export const getIncomeCategoryByIdFromDB = async (categoryId: string) => {
	return db.query.incomeCategory.findFirst({
		where: eq(incomeCategory.id, categoryId)
	})
}
