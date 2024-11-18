import {numeric, pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {expenseCategory, expenseVendor} from '@/db/schema'

export const expense = pgTable('expense', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: uuid('user_id').notNull(),
	categoryId: uuid('category_id').notNull(),
	vendorId: uuid('vendor_id').notNull(),
	particular: varchar('particular').notNull(),
	note: varchar('note'),
	amount: numeric('amount').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => sql`now()`)
})

export const expenseRelations = relations(expense, ({one}) => ({
	category: one(expenseCategory, {
		fields: [expense.categoryId],
		references: [expenseCategory.id]
	}),
	vendor: one(expenseVendor, {
		fields: [expense.vendorId],
		references: [expenseVendor.id]
	})
}))

export const ExpenseInsert = createInsertSchema(expense)
export const ExpenseSelect = createSelectSchema(expense)
