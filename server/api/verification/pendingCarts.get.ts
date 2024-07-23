export default defineEventHandler(async (event) => {
    const pendingCarts = await event.context.prisma.cart.findMany({
        where: {
            pending: true
        },
        include: { CartItems: true }
    })
    return pendingCarts
})
