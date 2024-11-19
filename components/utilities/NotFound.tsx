import Image from 'next/image'
import {cn} from '@/lib/utils'

const NotFound = ({className, text, description}: {className?: string, text?: string, description?: string}) => {
	return (
		<div className={cn('w-min', className)}>
			<Image src="/404.svg" alt={text ?? 'item not found'} width={760} height={554} className="max-w-xs"/>
			<h1 className="text-lg font-semibold mt-6 text-center">{text ?? 'item not found'}</h1>
			<p className="text-sm text-neutral-500 mt-1 text-center">{description ?? 'the item you are looking for does not exist or has been removed.'}</p>
		</div>
	)
}

export default NotFound
