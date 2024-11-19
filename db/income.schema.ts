import {numeric, pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {incomeCategory, incomeVendor} from '@/db/schema'

export const income = pgTable('income', {
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

export const incomeRelations = relations(income, ({one}) => ({
	category: one(incomeCategory, {
		fields: [income.categoryId],
		references: [incomeCategory.id]
	}),
	vendor: one(incomeVendor, {
		fields: [income.vendorId],
		references: [incomeVendor.id]
	})
}))

export const IncomeInsert = createInsertSchema(income)
export const IncomeSelect = createSelectSchema(income)
