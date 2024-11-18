'use client'

import {cn} from '@/lib/utils'
import {months, useSelectedFilters} from '@/components/providers/filter-provider'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'

const years = Array.from({length: 10}, (_, index) => new Date().getFullYear() - index)

const TimeFrameSelector = ({className}: {className?: string}) => {
	const {selectMonth, selectYear, filters} = useSelectedFilters()

	return (
		<div className={cn('flex items-center gap-4', className)}>
			<Select
				defaultValue={filters.selectedMonth.toString()}
				onValueChange={value => selectMonth(parseInt(value))}
			>
				<SelectTrigger className="w-min gap-1 border-none px-0">
					<SelectValue placeholder="Month" />
				</SelectTrigger>
				<SelectContent>
					{months.map((month, index) => <SelectItem
						key={index}
						value={index.toString()}
					>
						{month}
					</SelectItem>)}
				</SelectContent>
			</Select>

			<Select
				defaultValue={filters.selectedYear.toString()}
				onValueChange={value => selectYear(parseInt(value))}
			>
				<SelectTrigger className="w-min gap-1 border-none px-0">
					<SelectValue placeholder="Year" />
				</SelectTrigger>
				<SelectContent>
					{years.map(year => <SelectItem
						key={year}
						value={year.toString()}
					>
						{year}
					</SelectItem>)}
				</SelectContent>
			</Select>
		</div>
	)
}

export default TimeFrameSelector
