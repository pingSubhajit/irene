import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle
} from '@/components/ui/credenza'
import {expense as expenseModel, expenseCategory, expenseVendor} from '@/db/schema'
import {Receipt} from 'lucide-react'
import {defaultCurrencyFormat, formatDate, getInitialsFromName} from '@/lib/utils'
import {DateTime} from 'luxon'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Separator} from '@/components/ui/separator'

const SingleExpenseDialog = ({open, setOpen, expense}: {
	open: boolean,
	setOpen: (isOpen: boolean) => void,
	expense: (typeof expenseModel.$inferSelect) & {vendor: (typeof expenseVendor.$inferSelect), category: (typeof expenseCategory.$inferSelect)}
}) => {
	if (!expense || !expense.id) return null

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle className="flex items-center justify-center gap-1">
						<Receipt className="w-5 h-5 opacity-80"/>
						Expense details
					</CredenzaTitle>
					<CredenzaDescription>
						You paid {defaultCurrencyFormat.format(parseFloat(expense.amount))} to {expense.vendor.name} on {formatDate(expense.createdAt!, DateTime.DATE_FULL)}.
					</CredenzaDescription>
				</CredenzaHeader>
				<CredenzaBody className="mt-8">
					<div className="flex flex-col items-center gap-6">
						<div>
							<Avatar className="w-24 h-24">
								{expense.vendor.logo && <AvatarImage src={expense.vendor.logo}/>}
								<AvatarFallback>{getInitialsFromName(expense.vendor.name)}</AvatarFallback>
							</Avatar>
							<p className="mt-2 text-center text-xs opacity-80">paid to</p>
							<h3 className="text-xl font-medium truncate text-center">{expense.vendor.name}</h3>
						</div>

						<div>
							<p className="text-6xl font-Cirka text-center">{defaultCurrencyFormat.format(parseFloat(expense.amount))}</p>
							<p className="mt-2 text-lg opacity-80 text-center">{expense.particular}</p>
							{expense.note && <p className="mt-2 opacity-60 text-sm text-center">{expense.note}</p>}

							<div className="mt-2 flex justify-center gap-4 items-center">
								<div className="flex items-center gap-1">
									<div
										className="w-3 h-3 rounded-[2px]"
										style={{backgroundColor: `#${expense.category.color}`}}
									/>
									<p className="text-sm opacity-80 text-right">{expense.category.name}</p>
								</div>
								<Separator orientation="vertical" className="h-4" />
								<p className="text-sm opacity-80 text-right">{formatDate(expense.createdAt!)}</p>
							</div>
						</div>
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	)
}

export default SingleExpenseDialog
