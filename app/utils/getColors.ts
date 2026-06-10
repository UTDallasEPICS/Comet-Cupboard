const COLOR_PALETTE = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
  '#86BCB6',
  '#D37295',
  '#8CD17D',
  '#B6992D',
  '#499894',
  '#E58606',
  '#A0CBE8',
  '#FFBE7D',
  '#FF9D9A',
  '#9D7660',
  '#D7B5A6',
  '#CFCFCF',
  '#8E6C8A',
  '#F1CE63',
  '#B5CF6B',
  '#D6616B',
  '#6B6ECF',
  '#CEDB9C',
  '#BD9E39',
  '#E7BA52',
]

const categoryColors = new Map<string, string>()
const sourceColors = new Map<string, string>()
let nextColorIndex = 0

export function getCategoryColor(category: string){
  if(!categoryColors.has(category)){
    const color = CATEGORY_PALETTE[nextColorIndex]

    categoryColors.set(category, categoryColor)
    nextColorIndex++
  }

  console.log(categoryColors)

	return categoryColors.get(category)
}

export function getSourceColor(source: string){
  if(!sourceColors.has(source)){
    const sourceColor = COLOR_PALETTE[nextColorIndex % COLOR_PALETTE.length]

    sourceColors.set(source, sourceColor)
    nextColorIndex++
  }

  console.log(sourceColors)

	return sourceColors.get(source)
}

export function getItemColor(category: string){
	const baseColor = getCategoryColor(category)

	return baseColor
}
