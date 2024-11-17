import {db} from '@/db/db'
import {eq} from 'drizzle-orm'
import {expense, ExpenseInsert} from '@/db/schema'

export const addExpenseToDB = async (expenseValues: (typeof expense.$inferInsert)) => {
	const params = ExpenseInsert.parse(expenseValues)
	return db.insert(expense).values(params).returning()
}

export const getExpensesFromDB = async (userId: string) => {
	return db.query.expense.findMany({
		where: eq(expense.userId, userId)
	})
}
