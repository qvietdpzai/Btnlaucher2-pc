export function createOfferLauncherUrl(description: string) {
  return `btnlauncher2://peer/offer/${description}`
}

export function createAnswerLauncherUrl(description: string) {
  return `btnlauncher2://peer/answer/${description}`
}

export function createOfferAppUrl(description: string, inviter: string) {
  return `https://btnlauncher2.app/peer?description=${description}?type=offer?inviter=${inviter}`
}

export function createAnswerAppUrl(description: string, inviter: string) {
  return `https://btnlauncher2.app/peer?description=${description}?type=answer?inviter=${inviter}`
}
