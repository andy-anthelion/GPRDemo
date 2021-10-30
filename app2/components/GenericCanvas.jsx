import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import styled from "styled-components";

const GenericCanvas = props => {
  const { contextRef, width, height } = props;

  const canref = React.useRef(null);

  React.useEffect(() => {
    contextRef(canref.current.getContext("2d"));
  }, []);

  return <canvas ref={canref} width={width} height={height} />;
};

export default GenericCanvas;
