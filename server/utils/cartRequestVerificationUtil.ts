type EventStream = ReturnType<typeof createEventStream>

const userMap: { [netID: string]: EventStream} = {}

export { userMap }