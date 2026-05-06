type BagItem = { itemID: string; count: number; name: string; imgName?: string }

export const useBagEditor = (initialData: Ref<any>) => {
  const bagItems = ref<BagItem[]>([])
  const currentBagItems = ref<BagItem[]>([])

  const totalItemCount = computed(() =>
    bagItems.value.reduce((sum, i) => sum + i.count, 0) +
    currentBagItems.value.reduce((sum, i) => sum + i.count, 0)
  )

  const addItemToBag = (item: any) => {
    const existing = bagItems.value.find(bi => bi.itemID === item.itemID)
    if (existing) {
      existing.count++
    } else {
      bagItems.value.push({ itemID: item.itemID, count: 1, name: item.name, imgName: item.imgName })
    }
  }

  const removeItemFromBag = (itemID: string, isCurrentBag = false) => {
    if (isCurrentBag) {
      currentBagItems.value = currentBagItems.value.filter(i => i.itemID !== itemID)
    } else {
      bagItems.value = bagItems.value.filter(i => i.itemID !== itemID)
    }
  }

  const decreaseItemCount = (itemID: string, isCurrentBag = false) => {
    if (isCurrentBag) {
      const item = currentBagItems.value.find(i => i.itemID === itemID)
      if (!item) return
      if (item.count === 1) {
        currentBagItems.value = currentBagItems.value.filter(i => i.itemID !== itemID)
      } else {
        item.count--
      }
    } else {
      const item = bagItems.value.find(i => i.itemID === itemID)
      if (!item) return
      if (item.count === 1) {
        removeItemFromBag(itemID)
      } else {
        item.count--
      }
    }
  }

  const increaseItemCount = (itemID: string, isCurrentBag = false) => {
    if (isCurrentBag) {
      const item = currentBagItems.value.find(i => i.itemID === itemID)
      if (!item) return
      const original = initialData.value?.EmergencyBagItems?.find((i: any) => i.itemID === itemID)?.count ?? 0
      if (item.count < original) item.count++
    } else {
      const item = bagItems.value.find(i => i.itemID === itemID)
      if (item) item.count++
    }
  }

  const resetItems = () => {
    bagItems.value = []
    currentBagItems.value = []
  }

  watchEffect(() => {
    if (!initialData.value) return
    currentBagItems.value = initialData.value.EmergencyBagItems.map((item: any) => ({
      itemID: item.itemID,
      count: item.count,
      name: item.Item.name,
      imgName: item.Item.imgName
    }))
  })

  return {
    bagItems,
    currentBagItems,
    totalItemCount,
    addItemToBag,
    removeItemFromBag,
    decreaseItemCount,
    increaseItemCount,
    resetItems
  }
}
