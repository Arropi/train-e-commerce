
const capitalize =  (text)=>{
    const kataKata = text.split(' ')
    const textArr = kataKata.map(kata => {
        return kata.charAt(0).toUpperCase() + kata.slice(1)
    });
    const finalWord = textArr.join(' ')
    return finalWord
}

const getSubjectId = (subjects) =>{
    const getOnlySubject = subjects.map(subject => {
        return Number(subject.subject_id)
    })
    return getOnlySubject
}

const getInventoryId = (inventories) => {
    const getOnlyInventory = inventories.map(inventory => {
        return inventory.inventories_id
    })
    return getOnlyInventory
}

const filterSubject = (newSubject, oldSubject, inventory_id) => {
    let toInsert = newSubject.filter(item => !oldSubject.includes(item))
    toInsert = toInsert.map(subject_id =>{ return {inventory_id: Number(inventory_id), subject_id: subject_id, created_at: new Date()}}) 
    let toRemove = oldSubject.filter(item => !newSubject.includes(item))
    toRemove = toRemove.map(subject_id =>{ return {inventory_id: Number(inventory_id), subject_id: subject_id}})
    return {toInsert: toInsert, toRemove: toRemove}
}

module.exports ={
    capitalize,
    getSubjectId,
    getInventoryId,
    filterSubject
}