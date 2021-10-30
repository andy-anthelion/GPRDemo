import React from "react";
import styled from "styled-components";
import { Tabs, Tab } from "react-bootstrap";

import FileView from "./FileView";
import ProfileView from "./ProfileView";
import DisplayBundle from "./DisplayBundle";

import useRenderGSSI from "../hooks/RenderGSSI";

const Home = () => {
  const {
    fetchRenderContext,
    handleFileLoad,
    dataLoaded,
    getGSSIDataVal,
    getGSSIDataHdr,
    getGSSIDataCan,
    getHorzAxisDomain,
    getVertAxisDomain,
    hasEvent,
    renderProfileFromViewport,
    storeGSSIData,
    setCurrentData
  } = useRenderGSSI();

  const propsGSSIFileView = {
    disabled: false,
    onLoad: handleFileLoad,
    name: "GSSI Files",
    accept: ".dzt"
  };

  const propsPlainProfileView = {
    contextRef: fetchRenderContext,
    profileWidth: 700,
    profileHeight: 300,
    horzAxisDomain: getHorzAxisDomain(),
    horzAxisSize: 40,
    horzAxisLabel: "Traces",
    vertAxisDomain: getVertAxisDomain(),
    vertAxisSize: 80,
    vertAxisLabel: "Samples",
    axisPad: 15
  };

  const propsDisplayBundle = {
    canstate: dataLoaded,
    getCanvasImage: getGSSIDataCan
  };
  React.useEffect(() => {
    propsPlainProfileView.horzAxisDomain = getHorzAxisDomain();
    propsPlainProfileView.vertAxisDomain = getVertAxisDomain();
    renderProfileFromViewport();
  }, [hasEvent]);

  const propTabs = { defaultActiveKey: "profile" };
  const propTabFiles = { eventKey: "files", title: "Files" };
  const propTabProfile = { eventKey: "profile", title: "Profile (2D)" };
  const propTabBundle = { eventKey: "bundle", title: "Bundle (3D)" };

  const PageDiv = styled.div`
    position: fixed;
    right: 0;
    left: 0;
    margin-right: auto;
    margin-left: auto;
    min-height: 10em;
    width: 85%;
    top: 2em;
  `;

  return (
    <PageDiv>
      <h1>gprXcavte</h1>
      <Tabs {...propTabs}>
        <Tab {...propTabFiles}>
          <FileView {...propsGSSIFileView} />
        </Tab>
        <Tab {...propTabProfile}>
          <ProfileView {...propsPlainProfileView} />
        </Tab>
        <Tab {...propTabBundle}>
          <DisplayBundle {...propsDisplayBundle} />
        </Tab>
      </Tabs>
    </PageDiv>
  );
};

export default Home;
