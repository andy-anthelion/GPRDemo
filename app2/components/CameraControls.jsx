import React, { useRef } from "react";
import * as THREE from "three";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three-stdlib";

extend({ OrbitControls });

const CameraControls = props => {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controls = useRef();

  useFrame(state => {
    controls.current.update();
  });

  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

export default CameraControls;
