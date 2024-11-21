'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {incomeCategory, IncomeCategoryInsert} from '@/db/schema'
import {createClient} from '@/utils/supabase/server'

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
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.incomeCategory.findFirst({
		where: (incomeCategory, {eq, and}) => and(
			eq(incomeCategory.id, categoryId),
			eq(incomeCategory.userId, user!.id)
		)
	})
}
