'use client'

import {createContext, ReactNode, useContext, useState} from 'react'
import CreateExpenseDialog from '@/components/dialogs/CreateExpenseDialog'
import {useExpenseVendors} from '@/components/providers/expense-vendors-provider'
import {useExpenseCategories} from '@/components/providers/expense-categories-provider'
import CreateExpenseVendorDialog from '@/components/dialogs/CreateExpenseVendorDialog'
import CreateExpenseCategoryDialog from '@/components/dialogs/CreateExpenseCategoryDialog'

type DialogContextValueType = {
	isCreateExpenseOpen: boolean,
	isCreateExpenseVendorOpen: boolean,
	isCreateExpenseCategoryOpen: boolean
}

type UpdateStateFunctionType = (isOpen: boolean) => void

export type DialogContextType = [DialogContextValueType, {
	setIsCreateExpenseOpen: UpdateStateFunctionType,
	setIsCreateExpenseVendorOpen: UpdateStateFunctionType,
	setIsCreateExpenseCategoryOpen: UpdateStateFunctionType
}]

const defaultDialogContext: DialogContextValueType = {
	isCreateExpenseOpen: false,
	isCreateExpenseVendorOpen: false,
	isCreateExpenseCategoryOpen: false
}

const DialogContext = createContext(
	[
		defaultDialogContext,
		{
			setIsCreateExpenseOpen: () => {},
			setIsCreateExpenseVendorOpen: () => {},
			setIsCreateExpenseCategoryOpen: () => {}
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

	const setIsCreateExpenseCategoryOpen = (isOpen: boolean) => {
		setDialogContext({...dialogContext, isCreateExpenseCategoryOpen: isOpen})
	}

	return (
		<DialogContext.Provider value={
			[dialogContext, {
				setIsCreateExpenseOpen,
				setIsCreateExpenseVendorOpen: () => {},
				setIsCreateExpenseCategoryOpen: () => {}
			}]
		}>
			{children}

			<CreateExpenseDialog
				open={dialogContext.isCreateExpenseOpen}
				setOpen={setIsCreateExpenseOpen}
				setCreateExpenseVendorOpen={setIsCreateExpenseVendorOpen}
				setCreateExpenseCategoryOpen={setIsCreateExpenseCategoryOpen}
				expenseVendors={expenseVendors}
				expenseCategories={expenseCategories}
			/>

			<CreateExpenseVendorDialog
				open={dialogContext.isCreateExpenseVendorOpen}
				setOpen={setIsCreateExpenseVendorOpen}
			/>

			<CreateExpenseCategoryDialog
				open={dialogContext.isCreateExpenseCategoryOpen}
				setOpen={setIsCreateExpenseCategoryOpen}
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

export const useCreateExpenseCategoryDialog = () => {
	const context = useContext(DialogContext)

	if (!context) {
		throw new Error('useDialogs must be used within a DialogsProvider')
	}

	return {isCreateExpenseCategoryDialogOpen: context[0].isCreateExpenseCategoryOpen, setIsCreateExpenseCategoryDialogOpen: context[1].setIsCreateExpenseCategoryOpen}
}
