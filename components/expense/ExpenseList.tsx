'use client'

import {expense as expenseModel, expenseCategory, expenseVendor} from '@/db/schema'
import ExpenseCard from '@/components/expense/ExpenseCard'
import {cn} from '@/lib/utils'
import {useCreateExpenseDialog} from '@/components/providers/dialog-provider'
import {Button} from '@/components/ui/button'
import NotFound from '@/components/utilities/NotFound'

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

			{!expenses.length && <NotFound className="mt-16 mx-auto" text="no expenses found" description="there are no expenses in your account. good job as of yet" />}
		</div>
	)
}

export default ExpenseList
