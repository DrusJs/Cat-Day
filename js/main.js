document.querySelectorAll(".js-next").forEach(el => {
    el.addEventListener("click", (event)=> {
       let block = event.currentTarget.closest(".action-item")
       block.classList.remove("active")
       if (block.nextElementSibling){
        block.nextElementSibling.classList.add("active")
       } else {
        block.closest(".action-container").classList.remove("active")
        let selectContainer = document.querySelector(".select-container")
        selectContainer.classList.add("active")
        selectContainer.querySelector(".select-animate").classList.add("active")
        selectContainer.querySelector(".action-container").classList.add("active")
        selectContainer.querySelector(".action-item-radio").classList.add("active")
       }
       
    })
})

let pageHeight = document.documentElement.scrollHeight
console.log(pageHeight)
if (pageHeight < 750) {
    document.querySelector('.cozy-cats').classList.add('top')
    document.querySelector('.food-cats').classList.add('top')
    console.log(document.querySelector('.food-cats'))
}

document.getElementById("gift-label").addEventListener("click", ()=>{
    let image = document.querySelector(".select-toy-img")
    image.classList.add("select-animation")
    image.addEventListener("animationend", ()=>{
        image.classList.remove("select-animation")
    })
})

document.getElementById("feed-label").addEventListener("click", ()=>{
    let image = document.querySelector(".select-whiskas-img")
    image.classList.add("select-animation")
    image.addEventListener("animationend", ()=>{
        image.classList.remove("select-animation")
    })
})

let timer

function setTextSwapAction() {
    document.querySelector(".main-app-images").classList.remove("active")
    timer = setInterval(() => {
        let active = document.querySelector(".js-swap.active")
        if (active.nextElementSibling.classList.contains("js-swap")) {
            active.nextElementSibling.classList.add("active")
            active.classList.remove("active")
        } else {
            active.previousElementSibling.classList.add("active")
            active.classList.remove("active")
        }
    }, 3000)
    
    setTimeout(endTextSawpAction, 7000)

    document.querySelectorAll('.js-swap').forEach(el=>{
        el.addEventListener('touchstart', () => {
            clearInterval(timer)
        })
    })

    document.querySelectorAll('.js-swap').forEach(el=>{
        el.addEventListener('touchend', () => {
            timer = setInterval(() => {
                let active = document.querySelector(".js-swap.active")
                if (active.nextElementSibling.classList.contains("js-swap")) {
                    active.nextElementSibling.classList.add("active")
                    active.classList.remove("active")
                } else {
                    active.previousElementSibling.classList.add("active")
                    active.classList.remove("active")
                }
            }, 3000)
    })
    })
}

function endTextSawpAction() {
    clearInterval(timer)
    document.querySelector(".js-swap.active").classList.remove("active")
    document.querySelectorAll(".js-swap")[1].nextElementSibling.classList.add("active")
}

function showResult() {
    let radioContainer = document.querySelector(".action-item-radio")
    let input = document.querySelector("input:checked")
    if (!input){return}
    radioContainer.classList.remove("active")
    document.querySelector(".select-animate").classList.remove("active")
    if (input.id == "gift-radio") {
        document.querySelector(".select-result-cozy").classList.add("active")
    } else {
        document.querySelector(".select-result-food").classList.add("active")
    }
    radioContainer.nextElementSibling.classList.add("active")
        setTimeout(()=> {
            radioContainer.nextElementSibling.classList.remove("active")
            document.querySelector(".small-gap").classList.add("active")
        }, 6000)
}

document.querySelector(".close-btn").addEventListener("click",()=> {
    document.querySelector(".app-error").classList.toggle("active")
})