import * as THREE from 'three';
import * as gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Geometry } from "three/examples/jsm/deprecated/Geometry";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { Scene } from 'three';
const randnum = (min, max) => Math.round(Math.random() * (max - min) + min);


document.addEventListener('DOMContentLoaded', () => {
  console.log('test');


  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  let renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true; //Shadow
  renderer.shadowMapSoft = true; // Shadow
  renderer.shadowMapType = THREE.PCFShadowMap; //Shadow
  document.body.appendChild(renderer.domElement);



  scene.fog = new THREE.FogExp2(new THREE.Color("lightblue"), 0.005);


  // LIGHT
  const spotLight = new THREE.SpotLight(new THREE.Color('white'), .15);
  spotLight.position.set(5, 100, 0);
  spotLight.castShadow = true;

  scene.add(spotLight);

  const sphereLight = new THREE.SphereGeometry(.05);
  const sphereLightMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("white")
  });
  const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  sphereLightMesh.castShadow = true;
  sphereLightMesh.position.set(0, 2.5, 0)


  const distance = 10;
  const intensity = 2.5;

  const pointLight2 = new THREE.PointLight(new THREE.Color('red'), intensity, distance);
  pointLight2.position.set(0, 0, -5);
  scene.add(pointLight2);


  const pointLight3 = new THREE.PointLight(new THREE.Color('#808000'), intensity, distance);
  pointLight3.position.set(0, 0, 5);
  scene.add(pointLight3);



  // ========= FLOOR ========= //
  THREE.ImageUtils.crossOrigin = '';
  const floorMap = THREE.ImageUtils.loadTexture(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG76Ug6KATmlUnoLoZV8xJFLK2zGo3Jvw7xqyFSd3iBUue7PZ3"
  );
  floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
  floorMap.repeat.set(50, 50);
  const groundMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color('#111'),
    specular: new THREE.Color('#808000'),
    //specular: new THREE.Color('#333'),
    shininess: 0,
    bumpMap: floorMap
  });
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const ground = new THREE.Mesh(groundGeo, groundMaterial);

  ground.position.set(0, 0, 0);
  ground.rotation.x = (-Math.PI / 2);
  ground.receiveShadow = true;
  scene.add(ground);



  // ========= add tree ========= //
  //3D Model from http://www.sweethome3d.com/searchModels.jsp?model=tree&x=0&y=0
  const loader = new THREE.ObjectLoader();
  loader.load("https://raw.githubusercontent.com/baronwatts/models/master/real-tree2.js", function (geometry, materials) {

    new Array(100).fill(null).map((d, i) => {
      let x = Math.cos(i / 100 * Math.PI * 2) * randnum(7, 50);
      let z = Math.sin(i / 100 * Math.PI * 2) * randnum(7, 50);
      let y = -1;

      const obj = new THREE.Mesh(geometry, materials);
      obj.scale.set(5, 5, 5);
      obj.castShadow = true;
      obj.position.set(x, y, z);
      scene.add(obj);
    });
  });



// ========= MODELS ========= //
  const mixers = [];
  const characterGroup = new THREE.Group();
  scene.add(characterGroup);

  loadModels();

  function loadModels() {
    const loader = new GLTFLoader();

    loader.load('https://raw.githubusercontent.com/baronwatts/models/master/Reindeer.glb', function (gltf) {
      const model = gltf.scene.children[0];
      model.position.set(0, 0, -5);
      model.scale.set(.025, .025, .025);
      model.rotateZ(Math.PI);

      const animation = gltf.animations[0];
      const mixer = new THREE.AnimationMixer(model);
      mixers.push(mixer);

      const action = mixer.clipAction(animation);
      action.play();

      gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
        }
      });
      scene.add(model);
    });


    loader.load('https://raw.githubusercontent.com/baronwatts/models/master/Reindeer.glb', function (gltf) {
      const model = gltf.scene.children[0];
      model.position.set(100, 0, -5);
      model.scale.set(.025, .025, .025);
      model.rotateZ(Math.PI);

      const animation = gltf.animations[0];
      var mixer = new THREE.AnimationMixer(model);
      mixers.push(mixer);

      const action = mixer.clipAction(animation);
      action.play();

      gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.material.side = THREE.DoubleSide;
        }
      });
      scene.add(model);
    });
  } //end loadModels




// ================ model ================ //
  const loader2 = new THREE.ObjectLoader();
  loader2.load('https://raw.githubusercontent.com/baronwatts/models/master/camp.js', function (geometry, materials) {
    const matt = new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    });
    const wall = new THREE.Mesh(geometry, matt);
    wall.position.set(0, 0, 0);
    wall.rotateY(Math.PI);
    wall.scale.set(4, 4, 4);
    scene.add(wall);
  });




//=========================================================================================== full screen
  var requestFullscreen = function (ele) {
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
      ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
      ele.msRequestFullscreen();
    } else {
      console.log('Fullscreen API is not supported.');
    }
  }
  var exitFullscreen = function (ele) {
    if (ele.exitFullscreen) {
      ele.exitFullscreen();
    } else if (ele.webkitExitFullscreen) {
      ele.webkitExitFullscreen();
    } else if (ele.mozCancelFullScreen) {
      ele.mozCancelFullScreen();
    } else if (ele.msExitFullscreen) {
      ele.msExitFullscreen();
    } else {
      console.log('Fullscreen API is not supported.');
    }
  }



// =========== add particle texture for model ============ //
  const geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
  const material = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0 });
  const mesh2 = new THREE.Mesh(geometry, material);
  mesh2.position.set(5, 0, -5);
  scene.add(mesh2);
  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = ''; //allow cross origin loading


  const imageSrc = textureLoader.load('data:image/png;base64,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');

  const shaderPoint = THREE.ShaderLib.points;

  let uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
  uniforms.map.value = imageSrc;


  const smoke = new THREE.Group();
  mesh2.add(smoke);
  const matts = new THREE.PointsMaterial({
    size: 5,
    color: new THREE.Color("hsl(" + Math.floor(randnum(10, 50)) + ",50%,50%)"),
    map: uniforms.map.value,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: .5
  });




  const geo = new Geometry();
  const star = new THREE.Vector3();
  geo.vertices.push(star);
  const sparks = new THREE.Points(geo, matts);
  sparks.scale.set(1, 1, 1);

  for (let i = 0; i < 50; i++) {
    const clone = sparks.clone();
    clone.position.set((Math.random() - 0.5) * randnum(randnum(.5, 2), randnum(.5, 2)), 0, (Math.random() - 0.5) * randnum(randnum(.5, 2), randnum(.5, 2)));
    smoke.add(clone);
  }



// ========== add Animation ========= //
  let angle = 0,
    lastTime = null,
    u_frame = 0,
    clock = new THREE.Clock(),
    count = 0,
    prevTime = Date.now(),
    phase = 0;


  function moveCharacter() {
    characterGroup.position.z < -75 ? (characterGroup.position.z = 75) : (characterGroup.position.z -= .50);
  }

  function moveLights() {
    phase += 0.03;
    sphereLightMesh.position.z = 5 - Math.cos(phase) * 5;
    sphereLightMesh.position.x = Math.sin(phase) * 5;
    pointLight3.position.copy(sphereLightMesh.position);
  }


// ========= mouse ========== //
  let mouseX = 0;
  let mouseY = 0;
  const zoomIn = 20;
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / zoomIn;
    mouseY = (event.clientY - window.innerHeight / 2) / zoomIn;
  }



  (function animate() {
    //update models
    const delta = clock.getDelta();
    mixers.forEach((mixer) => { mixer.update(delta * 1.25); });
    moveCharacter();
    moveLights();


    renderer.render(scene, camera);
    // camera.position.x += (mouseX - camera.position.x) * .05;
    camera.lookAt(scene.position);

    smoke.rotation.y += .025;
    smoke.children.map((d, i) => {
      d.position.y = d.position.y > 5 ? 0 : d.position.y += (i * .0025);
    });

    requestAnimationFrame(animate);

  })();



  //gsap
  gsap.registerPlugin(ScrollTrigger);
  //set camera position
  camera.position.y = 1.5;
  camera.position.z = -25;
  camera.position.x = 1;
  gsap.to(camera.position, {
    z: -10,
    ease: "none",
    scrollTrigger:
      {
        trigger: renderer.domElement,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: true
      },
    //onUpdate: function () {
    //  camera.updateProjectionMatrix();
    //}
  })

})
