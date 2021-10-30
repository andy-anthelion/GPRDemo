import React, { useRef } from "react";
import styled from "styled-components";
import * as d3 from "d3";

import ProfileDisplay from "./ProfileDisplay";
import Axis from "./Axis";

const ProfileView = props => {
  const {
    contextRef,
    profileWidth,
    profileHeight,
    horzAxisDomain,
    horzAxisSize,
    horzAxisLabel,
    vertAxisDomain,
    vertAxisSize,
    vertAxisLabel,
    axisPad
  } = props;

  const ShelfDiv = styled.div`
    display: grid;
    grid-template-columns: ${props => props.widths};
  `;

  const profileDisplayProps = {
    contextRef: contextRef,
    profileWidth: profileWidth,
    profileHeight: profileHeight,
    horzAxisDomain: horzAxisDomain,
    horzAxisSize: horzAxisSize,
    horzAxisLabel: horzAxisLabel,
    axisPad: axisPad
  };

  const leftScale = d3
    .scaleLinear()
    .domain(vertAxisDomain)
    .range([0, profileHeight]);

  const leftAxisProps = {
    ori: "left",
    size: vertAxisSize,
    pad: horzAxisSize,
    visible: true,
    label: vertAxisLabel,
    tick: "default",
    scale: leftScale
  };

  const shelfDivProps = {
    widths: " " + vertAxisSize + "px " + (profileWidth + 2 * axisPad) + "px "
  };

  return (
    <ShelfDiv {...shelfDivProps}>
      <div>
        <Axis {...leftAxisProps} />
      </div>
      <div>
        <ProfileDisplay {...profileDisplayProps} />
      </div>
    </ShelfDiv>
  );
};

export default ProfileView;
