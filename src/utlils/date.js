
export function convertToEpochDays(momentDate) {
    return Math.floor(momentDate.valueOf()/8.64e7)
}