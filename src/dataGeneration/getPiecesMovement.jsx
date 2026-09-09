
import React, { useLayoutEffect,useRef,useContext, useState, useEffect } from "react"; // removed 'use'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import CaseImage from "../components/Oll/cubing/cubeImage.jsx";

import TestPage from '../pages/TestPage/TestPage.jsx';
import CornerPermutationPage from '../pages/CpPage/CornerPermutationPage.jsx';
//import ArrowDataGenerator from '../../dataGeneration/ArrowDataGenerator.jsx'
import cpllCaseSet from "../data/cpllCaseSet.js";
import eollCaseSet from "../data/eollCaseSet.js";
import epllCaseSet from "../data/epllCaseSet.js";
import f2lCaseSet from "../data/f2lCaseSet.js";
import ocllCaseSet from "../data/ocllCaseSet.js";
import ollCaseSet from "../data/ollCaseSet.js";
import pllCaseSet from "../data/pllCaseSet.js";
import BarPersevation from '../pages/BarPersevationPage/BarPersevationPage.jsx';

// Bootstrap CSS fir-st
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaIcon } from '../assets/fontAwesome.js';

// Your custom CSS after Bootstrap
import '../styling/App.css';
import '../styling/index.css';
import '../styling/PopUp.css';

import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../data/NewGeneratedData/db.js';

import {sortOlls} from "../context/OllContext.jsx"

//import arrowOllSet from "./data/arrowOllSet.js";

import arrowOllSet from "../data/arrowOllSet copy.js"
import { ThemeContext } from '../context/DarkThemeContext.jsx';
import {useOll} from "../context/ollContext.jsx"

import ShowAlgCard from "../pages/TrainSelectPage/cardPopUp.jsx";
import Bar6Grid from "../pages/BarPersevationPage/Bar6Grid.jsx";

import Stopwatch from '../components/Train/Stopwatch.jsx';

import BarPersevationOverlay from "../1OllBarInfo.jsx";

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../hooks/useWindowDimensions.jsx";

import {useWindowWidthLogic,GetCentersPosition,addInformationToColorIndexList,getCubeColors,
  sortPointsList,sortCenterLeftRight,isPositionLeft,Connect2Points,
  CalculatePointsDistance, convert2CentersToCoordinates, Connect2Centers,getCirclePath,ArrowBarMovement} from "../pages/BarPersevationPage/BarPersevationLogic.jsx";

import arrowsInfoGen from "../1OllArrowCpInfo.jsx";
import { piecesMovementGen } from "../pages/BarPersevationPage/BarPersevationLogic.jsx";
import { getHeadlights } from "./ArrowDataGenerator.jsx";


function getPiecesMovement(altoverlayRefs){



//   const [refsReady, setRefsReady] = useState(false);

    // const altoverlayRefs = useRef([]);



  const setOverlayRef = (el,index)=> {



  altoverlayRefs.current = el;


  if (el){
    if(!refsReady){
      setRefsReady(true);
    }
  } 
};

// useLayoutEffect(() => {
//   let paths
//   console.log("RefsRed?",refsReady)
//   if (!refsReady) return;
//   try {
//     paths =  GetBarsIndices(0, 0) || ["", "none"];
        
//       } catch (err) {
//         console.error('GetBarsIndices error for idx',0 ,0, err)
//         return ["","none"];
//       }



// //   setOverlayPaths(paths);
// //   setPathCalculated(true);
// }, [refsReady]);


 let containerparent = altoverlayRefs.current;
  
    if (!containerparent) {
      console.warn('GetBarsIndices: no ref for index', PermIndex);
      return ["","red"]
    }
    let container= containerparent.querySelector("div")
    let ContainerSvg = container.querySelector('svg');
  if (!ContainerSvg) {
    console.warn('GetBarsIndices: no svg inside container', container);
    return ["","red"]
  }
  let ContainerSvgSquaresInside= ContainerSvg.querySelectorAll("g")[1]
  let ContainerSvgSquaresInsideList= ContainerSvgSquaresInside.querySelectorAll("polygon")
  //console.log(containerSvgSquaresInsideList)
  let ContainerSvgSquaresOutside= ContainerSvg.querySelectorAll("g")[2]
  
  let ContainerSvgSquaresOutsideList= ContainerSvgSquaresOutside.querySelectorAll("polygon")
  //console.log(ContainerSvgSquaresOutsideList[0].getAttribute("points").split(" "))
  let combinedSquaresList=[...ContainerSvgSquaresInsideList,...ContainerSvgSquaresOutsideList]
  combinedSquaresList=[...combinedSquaresList,...[0,0,0,0]]
  let Remapping = [
      [0,6],[1,7],[2,8],[3,11],[4,12],
      [5,13],[6,16],[7,17],[8,18],[9,19],
      [10,14],[11,9],[12,21],[13,22],[14,23],
      [15,5],[16,10],[17,15],[18,3],[19,2],
      [20,1],[21,24],[22,20],[23,4],[24,0]
    ];
  let newCombinedSquaresList=Array.from( {length:25}, ()=> 0)
  //console.log(newCombinedSquaresList)
  combinedSquaresList.forEach((_,i)=>{
      newCombinedSquaresList[Remapping[i][1]]=combinedSquaresList[i]
  })
    let newSquaresColors= Array.from( {length:25}, ()=> 0)
  newCombinedSquaresList.forEach((_,i)=>{
    if (newCombinedSquaresList[i]!=0){
        newSquaresColors[i]=newCombinedSquaresList[i].getAttribute("fill")
    }
    else{
        newSquaresColors[i]=0
    }
        
  })

  let piecesMovement= piecesMovementGen(newSquaresColors,newCombinedSquaresList);

    


return(
    piecesMovement
    // <>
    //     <div className="RecCont"  ref={(el)=> setOverlayRef(el,0)}> 
    //                         {/* {console.log("Erro?",oll.algs,oll.ollNumber,oll.algNumber,pll)} */}
    //                         <CaseImage
    //                             size={200}
    //                             alg={(oll).replace(/\s+/g, "")+"y2"}
    //                             caseSetDetails={ScrambleVisualizerDetails}
    //                             co="40"
    //                         ></CaseImage>
                            
    //         </div>
    // </>
)
}

export default getPiecesMovement