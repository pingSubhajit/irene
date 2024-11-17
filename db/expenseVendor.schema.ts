import {pgTable, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {expense} from '@/db/expense.schema'

export const expenseVendor = pgTable('expense_vendor', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: uuid('user_id').notNull(),
	name: varchar('name').notNull(),
	logo: varchar('logo')
})

export const expenseVendorRelations = relations(expense, ({many}) => ({
	expenses: many(expense)
}))

export const ExpenseVendorInsert = createInsertSchema(expenseVendor)
export const ExpenseVendorSelect = createSelectSchema(expenseVendor)
