export const fill = (
  string: number | string, 
  length: number = 2, 
  fillText: string = '0'
): string => {
  let stringLength: number

  string = string + ''
  fillText = fillText + ''

  if ((stringLength = string.split('').length) > length) {
    return string
  }

  const difference = length - stringLength
  fillText = fillText.repeat(difference)

  return fillText + string
}