
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

import getPiecesMovement from "./getPiecesMovement.jsx";

export function pllPiecesDataGen(){  
  
  let PermTable=[0,5,1,2,3,4]
  //let pllPreAUF=["","","U2","U","U'",""]
  let pllPreAUF=["","","","","",""]

  let AUFs=["","U","U2","U'"]


let T_Perm="R U R' U' R' F R2 U' R' U' R U R' F'"
let Y_Perm="F R U' R' U' R U R' F' R U R' U' R' F R F'"
let F_Perm="R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"

const ScrambleVisualizerDetails={
    id: "oll",
    title: "OLL",
    subTitle: "Full OLL",
    view: "plan",
    stage:"cross",
    numCases: 57,
}

  let PiecesMovementList = useRef([])
  const  [pllIndex,setPllIndex] = useState(0)

  console.log("PllCaseSet",pllCaseSet)
  let AllPllAlgAngles=[]

  pllCaseSet.cases.forEach((item)=>{
   
    AllPllAlgAngles.push(item.algs[0])
    AllPllAlgAngles.push("U "+ item.algs[0])
    AllPllAlgAngles.push("U2 "+item.algs[0])
    AllPllAlgAngles.push("U' "+item.algs[0])
    // AllPllAlgAngles.push(T_Perm)
    
  })

  const [pll,setPll]=useState(AllPllAlgAngles[0])

  const [refsReady, setRefsReady] = useState(false);


  const altoverlayRefs = useRef([]);

function GetBarsIndices(OllIndex,PermIndex){
  
  let piecesMovement= getPiecesMovement(altoverlayRefs)

//   console.log("PiecesMovement",pllIndex,headlights,piecesMovement,newSquaresColors,newCombinedSquaresList)
  //console.log(newSquaresColors)

  PiecesMovementList.current.push(piecesMovement)


   //Important!
    console.log(
    "const pllPiecesMovementList = " +
    JSON.stringify(PiecesMovementList.current, null, 2)
        .replace(/"([^"]+)":/g, '$1:') + 
    ";\n\nexport default pllPiecesMovementList;"
    );
   

    return

}


const setOverlayRef = (el,index)=> {

  altoverlayRefs.current = el;


  if (el){
    if(!refsReady){
      setRefsReady(true);
    }
  } 
};

// compute overlayPaths after refs mount; run this AFTER refsReady becomes true
useLayoutEffect(() => {
  let paths
  console.log("RefsRed?",refsReady)
  if (!refsReady) return;
  try {
    paths =  GetBarsIndices(0, 0) || ["", "none"];
        
      } catch (err) {
        console.error('GetBarsIndices error for idx',0 ,0, err)
        return ["","none"];
      }
}, [refsReady]);

useEffect(() => {
    console.log("RefsRedy PLL:", refsReady,AllPllAlgAngles[pllIndex + 1]);
    if(refsReady){ 
        if (pllIndex < 83) {
            console.log("Advancing PLL:", pllIndex,AllPllAlgAngles[pllIndex + 1]);

            setPll(AllPllAlgAngles[pllIndex + 1]);
            setRefsReady(false);
            setPllIndex(pllIndex+1)
        }
    }
}, [pllIndex,refsReady]);



return (
  
  <>
  
  



                    <div className="RecCont"  ref={(el)=> setOverlayRef(el,0)}> 
                    {/* {console.log("Erro?",oll.algs,oll.ollNumber,oll.algNumber,pll)} */}
                    <CaseImage
                        size={200}
                        alg={(pll).replace(/\s+/g, "")+"y2"}
                        caseSetDetails={ScrambleVisualizerDetails}
                        co="40"
                    ></CaseImage>
                    
                   
                    </div>
                    




  </>

)

}

export default pllPiecesDataGen
