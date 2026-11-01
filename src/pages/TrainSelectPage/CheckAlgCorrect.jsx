
import { ThemeContext } from '../../context/DarkThemeContext';
import React, { useEffect, useRef, useState,useContext, useLayoutEffect } from "react"; // removed 'use'
import { Modal } from "react-bootstrap";
import { FaIcon } from '../../assets/fontAwesome.js';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import "../../styling/index.css";
import '../../styling/PopUp.css';
// import CaseImage from "./components/Oll/cubing/cubeImage.jsx";

import { TbRuler } from "react-icons/tb";
import { range } from "lodash";
import { SiTrueup } from "react-icons/si";
import { db } from '../../data/NewGeneratedData/db';
import { useAlgs } from '../../context/AlgContext';
import { Inverse } from '../../dataGeneration/ArrowDataGenerator';

import cpllCaseSet from "../../data/cpllCaseSet.js";
import eollCaseSet from "../../data/eollCaseSet.js";
import epllCaseSet from "../../data/epllCaseSet.js";
import f2lCaseSet from "../../data/f2lCaseSet.js";
import ocllCaseSet from "../../data/ocllCaseSet.js";
import ollCaseSet from "../../data/ollCaseSet.js";
import pllCaseSet from "../../data/pllCaseSet.js";
import { BsTypeItalic } from 'react-icons/bs';


async function UpdateAlg(changeAlg,type,newAlg,oldAlg){
    console.log("Updated",changeAlg,type,newAlg,oldAlg)
    await changeAlg(type, newAlg, oldAlg)
}
export function CheckAlgCorrect({newAlg,oldAlg,type,onSuccess,onError}){
 
    // newAlg="y F U' F'"
    // oldAlg= {algs:"R U' R'"}
    // type="f2l"

    console.log("StartChecking",newAlg,oldAlg,type)

    let T_Perm= "R U R' U' R' F R2 U' R' U' R U R' F' "
    let Y_Perm="F R U' R' U' R U R' F' R U R' U' R' F R F'"
    let F_Perm="R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"
    
    // oldAlg="M2 U' M2 U2 M2 U' M2"
    // newAlg="M2 U' M2 U2 M2 U' M2 U2"

  let preRotation = ["","y2", "y", "y'"]
  let postRotation = ["","y2", "y", "y'"]
  let AUFs = ["","U2", "U", "U'"]

  const [refsReady, setRefsReady] = useState(false);

  const solvedF2l= useRef([])
  const solvedLL= useRef([])

  const altoverlayRefs = useRef([]);
  const rerenderRef = useRef(0);
  const cubeIndexRef = useRef([])

  let allCasesDictionary={
    "f2l":f2lCaseSet,
  }

  let algCasesSet=allCasesDictionary[type]

  const {
        data,
        getAlgsByGroup,
        addAlg,
        changeAlg,
        createEmptySlot,
        swapAlgNumbers
    } = useAlgs();

  const cases = {
        oll: data.oll.all,
        pll: data.pll.all
    }[type] ?? algCasesSet?.cases ?? [];
        
    // const table = data[type].table;

  let cubeSize=200

const Scale=13.1/0.15740740740740744/150*cubeSize

    const ScrambleVisualizerDetails={
        id: "oll",
        title: "OLL",
        subTitle: "Full OLL",
        stage:"full",
        view:type=="f2l"?"":"plan",
        numCases: 57,
    }
    const {darkMode}= useContext(ThemeContext)
    

let f2lSlots=[]
function GetBarsIndices(cubeIndex){
  
    
  //console.log("Rerenders",rerenderRef)
  rerenderRef.current+=1

  //let {newSquaresColors,newCombinedSquaresList}= getCubeColors(altoverlayRefs,OllIndex,PermIndex)
  let containerparent = altoverlayRefs.current[cubeIndex];
  
  console.log("Run getbars")
    if (!containerparent) {
      console.warn('GetBarsIndices: no ref for index', cubeIndex);
      return ["","red"]
    }
    let container= containerparent.querySelector("div")
    let ContainerSvg = container.querySelector('svg');
  if (!ContainerSvg) {
    console.warn('GetBarsIndices: no svg inside container', container);
    return ["","red"]
  }

  console.log("IndexCheck",cubeIndex,type)
  if(type=="oll" || type=="pll"){


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

  if(cubeIndex==0){
    solvedLL.current=(newCombinedSquaresList)
}

let noWhite =true
ContainerSvgSquaresInsideList.forEach((_,i)=>{
    let insideColors=ContainerSvgSquaresInsideList[i].getAttribute("fill")
    if(insideColors=="white"){
        noWhite=false
    }
})
    
console.log("PLL223",cubeIndex,newSquaresColors,newAlg,oldAlg,)

    let barFront=(newSquaresColors[1]==newSquaresColors[2] && newSquaresColors[1]==newSquaresColors[3])
    let barLeft=(newSquaresColors[5]==newSquaresColors[10] && newSquaresColors[5]==newSquaresColors[15])
    let barRight=(newSquaresColors[9]==newSquaresColors[14] && newSquaresColors[9]==newSquaresColors[19])
    let barBack=(newSquaresColors[21]==newSquaresColors[22] && newSquaresColors[21]==newSquaresColors[23])

    let allBarsCheck= [barFront,barLeft,barRight,barBack,noWhite]
    console.log("BarsCheck",allBarsCheck)
    if(allBarsCheck.every(Boolean) && cubeIndex!=0){
        console.log("Barscheckdone",cubeIndex)
        //  await changeAlg(type, newAlg, oldAlg);
        UpdateAlg(changeAlg,type, newAlg, oldAlg)
         onSuccess()
    }
    else{
        if(cubeIndex==4){
            if (onError) onError("Invalid Alg");  // notify parent
            return;                   // stop further updates
        }
    }
  
    
    
}



    if(type=="f2l"){

        
  let ContainerSquaresLeft=ContainerSvg.querySelectorAll("g")[1].querySelectorAll("polygon")

  

  //console.log(containerSvgSquaresInsideList)
  let ContainerSquaresBack=ContainerSvg.querySelectorAll("g")[2].querySelectorAll("polygon")


  let ContainerSquaresBottom=ContainerSvg.querySelectorAll("g")[3].querySelectorAll("polygon")

  
  let ContainerSquaresTop=ContainerSvg.querySelectorAll("g")[5].querySelectorAll("polygon")

  let ContainerSquaresRight=ContainerSvg.querySelectorAll("g")[6].querySelectorAll("polygon")

  let ContainerSquaresFront=ContainerSvg.querySelectorAll("g")[7].querySelectorAll("polygon")
//   3 bottom 5 top 6 right 7 front
  //console.log(ContainerSvgSquaresOutsideList[0].getAttribute("points").split(" "))
  

  const LeftColors = Array.from(ContainerSquaresLeft).map(
    element => element.getAttribute("fill")
);

  const BackColors = Array.from(ContainerSquaresBack).map(
    element => element.getAttribute("fill")
);

const BottomColors = Array.from(ContainerSquaresBottom).map(
    element => element.getAttribute("fill")
);

const TopColors = Array.from(ContainerSquaresTop).map(
    element => element.getAttribute("fill")
);
const RightColors = Array.from(ContainerSquaresRight).map(
    element => element.getAttribute("fill")
);
const FrontColors = Array.from(ContainerSquaresFront).map(
    element => element.getAttribute("fill")
);


//F2LSlotColors Order: bottom, CounterClockwise bottom to up
let F2lSlotFlColors=[BottomColors[0],LeftColors[8],LeftColors[5],FrontColors[6],FrontColors[3]]
let F2lSlotFrColors=[BottomColors[2],FrontColors[8],FrontColors[5],RightColors[6],RightColors[3]]
let F2lSlotBlColors=[BottomColors[6],BackColors[8],BackColors[5],LeftColors[6],LeftColors[3]]
let F2lSlotBrColors=[BottomColors[8],RightColors[8],RightColors[5],BackColors[6],BackColors[3]]

let SolvesF2l=false
let sameOrientation
let correctSlots=[]

if(cubeIndex==0){
    solvedF2l.current=([F2lSlotFlColors,F2lSlotFrColors,F2lSlotBlColors,F2lSlotBrColors])
}
else{
    // console.log("CorrectSlot2",cubeIndexRef.current)
    let possibleSolution=[F2lSlotFlColors,F2lSlotFrColors,F2lSlotBlColors,F2lSlotBrColors]
    console.log("NewF2lSolution",newAlg,oldAlg,solvedF2l.current,cubeIndex,possibleSolution)
    possibleSolution.forEach((slot,slotIndex)=>{
        if(slot[1]=="#00d800" && slot[3]=="orange"){
            console.log("CorrectSlot",cubeIndex,slotIndex,slot,solvedF2l.current)
         sameOrientation = possibleSolution[1].every(
                (color, index) => color === solvedF2l.current[1][index]
            );
            console.log("Correct orientaiton2",sameOrientation,cubeIndex)
            if(sameOrientation){
                SolvesF2l=true
                
                //temp, need to store all correct
                console.log("Correct orientaiton",cubeIndex)
                
                solvedF2l.current.forEach((slot,i)=>{
                    let correctF2l=possibleSolution[i].every(
                        (color,index) => color === solvedF2l.current[i][index]
                    )
                    if(correctF2l){
                        correctSlots.push(i)
                    }
                })
                console.log("CorrectSlots",correctSlots)
            }

        }
    })
    if(sameOrientation){
        console.log("Passed",newAlg,{...oldAlg,slotsPerserved:correctSlots})
        UpdateAlg(changeAlg,type, newAlg, {...oldAlg,slotsPerserved:correctSlots})
        onSuccess()
        return
    }
    if(cubeIndex==4 && !sameOrientation){
        setTimeout(() => {
            
        
        console.log("ErrorF2l",newAlg)
        if (onError) onError("Invalid F2l");  // notify parent
            return;  
            }, 5000);
    }
}

//   let combinedSquaresList=[...ContainerSvgSquaresLeftList,...ContainerSvgSquaresBackList]

// //   console.log("F2lTest",combinedSquaresList)

//   let Remapping = [
//       [0,6],[1,7],[2,8],[3,11],[4,12],
//       [5,13],[6,16],[7,17],[8,18],[9,19],
//       [10,14],[11,9],[12,21],[13,22],[14,23],
//       [15,5],[16,10],[17,15],[18,3],[19,2],
//       [20,1],[21,24],[22,20],[23,4],[24,0]
//     ];
//   let newCombinedSquaresList=Array.from( {length:25}, ()=> 0)
//   //console.log(newCombinedSquaresList)
//   combinedSquaresList.forEach((_,i)=>{
//       newCombinedSquaresList[Remapping[i][1]]=combinedSquaresList[i]
//   })
//     let newSquaresColors= Array.from( {length:25}, ()=> 0)
//   newCombinedSquaresList.forEach((_,i)=>{
//     if (newCombinedSquaresList[i]!=0){
//         newSquaresColors[i]=newCombinedSquaresList[i].getAttribute("fill")
//     }
//     else{
//         newSquaresColors[i]=0
//     }
        
//   })

    }

  //console.log(newSquaresColors)
  
  let colorIndexList=[[],[],[],[],[]]
  let colorList=["#00d800","orange","#1f51ff","red","yellow"]
  let contrastingcolorList=["rgba(13, 139, 13, 1)","rgba(255, 128, 1, 1)","rgba(0, 71, 204, 1)","rgba(207, 1, 1, 1)","yellow"]

  
  let combinedColorList=Array.from({ length: 5 }, () => [])
  

  let solvesCase=[]

  return solvesCase

}

const setOverlayRef = (el,index)=> {

  altoverlayRefs.current[index] = el;
  cubeIndexRef.current[index]=index

 
   const allRefsReady =
        altoverlayRefs.current.length === 5 &&
        altoverlayRefs.current.every(Boolean);
    console.log("Test",allRefsReady)
  if (allRefsReady){
    if(!refsReady){
      setRefsReady(true);
    }
  } 
};

// compute overlayPaths after refs mount; run this AFTER refsReady becomes true
useLayoutEffect(() => {
  let paths
  console.log("Test2",refsReady)
  if (!refsReady) return;
  try {
    altoverlayRefs.current.forEach((_, index) => {
        console.log("AltRefs2",index,altoverlayRefs.current)
        GetBarsIndices(index);
    });
    // paths =  GetBarsIndices(cubeIndexRef.current) || ["", "none"];
        
      } catch (err) {
        console.error('GetBarsIndices error for idx',0 ,0, err)
      }

}, [refsReady,cubeSize]);



// console.log("Nothing.",pathCalculated,labsPageTrue)
return (
  
  <>
<div className='TestAlgAlts'>
  {
    
        
    
    <div className="RecCont" ref={(el)=> setOverlayRef(el,0)}> 
                
                <CaseImage
                    containerId="TestBestalg1"
                    size={cubeSize}
                    alg={("").replace(/\s+/g, "")+" y2"}
                    caseSetDetails={ScrambleVisualizerDetails}
                    cubeOpacity={`${type=="f2l"?"40":"100"}`}
                ></CaseImage>

                <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200+10}px`,width:`${cubeSize*160/200+9}px`,marginTop:`${-21+cubeSize/10}px`}}>
                    
                
                </div>
                <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-21+cubeSize/10}px`}}>
                
                    </div>
                </div>}
{
    type=="f2l" && postRotation.map((rotation1,index)=>{
    

            return <div className="RecCont"  ref={(el)=> setOverlayRef(el,index+1)}> 
                {console.log("Wtf444",rotation1,1,newAlg,2,Inverse(newAlg),3,oldAlg.algs)}
                <CaseImage
                    containerId="TestBestalg1"
                    size={cubeSize}
                    alg={(Inverse(newAlg)+oldAlg.algs+rotation1).replace(/\s+/g, "")+" y2"}
                    // alg={("R'"+rotation1+"L").replace(/\s+/g, "")+" y2"}
                    caseSetDetails={ScrambleVisualizerDetails}
                    cubeOpacity={`${type=="f2l"?"40":"100"}`}
                ></CaseImage>

                <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200+10}px`,width:`${cubeSize*160/200+9}px`,marginTop:`${-21+cubeSize/10}px`}}>
                    
                
                </div>
                <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-21+cubeSize/10}px`}}>
                
                    </div>
                </div>
        
          
    })
 
  }  
  {type=="pll" &&
  AUFs.map((AUF,index)=>{
    

            return <div className="RecCont"  ref={(el)=> setOverlayRef(el,index+1)}> 
                
                <CaseImage
                    containerId="TestBestalg1"
                    size={cubeSize}
                    alg={(Inverse(newAlg)+AUF+oldAlg.algs).replace(/\s+/g, "")+" y2"}
                    caseSetDetails={ScrambleVisualizerDetails}
                    cubeOpacity={`${type=="f2l"?"40":"100"}`}
                ></CaseImage>

                <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200+10}px`,width:`${cubeSize*160/200+9}px`,marginTop:`${-21+cubeSize/10}px`}}>
                    
                
                </div>
                <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-21+cubeSize/10}px`}}>
                
                    </div>
                </div>
    })
  }
</div>
  </>

)

}

export default CheckAlgCorrect
