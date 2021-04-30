export const genFormatter = (
  locales?: string,
  options?: Intl.DateTimeFormatOptions
): (date: Date | string) => string => {
  const { format } = new Intl.DateTimeFormat (locales, options)
  return (date) => format(new Date(date))
}