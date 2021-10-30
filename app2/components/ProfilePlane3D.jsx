import React, { useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

const ProfilePlane3D = props => {
  const { canstate, getCanvasImage } = props;

  const meshref = useRef(null);

  React.useEffect(() => {
    if (canstate === false) {
      return;
    }
    meshref.current.map = new THREE.CanvasTexture(getCanvasImage());
    meshref.current.needsUpdate = true;
  }, [canstate]);

  return (
    <mesh position={[350, 128, 0]}>
      <planeGeometry args={[700, 256]} />
      <meshBasicMaterial
        ref={meshref}
        color="#EEEEEE"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default ProfilePlane3D;
