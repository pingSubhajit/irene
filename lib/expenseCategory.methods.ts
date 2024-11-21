'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {expenseCategory, ExpenseCategoryInsert} from '@/db/schema'
import {createClient} from '@/utils/supabase/server'

export const addExpenseCategoryToDB = async (categoryValues: (typeof expenseCategory.$inferInsert)) => {
	const params = ExpenseCategoryInsert.parse(categoryValues)
	return db.insert(expenseCategory).values(params).returning()
}

export const getExpenseCategoriesFromDB = async (userId: string) => {
	return db.query.expenseCategory.findMany({
		where: eq(expenseCategory.userId, userId)
	})
}

export const getExpenseCategoryByIdFromDB = async (categoryId: string) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.expenseCategory.findFirst({
		where: (expenseCategory, {eq, and}) => and(
			eq(expenseCategory.id, categoryId),
			eq(expenseCategory.userId, user!.id)
		)
	})
}
