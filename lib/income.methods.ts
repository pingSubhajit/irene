'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {income, IncomeInsert} from '@/db/schema'
import {createClient} from '@/utils/supabase/server'

export const addIncomeToDB = async (incomeValues: (typeof income.$inferInsert)) => {
	const params = IncomeInsert.parse(incomeValues)
	return db.insert(income).values(params).returning()
}

export const getIncomesFromDB = async (userId: string) => {
	return db.query.income.findMany({
		where: eq(income.userId, userId),
		with: {
			category: true,
			vendor: true
		}
	})
}

export const getIncomeByIdFromDB = async (incomeId: string) => {
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.income.findFirst({
		where: (income, {eq, and}) => and(
			eq(income.id, incomeId),
			eq(income.userId, user!.id)
		),
		with: {
			category: true,
			vendor: true
		}
	})
}
