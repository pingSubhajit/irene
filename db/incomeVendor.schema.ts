import {pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'

export const incomeVendor = pgTable('income_vendor', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: uuid('user_id').notNull(),
	name: varchar('name').notNull(),
	logo: varchar('logo'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => sql`now()`)
})

export const IncomeVendorInsert = createInsertSchema(incomeVendor)
export const IncomeVendorSelect = createSelectSchema(incomeVendor)
