'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {expenseCategory, ExpenseCategoryInsert} from '@/db/schema'

export const addExpenseCategoryToDB = async (categoryValues: (typeof expenseCategory.$inferInsert)) => {
	const params = ExpenseCategoryInsert.parse(categoryValues)
	return db.insert(expenseCategory).values(params).returning()
}

export const getExpenseCategoriesFromDB = async (userId: string) => {
	return db.query.expenseCategory.findMany({
		where: eq(expenseCategory.userId, userId)
	})
}
