"use server"
import { prisma } from "@/lib/db"
import { Profile } from "@/types"

export const addUser = async (formData: Profile) =>{
    try {
        console.log(formData)
        const newUser = await prisma.user.create({
            data:{
                email: formData.email,
                password: formData.password,
            }
        })
        return newUser
    } catch (error) {
        console.log(error)
    }
}

