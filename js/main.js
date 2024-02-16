//запрос к камере
function photoQuery() {

}

//показываем 3D сцену
function show3DField() {
    document.querySelector('.camera').classList.add('active')
}


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

if (pageHeight < 750) {
    document.querySelector('.select-result-cozy').classList.add('top')
    document.querySelector('.select-result-food').classList.add('top')
    document.querySelectorAll('.select-action').forEach(el=>{
        el.classList.add('top')
    })
    document.querySelector('.action-item-radio.select-action').classList.remove('top')
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

let timer, coin = 0


//анимация пакет и монеты при нажатии на пакет
function animationStart() {
    if (+coin > 2) {return}
    if (+coin == 0) {
        document.querySelectorAll('.coin')[0].classList.add('active')
        coin++
        document.querySelectorAll('.pack')[coin-1].classList.add(`active${coin}`)
        return
    }
    swapCoin(coin)
    coin++
    console.log(document.querySelectorAll('.pack'))
    document.querySelectorAll('.pack')[coin-1].classList.add(`active${coin}`)
}

function swapCoin(cnt) {
    let item = document.querySelectorAll('.coin-block img')[cnt]
    if (+cnt==2) {
        //3 собранные монеты
        endTextSawpAction()
    }
    if (cnt==3) {
        document.querySelectorAll('.coin').forEach(el=>{
            el.classList.remove('active')
        })
        setTimeout(()=>{
            //переход на радио кнопки
            document.querySelector('.action-item.active button').click()
            showRadioBtn()
        }, 2400)
    }
    item.classList.add('active')
}


document.querySelector('.camera').addEventListener('click', ()=>{
    animationStart()
})

function setTextSwapAction() {
    document.querySelector(".main-app-images").classList.remove("active")
    document.querySelector(".count-flex").classList.add("active")
    document.querySelector(".coin-block").classList.add("active")

    timer = setInterval(() => {
        let active = document.querySelector(".js-swap.active")
        if (active.nextElementSibling.classList.contains("js-swap")) {
            active.nextElementSibling.classList.add("active")
            active.classList.remove("active")
        } else {
            active.previousElementSibling.classList.add("active")
            active.classList.remove("active")
        }
    }, 6000)

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
            }, 6000)
         })
    })
}

function endTextSawpAction() {
    clearInterval(timer)    
    document.querySelector(".js-swap.active").classList.remove("active")
    document.querySelectorAll(".js-swap")[1].nextElementSibling.classList.add("active")

}
function showRadioBtn() {
    document.querySelector(".count-flex").classList.remove("active")
    document.querySelector(".camera").classList.remove("active")    
    document.querySelector(".coin-block").classList.remove("active")
    document.querySelectorAll('.pack').forEach(el=>{
        el.remove()
    })
}

function showResult() {
    let input = document.querySelector("input:checked")
    if (!input){return}

    let radioContainer = document.querySelector(".action-item-radio")
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
        }, 4000)
}

function getOrientation(){
    var orientation = window.innerWidth > window.innerHeight ? "Landscape" : "Portrait";
    if (orientation == "Landscape") {
        document.querySelector(".app-error").classList.add("active")
    } else {
        document.querySelector(".app-error").classList.remove("active")
    }
}

 window.onresize = function(){ getOrientation() }
 getOrientation()