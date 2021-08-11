// import * as THREE from 'three';
import Animation from "./animation";

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { Geometry } from "three/examples/jsm/deprecated/Geometry";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { Scene } from 'three';
// import { ScrollTrigger } from 'gsap/ScrollTrigger'


document.addEventListener('DOMContentLoaded', () => {

  const animation = new Animation()
  animation.init()
  animation.animate()
});
