function getUserVideo( configuration )
{
	const facing = configuration.facingMode || 'environment';
	const onSuccess = configuration.onSuccess;
	const onError = configuration.onError || ( ( error ) =>	console.error( 'getUserMedia', error ) ); 
	const video = document.createElement( 'video' );
	const eventNames = [ 'touchstart', 'touchend', 'touchmove', 'touchcancel', 'click', 'mousedown', 'mouseup', 'mousemove', 'keydown', 'keyup', 'keypress', 'scroll' ];
	
	let readyToPlay = false;
	
	const play = function() 
	{
		if( readyToPlay )
		{
			video.play().then( () => 
			{
				onSuccess( video );
				
			} ).catch( ( error ) => 
			{
				onError( error );
				disposeVideo( video );
				
			} );
			
			if( !video.paused ) eventNames.forEach( ( eventName ) => window.removeEventListener( eventName, play, true ) );
		}
	};
	
	eventNames.forEach( ( eventName ) => window.addEventListener( eventName, play, true ) );
	
	const success = function( stream ) 
	{
		video.srcObject = stream;
		readyToPlay = true;
		video.autoplay = true;
		video.playsInline = true;
		play();
	};
	
	const constraints = {};
	const mediaDevicesConstraints = {};
	
	if( configuration.width ) 
	{
		mediaDevicesConstraints.width = configuration.width;
		
		if( typeof configuration.width === 'object' ) 
		{
			if( configuration.width.max ) constraints.maxWidth = configuration.width.max;
			if( configuration.width.min ) constraints.minWidth = configuration.width.min;
		} 
		else constraints.maxWidth = configuration.width;
	}

	if( configuration.height ) 
	{
		mediaDevicesConstraints.height = configuration.height;
		
		if( typeof configuration.height === 'object' ) 
		{
			if( configuration.height.max ) constraints.maxHeight = configuration.height.max;
			if( configuration.height.min ) constraints.minHeight = configuration.height.min;
		} 
		else constraints.maxHeight = configuration.height;
	}

	mediaDevicesConstraints.facingMode = facing;
	mediaDevicesConstraints.deviceId = configuration.deviceId;
	
	if( navigator.mediaDevices ) navigator.mediaDevices.getUserMedia( { audio:false, video:mediaDevicesConstraints }).then( success, onError );
	else if( navigator.getUserMedia ) navigator.getUserMedia( { audio:false, video:constraints }, success, onError ); 
	else onError( 'UserMedia is not supported in this browser' );
	
	return video;
}

let deviceOrientationReady = false;
let started = false;
let finished = false;
let video, videoContainer;
let renderer, camera, controls, scene, sprites, model;
let timer, coin = 0

const raycaster = new THREE.Raycaster();
const loader = new THREE.GLTFLoader();

loader.load( './whiskas_pack_01.glb', ( gltf ) =>
{
	console.log( 'GLTFLoaded' );
	model = gltf.scene;
} );

function render()
{
	if( !finished )
	{
		if( model && model.parent == scene )
		{
			scene.remove( model );
		}
		
		controls.update();
		
		renderer.render( scene, camera );
	
		window.requestAnimationFrame( render );
		
		// console.log( 'render' );
	}
}

function addSprite() 
{
	try
	{
		sprites.position.y = 0;
		
		const radius = 3;
		const theta = Math.floor( Math.random() * 10 ) * 36; // 270;//
		const phi = 110 - Math.random() * 30;
		
		model.position.set( 0, 0, 0 );

		sprite = new THREE.Group();
		sprite.add( model );
		// sprite.add( new THREE.Mesh( new THREE.SphereGeometry( 1 ), new THREE.MeshBasicMaterial( { color:0xFF0000 } ) ) );
		sprite.position.setFromSphericalCoords( radius, phi * Math.PI / 180, theta * Math.PI / 180 );
		sprite.lookAt( new THREE.Vector3() );
		
		
		sprites.add( sprite );
		sprites.position.y = -1;
	}
	catch( error )
	{
		alert( error );
	}

	
	//alert( 'added' );
}

function removeSprite()
{
	for( let i = sprites.children.length - 1; i >= 0; i-- )
		sprites.remove( sprites.children[ i ] );
}

function startGame()
{
	/*const helper = new THREE.GridHelper( 100, 100, 0xFFFFFF, 0xFFFFFF );
	helper.position.y = -2;
	scene.add( helper );*/
	
	try 
	{
		addSprite();
		
		const canvas = document.querySelector( '.camera' );
		const { x, y, width, height } = canvas.getBoundingClientRect();
		
		canvas.onmousedown = ( event ) =>
		{
			const tp = new THREE.Vector2
			(
				 ( ( event.clientX - x ) / width )  * 2 - 1,
				-( ( event.clientY - y ) / height ) * 2 + 1
			);
			
			raycaster.setFromCamera( tp, camera );
			
			const intersections = raycaster.intersectObjects( sprites.children, true );
			
			if( intersections.length > 0 )
			{
				removeSprite();
				
				if( animationStart() ) // возвращает возомжность продолжения игры!!!
				{	
					setTimeout( addSprite, 2000 ); // Тут нужно установить таймер так, чтобы прошли все анимации запускаемые в animationStart
				}
				else 
				{
					canvas.onmousedown = null;
				}
			}
		};
	}
	catch( error )
	{
		alert( error );
	}
}

function stopRender()
{
	finished = true;
	
	video.srcObject.getVideoTracks()[ 0 ].stop();
	video.srcObject = null;
	video.src = null;
	
	scene.background = null;
}

function onDeviceOrientationReady()
{
	deviceOrientationReady = true;
	
	if( video )
		initGame();
}

function onDeviceOrientationError( error )
{
	alert( error );
}

function onVideoStreamReady( stream )
{
	video = stream;
	
	videoContainer = document.createElement( 'div' );
	videoContainer.style.position = 'absolute';
	videoContainer.style.right = 9999;
	videoContainer.appendChild( video );
	
	if( deviceOrientationReady )
		initGame();
}

function onVideoStreamError( error )
{
	alert( error );
}

function initGame()
{
	const canvas = document.querySelector( '.camera' );
	
	canvas.classList.add('active')

	const { width, height } = canvas.getBoundingClientRect();
	
	renderer = new THREE.WebGLRenderer( { canvas, antialias:true, preserveDrawingBuffer:false } );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.setSize( width, height );
	renderer.setClearColor( 0x000000 );
	
	camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );
	
	controls = new THREE.DeviceOrientationControls( camera );
	
	sprites = new THREE.Group();
	
	const light = new THREE.DirectionalLight( 0xFFFFFF, 0.7 );

	light.position.set( 0, 0.5, 0.75 );
	
	scene = new THREE.Scene();
	scene.add( camera );
	scene.add( sprites );
	camera.add( light );
	scene.add( new THREE.AmbientLight( 0xFFFFFF, 1 ) );
	scene.background = new THREE.VideoTexture( video );
	
	
	render();
	
	started = true;
}




//запрос к камере
function photoQuery() {
	// Это переход на экран, не запрос!
}

//показываем 3D сцену
function show3DField() {
	// Вот тут идет запрос, поменял onclick на onmousedown - нужно чтобы сработало getUserVideo по onmouseup или ontouchend
	getUserVideo( { width:1280, height:720, facingMode:'environment', onSuccess:onVideoStreamReady, onError:onVideoStreamError } );
	// В onVideoStreamError нужно что-то сделать для отображения ошибки, это ситуация в которой не возможно продолжать сценарий приложения
	
	if( window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === 'function' ) 
	{
		window.DeviceOrientationEvent.requestPermission().then( response =>
		{
			if( response == 'granted' ) onDeviceOrientationReady();
			else onDeviceOrientationError( response );

		} ).catch( error => onDeviceOrientationError( error ) );
	}
	else onDeviceOrientationReady();
}


document.querySelectorAll(".js-next").forEach(el => {
    el.addEventListener("click", (event)=> {
       let block = event.currentTarget.closest(".action-item")
       block.classList.remove("active")
       if (block.nextElementSibling){
        block.nextElementSibling.classList.add("active")
		block.nextElementSibling.click()
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




//анимация пакет и монеты при нажатии на пакет
function animationStart() {
    if (+coin > 2) { return false  } // !!!
    if (+coin == 0) {
		setTimeout(()=>{
			document.querySelectorAll('.coin')[0].classList.add('active')
		},600)
        
        coin++
        document.querySelectorAll('.pack')[coin-1].classList.add(`active${coin}`)
        return true; // !!!
    }
    swapCoin(coin)
    coin++

    document.querySelectorAll('.pack')[coin-1].classList.add(`active${coin}`)
	
	return ( +coin <= 2 ); // Boolean - нужно ли еще добавлять пакеты в Scene
}

function swapCoin(cnt) {
    let item = document.querySelectorAll('.coin-block img')[cnt]
	if (document.querySelector('.coin.active')) {
		document.querySelector('.coin.active').classList.remove('active')
	}
    if (+cnt==2) {
        //3 собранные монеты
        endTextSawpAction()
    }
    if (cnt==3) {
        document.querySelectorAll('.coin').forEach(el=>{
            el.classList.remove('active')
        })
		item.classList.add('active')
        setTimeout(()=>{
            //переход на радио кнопки
			stopRender(); // Тут вырубаем камеру и останавливаем цикл рендера
            document.querySelector('.coin.active').classList.remove('active')
            return
            // document.querySelector('.action-item.active button').click()
            // showRadioBtn()
        }, 2400)
    }
	setTimeout(()=>{
		item.classList.add('active')
	},600)
    
}




function setTextSwapAction() {
	
	if( model == null || !started ) // Без загруженной модели не стратуем! По идее хорошо бы кнопку показать, только когда модель доступна
	{
		return;
	}
	
	// Начало игры?	
	setTimeout( startGame, 100 );
	
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

let audio = document.querySelector('.cute-audio')
document.querySelector('.sound').addEventListener('click', (event)=>{
    event.currentTarget.classList.toggle('active')
    if (event.currentTarget.classList.contains('active')) {
        audio.play()
    } else {
        audio.pause()
    }
})

function showResult() {
    let input = document.querySelector("input:checked")
    if (!input){return}

    document.querySelector('.sound').classList.remove('hide')
    document.querySelector('.sound').classList.add('active')
    audio.play()

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