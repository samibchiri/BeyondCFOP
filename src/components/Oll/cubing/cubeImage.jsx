// Source= http://cube.rider.biz/visualcube.php
import { cubeSVG } from "sr-visualizer";
import React, { useRef, useEffect, useContext } from "react";
import _ from "lodash";


import { ThemeContext } from '../../../context/DarkThemeContext.jsx';




const CubeImageInternal = (props) => {
  const imageRef = useRef(null);

  useEffect(() => {
    const container = imageRef.current;

    // Clear any existing SVG
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    cubeSVG(container, { ...props, colorScheme });

    // Only run when props change
  }, [props]);

  return <div ref={imageRef}></div>;
};


const Face = { U: 0, R: 1, F: 2, D: 3, L: 4, B: 5 };

const colorScheme = {
  [Face.U]: "yellow",
  [Face.R]: "red",
  [Face.F]: "#1F51FF", // brighter blue
  [Face.D]: "white",
  [Face.L]: "orange",
  [Face.B]: "#00D800", // default green
};

export const CubeImage = (props) => {
  
  const dyanmicKey = _.values(props).join();
  return <CubeImageInternal {...props} key={dyanmicKey} />;
};

CubeImage.defaultProps = {
  width: "50",
  height: "50",
};

const CaseImage = ({ size = 100, caseSetDetails, maskColor, alg,cubeOpacity,stickerOpacity,cubeSize, ...props }) => {
  if (!caseSetDetails) throw new Error("CaseImage must have caseSetDetails property");
  const { darkMode } = useContext(ThemeContext);
  const resolvedMaskColor = maskColor ?? (darkMode ? "#404044" : "#666");
  const cubeColor = darkMode ? "#000" : "#181818";
  const algorithm = props.case?.algs?.[0] || alg;

const normalizedAlgorithm = algorithm
  ?.replace(/R3/g, "R'")
  ?.replace(/U3/g, "U'")
  ?.replace(/F3/g, "F'")
  ?.replace(/D3/g, "D'")
  ?.replace(/L3/g, "L'")
  ?.replace(/B3/g, "B'")
  ?.replace(/R4/g, "")
  ?.replace(/U4/g, "")
  ?.replace(/F4/g, "")
  ?.replace(/D4/g, "")
  ?.replace(/L4/g, "")
  ?.replace(/B4/g, "");
  const { mask, view,arrows } = caseSetDetails;
  const rest = { mask, view, arrows, maskColor: resolvedMaskColor, cubeColor,cubeOpacity,cubeSize,
  stickerOpacity };

  console.log("Normalized")
  return <CubeImage case={normalizedAlgorithm || ""} height={size} width={size} {...rest} />;
};


CaseImage.defaultProps = {
  size: "100",
  stickerOpacity:"100",
  cubeOpacity:"100",
  cubeSize:3
};

export default CaseImage;
