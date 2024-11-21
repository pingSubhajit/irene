'use client'

import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle,
	CredenzaTrigger
} from '@/components/ui/credenza'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@/components/ui/button'
import {Form, FormControl, FormDescription, FormField, FormItem} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {useEffect, useState} from 'react'
import {ChevronDown, Loader2} from 'lucide-react'
import {cn, convertCurrencyValueToNumeric, getInitialsFromName} from '@/lib/utils'
import {incomeCategory, incomeVendor} from '@/db/schema'
import {createClient} from '@/utils/supabase/client'
import {toast} from 'sonner'
import {useCreateIncomeCategoryDialog, useCreateIncomeVendorDialog} from '@/components/providers/dialog-provider'
import {addIncomeToDB} from '@/lib/income.methods'

const formSchema = z.object({
	categoryId: z.string().uuid(),
	vendorId: z.string().uuid(),
	particular: z.string().min(4),
	note: z.string().optional(),
	amount: z.string()
})

const CreateExpenseDialog = ({open, setOpen, incomeVendors, incomeCategories}: {
	open: boolean,
	setOpen: (isOpen: boolean) => void,
	incomeVendors: (typeof incomeVendor.$inferInsert)[],
	incomeCategories: (typeof incomeCategory.$inferInsert)[]
}) => {
	const [isVendorSelectOpen, setIsVendorSelectOpen] = useState(false)
	const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryId: incomeCategories[0] ? incomeCategories[0].id : '',
			vendorId: incomeVendors[0] ? incomeVendors[0].id : '',
			particular: '',
			note: '',
			amount: ''
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const supabase = createClient()
			const {data: {user}} = await supabase.auth.getUser()

			const income = (await addIncomeToDB({
				...values,
				amount: convertCurrencyValueToNumeric(values.amount).toString(),
				userId: user!.id
			}))[0]

			toast.success('Income recorded successfully.')
			form.reset()
			setOpen(false)
		} catch (error: any) {
			toast.error('Failed to record income. Please try again.')
		}
	}

	const amountDescription = () => {
		const amount = convertCurrencyValueToNumeric(form.getValues('amount'))
		if (form.formState.errors.amount) {
			return 'please enter a valid amount.'
		} else if (amount === 0) {
			return 'amount value cannot be zero.'
		} else if (amount >= 5000 && amount < 20000) {
			return 'uff! That\'s a hefty amount'
		} else if (amount >= 30000) {
			return 'great job. How did you manage that?'
		} else {
			return 'enter the amount you spent.'
		}
	}

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Record an income</CredenzaTitle>
					<CredenzaDescription>
						Enter the required details to record an income.
					</CredenzaDescription>
				</CredenzaHeader>
				<CredenzaBody className="mt-10">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="amount"
								render={({field}) => (
									<FormItem className="mb-8">
										<FormControl>
											<Input
												placeholder="₹0.00"
												type="currency"
												{...field}
												className="text-5xl border-none focus-visible:ring-0 font-semibold text-center mb-3"
											/>
										</FormControl>
										<FormDescription className="text-center">
											{amountDescription()}
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="note"
								render={({field}) => (
									<FormItem className="mb-8">
										<FormControl>
											<Input
												placeholder="add a note"
												{...field}
												className="rounded-[8px] text-center border-none focus-visible:ring-0 bg-neutral-900 w-min mx-auto py-1.5 h-auto text-sm"
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="particular"
								render={({field}) => (
									<FormItem className="">
										<FormControl>
											<Input
												placeholder="particular"
												{...field}
												className="text-center text-lg h-auto py-3"
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="mt-10">
								<div className="mb-3 flex items-center justify-between">
									<Credenza open={isVendorSelectOpen} onOpenChange={setIsVendorSelectOpen}>
										<CredenzaTrigger className="flex items-center">
											{incomeVendors.find(vendor => vendor.id === form.getValues('vendorId')) && <Avatar className="w-7 h-7 mr-1.5">
												<AvatarImage src={incomeVendors.find(vendor => vendor.id === form.getValues('vendorId'))?.logo || '/404'} />
												<AvatarFallback>{getInitialsFromName(incomeVendors.find(vendor => vendor.id === form.getValues('vendorId'))?.name)}</AvatarFallback>
											</Avatar>}
											<span>
												{incomeVendors.find(vendor => vendor.id === form.getValues('vendorId'))?.name || 'Select a vendor'}
											</span>
											<ChevronDown className="w-4 h-4 ml-1" />
										</CredenzaTrigger>
										<IncomeVendorSelect
											allVendors={incomeVendors}
											selectedVendor={incomeVendors.find(vendor => vendor.id === form.getValues('vendorId'))!}
											selectVendor={(vendor) => form.setValue('vendorId', vendor.id!)}
											setOpen={setIsVendorSelectOpen}
										/>
									</Credenza>

									<Credenza open={isCategorySelectOpen} onOpenChange={setIsCategorySelectOpen}>
										<CredenzaTrigger className="flex items-center">
											{incomeCategories.find(category => category.id === form.getValues('categoryId')) && <div
												className="w-5 h-5 mr-1.5 rounded-[4px]"
												style={{backgroundColor: `#${incomeCategories.find(category => category.id === form.getValues('categoryId'))?.color}`}}
											/>}
											<span>
												{incomeCategories.find(category => category.id === form.getValues('categoryId'))?.name || 'Select a category'}
											</span>
											<ChevronDown className="w-4 h-4 ml-1" />
										</CredenzaTrigger>
										<IncomeCategorySelect
											allCategories={incomeCategories}
											selectedCategory={incomeCategories.find(category => category.id === form.getValues('categoryId'))!}
											selectCategory={(category) => form.setValue('categoryId', category.id!)}
											setOpen={setIsCategorySelectOpen}
										/>
									</Credenza>
								</div>
								<Button type="submit" size="lg" className="w-full text-lg" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting && <Loader2 className="w-6 h-6 animate-spin" />}
									Submit
								</Button>
							</div>
						</form>
					</Form>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	)
}

export default CreateExpenseDialog

const IncomeVendorSelect = ({allVendors, selectedVendor, selectVendor, setOpen}: {
	allVendors: (typeof incomeVendor.$inferInsert)[],
	selectedVendor: (typeof incomeVendor.$inferInsert),
	selectVendor: (vendor: (typeof incomeVendor.$inferInsert)) => void,
	setOpen?: (isOpen: boolean) => void,
}) => {
	const {setIsCreateIncomeVendorDialogOpen} = useCreateIncomeVendorDialog()

	useEffect(() => {
		const timeout = setTimeout(() => {
			allVendors.length && selectVendor(allVendors[0])
			if (setOpen) setOpen(false)
		}, 500)

		return () => clearTimeout(timeout)
	}, [allVendors])

	return (
		<CredenzaContent>
			<CredenzaHeader>
				<CredenzaTitle>Select a vendor</CredenzaTitle>
				<CredenzaDescription>
					Select a vendor to associate with your income.
				</CredenzaDescription>
			</CredenzaHeader>
			<CredenzaBody className="mt-6">
				<Button
					className="bg-neutral-950 text-neutral-50 border border-dashed h-auto w-full p-6
					hover:border-emerald-400 hover:bg-neutral-950 mb-4"
					onClick={() => {setIsCreateIncomeVendorDialogOpen(true)}}
				>
					add new vendor
				</Button>

				<div className="grid grid-cols-2 gap-4">
					{allVendors.map(vendor => (<button
						key={vendor.id}
						className={cn(
							'border hover:border-emerald-400 transition p-4',
							selectedVendor && selectedVendor.id === vendor.id && 'border-emerald-400 bg-emerald-950/40 text-neutral-50'
						)}
						onClick={() => {
							selectVendor(vendor)
							if (setOpen) setOpen(false)
						}}
					>
						<div className="flex items-center gap-2">
							<Avatar className="w-10 h-10">
								{vendor.logo && <AvatarImage src={vendor.logo} />}
								<AvatarFallback>{getInitialsFromName(vendor.name)}</AvatarFallback>
							</Avatar>
							<span className="text-lg font-medium">{vendor.name}</span>
						</div>
					</button>))}
				</div>
			</CredenzaBody>
		</CredenzaContent>
	)
}

const IncomeCategorySelect = ({allCategories, selectedCategory, selectCategory, setOpen}: {
	allCategories: (typeof incomeCategory.$inferInsert)[],
	selectedCategory: (typeof incomeCategory.$inferInsert),
	selectCategory: (vendor: (typeof incomeCategory.$inferInsert)) => void,
	setOpen?: (isOpen: boolean) => void
}) => {
	const {setIsCreateIncomeCategoryDialogOpen} = useCreateIncomeCategoryDialog()

	useEffect(() => {
		const timeout = setTimeout(() => {
			allCategories.length && selectCategory(allCategories[0])
			if (setOpen) setOpen(false)
		}, 500)

		return () => clearTimeout(timeout)
	}, [allCategories])

	return (
		<CredenzaContent>
			<CredenzaHeader>
				<CredenzaTitle>Select an income category</CredenzaTitle>
				<CredenzaDescription>
					Enter the required details to record an income.
				</CredenzaDescription>
			</CredenzaHeader>
			<CredenzaBody className="mt-6">
				<Button
					className="bg-neutral-950 text-neutral-50 border border-dashed h-auto w-full p-6
					hover:border-emerald-400 hover:bg-neutral-950 mb-4"
					onClick={() => {setIsCreateIncomeCategoryDialogOpen(true)}}
				>
					add new category
				</Button>

				<div className="grid grid-cols-2 gap-4">
					{allCategories.map(category => (<button
						key={category.id}
						value={category.id!}
						className={cn(
							'border hover:border-emerald-400 transition p-4',
							selectedCategory && selectedCategory.id === category.id && 'border-emerald-400 bg-emerald-950/40 text-neutral-50'
						)}
						onClick={() => {
							selectCategory(category)
							if (setOpen) setOpen(false)
						}}
					>
						<div className="flex items-center gap-2">
							<div
								className="w-10 h-10 rounded-[4px]"
								style={{backgroundColor: `#${category.color}`}}
							/>
							<span className="text-lg font-medium">{category.name}</span>
						</div>
					</button>))}
				</div>
			</CredenzaBody>
		</CredenzaContent>
	)
}
