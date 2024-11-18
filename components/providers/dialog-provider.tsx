'use client'

import {createContext, ReactNode, useContext, useState} from 'react'
import CreateExpenseDialog from '@/components/dialogs/CreateExpenseDialog'
import {useExpenseVendors} from '@/components/providers/expense-vendors-provider'
import {useExpenseCategories} from '@/components/providers/expense-categories-provider'

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

export const DialogsProvider = ({children}: {children: ReactNode}) => {
	const [dialogContext, setDialogContext] = useState<DialogContextValueType>(defaultDialogContext)
	const {vendors: expenseVendors} = useExpenseVendors()
	const {categories: expenseCategories} = useExpenseCategories()

	const setIsCreateExpenseOpen = (isOpen: boolean) => {
		setDialogContext({...dialogContext, isCreateExpenseOpen: isOpen})
	}

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
