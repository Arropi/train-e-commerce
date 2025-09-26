import { getSession, useSession } from "next-auth/react"
import {Session} from 'next-auth'
import { redirect } from "next/navigation"

export default async function Hero({session}: { session:Session}){
    const token = session.user.accessToken
    const verify = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }) 
    const response = await verify.json()
    console.log(response)
    return(
        <div>
            <h1 className=" text-3xl">Kosong dlu</h1>
        </div>
    )
}