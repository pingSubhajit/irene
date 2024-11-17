import {pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {expense} from '@/db/expense.schema'

export const expenseCategory = pgTable('expense_category', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: uuid('user_id').notNull(),
	name: varchar('name').notNull(),
	description: varchar('description'),
	color: varchar('color').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => sql`now()`)
})

export const expenseCategoryRelations = relations(expense, ({many}) => ({
	expenses: many(expense)
}))

export const ExpenseCategoryInsert = createInsertSchema(expenseCategory)
export const ExpenseCategorySelect = createSelectSchema(expenseCategory)
