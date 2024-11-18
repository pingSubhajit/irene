import {
	Credenza,
	CredenzaBody,
	CredenzaContent,
	CredenzaDescription,
	CredenzaHeader,
	CredenzaTitle
} from '@/components/ui/credenza'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {createClient} from '@/utils/supabase/client'
import {toast} from 'sonner'
import {Form, FormControl, FormField, FormItem, FormLabel} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Loader2} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {addExpenseCategoryToDB} from '@/lib/expenseCategory.methods'
import {Select, SelectContent, SelectItem, SelectTrigger} from '@/components/ui/select'

const formSchema = z.object({
	name: z.string().min(2),
	color: z.string().length(6)
})

const colorOptions = [
	'fca5a5', 'fdba74', 'fcd34d', 'fde047', 'bef264', '86efac', '6ee7b7', '5eead4', '67e8f9', '7dd3fc', '93c5fd',
	'a5b4fc', 'c4b5fd', 'd8b4fe', 'f0abfc', 'f9a8d4', 'fda4af'
]

const CreateExpenseCategoryDialog = ({open, setOpen}: { open: boolean, setOpen: (isOpen: boolean) => void }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			color: colorOptions[0]
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const supabase = createClient()
			const {data: {user}} = await supabase.auth.getUser()

			const category = (await addExpenseCategoryToDB({
				...values,
				userId: user!.id
			}))[0]

			toast.success('Category added successfully.')
			form.reset()
			setOpen(false)
		} catch (error: any) {
			toast.error('Failed to add category. Please try again.')
		}
	}

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Add a category</CredenzaTitle>
					<CredenzaDescription>
						Create a new category to associate with your expenses.
					</CredenzaDescription>
				</CredenzaHeader>
				<CredenzaBody className="mt-10">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({field}) => (
									<FormItem className="">
										<FormControl>
											<Input
												placeholder="name of the category"
												{...field}
												className="text-center text-lg h-auto py-3"
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="color"
								render={({field}) => (
									<FormItem className="mt-6 mb-2">
										<FormLabel>Select color</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger className="relative justify-end [&>svg]:stroke-neutral-950 [&>svg]:stroke-[3]">
													{/* <SelectValue placeholder="Select a verified email to display" />*/}
													<div
														className="absolute inset-x-0 h-[90%] top-1/2 -translate-y-1/2"
														style={{backgroundColor: `#${field.value}`}}
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{colorOptions.map(color => <SelectItem
													key={color}
													value={color}
													className="w-full h-8 relative"
												>
													<div
														className="absolute inset-x-0 h-[90%] top-1/2 -translate-y-1/2"
														style={{backgroundColor: `#${color}`}}
													/>
												</SelectItem>)}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>

							<Button type="submit" size="lg" className="w-full text-lg mt-8"
								disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting && <Loader2 className="w-6 h-6 animate-spin"/>}
								Submit
							</Button>
						</form>
					</Form>
				</CredenzaBody>
			</CredenzaContent>
		</Credenza>
	)
}

export default CreateExpenseCategoryDialog
