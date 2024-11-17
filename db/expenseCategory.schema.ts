import {pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'

export const expenseCategory = pgTable('expense_category', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: uuid('user_id').notNull(),
	name: varchar('name').notNull(),
	description: varchar('description'),
	color: varchar('color').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => sql`now()`)
})

export const ExpenseCategoryInsert = createInsertSchema(expenseCategory)
export const ExpenseCategorySelect = createSelectSchema(expenseCategory)
