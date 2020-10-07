import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';




// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');
const popupWindow = document.querySelector('.popup-window');
const closeBtn = document.querySelector('#btn-close');


const audios = [
    'assets/sounds/bensound-cute.mp3',
    'assets/sounds/bensound-hey.mp3',
    'assets/sounds/bensound-relaxing.mp3',
    'assets/sounds/bensound-ukulele.mp3'
];
const loadedAudios = [];


// loader
const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let orbiting = false;
let viewing = false;

let currentObject;


// three.js functions
const main  = () => {
    const canvas = document.querySelector('#c');

    // renderer
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000 );;
    camera.position.set(0, 10, 20);


    // scene
    const scene = new THREE.Scene();

    

    // loaders
    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);
    const cubeTextureLoader = new THREE.CubeTextureLoader(loadManager);

  
    
    // orbit controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();


    const addPointLight = (shade, intense, parent, angle, far, top, distance) => {
        const color = shade;
        const intensity = intense;
        const light = new THREE.SpotLight(color, intensity);
        light.castShadow = true;
        light.position.set(0, top, 0);
        light.target.position.set(-4, 0, -4);
        light.penumbra = 1;
        light.angle = angle;
        light.far = far;
        light.distance = distance;
        parent.add(light);
        parent.add(light.target);
    }

    addPointLight(0xff00ff, 0.8, scene, 1, 500, 50, 1000);

    scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );




    // set up background
    var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale( - 1, 1, 1 );

    var texture = textureLoader.load( 'assets/background.jpeg' );
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    const mesh = new THREE.Mesh( geometry, material );

    

    // set up ground plane
    const groundSize = 1000;
    const groundTexture = textureLoader.load('assets/grid.png');
    groundTexture.magFilter = THREE.NearestFilter;
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    const repeats = groundSize / 2;
    groundTexture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(groundSize, groundSize);
    const planeMat = new THREE.MeshPhongMaterial({map: groundTexture});
    planeMat.transparent = true;
    planeMat.alphaTest = 0.1;

    const mapMesh = new THREE.Mesh(planeGeo, planeMat);
    mapMesh.receiveShadow = true;
    mapMesh.rotation.x = Math.PI * -.5;
    mapMesh.position.y = -2;




    // group of clickable objects
    let objects = [];


    // one
    const basicSphere1 = new THREE.SphereBufferGeometry( 2, 32, 16 );
    const sphere1Texture = textureLoader.load('assets/texture1.jpg');
    const sphere1Material = new THREE.MeshPhongMaterial({map: sphere1Texture, shininess: 100});
    const sphere1 = new THREE.Mesh( basicSphere1, sphere1Material);

    // two
    const basicSphere2 = new THREE.SphereBufferGeometry( 2, 32, 16 );
    const sphere2Texture = textureLoader.load('assets/texture2.jpg');
    const sphere2Material = new THREE.MeshPhongMaterial({map: sphere2Texture, shininess: 100});
    const sphere2 = new THREE.Mesh( basicSphere2, sphere2Material);

    // three
    const basicSphere3 = new THREE.SphereBufferGeometry( 2, 32, 16 );
    const sphere3Texture = textureLoader.load('assets/texture3.jpg');
    const sphere3Material = new THREE.MeshPhongMaterial({map: sphere3Texture, shininess: 100});
    const sphere3 = new THREE.Mesh( basicSphere3, sphere3Material);

    // four
    const basicSphere4 = new THREE.SphereBufferGeometry( 2, 32, 16 );
    const basicTorus4 = new THREE.TorusBufferGeometry(2.5, 0.1, 10, 30);
    const sphere4Texture = textureLoader.load('assets/texture4.jpg');
    const sphere4Material = new THREE.MeshPhongMaterial({map: sphere4Texture, shininess: 100});
    const sphere4 = new THREE.Mesh( basicSphere4, sphere4Material);
    const torus4 = new THREE.Mesh ( basicTorus4, sphere4Material );
    torus4.rotation.x = 45 * Math.PI/180;

    // five
    const basicSphere5 = new THREE.SphereBufferGeometry( 2, 32, 16 );
    const sphere5Texture = textureLoader.load('assets/texture5.jpg');
    const sphere5Material = new THREE.MeshPhongMaterial({map: sphere5Texture, shininess: 100});
    const sphere5 = new THREE.Mesh( basicSphere5, sphere5Material);

    // six
    const basicSphere6 = new THREE.SphereBufferGeometry( 2, 32, 16 );
    const basicTorus6 = new THREE.TorusBufferGeometry(2.5, 0.1, 10, 30);
    const sphere6Texture = textureLoader.load('assets/texture6.jpg');
    const sphere6Material = new THREE.MeshPhongMaterial({map: sphere6Texture, shininess: 100});
    const sphere6 = new THREE.Mesh( basicSphere6, sphere6Material);
    const torus6 = new THREE.Mesh ( basicTorus6, sphere6Material );
    torus6.rotation.x = 60 * Math.PI/180;

    // seven
    const basicSphere7 = new THREE.SphereBufferGeometry( 2, 32, 16 );
    const sphere7Texture = textureLoader.load('assets/texture7.jpg');
    const sphere7Material = new THREE.MeshPhongMaterial({map: sphere7Texture, shininess: 100});
    const sphere7 = new THREE.Mesh( basicSphere7, sphere7Material);

    

    


    
    

    loadManager.onLoad = () => {
        loadingElem.style.display = 'none';  
        scene.add(mapMesh);  
        scene.add( mesh );  
        scene.add(sphere1);  
        objects.push(sphere1);

        scene.add(sphere2);  
        objects.push(sphere2);

        scene.add(sphere3);  
        objects.push(sphere3);

        scene.add(sphere4);  
        sphere4.add(torus4);
        objects.push(sphere4);

        scene.add(sphere5);  
        objects.push(sphere5);

        scene.add(sphere6);  
        sphere6.add(torus6);
        objects.push(sphere6);

        scene.add(sphere7);  
        objects.push(sphere7);

        objects.forEach( object => {
            object.position.x = Math.random() * 100;
            object.position.y = Math.random() * 25;
            object.position.z = Math.random() * 500;
        })
    };

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal*100;
        progressBarElem.style.width = progress + '%';
    };


    
  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.raycaster.far = 300;
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject = undefined;
      }

      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        this.pickedObject = intersectedObjects[0].object;
      }
    }
  }

  const pickPosition = {x: 0, y: 0};
  const pickHelper = new PickHelper();
  clearPickPosition();

    

    renderer.render( scene, camera );

    // resize function
    const onWindowResize = () => {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    
    }

    const render = (time) => {
        currentObject = undefined;
        var timer = 0.0002 * Date.now();

        if(!viewing){
            let itemSelected = false;
            

            time *= 0.0001;

            window.addEventListener('resize', onWindowResize, false)

            // move bubles randomly
            for ( var i = 0, il = objects.length; i < il; i ++ ) {
    
                var sphere = objects[ i ];

                sphere.position.x = 15 * Math.cos( timer + i );
                sphere.position.y = 5 * Math.sin( timer + i * 1.1 ) + 5;
                sphere.position.z = 15 * Math.sin( timer + i * 2 );
                sphere.rotation.x = timer;
                sphere.rotation.y = timer;

            }
           


            pickHelper.pick(pickPosition, scene, camera, time);
            
            if(pickHelper.pickedObject && !orbiting){
                if(pickHelper.pickedObject.name){
                    currentObject = pickHelper.pickedObject.name;
                    itemSelected = true;
                }
            }
            
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.render(scene, camera);
        }
        requestAnimationFrame(render);


        
    }

    

    requestAnimationFrame(render);
    controls.update();

    const pinkColor = (object, blue) => {
        let g = object.material.color.g;
        if( g < 1 && !blue){ g += 0.005 };
        if( g > 0.5 && blue){ g -= 0.005 };
        object.material.color.setRGB(1, g, 1);
    }


    function getCanvasRelativePosition(event) {
		const rect = canvas.getBoundingClientRect();
		return {
		x: (event.clientX - rect.left) * canvas.width  / rect.width,
		y: (event.clientY - rect.top ) * canvas.height / rect.height,
		};
	}

	function setPickPosition(event) {
		const pos = getCanvasRelativePosition(event);
		pickPosition.x = (pos.x /  canvas.width ) *  2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
	}

	
    controls.addEventListener('change', () => {

        orbiting = true;

    });

	function clearPickPosition() {
		// unlike the mouse which always has a position
		// if the user stops touching the screen we want
		// to stop picking. For now we just pick a value
		// unlikely to pick something
		pickPosition.x = -100000;
		pickPosition.y = -100000;
  }
  

    window.addEventListener('mousemove', setPickPosition);
	window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);
    window.addEventListener('mouseup', () => {
        orbiting = false;
    })


	window.addEventListener('touchstart', (event) => {
		// prevent the window from scrolling
		event.preventDefault();
        setPickPosition(event.touches[0]);
        checkForClick();
	}, {passive: false});

	window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
        checkForClick();
	});

	window.addEventListener('touchend', () => {
        clearPickPosition();
        orbiting = false;
        checkForClick();
	})
}


// event listeners
beginBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    threeJsWindow.style.display = 'block';
    main();
});

beginBtn.addEventListener('touchend', () => {
    overlay.style.display = 'none';
    threeJsWindow.style.display = 'block';
    main();
});


// functions
window.addEventListener('mouseup', () => {
    checkForClick();
});

const checkForClick = () => {
    if(!orbiting &&!viewing && currentObject){

    }

    currentObject = undefined;
}


closeBtn.addEventListener('click', () => {
    closeWindow();
})
closeBtn.addEventListener('touchstart', () => {
    closeWindow();
})

function closeWindow() {
    popupWindow.style.opacity = 0;
    setTimeout(() => {
        popupWindow.style.zIndex = -10;
    }, 1200)
    viewing = false;
}
function openWindow(){
    popupWindow.style.opacity = 1;
    popupWindow.style.zIndex = 100;
    viewing = true;
}