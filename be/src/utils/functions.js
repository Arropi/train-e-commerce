const capitalize =  (text)=>{
    const kataKata = text.split(' ')
    const textArr = kataKata.map(kata => {
        return kata.charAt(0).toUpperCase() + kata.slice(1)
    });
    console.log(textArr)
    const finalWord = textArr.join(' ')
    console.log(finalWord)
}

module.exports ={
    capitalize
}