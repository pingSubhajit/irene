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
import {Form, FormControl, FormField, FormItem} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Loader2} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {addExpenseVendorToDB, LogoResult, searchLogos} from '@/lib/expenseVendor.methods'
import {useEffect, useState} from 'react'
import {cn, getInitialsFromName} from '@/lib/utils'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'

const formSchema = z.object({
	name: z.string().min(2),
	logo: z.string().url().optional()
})

const CreateExpenseVendorDialog = ({open, setOpen}: { open: boolean, setOpen: (isOpen: boolean) => void }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: ''
		}
	})

	const searchTerm = form.watch('name')
	const selectedLogo = form.watch('logo')
	const [logoResults, setLogoResults] = useState<LogoResult[]>([])

	useEffect(() => {
		if (searchTerm.length > 2) {
			searchLogos(searchTerm).then(results => {
				setLogoResults(results)
			})
		}
	}, [searchTerm])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const supabase = createClient()
			const {data: {user}} = await supabase.auth.getUser()

			const vendor = (await addExpenseVendorToDB({
				...values,
				userId: user!.id
			}))[0]

			toast.success('Vendor added successfully.')
			form.reset()
			setOpen(false)
		} catch (error: any) {
			toast.error('Failed to add vendor. Please try again.')
		}
	}

	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Add a vendor</CredenzaTitle>
					<CredenzaDescription>
						Create a new vendor to associate with your expenses.
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
												placeholder="name of the vendor"
												{...field}
												className="text-center text-lg h-auto py-3"
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							{(selectedLogo || logoResults[0]) && <>
								<p className="mt-6 mb-2">Select logo</p>
								<div className="grid grid-cols-5 gap-4">
									{selectedLogo && !logoResults.find(logo => logo.logo_url === selectedLogo) && <button
										type="button"
										className={cn(
											'border hover:border-emerald-400 transition p-4 border-emerald-400 ' +
											'bg-emerald-950/40 text-neutral-50'
										)}
										onClick={() => {
											form.setValue('logo', '')
										}}
									>
										<Avatar className="w-14 h-14 mx-auto">
											<AvatarImage src={selectedLogo}/>
										</Avatar>
									</button>}
									{logoResults.slice(0, 6).map(logo => (<button
										key={logo.logo_url}
										type="button"
										className={cn(
											'border hover:border-emerald-400 transition p-4',
											selectedLogo === logo.logo_url && 'border-emerald-400 bg-emerald-950/40 text-neutral-50'
										)}
										onClick={() => {
											if (selectedLogo === logo.logo_url) {
												form.setValue('logo', '')
											} else {
												form.setValue('logo', logo.logo_url)
											}
										}}
									>
										<Avatar className="w-14 h-14 mx-auto max-w-full aspect-square">
											<AvatarImage src={logo.logo_url}/>
											<AvatarFallback>{getInitialsFromName(logo.name)}</AvatarFallback>
										</Avatar>
									</button>))}
								</div>
							</>}

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

export default CreateExpenseVendorDialog
