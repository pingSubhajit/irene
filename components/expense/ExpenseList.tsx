'use client'

import {expense as expenseModel} from '@/db/expense.schema'
import {expenseCategory} from '@/db/expenseCategory.schema'
import {expenseVendor} from '@/db/expenseVendor.schema'
import ExpenseCard from '@/components/expense/ExpenseCard'
import {cn} from '@/lib/utils'
import {useCreateExpenseDialog} from '@/components/providers/dialog-provider'
import {Button} from '@/components/ui/button'

const ExpenseList = ({expenses, className}: {
	expenses: ((typeof expenseModel.$inferSelect) & {
		category: (typeof expenseCategory.$inferSelect)} & {
		vendor: (typeof expenseVendor.$inferSelect)
	})[],
	className?: string
}) => {
	const {setIsCreateExpenseDialogOpen} = useCreateExpenseDialog()

	return (
		<div className={cn('', className)}>
			<Button
				className="bg-neutral-950 text-neutral-50 border border-dashed h-auto w-full p-6
				hover:border-emerald-400 hover:bg-neutral-950"
				onClick={() => setIsCreateExpenseDialogOpen(true)}
			>
				add new expense
			</Button>

			{expenses.map(expense => <ExpenseCard expense={expense} key={expense.id}/>)}
		</div>
	)
}

export default ExpenseList
