'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {expense, ExpenseInsert} from '@/db/schema'

export const addExpenseToDB = async (expenseValues: (typeof expense.$inferInsert)) => {
	const params = ExpenseInsert.parse(expenseValues)
	return db.insert(expense).values(params).returning()
}

export const getExpensesFromDB = async (userId: string) => {
	return db.query.expense.findMany({
		where: eq(expense.userId, userId),
		with: {
			category: true,
			vendor: true
		}
	})
}

export const getExpenseByIdFromDB = async (expenseId: string) => {
	return db.query.expense.findFirst({
		where: eq(expense.id, expenseId),
		with: {
			category: true,
			vendor: true
		}
	})
}
