import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'
import {DateTime} from 'luxon'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const convertCurrencyValueToNumeric = (value: string) => {
	// Remove currency symbol
	const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''))
	return isNaN(numericValue) ? 0.00 : numericValue
}

export const getInitialsFromName = (name?: string) => {
	if (!name) return ''

	const names = name.split(' ')
	return names.map(name => name[0].toUpperCase()).join('')
}

export const defaultCurrencyFormat = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
})

export const formatDate = (date: Date, format?: Intl.DateTimeFormatOptions) => {
	return DateTime.fromJSDate(date).setLocale('fr').toLocaleString(format ?? DateTime.DATE_SHORT)
}
