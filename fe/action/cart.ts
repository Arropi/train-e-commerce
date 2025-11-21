export async function addToCart(itemId: number[]) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventory_id: itemId }),
    })
}