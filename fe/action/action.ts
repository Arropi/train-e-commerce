"use server"
import { Profile } from "@/types"

export const addUser = async (formData: Profile) =>{
    try {
        console.log(formData)
    } catch (error) {
        console.log(error)
    }
}