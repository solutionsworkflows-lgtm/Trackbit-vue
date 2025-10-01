import * as UAParser from 'ua-parser-js'

/**
 * Format a number as currency (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as percentage
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

/**
 * Format a number with thousands separator
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatDate = (dateInput: string | Date, format = 'dd/MM/yyyy'): string => {
  const date = new Date(dateInput)

  if (isNaN(date.getTime())) return ''

  const pad = (n: number) => n.toString().padStart(2, '0')

  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const year = date.getFullYear()
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return format
      .replace(/dd/, day)
      .replace(/MM/, month)
      .replace(/yyyy/, year.toString())
      .replace(/HH/, hours)
      .replace(/mm/, minutes)
      .replace(/ss/, seconds)
}


export const parseUserAgent = (userAgent: string) => {
  const parser = new UAParser.UAParser(userAgent)
  const browser = parser.getBrowser()
  const os = parser.getOS()
  return `${browser.name} ${browser.version} - ${os.name} ${os.version}`
}