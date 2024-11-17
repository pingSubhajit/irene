'use client'

import {createContext, useContext, useMemo, useState} from 'react'
import CreateExpenseDialog from '@/components/dialogs/CreateExpenseDialog'

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

export const DialogsProvider = ({children}: {children: React.ReactNode}) => {
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

			<CreateExpenseDialog open={dialogContext.isCreateExpenseOpen} setOpen={setIsCreateExpenseOpen} />
		</DialogContext.Provider>
	)
}

export const useCreateExpenseDialog = () => {
	const context = useContext(DialogContext)

	if (!context) {
		throw new Error('useDialogs must be used within a DialogsProvider')
	}

	return {isCreateDialogOpen: context[0].isCreateExpenseOpen, setIsCreateDialogOpen: context[1].setIsCreateExpenseOpen}
}
