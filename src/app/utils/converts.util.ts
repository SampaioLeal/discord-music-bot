const secondsToDisplayTime = (seconds: number) => {
  if (!seconds || seconds <= 0) {
    return '-'
  }

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor((seconds % 3600) % 60)

  const hDisplay = h > 0 ? h + 'h ' : ''
  const mDisplay = m > 0 ? m + 'm ' : ''
  const sDisplay = s > 0 ? s + 's' : ''

  return hDisplay + mDisplay + sDisplay
}

export { secondsToDisplayTime }
