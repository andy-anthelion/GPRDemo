import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import styled from "styled-components";

import { Button, Container, Row, Col } from "react-bootstrap";

const FileView = props => {
  const { dispatchMultiFiles, onLoad, accept, name, disabled } = props;

  const butRef = React.useRef(null);
  const inpRef = React.useRef(null);
  const [msg, setMsg] = React.useState(" No file selected. ");

  const handleClick = e => {
    d3.select(inpRef.current)
      .node()
      .click();
  };

  const handleChange = e => {
    let reader = new FileReader();
    let name = e.target.files[0].name;

    reader.onloadstart = e => {
      setMsg(" Loading ... ");
    };
    reader.onerror = e => {
      setMsg(" Unable to load file! "); /*onLoad(null)*/
    };
    reader.onloadend = e => {
      setMsg(name.slice());
      onLoad(name, reader.result);
    };

    reader.readAsArrayBuffer(e.target.files[0]);
  };

  const propsFileInput = {
    ref: inpRef,
    type: "file",
    accept: accept,
    onChange: handleChange
  };
  const propsLoadFileButton = {
    ref: butRef,
    onClick: handleClick,
    variant: "outline-primary"
  };

  const propsRow = {
    className: "align-items-center"
  };

  const FileDiv = styled.div`
    width: 400px;
    margin-top: 20px;
  `;

  return (
    <FileDiv>
      <Container>
        <Row {...propsRow}>
          <Col>
            <input {...propsFileInput} style={{ display: "none" }} />
            <Button {...propsLoadFileButton}>{name}</Button>
          </Col>
          <Col>
            <span>{msg}</span>
          </Col>
        </Row>
      </Container>
    </FileDiv>
  );
};

export default FileView;
