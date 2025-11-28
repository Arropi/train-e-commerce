'use server'

import { authConfig } from "@/lib/auth";
import { ReserveFormInput } from "@/types";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const postReserves = async (reserve: ReserveFormInput[]) => {
    const session = await getServerSession(authConfig)
    if (!session) return { success: false, error: 'Unauthorized' }
    console.log('Posting reserves:', reserve)
    
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reserves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.accessToken}`,
            },
            body: JSON.stringify({ data: reserve})
        })
        
        const result = await res.json()
        console.log(result)
        
        if (res.ok) {
            const resCheckout = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.accessToken}`,
                }
            })
            
            const checkoutResult = await resCheckout.json()
            console.log(checkoutResult)
            
            if (resCheckout.ok) {
                // Revalidate paths yang menampilkan cart
                revalidatePath('/home')
                revalidatePath('/lab/[slug]', 'page')
                // redirect akan throw NEXT_REDIRECT yang harus di-propagate
                redirect('/home')
            }
            
            return { success: false, error: 'Checkout failed' }
        }
        console.log(result)
        return { success: false, error: 'Reserve failed' }
    } catch (error) {
        // PENTING: redirect() melempar error NEXT_REDIRECT yang HARUS di-propagate
        // Jangan tangkap error redirect!
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error  // propagate redirect error
        }
        console.log(error)
        return { success: false, error: 'Server error' }
    }
}

export const updateReserves = async (reserveId: number, status: string) => {
    const session = await getServerSession(authConfig)
    if (!session) return { success: false, error: 'Unauthorized' }
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reserves/${reserveId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.accessToken}`,
            },
            body: JSON.stringify({ status })
        })

        const result = await res.json()
        console.log(result)

        if (res.ok) {
            revalidatePath('/home')
            revalidatePath('/lab/[slug]', 'page')
            redirect('/home')
        }

        return { success: false, error: 'Update failed' }
    } catch (error) {
        console.log(error)
        return { success: false, error: 'Server error' }
    }
}