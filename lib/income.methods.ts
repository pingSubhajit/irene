'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {income, IncomeInsert} from '@/db/schema'

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
	return db.query.income.findFirst({
		where: eq(income.id, incomeId),
		with: {
			category: true,
			vendor: true
		}
	})
}
