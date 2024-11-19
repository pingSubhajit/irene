'use client'

import {income as incomeModel, incomeCategory, incomeVendor} from '@/db/schema'
import {Card, CardContent} from '@/components/ui/card'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {cn, defaultCurrencyFormat, formatDate, getInitialsFromName} from '@/lib/utils'

const IncomeCard = ({income, className}: {
	income: (typeof incomeModel.$inferSelect) & {
		category: (typeof incomeCategory.$inferSelect)} & {
		vendor: (typeof incomeVendor.$inferSelect)
	},
	className?: string
}) => {
	// const {setIsSingleExpenseDialogOpen} = useSingleExpenseDialog()

	return (
		// <button onClick={() => setIsSingleExpenseDialogOpen(true, expense as any)} className="w-full">
		<Card className={cn('border-none group relative', className)}>
			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-neutral-900 transition scale-x-125" />

			<CardContent className="py-4 px-0 relative z-10 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar className="w-12 h-12">
						<AvatarImage src={income.vendor.logo || ''} />
						<AvatarFallback>{getInitialsFromName(income.vendor.name)}</AvatarFallback>
					</Avatar>

					<div>
						<h3 className="text-lg text-left font-medium truncate">{income.vendor.name}</h3>
						<p className="text-sm opacity-80 truncate">{income.particular}</p>
						{income.note && <p className="text-xs truncate">{income.note}</p>}
					</div>
				</div>

				<div>
					<p className="text-2xl font-medium text-right font-Cirka">{defaultCurrencyFormat.format(parseFloat(income.amount))}</p>
					<div className="flex items-center justify-end gap-2">
						<p className="text-sm opacity-80 text-right">{formatDate(income.createdAt!)}</p>
						<div className="flex items-center gap-1">
							<div
								className="w-3 h-3 rounded-[2px]"
								style={{backgroundColor: `#${income.category.color}`}}
							/>
							<p className="text-sm opacity-80 text-right">{income.category.name}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
		// </button>
	)
}

export default IncomeCard
