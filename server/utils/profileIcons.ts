const profileIcons: string[] = ["i-lucide-bird", "i-lucide-cat", "i-lucide-dog", "i-lucide-fish", "i-lucide-panda", "i-lucide-turtle", "i-lucide-bot"]

export const getRandomProfileIcon = (): string => {
	const randomIndex = Math.floor(Math.random() * profileIcons.length)
	return profileIcons[randomIndex]!
}
