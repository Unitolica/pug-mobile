import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { endOfMonth, intervalToDuration, startOfMonth } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function datesToDurationString (
  end: Date | null | undefined,
  start: Date | null | undefined
) {
  if (!start || !end) return null

  const timeElapsed = end.getTime() - start.getTime()
  if (timeElapsed < 1000)
    return `${timeElapsed}ms`

  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed
  })

  const hoursString = duration.hours ? `${duration.hours}h` : ""
  const minutesString = duration.minutes ? `${duration.minutes}m` : ""
  const secondsString = duration.seconds ? `${duration.seconds}s` : ""

  if (hoursString)
    return `${hoursString} ${minutesString}`

  if (minutesString)
    return `${minutesString} ${secondsString}`

  return secondsString
}


export function periodToDateRange(period: { year: number, month: number }) {
  const startDate = startOfMonth(new Date(period.year, period.month))
  const endDate = endOfMonth(new Date(period.year, period.month))

  return { startDate, endDate }
}


