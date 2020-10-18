import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';




// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');


const popupWindow = document.querySelector('.popup-window');
const title = popupWindow.querySelector('.top-bar span');
const content = popupWindow.querySelector('.content');


const closeBtn = document.querySelector('#btn-close');
const begin2 = document.querySelector('#opening-close')

const openingAudio = document.querySelector('#opening-audio');
const openingLines = document.querySelector('.openingLines');

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
    camera.target = new THREE.Vector3( 0, 0, 0 );


    // scene
    const scene = new THREE.Scene();

    

    // loaders
    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);

  
    
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
    var basicSphere = new THREE.SphereBufferGeometry( 500, 60, 40 );
    var sphereTexture = textureLoader.load('assets/background.jpg');
    basicSphere.scale( -1, 1, 1 );
    var sphereMaterial = new THREE.MeshBasicMaterial({map: sphereTexture});
    var environment = new THREE.Mesh( basicSphere, sphereMaterial);
    


    loadManager.onLoad = () => {
        loadingElem.style.display = 'none';  
        scene.add( environment );  
    };

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal*100;
        progressBarElem.style.width = progress + '%';
    };


    

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
            time *= 0.0001;
            environment.rotation.y = time/4;
            window.addEventListener('resize', onWindowResize, false)
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.render(scene, camera);

        requestAnimationFrame(render);

        
    }

    

    requestAnimationFrame(render);
    controls.update();

}


// event listeners
beginBtn.addEventListener('click', () => {
    opening();
});

beginBtn.addEventListener('touchend', () => {
    opening();
});

begin2.addEventListener('click', () => {
    opening()
});

begin2.addEventListener('touchend', () => {
    opening();
});

function opening() {
    openingLines.classList.add('d-none');
    openingAudio.classList.remove('d-none');
    openingAudio.play();
}

openingAudio.addEventListener('ended', () => {
    overlay.style.display = 'none';
    threeJsWindow.style.display = 'block';
    main();
})
