'use client'

import {createContext, ReactNode, useContext, useState} from 'react'
import CreateExpenseDialog from '@/components/dialogs/CreateExpenseDialog'
import {useExpenseVendors} from '@/components/providers/expense-vendors-provider'
import {useExpenseCategories} from '@/components/providers/expense-categories-provider'
import CreateExpenseVendorDialog from '@/components/dialogs/CreateExpenseVendorDialog'

type DialogContextValueType = {
	isCreateExpenseOpen: boolean,
	isCreateExpenseVendorOpen: boolean
}

type UpdateStateFunctionType = (isOpen: boolean) => void

export type DialogContextType = [DialogContextValueType, {
	setIsCreateExpenseOpen: UpdateStateFunctionType,
	setIsCreateExpenseVendorOpen: UpdateStateFunctionType
}]

const defaultDialogContext: DialogContextValueType = {
	isCreateExpenseOpen: false,
	isCreateExpenseVendorOpen: false
}

const DialogContext = createContext(
	[
		defaultDialogContext,
		{
			setIsCreateExpenseOpen: () => {},
			setIsCreateExpenseVendorOpen: () => {}
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

	const setIsCreateExpenseVendorOpen = (isOpen: boolean) => {
		setDialogContext({...dialogContext, isCreateExpenseVendorOpen: isOpen})
	}

	return (
		<DialogContext.Provider value={
			[dialogContext, {
				setIsCreateExpenseOpen,
				setIsCreateExpenseVendorOpen: () => {}
			}]
		}>
			{children}

			<CreateExpenseDialog
				open={dialogContext.isCreateExpenseOpen}
				setOpen={setIsCreateExpenseOpen}
				setCreateExpenseVendorOpen={setIsCreateExpenseVendorOpen}
				expenseVendors={expenseVendors}
				expenseCategories={expenseCategories}
			/>

			<CreateExpenseVendorDialog
				open={dialogContext.isCreateExpenseVendorOpen}
				setOpen={setIsCreateExpenseVendorOpen}
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

export const useCreateExpenseVendorDialog = () => {
	const context = useContext(DialogContext)

	if (!context) {
		throw new Error('useDialogs must be used within a DialogsProvider')
	}

	return {isCreateExpenseVendorDialogOpen: context[0].isCreateExpenseVendorOpen, setIsCreateExpenseVendorDialogOpen: context[1].setIsCreateExpenseVendorOpen}
}
