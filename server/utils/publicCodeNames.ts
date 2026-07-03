const adjectives = [
	"Cosmic",
	"Galactic",
	"Stellar",
	"Lunar",
	"Solar",
	"Quantum",
	"Astro",
	"Nebula",
	"Hyper",
	"Turbo",
	"Nova",
	"Supernova",
	"Orbiting",
	"Radiant",
]

const nouns = ["Temoc", "Tobor", "Comet", "Orion", "Galaxy", "Nebula", "Astronaut"]

export const generatePublicCodeName = (): string => {
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
	const noun = nouns[Math.floor(Math.random() * nouns.length)]
	const number = Math.floor(Math.random() * 100) // 0–99

	return `${adj} ${noun} ${number}`
}
