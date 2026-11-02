
import arrowOllSet from "../../data/arrowOllSet.js";
//import arrowOllSet from "../../data/arrowOllSet copy.js"
import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import React, { useMemo, useContext,useRef, useEffect, useState } from "react";
import '../../styling/index.css'
import { FaIcon } from '../../assets/fontAwesome.js';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import ollCaseSet from "../../data/ollCaseSet.js";
import CpRecOverlay from "../../assetsGeneration/CpOverlay.jsx"
import OllCaseFilter from "../../components/Oll/OllCaseFilter.jsx";
import OllGroupSelector from "../../components/Oll/OllGroupSelect.jsx";
import { db } from '../../data/NewGeneratedData/db.js';

import { useLiveQuery } from "dexie-react-hooks";
import {sortOlls} from "../../context/OllContext.jsx"
import { ChangeOllCont } from "../BarPersevationPage/changeAlg.jsx";
import {ArrowDataGenerator} from "../../dataGeneration/ArrowDataGenerator.jsx"
import BarPersevationOverlay from "../../1OllBarInfo.jsx";
import Cp6Grid from "./Cp6Grid.jsx";
import ShowBarFullHint from "../BarTrainerPage/BarTrainerAnsPopup.jsx";


function CornerPermutationPage({algGroup,testedAlgs,setButtonClicked,setCaseClicked}){


 
// const allOlls = useLiveQuery(() => db.olls.toArray(), []);
// const changeOll = async (event)=>{
//     event.preventDefault()
//     const newOll= 
// }

const [groupSelected,setGroupSelected]=useState(0)
const [ollSelectList,setOllSelectList]=useState([])
const [changedAlgArray,setChangedAlgArray]=useState(["","",false])

const [showPopUpCard, setShowPopUpCard] = useState([])
const [algCasesSet, setAlgCasesSet] = useState(ollCaseSet)


const ScrambleVisualizerDetails={
    id: "oll",
    title: "OLL",
    subTitle: "Full OLL",
    view: "plan",
    stage:"cross",
    numCases: 57,
}
const {darkMode}= useContext(ThemeContext)

  const BackButtonstyle={
    width: "75px",
    height: "40px",
    alignItems:"center",
    fontWeight:"bold",
    borderWidth:"2px",
    
    

  }
  
  const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        height: "50px",
    }

    const handleAlgCardShown = (alg) => {
        console.log("HandleShown")
        console.log(alg)
        setShowPopUpCard([alg])
    }

  const selectedGroupOllsRaw = useLiveQuery(()=>{
      if (groupSelected === null) {
        return [];
      }
      db.olls.toArray().then(olls => {
    console.log("Wut3", olls);
    });
      return db.olls.where("group").equals(groupTable[groupSelected]).toArray().then(arr => arr.sort(sortOlls));;
    },[groupSelected]
  );
  
  const selectedGroupOlls = useMemo(
    () => selectedGroupOllsRaw ?? [],
    [JSON.stringify(selectedGroupOllsRaw)]
  );
  
  
const groupTable = {
  0: "Cross",
  1: "Dot",
  2: "T Shape",
  3: "C Shape",
  4: "I Shape",
  5: "P Shape",
  6: "W Shape",
  7: "Small L Shape",
  8: "Small Lightning Bolt",
  9: "Big Lightning Bolt",
  10: "Square Shape",
  11: "Fish Shape",
  12: "Knight Move Shape",
  13: "Awkward Shape",
  14: "Corners Oriented"
}

function GetCentersPosition(cubeSize){
 
    const xCoords = [9.5, 39.5, 79.5, 119.5,149.5];
    const yCoords = [9.75, 39.75, 79.75, 119.75, 149.75];

    let Centers = [];

   
    for (let y of yCoords) {
        for (let x of xCoords) {
            Centers.push([x*(cubeSize/200), y*(cubeSize/200)]);
        }
    }
    
    return Centers

}

function Arrow(Center1,Center2,color,index){

    let Centers=GetCentersPosition()


let centerx=Centers[Center1][0]
let centery=Centers[Center1][1]

let centerx2=Centers[Center2][0]
let centery2=Centers[Center2][1]


let Correction=(centery2-centery)>0? 90:-90

let angle = Math.atan(-(centerx2 - centerx) / (centery2 - centery))*180/Math.PI;
if (centery==centery2){
    angle=0
    Correction=0
}
if (centerx>centerx2 && centery==centery2){
    [centerx, centerx2] = [centerx2, centerx];
    let difference=centerx2-centerx
    centerx-=difference
    centerx2-=difference
    // centery2-=2.5
    // centery-=1.5
    Correction+=180
}

angle+=Correction



centerx=Centers[Center1][0]
centery=Centers[Center1][1]
let centerpath=`M ${centerx},${centery} L ${centerx},${centery+2} L ${centerx+2},${centery+2} L ${centerx+2},${centery} L ${centerx},${centery} Z`

centerx=Centers[Center2][0]                                                               
centery=Centers[Center2][1]
let centerpath2=`M ${centerx},${centery} L ${centerx},${centery+2} L ${centerx+2},${centery+2} L ${centerx+2},${centery} L ${centerx},${centery} Z`



centerx=Centers[Center1][0]
centery=Centers[Center1][1]

centerx2=Centers[Center2][0]
centery2=Centers[Center2][1]
centerx=centerx2-((centerx-centerx2)**2+(centery-centery2)**2)**(1/2)                                                                                                                                                                                                                                                                                                                   //L 37,41 37,45 27,39 37,33 Z"
centery2+=1

let pathArrow2=`M ${centerx+3},${centery2-2} L ${centerx2-1},${centery2-2} L ${centerx2-1},${centery2-6} L ${centerx2+8},${centery2} L ${centerx2-1},${centery2+6} L ${centerx2-1},${centery2+2} L ${centerx+3},${centery2+2} L ${centerx+3},${centery2+2} L ${centerx+3},${centery2+6} L ${centerx-6},${centery2} L ${centerx+3},${centery2-6}  Z`

}

function getCenter1And2(oll,index,arrowNumber){
    let Center1
    let Center2
    if(index==0){
    Center1=oll.fullDiagCp[0][0][0+arrowNumber*3]
    Center2=oll.fullDiagCp[0][0][1+arrowNumber*3]
    }
    else if(index==5){
        Center1=oll.fullDiagCp[0][1][0+arrowNumber*3]
        Center2=oll.fullDiagCp[0][1][1+arrowNumber*3]
    }
    else if(index==1){
        Center1=oll.leftRightCp[0][0][0+arrowNumber*3]
        Center2=oll.leftRightCp[0][0][1+arrowNumber*3]
    }
    else if(index==2){
        Center1=oll.leftRightCp[0][1][0+arrowNumber*3]
        Center2=oll.leftRightCp[0][1][1+arrowNumber*3]
    }
    else if(index==3){
        Center1=oll.frontBackCp[0][0][0+arrowNumber*3]
        Center2=oll.frontBackCp[0][0][1+arrowNumber*3]
    }
    else if(index==4){
        Center1=oll.frontBackCp[0][1][0+arrowNumber*3]
        Center2=oll.frontBackCp[0][1][1+arrowNumber*3]
    }

    return [Center1,Center2]
}

function getPath(oll,index,arrowNumber){
    
    let [Center1,Center2]=getCenter1And2(oll,index,arrowNumber);
    let Centers=GetCentersPosition(cubeSize)
    let centerx=Centers[Center1][0]
    let centery=Centers[Center1][1]

    let centerx2=Centers[Center2][0]
    let centery2=Centers[Center2][1]
    centerx=centerx2-((centerx-centerx2)**2+(centery-centery2)**2)**(1/2)                                                                                                                                                                                                                                                                                                                   //L 37,41 37,45 27,39 37,33 Z"
    centery2+=1

    // let pathArrow=`M ${centerx+3},${centery2-2} L ${centerx2-1},${centery2-2} L ${centerx2-1},${centery2-6} L ${centerx2+8},${centery2} L ${centerx2-1},${centery2+6} L ${centerx2-1},${centery2+2} L ${centerx+3},${centery2+2} L ${centerx+3},${centery2+2} L ${centerx+3},${centery2+6} L ${centerx-6},${centery2} L ${centerx+3},${centery2-6}  Z`
    let arrowWidth=cubeSize/200*2
  

    let pathArrow=`M ${centerx+3},${centery2-arrowWidth} L ${centerx2-1},${centery2-arrowWidth} L ${centerx2-1},${centery2-arrowWidth*3} L ${centerx2+arrowWidth*4},${centery2} L ${centerx2-1},${centery2+arrowWidth*3} L ${centerx2-1},${centery2+arrowWidth} L ${centerx+3},${centery2+arrowWidth} L ${centerx+3},${centery2+arrowWidth} L ${centerx+3},${centery2+arrowWidth*3} L ${centerx-arrowWidth*3},${centery2} L ${centerx+3},${centery2-arrowWidth*3}  Z`
    
    return pathArrow
}



function getRotation(oll,index,arrowNumber){ 

    let [Center1,Center2]=getCenter1And2(oll,index,arrowNumber);
    
    let Centers=GetCentersPosition(cubeSize)

    let centerx=Centers[Center1][0]
    let centery=Centers[Center1][1]

    let centerx2=Centers[Center2][0]
    let centery2=Centers[Center2][1]


    let Correction=(centery2-centery)>0? 90:-90

    let angle = Math.atan(-(centerx2 - centerx) / (centery2 - centery))*180/Math.PI;
    if (centery==centery2){
        angle=0
        Correction=0
    }
    if (centerx>centerx2 && centery==centery2){
        [centerx, centerx2] = [centerx2, centerx];
        let difference=centerx2-centerx
        centerx-=difference
        centerx2-=difference
        // centery2-=2.5
        // centery-=1.5
        Correction+=180
    }

    angle+=Correction
    return angle

}

function GetColor(oll,index,arrowNumber){
    
    let color
    let type

    //First select which set of arrows,
    //Then Select whether it is first or second arrow.
    //Then arrow properties
    if(index==0){
        type=oll.fullDiagCp[0][0][2+arrowNumber*3]
    }
    else if(index==1){
        type=oll.leftRightCp[0][0][2+arrowNumber*3]
    }
    else if(index==2){
        type=oll.leftRightCp[0][1][2+arrowNumber*3]
    }
    else if(index==3){
        type=oll.frontBackCp[0][0][2+arrowNumber*3]
    }
    else if(index==4){
        type=oll.frontBackCp[0][1][2+arrowNumber*3]
    }
    else if(index==5){
        type=oll.fullDiagCp[0][1][2+arrowNumber*3]
    }

    if(type=="opp"){
        color="red"
    }
    else if (type=="same"){
        color="cyan"
    }
    else{
        color="lime"
    }
    return color
}

function getArrowTipCoord(oll,index,arrowNumber,cubeSize){
    let [Center1,Center2]=getCenter1And2(oll,index,arrowNumber);
    let Centers= GetCentersPosition(cubeSize)
    let centerx2=Centers[Center2][0]
    let centery2=Centers[Center2][1]

    //+1 for correction, don't know why
    return [centerx2+1,centery2]

}


let T_Perm="R U R' U' R' F R2 U' R' U' R U R' F'"
let Y_Perm="F R U' R' U' R U R' F' R U R' U' R' F R F'"

let CornerPermutations=["",T_Perm,"U2"+T_Perm,"U"+T_Perm,"U'"+T_Perm,Y_Perm]
//let CornerPermutations=["","",T_Perm,"","",""]
let PermTable=[0,5,1,2,3,4]

let CpLocation=["Full","Diag","Left","Right","Front","Back"]


const [cubeSize,setCubeSize]=useState(150)

function getEasyRotation(Center1,Center2,cubeSize){

  
    let Centers=GetCentersPosition(cubeSize)

    let centerx=Centers[Center1][0]
    let centery=Centers[Center1][1]

    let centerx2=Centers[Center2][0]
    let centery2=Centers[Center2][1]


    let Correction=(centery2-centery)>0? 90:-90

    let angle = Math.atan(-(centerx2 - centerx) / (centery2 - centery))*180/Math.PI;
    if (centery==centery2){
        angle=0
        Correction=0
    }
    if (centerx>centerx2 && centery==centery2){
        [centerx, centerx2] = [centerx2, centerx];
        let difference=centerx2-centerx
        centerx-=difference
        centerx2-=difference
        // centery2-=2.5
        // centery-=1.5
        Correction+=180
    }

    angle+=Correction
    return angle
}

function getEasyPath(Center1,Center2,cubeSize){
    let Centers=GetCentersPosition(cubeSize)
    let centerx=Centers[Center1][0]
    let centery=Centers[Center1][1]

    let centerx2=Centers[Center2][0]
    let centery2=Centers[Center2][1]

    centerx=centerx2-((centerx-centerx2)**2+(centery-centery2)**2)**(1/2)                                                                                                                                                                                                                                                                                                            //L 37,41 37,45 27,39 37,33 Z"
    centery2+=1

    // let pathArrow=`M ${centerx+3},${centery2-2} L ${centerx2-1},${centery2-2} L ${centerx2-1},${centery2-6} L ${centerx2+8},${centery2} L ${centerx2-1},${centery2+6} L ${centerx2-1},${centery2+2} L ${centerx+3},${centery2+2} L ${centerx+3},${centery2+2} L ${centerx+3},${centery2+6} L ${centerx-6},${centery2} L ${centerx+3},${centery2-6}  Z`

    let arrowWidth=cubeSize/200*2
  

    let pathArrow=`M ${centerx+3},${centery2-arrowWidth} L ${centerx2-1},${centery2-arrowWidth} L ${centerx2-1},${centery2-arrowWidth*3} L ${centerx2+arrowWidth*4},${centery2} L ${centerx2-1},${centery2+arrowWidth*3} L ${centerx2-1},${centery2+arrowWidth} L ${centerx+3},${centery2+arrowWidth} L ${centerx+3},${centery2+arrowWidth} L ${centerx+3},${centery2+arrowWidth*3} L ${centerx-arrowWidth*3},${centery2} L ${centerx+3},${centery2-arrowWidth*3}  Z`
    
    return pathArrow
}

function getEasierRecognitionInfo(oll,index,arrowNumber,cubeSize){
    let infoList=oll.easierRecognition[0]

    let SpecificPermInfo=infoList[index]

    let color

    if(SpecificPermInfo[2+3*arrowNumber]=="opp"){
        color="red"
    }
    else if((SpecificPermInfo[2+3*arrowNumber])=="same"){
        color="cyan"
    }
    else{
        color="lime"
    }

    
    let Center1=SpecificPermInfo[0+3*arrowNumber]
    let Center2=SpecificPermInfo[1+3*arrowNumber]


    let Centers= GetCentersPosition(cubeSize)
    let centerx2=Centers[Center2][0]
    let centery2=Centers[Center2][1]
    let arrowTipCoord=[centerx2,centery2]
   
    let rotation=getEasyRotation(Center1,Center2,cubeSize)
    let pathArrow=getEasyPath(Center1,Center2,cubeSize)

    return [rotation,pathArrow,color,arrowTipCoord]



}


function getSameOppInfo(oll,index,arrowNumber,cubeSize){
    let infoList=[oll.SameOpp[0][0][0],oll.SameOpp[1][0][0],oll.SameOpp[1][0][1],oll.SameOpp[2][0][0],oll.SameOpp[2][0][1],oll.SameOpp[0][0][1]]
    let SpecificPermInfo=infoList[index]

    let color

    if(SpecificPermInfo[2+3*arrowNumber]=="opp"){
        color="red"
    }
    else if((SpecificPermInfo[2+3*arrowNumber])=="same"){
        color="cyan"
    }
    else{
        color="lime"
    }

    
    let Center1=SpecificPermInfo[0+3*arrowNumber]
    let Center2=SpecificPermInfo[1+3*arrowNumber]


    let Centers= GetCentersPosition(cubeSize)
    let centerx2=Centers[Center2][0]
    let centery2=Centers[Center2][1]
    let arrowTipCoord=[centerx2,centery2]

    let rotation=getEasyRotation(Center1,Center2,cubeSize)
    let pathArrow=getEasyPath(Center1,Center2,cubeSize)

    let sameOppInfoDict={
        path:pathArrow,
        color:color,
        rotation:rotation,
        rotateX:arrowTipCoord[0],
        rotateY:arrowTipCoord[1],

    }
    return sameOppInfoDict



}


// let FirstGroupCase=[]
// let Groups=[... new Set(ollCaseSet.cases.map(alg=>alg.group))]
// Groups.map(group=>{
// FirstGroupCase.push(ollCaseSet.cases.find(alg =>(
//     alg.group==group
// )))
// })

useEffect(() => {
  console.time("OllGridsCont Render");
  // Force measurement after DOM paint
  requestAnimationFrame(() => {
    console.timeEnd("OllGridsCont Render");
  });
}, [groupSelected,ollSelectList]);

    return (
        <>
        {groupSelected == null && (
            <OllGroupSelector
                arrowOllSet={arrowOllSet}
                caseDetails={ollCaseSet.details}
                onSelectGroup={setGroupSelected}
            />
            )}


            {groupSelected != null && (
            <OllCaseFilter
                groupSelected={groupSelected}
                setGroupSelected={setGroupSelected}
                arrowOllSet={arrowOllSet}
                ollSelectList={ollSelectList}
                setOllSelectList={setOllSelectList}
                caseDetails={ollCaseSet.details}
                darkMode={darkMode}
                BackButtonstyle={BackButtonstyle}
                
            />

        )}
            
            { (groupSelected!=null) && (
                <div className="CpOllGridsCont">
                    {
                selectedGroupOlls.map((oll,i)=>
                (ollSelectList.includes(oll.name.split(" ")[1]) ||ollSelectList.length==0) &&
                
                (
                    <>
            
                    <div>
                    {/* <h2>{oll.name}</h2> */}
                    <h2>{oll.name + "-"+oll.algNumber}</h2>
                    <h2>{oll.algs}</h2>
                    {/* <div className="OllGrid">
                        
                        {CornerPermutations.map((_,j)=>
                        <div className="RecCont">  
                        <h2 className="OllCpLocation">{CpLocation[j]}</h2>
                        <h2 className="OllCpLocation">{oll.algNumber?CpLocation[j] +" -> "+oll.barMovements[PermTable[j]][0]:CpLocation[j] }</h2>
                        <div id="tempCont" style={{position:"relative",height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}`,marginBottom:"20px"}}>
                        <CaseImage
                            size={cubeSize}
                            //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                                alg={(oll.algs+CornerPermutations[PermTable[j]]).replace(/\s+/g, "")+"y2"}
                            caseSetDetails={ScrambleVisualizerDetails}
                            co="40"
                        ></CaseImage>

                        
                        <div className='CpRecOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-20+cubeSize/10}px`}}>
                           
                            {
                               <>
                               
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getPath(oll,PermTable[j],0,cubeSize)}
                                        fill={`${GetColor(oll,PermTable[j],0)}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getRotation(oll,PermTable[j],0)} ${getArrowTipCoord(oll,PermTable[j],0,cubeSize)[0]} ${getArrowTipCoord(oll,PermTable[j],0,cubeSize)[1]})`}
                                    />
                                </svg>
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getPath(oll,PermTable[j],1,cubeSize)}
                                        fill={`${GetColor(oll,PermTable[j],1)}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getRotation(oll,PermTable[j],1,cubeSize)} ${getArrowTipCoord(oll,PermTable[j],1,cubeSize)[0]} ${getArrowTipCoord(oll,PermTable[j],1,cubeSize)[1]})`}
                                    />
                                </svg>
                                </>
                            
                        
                            }
                            
                        </div>
                        <CpRecOverlay
                            cubeSize={cubeSize}
                            arrowsInfo={[
                                {
                                path: getPath(oll, PermTable[j], 0, cubeSize),
                                color: GetColor(oll, PermTable[j], 0),
                                rotation: getRotation(oll, PermTable[j], 0, cubeSize),
                                rotateX: getArrowTipCoord(oll, PermTable[j], 0, cubeSize)[0],
                                rotateY: getArrowTipCoord(oll, PermTable[j], 0, cubeSize)[1],
                                },
                                {
                                path: getPath(oll, PermTable[j], 1, cubeSize),
                                color: GetColor(oll, PermTable[j], 1),
                                rotation: getRotation(oll, PermTable[j], 1, cubeSize),
                                rotateX: getArrowTipCoord(oll, PermTable[j], 1, cubeSize)[0],
                                rotateY: getArrowTipCoord(oll, PermTable[j], 1, cubeSize)[1],
                                },
                            ]}
                            />
                            <BarPersevationOverlay
                                oll={oll}
                                pll={CornerPermutations[PermTable[j]]}
                                permIndex={j}
                                cpEasyWanted={true}
                                cpSameOppWanted={false}
                                barMovementWanted={false}
                                cubeSize={cubeSize}
                                setCubeSize={setCubeSize}
                                cubeSizeFixed={true}
                                />


                        </div>
                        <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-20+cubeSize/10}px`}}>
                            
                        </div>
                        
                        </div>
                        
                        )}
                    
                
                </div> */}
                {console.log("ollFD",oll)}
                <Cp6Grid oll={oll} cubeSize={cubeSize} setCubeSize={setCubeSize} cpEasyWanted={true} cpSameOppWanted={false}></Cp6Grid>
                
                </div>
                

                
                    <div>
                     
                    <h2>{selectedGroupOlls[i+(1-selectedGroupOlls[i].algNumber)]?
                          oll.name + "-"+oll.algNumber:oll.name}</h2>
                    <h2>{oll.algs}</h2>
                    
                    {/* <div className="OllGrid">
                        
                        {CornerPermutations.map((_,j)=>
                        <div className="RecCont">  
                        <h2 className="OllCpLocation">{CpLocation[j]}</h2>
                        
                         <div id="tempCont" style={{position:"relative",height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}`,marginBottom:"20px"}}>
                       
                        <CaseImage
                            size={cubeSize}
                            //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                                alg={(oll.algs+CornerPermutations[PermTable[j]]).replace(/\s+/g, "")+"y2"}
                            caseSetDetails={ScrambleVisualizerDetails}
                            co="40"
                        ></CaseImage>
                        <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-20+cubeSize/10}px`}}>
                           
                            {
                               <>
                               
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getSameOppInfo(oll,PermTable[j],0,cubeSize)[1]}
                                        fill={`${getSameOppInfo(oll,PermTable[j],0,cubeSize)[2]}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getSameOppInfo(oll,PermTable[j],0,cubeSize)[0]} ${getSameOppInfo(oll,PermTable[j],0,cubeSize)[3][0]} ${getSameOppInfo(oll,PermTable[j],0,cubeSize)[3][1]})`}
                                    />
                                </svg>
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getSameOppInfo(oll,PermTable[j],1,cubeSize)[1]}
                                        fill={`${getSameOppInfo(oll,PermTable[j],1,cubeSize)[2]}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getSameOppInfo(oll,PermTable[j],1,cubeSize)[0]} ${getSameOppInfo(oll,PermTable[j],1,cubeSize)[3][0]} ${getSameOppInfo(oll,PermTable[j],1,cubeSize)[3][1]})`}
                                    />
                                </svg>
                                </>
                            
                        
                            }
                            
                        </div>
                        <CpRecOverlay
                            cubeSize={cubeSize}
                            arrowsInfo={[
                                {
                                path: getSameOppInfo(oll,PermTable[j],0,cubeSize).path,
                                color: getSameOppInfo(oll,PermTable[j],0,cubeSize).color,
                                rotation: getSameOppInfo(oll,PermTable[j],0,cubeSize).rotation,
                                rotateX: getSameOppInfo(oll,PermTable[j],0,cubeSize).rotateX,
                                rotateY: getSameOppInfo(oll,PermTable[j],0,cubeSize).rotateY,
                                },
                                {
                                path: getSameOppInfo(oll,PermTable[j],1,cubeSize).path,
                                color: getSameOppInfo(oll,PermTable[j],1,cubeSize).color,
                                rotation: getSameOppInfo(oll,PermTable[j],1,cubeSize).rotation,
                                rotateX: getSameOppInfo(oll,PermTable[j],1,cubeSize).rotateX,
                                rotateY: getSameOppInfo(oll,PermTable[j],1,cubeSize).rotateY,
                                },
                            ]}
                            />
                            <BarPersevationOverlay
                                oll={oll}
                                pll={CornerPermutations[PermTable[j]]}
                                permIndex={j}
                                cpEasyWanted={false}
                                cpSameOppWanted={true}
                                barMovementWanted={false}
                                cubeSize={cubeSize}
                                setCubeSize={setCubeSize}
                                cubeSizeFixed={true}
                                />
                        </div>
                        <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-20+cubeSize/10}px`}}>
                            
                        </div>
                        </div>
                        )}
                    
                
                </div> */}
                <Cp6Grid oll={oll} cubeSize={cubeSize} setCubeSize={setCubeSize} cpEasyWanted={false} cpSameOppWanted={true}></Cp6Grid>
                
                <div className="d-flex justify-content-center" style={{marginBottom:"20px"}}>

                                <button onClick={() => { handleAlgCardShown(oll) }}
                                className={`${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                    style={{
                                        ...ContinueButtonstyle,

                                        "--bs-border-style": "solid",
                                        "--bs-border-color": "white",
                                        "--bs-btn-hover-border-color": "red",
                                        "--bs-btn-focus-border-color": "red",
                                        "--bs-btn-active-border-color": "red",
                                    }}>
                                    <h3 className="ContinueRecTrainCont">Show Bar Info</h3>
                                </button>
                            </div>

                <ChangeOllCont refIndex={i} oll={oll} setChangedAlgArray={setChangedAlgArray}/>
                {(changedAlgArray.length>0 &&changedAlgArray[0] && changedAlgArray[1]!=null &&changedAlgArray[2]==true && changedAlgArray[0]!=changedAlgArray[1])  
                    && (<>
                    {console.log("NewPage")}
                        <ArrowDataGenerator
                            key={`${changedAlgArray[0]}-${changedAlgArray[1]}`}
                            newAlg={changedAlgArray[0]}
                            tempoll={changedAlgArray[1]}
                            onError={(errorMessage) => {
                            console.warn("CornerPermutation error:", errorMessage);
                
                            setChangedAlgArray([changedAlgArray[1], changedAlgArray[1], false,changedAlgArray[3]]);
                          
                        }}
                        onSuccess={() => {
                            
                            setChangedAlgArray([changedAlgArray[0], changedAlgArray[1], false,changedAlgArray[3]]);
                        }}
                        />
                        </>
                        
                        )}
                        </div>
                </>
                )
            )
        }
        </div>
        )
            }

            
        
    {showPopUpCard.length > 0 && <ShowBarFullHint sixGridWanted={true} alg={showPopUpCard[0]} cubeSize={150} setCubeSize={setCubeSize} onClose={() => setShowPopUpCard([])} algCasesSet={algCasesSet} />}
  
                    




        {/* { (groupSelected!=null) && (
                selectedGroupOlls.map((oll,i)=>
                (
                    <div>
                    <h2>{oll.name}</h2>
                    <div className="OllGrid">
                        
                        {CornerPermutations.map((_,j)=>
                        <div className="RecCont">  
                        <h2 className="OllCpLocation">{CpLocation[j]}</h2>
                        
                        <CaseImage
                            size={cubeSize}
                            //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                                alg={(oll.algs+CornerPermutations[PermTable[j]]).replace(/\s+/g, "")+"y2"}
                            caseSetDetails={ScrambleVisualizerDetails}
                            co="40"
                        ></CaseImage>
                        <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${45+cubeSize/10}px`}}>
                           
                            {
                               <>
                               
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getEasierRecognitionInfo(oll,PermTable[j],0,cubeSize)[1]}
                                        fill={`${getEasierRecognitionInfo(oll,PermTable[j],0,cubeSize)[2]}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getEasierRecognitionInfo(oll,PermTable[j],0,cubeSize)[0]} ${getEasierRecognitionInfo(oll,PermTable[j],0,cubeSize)[3][0]} ${getEasierRecognitionInfo(oll,PermTable[j],0,cubeSize)[3][1]})`}
                                    />
                                </svg>
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getEasierRecognitionInfo(oll,PermTable[j],1,cubeSize)[1]}
                                        fill={`${getEasierRecognitionInfo(oll,PermTable[j],1,cubeSize)[2]}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getEasierRecognitionInfo(oll,PermTable[j],1,cubeSize)[0]} ${getEasierRecognitionInfo(oll,PermTable[j],1,cubeSize)[3][0]} ${getEasierRecognitionInfo(oll,PermTable[j],1,cubeSize)[3][1]})`}
                                    />
                                </svg>
                                </>
                            
                        
                            }
                            
                        </div>
                        <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${45+cubeSize/10}px`}}>
                            
                        </div>
                        </div>
                        )}
                    
                
                </div>
                </div>
                )
            )
        )
            } */}
{/* 
            { (groupSelected!=null) && (
                selectedGroupOlls.map((oll,i)=>
                (i==0) &&(
                    <div>
                    <h2>{oll.name}</h2>
                    <div className="OllGrid">
                        
                        {CornerPermutations.map((_,j)=>
                        <div className="RecCont">  
                        <h2 className="OllCpLocation">{CpLocation[j]}</h2>
                        
                        <CaseImage
                            size={cubeSize}
                            //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                                alg={(oll.algs+CornerPermutations[PermTable[j]]).replace(/\s+/g, "")+"y2"}
                            caseSetDetails={ScrambleVisualizerDetails}
                            co="40"
                        ></CaseImage>
                        <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${45+cubeSize/10}px`}}>
                           
                            {
                               <>
                               
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getSameOppInfo(oll,PermTable[j],0,cubeSize)[1]}
                                        fill={`${getSameOppInfo(oll,PermTable[j],0,cubeSize)[2]}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getSameOppInfo(oll,PermTable[j],0,cubeSize)[0]} ${getSameOppInfo(oll,PermTable[j],0,cubeSize)[3][0]} ${getSameOppInfo(oll,PermTable[j],0,cubeSize)[3][1]})`}
                                    />
                                </svg>
                                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                    <path
                                        d={getSameOppInfo(oll,PermTable[j],1,cubeSize)[1]}
                                        fill={`${getSameOppInfo(oll,PermTable[j],1,cubeSize)[2]}`}
                                        stroke="rgba(0, 0, 0, 1)"
                                        strokeWidth="1"
                                        transform={`rotate(${getSameOppInfo(oll,PermTable[j],1,cubeSize)[0]} ${getSameOppInfo(oll,PermTable[j],1,cubeSize)[3][0]} ${getSameOppInfo(oll,PermTable[j],1,cubeSize)[3][1]})`}
                                    />
                                </svg>
                                </>
                            
                        
                            }
                            
                        </div>
                        <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${45+cubeSize/10}px`}}>
                            
                        </div>
                        </div>
                        )}
                    
                
                </div>
                </div>
                )
            )
        )
            } */}
                
               
        
        
        {/* <CaseImage
            size={200}
            //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                alg={arrowOllSet[0].algs}
            caseSetDetails={ScrambleVisualizerDetails}
            co="40"
        ></CaseImage> */}
        </>
    )
}

export default CornerPermutationPage