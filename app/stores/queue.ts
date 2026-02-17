// // stores/queue.ts
// export const useQueueStore = defineStore("queue", {
// 	state: () => ({
// 		positions: {} as Record<string, number>,
// 		version: 0,
// 		lastEventId: 0,
// 	}),

// 	actions: {
// 		async fetchInitial() {
// 			const data = await $fetch("/api/queue")
// 			this.$patch(data)
// 		},

// 		handleEvent(event: AppEvent) {
// 			if (event.id <= this.lastEventId) return
// 			this.lastEventId = event.id

// 			switch (event.type) {
// 				case "queue.updated":
// 					if (event.payload.version <= this.version) return
// 					this.$patch(event.payload)
// 					break

// 				case "resync.required":
// 					this.fetchInitial()
// 					break
// 			}
// 		},
// 	},
// })
