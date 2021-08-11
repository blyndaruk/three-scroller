import * as THREE from 'three'
import * as gsap from "gsap";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { NormalBlending } from "three";
import TweenLite from "gsap/gsap-core";
import TextSprite from '@seregpie/three.text-sprite';

// import debounce from 'debounce'


export default class Animation {
  constructor () {
    this.geometry= ''
    this.camera= null
    this.scene= null
    this.renderer = null
    // this.material = null
    this.mesh = null
    this.speed = 0
    this.canvasDOM = null
    this.mouse = new THREE.Vector2();
    this.target = new THREE.Vector2();
  }
  // onResize() {
  //   // this.$refs.canvas.parentNode.removeChild(this.renderer.domElement)
  //   this.init()
  //   this.animate()
  // }
  init() {
    this.clock = new THREE.Clock()
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    // this.renderer.setClearColor( 0xFFB00F, 1);
    this.scene = new THREE.Scene()
    this.frustum = new THREE.Frustum();
    this.cameraViewProjectionMatrix = new THREE.Matrix4();
    this.addCamera()
    this.addImage()
    this.addSecondImage()
    this.addThirdImage()
      // this.addSmoke()



    // this.scene.background = new THREE.Color( 0xFFB00F );

    {
      const near = 300;
      const far = 1000;
      const color = 0xFFB00F;
      this.scene.fog = new THREE.Fog(color, near, far);
      this.scene.background = new THREE.Color(color);
    }


    // {
    //   const color = 0xFFFFFF;
    //   const intensity = 1;
    //   const light = new THREE.DirectionalLight(color, intensity);
    //   light.position.set(-1, 2, 4);
    //   this.scene.add(light);
    // }





    // let text3d = new THREE.TextGeometry('Simple', {
    //   font: "Helvetica",
    //   color: '#ffbbff',
    // });
    //
    // const textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: true } );
    // const text = new THREE.Mesh( text3d, textMaterial );
    // text.position.set( -140, -40, 1000 );
    // this.scene.add( text );

    // this.firstImage.position.x = -140
    // this.firstImage.position.y = -40
    // this.firstImage.position.z = 800
    const loader = new THREE.FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', ( font ) => {

      console.log('loaded');
      const geometry = new THREE.TextGeometry( '1986', {
        font: font,
        size: 180,
        height: 5,
        curveSegments: 24,
        bevelEnabled: true,
        bevelThickness: 4,
        bevelSize: 4,
        bevelOffset: 0,
        bevelSegments: 5
      } );

      const textMaterial = new THREE.MeshPhongMaterial(
        { color: 0x1D1D1D }
      );

      const mesh = new THREE.Mesh(geometry, textMaterial);

      mesh.position.x = -320
      mesh.position.y = -80
      mesh.position.z = 0
      this.scene.add(mesh);
      // this.scene.add(geometry);
    } );

    // instance.set(-140, -40, 1)




    window.addEventListener('wheel', (e) => {
      this.speed += e.deltaY * 0.01 * -1 // -1 for inverse scrolling
      // console.log(this.speed);
      this.camera.position.z = (this.speed * 10) + 1200
      // console.log(this.image.position);


      // Test
      // console.log(this.getCameraDistanceFrom(this.camera, this.firstImage.position), this.getCameraDistanceFrom(this.camera, this.SecondImage.position));



      if (this.camera.position.z < 800) {
        // on second image for now
        // this.imageSecondMaterial.blending = 0
        // this.scene.background = new THREE.Color(0xFFB00F);
        // this.scene.fog = new THREE.Fog(0xBC2127, 1, 900);
        this.changeColor(0xFFB00F, 0xBC2127)

      } else {

        // this.scene.fog = new THREE.Fog(0xFFB00F, 1, 900);
        // this.scene.background = new THREE.Color(0xBC2127);
        this.changeColor(0xBC2127, 0xFFB00F)
        // this.imageSecondMaterial.blending = 4
      }




      // var frustum = new THREE.Frustum();
      // var cameraViewProjectionMatrix = new THREE.Matrix4();

      this.camera.updateMatrix();
      this.camera.updateMatrixWorld();
      var frustum = new THREE.Frustum();
      frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

      const { x, y, z } = this.firstImage.position;
      const pos = new THREE.Vector3(x, y, z);
      if (frustum.containsPoint(pos)) {
        // this.changeColor(0xBC2127, 0xFFB00F)
      } else {
        // this.changeColor(0xFFB00F, 0xBC2127)

      }
    })








    document.body.appendChild( this.renderer.domElement );
    document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
    // this.$refs.canvas.parentNode.appendChild(this.renderer.domElement)
  }

  getCameraDistanceFrom (camera, position) {
    const cameraDistance = new THREE.Vector3();
    // const target = new THREE.Vector3(x,y,z);
    cameraDistance.subVectors(camera.position, position);
    return cameraDistance.length();
  }

  onMouseMove( e ) {
    // this.mouse.x = ( e.clientX - this.windowHalf.x );
    // this.mouse.y = ( e.clientY - this.windowHalf.x );
    this.mouse.x = e.clientX / window.innerWidth - .5
    this.mouse.y = e.clientY / window.innerHeight - .5

    // if (e.clientX>mouse.x) { camera.position.x += this.cameraMoves.speed; } else { camera.position.x += -this.cameraMoves.speed; }
    // if (e.clientY>mouse.y) { camera.position.y += -this.cameraMoves.speed; } else { camera.position.y += this.cameraMoves.speed; }
    //
    // this.mouse.x = e.clientX;
    // this.mouse.y = e.clientY;
  }

  changeColor(colorFrom, colorTo) {
    // const initial = 0xFFB00F;
    // const value = 0xBC2127;
    const value = new THREE.Color(colorTo);
    // console.log(value.r);

    // this.scene.fog = new THREE.Fog(color, near, far);
    // this.scene.background = new THREE.Color(color);

    TweenLite.to(this.scene.fog.color, 1.2, {
      r: value.r,
      g: value.g,
      b: value.b,
    });
    TweenLite.to(this.scene.background, 1.2, {
      r: value.r,
      g: value.g,
      b: value.b,
    });
    // TweenLite.fromTo(this.imageSecondMaterial, 1,
    //   {
    //     blending: 4,
    //   },
    //   {
    //     blending: 0,
    //   }
    // );

    // this.renderTween()
    // this.renderer.setClearColor(color, 1);
  }
  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.z = 1200
    this.scene.add(this.camera)
  }
  addImage() {
    const material = new THREE.MeshLambertMaterial({
      color: 0xaa6666,
      wireframe: false,
    })
    this.mesh = new THREE.Mesh('', material)
    const imgWidth = 640 / 3
    const imgHeight = 420 / 3
    const imageGeo = new THREE.PlaneGeometry(imgWidth, imgHeight)
    THREE.ImageUtils.crossOrigin = '' // Need this to pull in crossdomain images from AWS
    const imageTexture = THREE.ImageUtils.loadTexture('images/test-img.jpg')
    const imageMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0.7,
      map: imageTexture,
      transparent: true,
      // blending: 4, // bug with fog
    })
    this.firstImage = new THREE.Mesh(imageGeo, imageMaterial)
    this.firstImage.position.x = -140
    this.firstImage.position.y = -40
    this.firstImage.position.z = 800
    this.scene.add(this.firstImage)
    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(-1, 0, 1)
    this.scene.add(light)
  }
  addSecondImage() {
    const material = new THREE.MeshLambertMaterial({
      color: 0xaa6666,
      wireframe: false,
    })
    this.mesh = new THREE.Mesh('', material)
    const imgWidth = 640 / 3
    const imgHeight = 960 / 3
    const imageGeo = new THREE.PlaneGeometry(imgWidth, imgHeight)
    THREE.ImageUtils.crossOrigin = '' // Need this to pull in crossdomain images from AWS
    const imageTexture = THREE.ImageUtils.loadTexture('images/test-img2.jpg')
    this.imageSecondMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0.7,
      map: imageTexture,
      transparent: true,
      // blending: 4,
    })
    this.SecondImage = new THREE.Mesh(imageGeo, this.imageSecondMaterial)
    this.SecondImage.position.x = 300
    this.SecondImage.position.y = 160
    this.SecondImage.position.z = 400
    this.scene.add(this.SecondImage)
    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(-1, 0, 1)
    this.scene.add(light)
  }
  addThirdImage() {
    const material = new THREE.MeshLambertMaterial({
      color: 0xaa6666,
      wireframe: false,
    })
    this.mesh = new THREE.Mesh('', material)
    const imgWidth = 960 / 3
    const imgHeight = 590 / 3
    const imageGeo = new THREE.PlaneGeometry(imgWidth, imgHeight)
    THREE.ImageUtils.crossOrigin = '' // Need this to pull in crossdomain images from AWS
    const imageTexture = THREE.ImageUtils.loadTexture('images/space.png')
    this.imageSecondMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0.7,
      map: imageTexture,
      transparent: true,
      // blending: 4,
    })
    this.thirdImage = new THREE.Mesh(imageGeo, this.imageSecondMaterial)
    this.thirdImage.position.x = -300
    this.thirdImage.position.y = 300
    this.thirdImage.position.z = 300
    this.scene.add(this.thirdImage)
    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(-1, 0, 1)
    this.scene.add(light)
  }
  addSmoke() {
    this.smokeTexture = THREE.ImageUtils.loadTexture('images/smoke.png')
    this.smokeMaterial = new THREE.MeshLambertMaterial({
      color: 0x00dddd,
      map: this.smokeTexture,
      transparent: true,
    })
    this.smokeGeo = new THREE.PlaneGeometry(400, 400)
    this.smokeParticles = []
    for (let p = 0; p < 150; p++) {
      this.particle = new THREE.Mesh(this.smokeGeo, this.smokeMaterial)
      this.particle.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 500 - 100
      )
      this.particle.rotation.z = Math.random() * 360
      this.scene.add(this.particle)
      this.smokeParticles.push(this.particle)
    }
  }
  render() {
    this.mesh.rotation.x += 0.005
    this.mesh.rotation.y += 0.01
    this.cubeSineDriver += 0.01
    this.mesh.position.z = 100 + Math.sin(this.cubeSineDriver) * 500
    this.renderer.render(this.scene, this.camera)
  }
  animate() {
    // if (!this || this.clock) return
    this.delta = this.clock.getDelta()
    // console.log(this.target.x);
    // this.target.x = ( 1 - this.mouse.x ) * 0.0005;
    // this.target.y = ( 1 - this.mouse.y ) * 0.0005;

    // this.target.x = this.mouse.x * .0008;
    // this.target.y = this.mouse.y * .0008;
    // window.innerWidth - .5

    // this.camera.rotation.x += ( this.target.y - this.camera.position.x ) * 0.05;
    // this.camera.rotation.y += ( this.target.x - this.camera.position.y ) * 0.05;
    // console.log(this.camera.rotation.y);
    // this.camera.rotation.y += 0.05 * ( this.target.x - this.camera.rotation.y );
    // this.camera.rotation.x += 0.05 * ( this.target.y - this.camera.rotation.x ) + 0.02;
    TweenLite.to(this.camera.rotation, 2, {
      x: .5 * -this.mouse.y,
      y: .5 * -this.mouse.x,
      // ease: "Power4.easeOut"
    })
    // this.camera.rotation.x += 0.05 * ( this.target.y - this.camera.rotation.x );
    // this.camera.rotation.y += 0.05 * ( this.target.x - this.camera.rotation.y );
    // this.camera.lookAt( this.scene.position );
    // console.log(this.camera.rotation.y);
    requestAnimationFrame(this.animate.bind(this))
    // this.evolveSmoke()
    // if (this.tween) this.tween.update();
    this.render()
  }
  // renderTween() {
  //   requestAnimationFrame(this.renderTween.bind(this));
  //   this.tween.update(); // don't forget to add this line when you use Tween.js
  //   this.renderer.render(this.scene, this.camera);
  // }
  evolveSmoke() {
    this.sp = this.smokeParticles.length
    // this.camera.position.z = 1000
    while (this.sp--) {
      // this.camera.position.z = this.speed * 10
      // console.log(this.delta * 0.12);
      this.smokeParticles[this.sp].rotation.z += this.delta * 0.12
    }
  }
}

