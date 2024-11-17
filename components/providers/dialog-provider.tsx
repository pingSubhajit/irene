'use client'

import {createContext, ReactNode, useContext, useMemo, useState} from 'react'
import CreateExpenseDialog from '@/components/dialogs/CreateExpenseDialog'
import {expenseVendor} from '@/db/expenseVendor.schema'
import {expenseCategory} from '@/db/schema'

type DialogContextValueType = {
	isCreateExpenseOpen: boolean
}

type UpdateStateFunctionType = (isOpen: boolean) => void

export type DialogContextType = [DialogContextValueType, {
	setIsCreateExpenseOpen: UpdateStateFunctionType
}]

const defaultDialogContext: DialogContextValueType = {
	isCreateExpenseOpen: false
}

const DialogContext = createContext(
	[
		defaultDialogContext,
		{
			setIsCreateExpenseOpen: () => {}
		}
	] as DialogContextType
)

export const DialogsProvider = ({children, expenseVendors, expenseCategories}: {
	children: ReactNode,
	expenseVendors: (typeof expenseVendor.$inferInsert)[],
	expenseCategories: (typeof expenseCategory.$inferInsert)[]
}) => {
	const [dialogContext, setDialogContext] = useState<DialogContextValueType>(defaultDialogContext)

	const setIsCreateExpenseOpenUnMemoized = (isOpen: boolean) => {
		setDialogContext({...dialogContext, isCreateExpenseOpen: isOpen})
	}

	const setIsCreateExpenseOpen = useMemo(() => setIsCreateExpenseOpenUnMemoized, [dialogContext.isCreateExpenseOpen])

	return (
		<DialogContext.Provider value={
			[dialogContext, {
				setIsCreateExpenseOpen
			}]
		}>
			{children}

			<CreateExpenseDialog
				open={dialogContext.isCreateExpenseOpen}
				setOpen={setIsCreateExpenseOpen}
				expenseVendors={expenseVendors}
				expenseCategories={expenseCategories}
			/>
		</DialogContext.Provider>
	)
}

export const useCreateExpenseDialog = () => {
	const context = useContext(DialogContext)

	if (!context) {
		throw new Error('useDialogs must be used within a DialogsProvider')
	}

	return {isCreateExpenseDialogOpen: context[0].isCreateExpenseOpen, setIsCreateExpenseDialogOpen: context[1].setIsCreateExpenseOpen}
}
