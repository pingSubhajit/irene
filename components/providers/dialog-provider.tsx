'use client'

import {createContext, ReactNode, useContext, useState} from 'react'
import CreateExpenseDialog from '@/components/dialogs/CreateExpenseDialog'
import {useExpenseVendors} from '@/components/providers/expense-vendors-provider'
import {useExpenseCategories} from '@/components/providers/expense-categories-provider'
import CreateExpenseVendorDialog from '@/components/dialogs/CreateExpenseVendorDialog'
import CreateExpenseCategoryDialog from '@/components/dialogs/CreateExpenseCategoryDialog'
import SingleExpenseDialog from '@/components/dialogs/SingleExpenseDialog'

type DialogContextValueType = {
	isCreateExpenseOpen: boolean,
	isCreateExpenseVendorOpen: boolean,
	isCreateExpenseCategoryOpen: boolean,
	isSingleExpenseOpen: {
		isOpen: boolean,
		expense: Record<string, string>
	}
}

type UpdateStateFunctionType = (isOpen: boolean) => void
type UpdateStateWithContextFunctionType = (isOpen: boolean, context: Record<string, string>) => void

export type DialogContextType = [DialogContextValueType, {
	setIsCreateExpenseOpen: UpdateStateFunctionType,
	setIsCreateExpenseVendorOpen: UpdateStateFunctionType,
	setIsCreateExpenseCategoryOpen: UpdateStateFunctionType,
	setIsSingleExpenseOpen: UpdateStateWithContextFunctionType,
}]

const defaultDialogContext: DialogContextValueType = {
	isCreateExpenseOpen: false,
	isCreateExpenseVendorOpen: false,
	isCreateExpenseCategoryOpen: false,
	isSingleExpenseOpen: {
		isOpen: false,
		expense: {}
	}
}

const DialogContext = createContext(
	[
		defaultDialogContext,
		{
			setIsCreateExpenseOpen: () => {},
			setIsCreateExpenseVendorOpen: () => {},
			setIsCreateExpenseCategoryOpen: () => {},
			setIsSingleExpenseOpen: () => {}
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

	const setIsSingleExpenseOpen = (isOpen: boolean, context: Record<string, string>) => {
		setDialogContext({...dialogContext, isSingleExpenseOpen: {isOpen, expense: context}})
	}

	return (
		<DialogContext.Provider value={
			[dialogContext, {
				setIsCreateExpenseOpen,
				setIsCreateExpenseVendorOpen,
				setIsCreateExpenseCategoryOpen,
				setIsSingleExpenseOpen
			}]
		}>
			{children}

			<CreateExpenseDialog
				open={dialogContext.isCreateExpenseOpen}
				setOpen={setIsCreateExpenseOpen}
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

			<SingleExpenseDialog
				open={dialogContext.isSingleExpenseOpen.isOpen}
				setOpen={(isOpen: boolean) => setIsSingleExpenseOpen(isOpen, dialogContext.isSingleExpenseOpen.expense)}
				expense={dialogContext.isSingleExpenseOpen.expense as any}
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

export const useSingleExpenseDialog = () => {
	const context = useContext(DialogContext)

	if (!context) {
		throw new Error('useDialogs must be used within a DialogsProvider')
	}

	return {isSingleExpenseDialogOpen: context[0].isSingleExpenseOpen, setIsSingleExpenseDialogOpen: context[1].setIsSingleExpenseOpen}
}
