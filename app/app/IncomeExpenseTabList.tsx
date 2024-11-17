'use client'

import {TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Button} from '@/components/ui/button'
import {Plus} from 'lucide-react'
import {useCreateExpenseDialog} from '@/components/providers/dialog-provider'

const IncomeExpenseTabList = () => {
	const {setIsCreateExpenseDialogOpen} = useCreateExpenseDialog()

	return (
		<TabsList className="w-full">
			<TabsTrigger value="expense" className="w-1/2 group flex items-center">
				<span>Expenses</span>
				<Button
					className="ml-1 h-7 w-7 px-0 scale-0 group-data-[state=active]:scale-100 transition"
					asChild
					variant="ghost"
					size="sm"
					onClick={() => setIsCreateExpenseDialogOpen(true)}
				>
					<div>
						<Plus className="w-4 h-4" />
					</div>
				</Button>
			</TabsTrigger>
			<TabsTrigger value="income" className="w-1/2 group flex items-center">
				<span>Incomes</span>
				<Button className="ml-1 h-7 w-7 px-0 scale-0 group-data-[state=active]:scale-100 transition" asChild variant="ghost" size="sm">
					<div>
						<Plus className="w-4 h-4" />
					</div>
				</Button>
			</TabsTrigger>
		</TabsList>
	)
}

export default IncomeExpenseTabList
