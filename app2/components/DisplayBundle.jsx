import React, { useRef } from "react";
import * as THREE from "three"
import { Canvas } from "@react-three/fiber";

import CameraControls from "./CameraControls";
import ProfilePlane3D from "./ProfilePlane3D";

const DisplayBundle = props => {
  const { canstate, getCanvasImage } = props;

  const canvasStyle = {
    background: "#ffffff",
    width: "800px",
    height: "450px"
  };

  const propsProfilePlane3D = {
    canstate: canstate,
    getCanvasImage: getCanvasImage
  };

  const initCanvas = state => {
    const { camera, scene } = state;

    camera.fov = 45;
    camera.aspect = 16 / 9;
    camera.near = 0.1;
    camera.far = 5000;
    camera.position.set(300, 100, 1300);
    camera.lookAt(scene.position);

    camera.updateProjectionMatrix();
  };

  return (
    <Canvas
      style={canvasStyle}
      onCreated={initCanvas}
      linear={true}
      flat={true}
    >
      <CameraControls />
      <axesHelper args={[1000]} />
      <ProfilePlane3D {...propsProfilePlane3D} />
    </Canvas>
  );
};

export default DisplayBundle;
