'use client'

import {income as incomeModel, incomeCategory, incomeVendor} from '@/db/schema'
import IncomeCard from '@/components/income/IncomeCard'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'

const IncomeList = ({incomes, className}: {
	incomes: ((typeof incomeModel.$inferSelect) & {
		category: (typeof incomeCategory.$inferSelect)} & {
		vendor: (typeof incomeVendor.$inferSelect)
	})[],
	className?: string
}) => {
	// const {setIsCreateExpenseDialogOpen} = useCreateExpenseDialog()

	return (
		<div className={cn('', className)}>
			<Button
				className="bg-neutral-950 text-neutral-50 border border-dashed h-auto w-full p-6
				hover:border-emerald-400 hover:bg-neutral-950"
				// onClick={() => setIsCreateExpenseDialogOpen(true)}
			>
				add new income
			</Button>

			{incomes.map(income => <IncomeCard income={income} key={income.id}/>)}
		</div>
	)
}

export default IncomeList
