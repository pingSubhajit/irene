'use server'

import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {expense, ExpenseInsert} from '@/db/schema'
import {createClient} from '@/utils/supabase/server'

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
	const supabase = await createClient()
	const {data: {user}} = await supabase.auth.getUser()

	return db.query.expense.findFirst({
		where: (income, {eq, and}) => and(
			eq(expense.id, expenseId),
			eq(expense.userId, user!.id)
		),
		with: {
			category: true,
			vendor: true
		}
	})
}
