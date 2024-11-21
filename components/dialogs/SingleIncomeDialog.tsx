import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle
} from '@/components/ui/credenza'
import {income as incomeModel, incomeCategory, incomeVendor} from '@/db/schema'
import {Loader2, Receipt, Trash} from 'lucide-react'
import {defaultCurrencyFormat, formatDate, getInitialsFromName} from '@/lib/utils'
import {DateTime} from 'luxon'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Separator} from '@/components/ui/separator'
import {toast} from 'sonner'
import {useState} from 'react'
import {removeIncomeByIdFromDB} from '@/lib/income.methods'
import {Button} from '@/components/ui/button'

const SingleIncomeDialog = ({open, setOpen, income}: {
	open: boolean,
	setOpen: (isOpen: boolean) => void,
	income: (typeof incomeModel.$inferSelect) & {vendor: (typeof incomeVendor.$inferSelect), category: (typeof incomeCategory.$inferSelect)}
}) => {
	const [isDeleting, setIsDeleting] = useState(false)
	if (!income || !income.id) return null

	const onDelete = async () => {
		try {
			setIsDeleting(true)
			await removeIncomeByIdFromDB(income.id)
			setOpen(false)
			toast.success('Income deleted successfully!')
		} catch (error: any) {
			toast.error(error.message || 'Could not delete the Income. Please try again later.')
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle className="flex items-center justify-center gap-1">
						<Receipt className="w-5 h-5 opacity-80"/>
						Income details
					</CredenzaTitle>
					<CredenzaDescription className="text-center">
						You got {defaultCurrencyFormat.format(parseFloat(income.amount))} from {income.vendor.name} on {formatDate(income.createdAt!, DateTime.DATE_FULL)}.
					</CredenzaDescription>
				</CredenzaHeader>
				<CredenzaBody className="mt-8">
					<div className="flex flex-col items-center gap-6">
						<div>
							<Avatar className="w-24 h-24">
								{income.vendor.logo && <AvatarImage src={income.vendor.logo}/>}
								<AvatarFallback>{getInitialsFromName(income.vendor.name)}</AvatarFallback>
							</Avatar>
							<p className="mt-2 text-center text-xs opacity-80">received from</p>
							<h3 className="text-xl font-medium truncate text-center">{income.vendor.name}</h3>
						</div>

						<div>
							<p className="text-6xl font-Cirka text-center">{defaultCurrencyFormat.format(parseFloat(income.amount))}</p>
							<p className="mt-2 text-lg opacity-80 text-center">{income.particular}</p>
							{income.note && <p className="mt-2 opacity-60 text-sm text-center">{income.note}</p>}

							<div className="mt-2 flex justify-center gap-4 items-center">
								<div className="flex items-center gap-1">
									<div
										className="w-3 h-3 rounded-[2px]"
										style={{backgroundColor: `#${income.category.color}`}}
									/>
									<p className="text-sm opacity-80 text-right">{income.category.name}</p>
								</div>
								<Separator orientation="vertical" className="h-4"/>
								<p className="text-sm opacity-80 text-right">{formatDate(income.createdAt!)}</p>
							</div>
						</div>

						<div className="w-full flex gap-2 mt-4">
							<Button size="sm" className="w-full" onClick={() => setOpen(false)}>Understood</Button>
							<Button size="sm" className="w-24" variant="destructive" onClick={onDelete} disabled={isDeleting}>
								{isDeleting ? <Loader2 className="w-6 h-6 animate-spin"/> : <Trash className="w-4 h-4"/>}
							</Button>
						</div>
					</div>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	)
}

export default SingleIncomeDialog
