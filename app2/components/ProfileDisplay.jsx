import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import * as d3 from "d3";

import Axis from "./Axis";
import GenericCanvas from "./GenericCanvas";

const ProfileDisplay = props => {
 const { 
    contextRef, 
    profileWidth, 
    profileHeight,
    horzAxisDomain,
    horzAxisSize, 
    horzAxisLabel,
    axisPad 
  } = props

  const StackDiv = styled.div`
    display: grid;
    grid-template-rows: ${props => props.heights};
    place-items: center;
  `;

  const bottomScale = d3
    .scaleLinear()
    .domain(horzAxisDomain)
    .range([0, profileWidth])
  

  const bottomAxisProps = {
    ori: "bottom",
    size: horzAxisSize,
    pad: axisPad,
    visible: true,
    label: horzAxisLabel,
    tick: 'default',
    scale: bottomScale
  }

  const canvasProps = {
    contextRef: contextRef,
    width: profileWidth,
    height: profileHeight
  };

  const stackDivProps = {
    heights: " " + horzAxisSize + "px " + profileHeight + "px " + horzAxisSize + "px "
  };

  return (
    <StackDiv {...stackDivProps}>
      <div>
      </div>
      <div>
        <GenericCanvas {...canvasProps} />
      </div>
      <div>
        <Axis {...bottomAxisProps} />
      </div>
    </StackDiv>
  );
};

export default ProfileDisplay;
