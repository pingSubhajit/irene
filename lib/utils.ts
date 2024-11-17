import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const convertCurrencyValueToNumeric = (value: string) => {
	// Remove currency symbol
	const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''))
	return isNaN(numericValue) ? 0.00 : numericValue
}
