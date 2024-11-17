import {
	Credenza,
	CredenzaBody,
	CredenzaClose,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle
} from '@/components/ui/credenza'

const CreateExpenseDialog = ({open, setOpen}: { open: boolean, setOpen: (isOpen: boolean) => void }) => {
	return (
		<Credenza open={open} onOpenChange={setOpen}>
			<CredenzaContent>
				<CredenzaHeader>
					<CredenzaTitle>Credenza</CredenzaTitle>
					<CredenzaDescription>
						A responsive modal component for shadcn/ui.
					</CredenzaDescription>
				</CredenzaHeader>
				<CredenzaBody>
					This component is built using shadcn/ui&apos;s dialog and drawer
					component, which is built on top of Vaul.
				</CredenzaBody>
				<CredenzaFooter>
					<CredenzaClose asChild>
						<button>Close</button>
					</CredenzaClose>
				</CredenzaFooter>
			</CredenzaContent>
		</Credenza>
	)
}

export default CreateExpenseDialog
