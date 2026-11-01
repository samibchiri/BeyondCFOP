
import { ThemeContext } from '../context/DarkThemeContext.jsx';
import React, { use, useContext,useRef, useEffect, useState } from "react";
import '../styling/index.css'
import { FaIcon } from '../assets/fontAwesome.js';
import CaseImage from "../components/Oll/cubing/cubeImage.jsx";
import { flushSync } from 'react-dom';
import ollCaseSet from "../data/ollCaseSet.js";
import { db } from '../data/NewGeneratedData/db.js';
import {piecesMovementGen}  from "../pages/BarPersevationPage/BarPersevationLogic.jsx"
import OllCaseFilter from "../components/Oll/OllCaseFilter.jsx";
import OllGroupSelector from "../components/Oll/OllGroupSelect.jsx";

import { sortOlls } from '../context/OllContext.jsx';
import { useLiveQuery } from "dexie-react-hooks";

//Function to invert the oll alg
export function Inverse(alg){

    
    if(!alg){
        return ""
    }
    console.log(`InverseAlgStart ${alg}`,typeof(alg))
    let inverse=""

   alg = alg
  .replace(/R/g, " R")
  .replace(/L/g, " L")
  .replace(/U/g, " U")
  .replace(/B/g, " B")
  .replace(/F/g, " F");

    if(alg!=""){
    alg=alg.trim()
    let splitAlg=alg.split(" ")
    for(let i=splitAlg.length-1;i>=0;i--){
        let part=splitAlg[i][0]
        if(part!=undefined){
        inverse+=" "+part
        // console.log("InversePart",part,splitAlg[i],splitAlg[i][1],splitAlg[i][1]!=true)
        if(splitAlg[i][1]==undefined){
            inverse+="'"
        }
        else if(splitAlg[i][1]=="2"){
            inverse+="2"
        }
        else if(splitAlg[i][1]=="3"){
            inverse+=""
        }
        }
    }
    inverse=inverse.trim()
    // console.log(`InverseAlgEnd ${inverse}`)
    }
    return inverse
}

async function UpdateOll(oll_id,newdata){
    console.log("UpdateO",oll_id, newdata)
    await db.olls.update(oll_id, {
    ...newdata
  });
}


export function getHeadlights(svgSquaresOutsideList){
           
            let LeftTrue=false
            let RightTrue=false
            let FrontTrue=false
            let BackTrue=false
            if(svgSquaresOutsideList[0].getAttribute("fill")==svgSquaresOutsideList[2].getAttribute("fill")){
                RightTrue=true
            }
            if(svgSquaresOutsideList[3].getAttribute("fill")==svgSquaresOutsideList[5].getAttribute("fill")){
                FrontTrue=true
            }
            if(svgSquaresOutsideList[6].getAttribute("fill")==svgSquaresOutsideList[8].getAttribute("fill")){
                LeftTrue=true
            }
            if(svgSquaresOutsideList[9].getAttribute("fill")==svgSquaresOutsideList[11].getAttribute("fill")){
                BackTrue=true
            }
            let ReturnedValue=""
            if(RightTrue&&FrontTrue){
                ReturnedValue="Full"
            }
            else if(LeftTrue){
                ReturnedValue="Left"
            }
            else if(RightTrue){
                ReturnedValue="Right"
            }
            else if(FrontTrue){
                ReturnedValue="Front"
            }
            else if(BackTrue){
               ReturnedValue="Back"
            }
            else{
                ReturnedValue="Diag"
            }
            console.log("ReturnedHeadlightsValue",ReturnedValue)
            return ReturnedValue
        }

export function ArrowDataGenerator({newAlg,tempoll,setCaseClicked,onError,onSuccess }){

// oll={}
// oll["id"]="OLL 57-0"
// chosenAlg="F R U R' U' F'"
console.log("Run Function")
    
const [pathArrowList, setPathArrowList] = useState([]);
const [angleList, setAngleList] = useState([]);
const [centerPathList, setCenterPathList] = useState([]);
const [centerPath2List, setCenterPath2List] = useState([]);
const [centerxList, setCenterxList] = useState([]);
const [centerx2List, setCenterx2List] = useState([]);
const [centeryList, setCenteryList] = useState([]);
const [centery2List, setCentery2List] = useState([]);
const [squaresColors, setSquaresColors] = useState([]);
const [arrowCombination,setArrowCombination]=useState([])
const [arrowColor, setArrowColor]=useState([])
const [scramble, setScramble] = useState(newAlg?newAlg:"");
const [chosenAlg,setChosenAlg]= useState(null)

const [oll, setOll] = useState(tempoll);

console.log("StartArrowDataGen",newAlg,oll)


const [altscramble,setAltScramble] = useState(Array(4).fill("null"));
// const [allAltAUF,setAllAltAUF]=useState([])

let allAltAUF=useRef([])
let allAUF=useRef([])

let altAUFToSave= useRef([])
let AUFToSave= useRef([])

let AlgNumber1Data= useRef()


const [jsonArrowsToExport,setJsonArrowsToExport]=useState([])
const dbOllCaseSet = useLiveQuery(
    () => {
        console.log("Helel", oll);

        if (chosenAlg == null) {
            return [];
        }

        return db.olls
            .where("ollNumber")
            .equals(oll.ollNumber)
            .toArray()
            .then(arr => arr.sort(sortOlls));
    },
    [chosenAlg],
    []
);


// const [allAUF,setAllAUF]=useState
const [barMovements,setBarMovements]=useState([])
const [piecesMovement,setPiecesMovement]=useState([])


const [arrowCombinationSorted,setArrowCombinationSorted]= useState(false)
const [arrowDone,setArrowDone]=useState(false)


const [tempArrowSet, setTempArrowSet] = useState(new Set());
const [possibleArrowCombination, setPossibleArrowCombination] = useState(new Set());

const originalAlg=useRef()



    let T_Perm="R U R' U' R' F R2 U' R' U' R U R' F'"
    let Y_Perm="F R U' R' U' R U R' F' R U R' U' R' F R F'"

    
    let algRef=useRef(0)
    let algIndexRef=useRef(0)

    const currentAlgIndexRef = algIndexRef.current 
    const currentAlgRef= algRef.current

    let CornerPermutations=["",T_Perm,"U2"+T_Perm,"U"+T_Perm,"U'"+T_Perm,Y_Perm]
    let allAUFPerm=["","U'","U","U2"]
    const ScrambleVisualizerDetails={
    id: "oll",
    title: "OLL",
    subTitle: "Full OLL",
    view: "plan",
    stage:"cross",
    numCases: 57,
  }

  let BarPositionDict={
    0:"Full",
    1:"Left",
    2:"Right",
    3:"Front",
    4:"Back",
    5:"Diag"
  }

  let pathArrow1="M 37,37 L 117,37 L 117,33 L 127,39 L 117,43 L 117,41 L 37,41 37,45 27,39 37,33 Z"

const xCoords = [9.5, 39.5, 79.5, 119.5,149.5];
const yCoords = [9.75, 39.75, 79.75, 119.75, 149.75];

let Centers = [];

for (let y of yCoords) {
  for (let x of xCoords) {
    Centers.push([x, y]);
  }
}

let scrambleIndex=useRef(0)
console.log("SetNewAlg",newAlg!=chosenAlg,newAlg,[newAlg,chosenAlg])

useEffect(() => {
  if (newAlg && newAlg !== chosenAlg) {
    setChosenAlg(newAlg);
  }
  else if(newAlg!=null){
    console.log("Dup",chosenAlg,newAlg)
    onError("Duplicate Oll")
    return;
  }
}, [newAlg]);


//Initialize scramble
useEffect(() => {
    if (!(dbOllCaseSet?.length>0) && chosenAlg!=null){
        console.log("Returned, no db")
        return;
    }
    else{
        console.log("DB:",dbOllCaseSet,chosenAlg,oll)
    } 

    let currentalg={}
    if (chosenAlg ==null){
        currentalg=ollCaseSet.cases[currentAlgRef]
    }
    else{
        currentalg["algs"]=[chosenAlg,oll.algs]
        console.log("NewCurrentAlg",currentalg)
        scrambleIndex.current=0
    }

    console.log("Rapid1",newAlg,currentalg,dbOllCaseSet,chosenAlg,oll)
    
    setTimeout(() => { 
        if(newAlg==null){
                setScramble(currentalg.algs[currentAlgIndexRef] + CornerPermutations[scrambleIndex.current]);        
        }
        else if (chosenAlg!=null){
            console.log("SettedScramble",currentalg.algs[currentAlgIndexRef],CornerPermutations[scrambleIndex.current])
            setScramble(currentalg.algs[currentAlgIndexRef] + CornerPermutations[scrambleIndex.current]); 
        }
           
    }, 200);

    if(newAlg==null){
                setScramble(currentalg.algs[currentAlgIndexRef] + CornerPermutations[scrambleIndex.current]);        
        }
    
    let alg1=currentalg.algs[0]
    let alg2=currentalg.algs[1]

    if(chosenAlg!=null&& dbOllCaseSet.length>0){

        let checkedAlgNumber=1
        if(oll.algNumber==0 && dbOllCaseSet.length>1 ){
            checkedAlgNumber=1
        }
        else{
            checkedAlgNumber=0
        }
        console.log("FKedUp",checkedAlgNumber, alg1,alg2,oll)
        alg2= dbOllCaseSet[checkedAlgNumber].algs
        alg2=Inverse(alg1)
        setAltScramble(
            new Array(4).fill("").map((_,i)=>
                alg2+allAUFPerm[i] +alg1+
                CornerPermutations[scrambleIndex.current]
            )
        );
    }
    else if(currentAlgIndexRef==0){
        alg2=Inverse(alg1)
        setAltScramble(
            new Array(4).fill("").map((_,i)=>
                alg2+allAUFPerm[i] +alg1+
                CornerPermutations[scrambleIndex.current]
            )
        );
    }
    
    else{
        if(currentAlgIndexRef==1){
            alg1=currentalg.algs[1]
            alg2=currentalg.algs[0]
        }
        alg2=Inverse(alg2)

        
        
        //Search for angle in which alternative oll should be performed
        
        setAltScramble(
            new Array(4).fill("").map((_,i)=>
                alg2+allAUFPerm[i] +alg1+
                CornerPermutations[scrambleIndex.current]
            )
        );
    }
    
    

    
}, [chosenAlg,dbOllCaseSet]);

//Whenever scramble changes, reset lists & read squares
useEffect(() => {
    // console.log(`ScrambleIndex,${scrambleIndex.current}`)
    // console.log("CurrentScramble",scramble)
    if (!scramble && scramble!=="") return;

    const currentAlgIndexRef = algIndexRef.current 
    const currentAlgRef= algRef.current

    setPathArrowList([]);
    setAngleList([]);
    setCenterPathList([]);
    setCenterPath2List([]);
    setCenterxList([]);
    setCenterx2List([]);
    setCenteryList([]);
    setCentery2List([]);
    setArrowColor([]);
    tempBarMovementRef.current=[]
    
    console.log("Rests",scramble,allAltAUF.current, allAUF.current)
    allAltAUF.current=[]
    allAUF.current=[]

    // give CaseImage time to render
     const timeout = setTimeout(() => {
    
    let newCombinedSquaresList= getSquaresInfo();
    // if(scrambleIndex.current==0){
    //     console.log("SquaresColors",newCombinedSquaresList)
    //     piecesMovementGen(newCombinedSquaresList)
    // }
    let newSquaresColors =getSquaresColors(newCombinedSquaresList)
    if (newSquaresColors && newSquaresColors.includes("white")) {
        console.log("Stopping CornerPermutationPage because it contains white");
        if (onError) onError("Not an OLL");  // notify parent
        return;                   // stop further updates
        
    }
    if(scrambleIndex.current==0){
        let piecesMovement= piecesMovementGen(newSquaresColors,newCombinedSquaresList);
        setPiecesMovement(piecesMovement)
    }
    getAltHeadlightsMovement()
    if(currentAlgIndexRef==0){
        setBarMovements([["Full"],["Back"],["Front"],["Left"],["Right"],["Diag"]])
    }
  },200);

  return () => clearTimeout(timeout);
}, [scramble]);

//If colors are initialized, get possible arrows
useEffect(() => {
  if (!squaresColors || squaresColors.length === 0) return;
  getPossibleArrows(squaresColors);
}, [squaresColors]);

//After arrows are generated, go to next scramble
useEffect(() => {
    if (arrowCombination.length==CornerPermutations.length){
        setArrowDone(true)
    }
    if (arrowCombination.length === 0) return;

    if (scrambleIndex.current + 1 < CornerPermutations.length) {
        scrambleIndex.current += 1
        let currentalg={}
        
        if (chosenAlg !=null){
            currentalg["algs"]=[chosenAlg,oll.algs]
            setScramble(currentalg.algs[currentAlgIndexRef] + CornerPermutations[scrambleIndex.current]);
            
        }
        else{
            currentalg=ollCaseSet.cases[currentAlgRef]
        }
            console.log("Rapid2",currentalg.algs[currentAlgIndexRef],CornerPermutations[scrambleIndex.current])
        setScramble(currentalg.algs[currentAlgIndexRef] + CornerPermutations[scrambleIndex.current]);
        //setScramble(currentalg.algs[currentAlgIndexRef])

        //if(scrambleIndex.current==1){

            let alg1=currentalg.algs[0]
            let alg2=currentalg.algs[1]
            console.log("CurrentAlg",currentalg,scrambleIndex.current)
            // if(alg2==""||alg2==undefined){
            //     console.log("SettingAltScramble1")
            //     setAltScramble(
            //     new Array(4).fill("").map((_,i)=>
            //         ""
            //     ));
            // }
            // else{
            //     if(currentAlgIndexRef==1){
            //         alg1=currentalg.algs[1]
            //         alg2=currentalg.algs[0]
            //     }
            //     alg2=Inverse(alg2)
            //     console.log("SettingAltScramble2")
            //     setAltScramble(
            //     new Array(4).fill("").map((_,i)=>
            //         alg2+allAUFPerm[i] +alg1+
            //         CornerPermutations[scrambleIndex.current]
            //     ));
            // }
            
            if(currentAlgIndexRef==0){
                alg2=Inverse(alg1)
                if(chosenAlg!=null && oll.algNumber==1){
                    alg2=Inverse(currentalg.algs[1])
                }
                // console.log("Errro?",alg1,currentAlgRef,alg2)
                // console.log("FKedUp2",alg1,alg2,oll)
                setAltScramble(
                new Array(4).fill("").map((_,i)=>
                    alg2+allAUFPerm[i] +alg1+
                    CornerPermutations[scrambleIndex.current]
                )
            );
            }
            else{
               alg1=currentalg.algs[1]
                    alg2=currentalg.algs[0]
                
                alg2=Inverse(alg2)
                // console.log("SettingAltScramble2")
                // console.log("FKedUp3",alg1,checkedAlgNumber,alg2,oll)
                setAltScramble(
                new Array(4).fill("").map((_,i)=>
                    alg2+allAUFPerm[i] +alg1+
                    CornerPermutations[scrambleIndex.current]
                ));
            
        //}
        // if(scrambleIndex.current==2){

        //     let alg1=currentalg.algs[currentAlgIndexRef]
        //     let alg2=currentalg.algs[currentAlgIndexRef]
        //     if(alg2==undefined){
        //         setAltScramble(
        //         new Array(4).fill("").map((_,i)=>
        //             ""
        //         ));
        //     }
        //     else{
        //         alg2=Inverse(alg2)
                
        //         setAltScramble(
        //         new Array(4).fill("").map((_,i)=>
        //             alg2+allAUFPerm[i] +alg1+
        //             CornerPermutations[scrambleIndex.current]
        //         ));
        //     }
            
        // }
        }
    }
    
}, [arrowCombination]);

function getAUFsOf2Algs(alg1,alg2){

}


useEffect(()=>{
    if(arrowDone==true){
    arrowCombinationSort()
    if(arrowCombination.length==6){
        setArrowCombinationSorted(true)
    }
    }
},[arrowDone])


function arrowCombinationSort(){
     if(scrambleIndex.current===5 &&arrowCombination.length==6){
        let newArray=[]
        for (let j=0;j<Math.min(arrowCombination.length,6);j++){
            let partOfArray=arrowCombination[j]
            let sortedArray = partOfArray
            .map(([c1, c2, type, penalty]) => {
                if (c1 > c2) [c1, c2] = [c2, c1]; // ensure center1 < center2
                return [c1, c2, type, penalty];
            })
            .sort((a, b) => {
                if (a[3] !== b[3]) return a[3] - b[3]; // penalty ascending
                if (a[0] !== b[0]) return a[0] - b[0]; // center1 ascending
                return a[1] - b[1];                     // center2 ascending
            });
            newArray.push(sortedArray)
        }
        setArrowCombination(newArray)
    }
}


function EasyRecognition(){

    let PossibleCombination=[]
    let AllCombination=[]
    let ReducedCombinations=[]
        
     for (let index1=0;index1<arrowCombination[0].length;index1++){
        
             for (let index2=0;index2<arrowCombination[0].length;index2++){//Second Arrow Indices
                let tempset=new Set()
                let allCombSet=new Set()
                for( let index3=0;index3<arrowCombination.length;index3++){ //ScrambleCornerPermutation
                    let skip=false
                
                let center1a=arrowCombination[index3][index1][0]
                let center1b=arrowCombination[index3][index1][1]
                let center2a=arrowCombination[index3][index2][0]
                let center2b=arrowCombination[index3][index2][1]
                
                if(index3==0){
                     if(arrowCombination[index3][index1][2]=="adj"){
                        skip=true
                     }
                     if(arrowCombination[index3][index2][2]=="adj"){
                            skip=true
                        }
                }
                if(index3==6){
                     if(arrowCombination[index3][index1][2]=="adj"){
                        skip=true
                     }
                     if(arrowCombination[index3][index2][2]=="adj"){
                            skip=true
                        }
                }
                if(index2>=index1){
                    skip=true
                }

                if(!skip){
                    if(center1a>center1b){
                    [center1b,center1a]=[center1a,center1b]
                }
                if(center2a>center2b){
                    [center2b,center2a]=[center2a,center2b]
                }
                
                let totalpenalty=arrowCombination[index3][index1][3]+arrowCombination[index3][index2][3]
                let leftUsed=false
                let rightUsed=false
                if(center1a==9||center1a==19||center1b==9 ||center1b==19||center2a==9||center2a==19||center2b==9||center2b==19 ){
                    leftUsed=true

                }
                if(center1a==15 ||center1b==15||center2a==15||center2b==15){
                    rightUsed=true
                }
                if(leftUsed &&rightUsed){
                    totalpenalty+=1000
                }


                tempset.add(JSON.stringify([center1a,center1b,arrowCombination[index3][index1][2],center2a,center2b,arrowCombination[index3][index2][2],totalpenalty]))
                
                }
               if(center1a>center1b){
                    [center1b,center1a]=[center1a,center1b]
                }
                if(center2a>center2b){
                    [center2b,center2a]=[center2a,center2b]
                }

                let totalpenalty=arrowCombination[index3][index1][3]+arrowCombination[index3][index2][3]
                
                allCombSet.add(JSON.stringify([center1a,center1b,arrowCombination[index3][index1][2],center2a,center2b,arrowCombination[index3][index2][2],totalpenalty]))
            }
           
             if(tempset.size==6){
                let setToArray = Array.from(tempset).map(JSON.parse);
                PossibleCombination.push(setToArray)
             }
             if(allCombSet.size==6){
                let setToArray = Array.from(allCombSet).map(JSON.parse);
                AllCombination.push(setToArray)
             }
                }
            }
        for(let i=0;i<PossibleCombination.length;i++){
            let easyrec=true
            for(let j=0;j<PossibleCombination[i].length;j++){
            if(1<=j && j<=4){
                if(PossibleCombination[i][j][2]!="adj" &&PossibleCombination[i][j][5]!="adj"){
                    easyrec=false
                }
            }
            }
            if(easyrec){
                ReducedCombinations.push(PossibleCombination[i])
            }
        }
    
    let LowestPenalty=[]
    let minpenalty=1000
        for (let i=0;i<AllCombination.length;i++){
        if(AllCombination[i][0][6]<minpenalty){
            minpenalty=AllCombination[i][0][6]
        }
    }

    let k=0
    while(LowestPenalty.length<5 &&k<=20){
        for (let i=0;i<AllCombination.length;i++){
            if(AllCombination[i][0][6]<=minpenalty+k){
                LowestPenalty.push(AllCombination[i])
            }
        }
        k=k+5
    }
    
    if(ReducedCombinations.length==0){
        ReducedCombinations=PossibleCombination
    }

    minpenalty=10000
    for (let i=0;i<ReducedCombinations.length;i++){
        if(ReducedCombinations[i][0][6]<minpenalty){
            minpenalty=ReducedCombinations[i][0][6]
        }
    }
    let LowestPenaltyEasy=[]
    
    k=0
    while ((LowestPenaltyEasy.length<3 &&k<=20)){
        for (let i=0;i<ReducedCombinations.length;i++){
            if(ReducedCombinations[i][0][6]==minpenalty+k){
                LowestPenaltyEasy.push(ReducedCombinations[i])
            }
        }
        k=k+5
    }

    let dict ={
        name:ollCaseSet.cases[currentAlgRef].name,
        easierRecognition:LowestPenaltyEasy,
        lowestPenaltyRecognition:LowestPenalty
    }

    if (chosenAlg !=null){
        dict["name"]=oll.name
    }

    console.log("GoOrder",groupdict,currentAlgRef)

    // jsonArrowsToExport.forEach((item)=>{
    //     console.log(item.name===dict.name)
    // })


    // const altAUFToSave = [...allAltAUF.current];

    // if(currentAlgIndexRef==1){
    //     AUFToSave = [...allAUF.current];
    // }

    const groupdictToSave= groupdict
    
    console.log("TOSave",altAUFToSave.current,AUFToSave.current)

    if(chosenAlg){
        setJsonArrowsToExport(prev=>
    [...prev,{...groupdict,...dict}]
    )
    }
    else{
        
        setJsonArrowsToExport(prev=>{
            console.log("GoOrder2",prev,currentAlgRef)
             console.log("Rests2",altAUFToSave.current,allAltAUF.current, AUFToSave.current,currentAlgRef,currentAlgIndexRef)
            if(currentAlgIndexRef==1){
                console.log("Rests3",altAUFToSave.current,AUFToSave.current,groupdict,groupdictToSave)
                let newAltAUF=[]
                console.log("GoOrder2AltItem2",AUFToSave.current,altAUFToSave.current,currentAlgRef,currentAlgIndexRef)
                altAUFToSave.current.forEach((item)=>{
                    console.log("AltItem",item,newAltAUF)
                    if(item=="U"){
                        newAltAUF.push("U'")
                    }
                    else if(item=="U'"){
                        newAltAUF.push("U")
                    }
                    else{
                        newAltAUF.push(item)
                    }
                    console.log(newAltAUF)
                })
         console.log("GoOrder2AltItem22",prev,AUFToSave.current,altAUFToSave.current,currentAlgRef,currentAlgIndexRef)
        return[...prev.slice(0,-1), { ...prev[prev.length - 1], differentAUF: [...AUFToSave.current] },{...groupdict,...dict,differentAUF: groupdictToSave.differentAUF}]
    }
    else{
           
        return [...prev,{...groupdict,...dict}]
        
    }
    })
        
    }
    

    scrambleIndex.current=0
    setPathArrowList([]);
    setAngleList([]);
    setCenterPathList([]);
    setCenterPath2List([]);
    setCenterxList([]);
    setCenterx2List([]);
    setCenteryList([]);
    setCentery2List([]);
    setSquaresColors([]);
    setArrowCombination([]);
    setArrowColor([]);
    setArrowCombinationSorted(false);
    setArrowDone(false);
    

    

  
    if(!chosenAlg){

   //Continue if it isnt the last alg
    if(currentAlgRef+1<ollCaseSet.cases.length || ollCaseSet.cases[currentAlgRef].algs[currentAlgIndexRef+1]){
    //if(currentAlgRef+1<0 || ollCaseSet.cases[currentAlgRef].algs[currentAlgIndexRef+1]){
     
        if(currentAlgIndexRef==1){
            algIndexRef.current=0
            algRef.current+=1
            
        }
        else if(currentAlgIndexRef==0 &&chosenAlg==null){
            algIndexRef.current=1
            if(ollCaseSet.cases[currentAlgRef].algs[currentAlgIndexRef+1]==undefined){
                algIndexRef.current=0
                algRef.current+=1
            }
        }

        // if(currentAlgRef==1){
        //     algRef.current=1
        // }


    console.log("Rapid3",currentAlgRef,currentAlgIndexRef,ollCaseSet.cases,ollCaseSet.cases[algRef.current].algs[algIndexRef.current])
    setScramble(ollCaseSet.cases[algRef.current].algs[algIndexRef.current])

    let alg1=ollCaseSet.cases[algRef.current].algs[0]
    let alg2=ollCaseSet.cases[algRef.current].algs[1]
    if(alg2==""||alg2==undefined){
        alg2=alg1
    }
    if(currentAlgIndexRef==1){
        alg1=ollCaseSet.cases[algRef.current].algs[1]
        alg2=ollCaseSet.cases[algRef.current].algs[0]
    }

    let currentalg={}
    
    if (chosenAlg ==null){
        currentalg=ollCaseSet.cases[currentAlgRef]
    }
    else{
        currentalg["algs"]=[chosenAlg,oll.algs]
    }

    alg2=Inverse(alg2)
      
    // setAllAltAUF([])
    setBarMovements([])
    // console.log("Wutsd",alg1,currentAlgRef,currentAlgIndexRef,alg2)
    if(currentAlgIndexRef==0){
        alg2=Inverse(alg1)
        // console.log("FKedUp4",alg1,checkedAlgNumber,alg2,oll)
        setAltScramble(
            new Array(4).fill("").map((_,i)=>
                alg2+allAUFPerm[i] +alg1+
                CornerPermutations[scrambleIndex.current]
            )
        );
    }
    
    else{
        if(currentAlgIndexRef==1){
            alg1=currentalg.algs[1]
            alg2=currentalg.algs[0]
        }
        alg2=Inverse(alg2)

        
        
        //Search for angle in which alternative oll should be performed
        // console.log("FKedUp5",alg1,checkedAlgNumber,alg2,oll)
        setAltScramble(
            new Array(4).fill("").map((_,i)=>
                alg2+allAUFPerm[i] +alg1+
                CornerPermutations[scrambleIndex.current]
            )
        );
    }
     }
    }
}

let groupdict




function getRotation(Center1,Center2){ 

 
    
    const xCoords = [9.5, 39.5, 79.5, 119.5,149.5];
    const yCoords = [9.75, 39.75, 79.75, 119.75, 149.75];

    let Centers = [];

    for (let y of yCoords) {
    for (let x of xCoords) {
        Centers.push([x, y]);
    }
    }

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

    angle=Math.round(angle)
    
    return angle

}

function GroupRecognition(){
    let FirstPairOppTrueList=[]
    let SecondPairOppTrueList=[]
    let ThirdPairOppTrueList=[]
    let FirstPairSameTrueList=[]
    let SecondPairSameTrueList=[]
    let ThirdPairSameTrueList=[]
    let FirstPairBothTrueList=[]
    let SecondPairBothTrueList=[]
    let ThirdPairBothTrueList=[]

    let FirstPairSameOppTrueList=[]
    let SecondPairSameOppTrueList=[]
    let ThirdPairSameOppTrueList=[]

    let Pairs=[[0,5],[1,2],[3,4]]

    for (let j=0;j<Pairs.length;j++){
        for (let index1=0;index1<arrowCombination[0].length;index1++){
            let oppTrue=false
            let sameTrue=false
            let bothTrue=false
            let sameOppTrue=false

            if(arrowCombination[Pairs[j][0]][index1][2]=="opp" &&arrowCombination[Pairs[j][1]][index1][2]=="opp"){
                oppTrue=true
            }
            if(arrowCombination[Pairs[j][0]][index1][2]=="same" &&arrowCombination[Pairs[j][1]][index1][2]=="same"){
                sameTrue=true
            }
            if(arrowCombination[Pairs[j][0]][index1][2]!="adj" &&arrowCombination[Pairs[j][1]][index1][2]!="adj"){
                if(oppTrue==false &&sameTrue==false)
                bothTrue=true
            }  
            if(arrowCombination[Pairs[j][0]][index1][2]!="adj" && arrowCombination[Pairs[j][1]][index1][2]!="adj" &&arrowCombination[Pairs[j][0]][index1][2]!=arrowCombination[Pairs[j][1]][index1][2]){
                sameOppTrue=true
            }

            if(oppTrue){
                
                let unique=true
                // console.log("test")
                // console.log(arrowCombination[Pairs[j][0]][index1])
                // console.log(arrowCombination[Pairs[j][0]][index1][2])
                for (let i=0; i<6;i++){
                    if(i!=Pairs[j][0] && i!=Pairs[j][1]){
                        if(arrowCombination[i][index1][2]=="opp"){
                            unique=false
                            //console.log(arrowCombination[Pairs[j][0]][index1],j)
                            break
                        }
                    }
                    
                }

                if(unique){

                    for( let index2=0;index2<arrowCombination[0].length;index2++){
                        if(index2!=index1){
                        if (arrowCombination[Pairs[j][0]][index2][2]!="adj" && arrowCombination[Pairs[j][1]][index2][2]!="adj"){
                            if(arrowCombination[Pairs[j][0]][index2][2]!=arrowCombination[Pairs[j][1]][index2][2]){
                            
                            // console.log()
                            // console.log()
                            // console.log()
                            // console.log()

                            // console.log(arrowCombination)
                            // console.log()
                            // console.log()
                            // console.log()

                            
                            let center1a=arrowCombination[Pairs[j][0]][index1][0]
                            let center1b=arrowCombination[Pairs[j][0]][index1][1]
                            let center2a=arrowCombination[Pairs[j][0]][index2][0]
                            let center2b=arrowCombination[Pairs[j][0]][index2][1]
                            
                            
                            
                            let totalpenalty=arrowCombination[Pairs[j][0]][index1][3]+arrowCombination[Pairs[j][0]][index2][3]
                            
                            let leftUsed=false
                            let rightUsed=false
                            if(center1a==9||center1a==19||center1b==9 ||center1b==19||center2a==9||center2a==19||center2b==9||center2b==19 ){
                                leftUsed=true

                            }
                            if(center1a==15 ||center1b==15||center2a==15||center2b==15){
                                rightUsed=true
                            }
                            if(leftUsed &&rightUsed){
                                totalpenalty=1000
                            }
                            let ArrayToPush= [[center1a,center1b,arrowCombination[Pairs[j][0]][index1][2],center2a,center2b,arrowCombination[Pairs[j][0]][index2][2],totalpenalty]]
                            ArrayToPush.push([center1a,center1b,arrowCombination[Pairs[j][1]][index1][2],center2a,center2b,arrowCombination[Pairs[j][1]][index2][2],totalpenalty])
                            
                            // console.log("ErrorPush",ArrayToPush,j,oll.algNumber,chosenAlg)
                            if(j==0){
                                FirstPairOppTrueList.push(ArrayToPush)
                            }
                            if(j==1){
                                SecondPairOppTrueList.push(ArrayToPush)
                            }
                            if(j==2){
                                ThirdPairOppTrueList.push(ArrayToPush)
                               
                            }
                        }
                    }
                    }
                }
                }
            }


            if(sameTrue){
                
                let unique=true
                // console.log("test")
                // console.log(arrowCombination[Pairs[j][0]][index1])
                // console.log(arrowCombination[Pairs[j][0]][index1][2])
                for (let i=0; i<6;i++){
                    if(i!=Pairs[j][0] && i!=Pairs[j][1]){
                        if(arrowCombination[i][index1][2]=="opp"){
                            unique=false
                            //console.log(arrowCombination[Pairs[j][0]][index1],j)
                            break
                        }
                    }
                    
                }

                if(unique){
                    for( let index2=0;index2<arrowCombination[0].length;index2++){
                        if(index2!=index1){
                        if (arrowCombination[Pairs[j][0]][index2][2]!="adj" && arrowCombination[Pairs[j][1]][index2][2]!="adj"){
                            if(arrowCombination[Pairs[j][0]][index2][2]!=arrowCombination[Pairs[j][1]][index2][2]){
                        
                            let center1a=arrowCombination[Pairs[j][0]][index1][0]
                            let center1b=arrowCombination[Pairs[j][0]][index1][1]
                            let center2a=arrowCombination[Pairs[j][0]][index2][0]
                            let center2b=arrowCombination[Pairs[j][0]][index2][1]
                            
                            let totalpenalty=arrowCombination[Pairs[j][0]][index1][3]+arrowCombination[Pairs[j][0]][index2][3]
                            
                            let leftUsed=false
                            let rightUsed=false
                            if(center1a==9||center1a==19||center1b==9 ||center1b==19||center2a==9||center2a==19||center2b==9||center2b==19 ){
                                leftUsed=true

                            }
                            if(center1a==15 ||center1b==15||center2a==15||center2b==15){
                                rightUsed=true
                            }
                            if(leftUsed &&rightUsed){
                                totalpenalty=1000
                            }
                            let ArrayToPush= [[center1a,center1b,arrowCombination[Pairs[j][0]][index1][2],center2a,center2b,arrowCombination[Pairs[j][0]][index2][2],totalpenalty]]
                            ArrayToPush.push([center1a,center1b,arrowCombination[Pairs[j][1]][index1][2],center2a,center2b,arrowCombination[Pairs[j][1]][index2][2],totalpenalty])
                            if(j==0){
                                FirstPairSameTrueList.push(ArrayToPush)
                            }
                            if(j==1){
                                SecondPairSameTrueList.push(ArrayToPush)
                            }
                            if(j==2){
                                ThirdPairSameTrueList.push(ArrayToPush)
                            }
                        }
                    }
                    }
                    }
                }
            }


            if(bothTrue){
                
                let unique=true
                // console.log("test")
                // console.log(arrowCombination[Pairs[j][0]][index1])
                // console.log(arrowCombination[Pairs[j][0]][index1][2])
                for (let i=0; i<6;i++){
                    if(i!=Pairs[j][0] && i!=Pairs[j][1]){
                        if(arrowCombination[i][index1][2]=="opp"){
                            unique=false
                            //console.log(arrowCombination[Pairs[j][0]][index1],j)
                            break
                        }
                    }
                    
                }

                if(unique){
                    for( let index2=0;index2<arrowCombination[0].length;index2++){
                        if(index2!=index1){
                        if (arrowCombination[Pairs[j][0]][index2][2]!="adj" && arrowCombination[Pairs[j][1]][index2][2]!="adj"){
                            if(arrowCombination[Pairs[j][0]][index2][2]!=arrowCombination[Pairs[j][1]][index2][2]){
                        
                            let center1a=arrowCombination[Pairs[j][0]][index1][0]
                            let center1b=arrowCombination[Pairs[j][0]][index1][1]
                            let center2a=arrowCombination[Pairs[j][0]][index2][0]
                            let center2b=arrowCombination[Pairs[j][0]][index2][1]
                            
                            let totalpenalty=arrowCombination[Pairs[j][0]][index1][3]+arrowCombination[Pairs[j][0]][index2][3]
                            
                            let leftUsed=false
                            let rightUsed=false
                            if(center1a==9||center1a==19||center1b==9 ||center1b==19||center2a==9||center2a==19||center2b==9||center2b==19 ){
                                leftUsed=true

                            }
                            if(center1a==15 ||center1b==15||center2a==15||center2b==15){
                                rightUsed=true
                            }
                            if(leftUsed &&rightUsed){
                                totalpenalty=1000
                            }
                            let ArrayToPush= [[center1a,center1b,arrowCombination[Pairs[j][0]][index1][2],center2a,center2b,arrowCombination[Pairs[j][0]][index2][2],totalpenalty]]
                            ArrayToPush.push([center1a,center1b,arrowCombination[Pairs[j][1]][index1][2],center2a,center2b,arrowCombination[Pairs[j][1]][index2][2],totalpenalty])
                            if(j==0){
                                FirstPairOppTrueList.push(ArrayToPush)
                            }
                            if(j==1){
                                SecondPairBothTrueList.push(ArrayToPush)
                            }
                            if(j==2){
                                ThirdPairBothTrueList.push(ArrayToPush)
                            }
                        }
                    }
                    }
                }
                }
            }

            if(sameOppTrue){
                
                let unique=true

                if(unique){

                    for( let index2=0;index2<arrowCombination[0].length;index2++){
                        if(index2!=index1){
                            console.log("arrowWtf",arrowCombination,arrowCombination[Pairs[j][1]],index2)
                         if(arrowCombination[Pairs[j][0]][index2][2]!="adj" && arrowCombination[Pairs[j][1]][index2][2]!="adj"){
                            if(index1!=index2){
                            
                            let center1a=arrowCombination[Pairs[j][0]][index1][0]
                            let center1b=arrowCombination[Pairs[j][0]][index1][1]
                            let center2a=arrowCombination[Pairs[j][0]][index2][0]
                            let center2b=arrowCombination[Pairs[j][0]][index2][1]

                            let angle1=getRotation(center1a,center1b)
 
                            let angle2=getRotation(center2a,center2b)
                            let anglepenalty=0

                            if(angle1==135){
                                angle1=45
                            }
                            if(angle2==135){
                                angle2=45
                            }
                            if(angle1!=angle2){
                
                                anglepenalty+=20
                            }
                            angle1=angle1%90
                            angle2=angle2%90
                            
                            
                            let totalpenalty=arrowCombination[Pairs[j][0]][index1][3]+arrowCombination[Pairs[j][0]][index2][3]
                            
                            
                            if(angle1==45){
                                anglepenalty+=5
                            }
                            if(angle2==45){
                                anglepenalty+=5
                            }
                            if(angle1!=45 &&angle1!=0){
                                anglepenalty+=15
                            }
                            if(angle2!=45 &&angle2!=0){
                                anglepenalty+=15
                            }
                            
                            totalpenalty+=anglepenalty
                            

                            let leftUsed=false
                            let rightUsed=false
                            if(center1a==9||center1a==19||center1b==9 ||center1b==19||center2a==9||center2a==19||center2b==9||center2b==19 ){
                                leftUsed=true

                            }
                            if(center1a==15 ||center1b==15||center2a==15||center2b==15){
                                rightUsed=true
                            }
                            if(leftUsed &&rightUsed){
                                totalpenalty+=1000
                            }

                            
                            let corner1used=0
                            let corner2used=0
                            let corner3used=0
                            let corner4used=0
                            
                            let corner1=[6]
                            let corner2=[8,9]
                            let corner3=[16,15,21]
                            let corner4=[18,19,23]
                            let CentersUsed=[center1a,center1b,center2a,center2b]
                            
                            corner1.forEach(corner=>{
                                if(CentersUsed.includes(corner)){
                                    corner1used=1
                                }
                            })
                            corner2.forEach(corner=>{
                                if(CentersUsed.includes(corner)){
                                    corner2used=1
                                }
                            })
                            corner3.forEach(corner=>{
                                if(CentersUsed.includes(corner)){
                                    corner3used=1
                                }
                            })
                            corner4.forEach(corner=>{
                                if(CentersUsed.includes(corner)){
                                    corner4used=1
                                }
                            })

                            let sumcorners= corner1used+corner2used+corner3used+corner4used
                            if(sumcorners<3){
                                totalpenalty+=10000
                            }
                            let ArrayToPush= [[center1a,center1b,arrowCombination[Pairs[j][0]][index1][2],center2a,center2b,arrowCombination[Pairs[j][0]][index2][2],totalpenalty]]
                            ArrayToPush.push([center1a,center1b,arrowCombination[Pairs[j][1]][index1][2],center2a,center2b,arrowCombination[Pairs[j][1]][index2][2],totalpenalty])
                            
                            if(totalpenalty<=200){
                                if(j==0){
                                FirstPairSameOppTrueList.push(ArrayToPush)
                                }
                                if(j==1){
                                    SecondPairSameOppTrueList.push(ArrayToPush)
                                }
                                if(j==2){
                                    ThirdPairSameOppTrueList.push(ArrayToPush)
                                }
                            }
                            
                            }
                        }
                    }
                    }
                }
            }

            
            

        }
        // console.log("2errorpush",oll.algNumber,FirstPairSameOppTrueList,SecondPairSameOppTrueList,ThirdPairSameOppTrueList)
    }

    function SortAndShortenPenaltiesList(list){
        if(list.length>0){

        list.sort((a, b) => a[0][6] - b[0][6])

        let newlist=[]
        let minnewlistlength=3
        for (let i=0;i<Math.min(list.length,minnewlistlength);i++){
            newlist.push(list[i])
        }

        for (let i=3;i<list.length;i++){
            if(newlist.length>2){
                if (newlist[2][0][6]==list[i][0][6]){
                newlist.push(list[i])
            }
            }
            
        }

        return newlist
    }
    }


    FirstPairOppTrueList=SortAndShortenPenaltiesList(FirstPairOppTrueList)
    FirstPairSameTrueList=SortAndShortenPenaltiesList(FirstPairSameTrueList)
    FirstPairBothTrueList=SortAndShortenPenaltiesList(FirstPairBothTrueList)
    SecondPairOppTrueList=SortAndShortenPenaltiesList(SecondPairOppTrueList)
    SecondPairSameTrueList=SortAndShortenPenaltiesList(SecondPairSameTrueList)
    SecondPairBothTrueList=SortAndShortenPenaltiesList(SecondPairBothTrueList)
    ThirdPairOppTrueList=SortAndShortenPenaltiesList(ThirdPairOppTrueList)
    ThirdPairSameTrueList=SortAndShortenPenaltiesList(ThirdPairSameTrueList)
    ThirdPairBothTrueList=SortAndShortenPenaltiesList(ThirdPairBothTrueList)

    if(FirstPairSameOppTrueList.length==0){
        console.log("COoked")
        console.log(currentAlgRef)
    }
    if(SecondPairSameOppTrueList.length==0){
        console.log("COoked")
        console.log(currentAlgRef)
    }
    if(ThirdPairSameOppTrueList.length==0){
        console.log("COoked")
        console.log(currentAlgRef)
    }


    FirstPairSameOppTrueList=SortAndShortenPenaltiesList(FirstPairSameOppTrueList)
    SecondPairSameOppTrueList=SortAndShortenPenaltiesList(SecondPairSameOppTrueList)
    ThirdPairSameOppTrueList=SortAndShortenPenaltiesList(ThirdPairSameOppTrueList)
    
    
    let finalOrder= getOrder(piecesMovement,squaresColors)
    
    console.log("GetScramble",ollCaseSet.cases[currentAlgRef])
    
    if(chosenAlg!=null){
        if(oll.algNumber==0){
            AUFToSave.current = [...allAUF.current];
        }
        if(oll.algNumber==1){
             altAUFToSave.current = [...allAltAUF.current];
        }
    }
    else{
        if(currentAlgIndexRef==1){
        altAUFToSave.current = [...allAltAUF.current];
        }
        if(currentAlgIndexRef==0){
            AUFToSave.current = [...allAUF.current];
        }
    }
    

    // console.log("TOSave2",altAUFToSave.current,AUFToSave.current,currentAlgIndexRef,allAUF.current)

    try{
        // console.log("groupC", chosenAlg,oll,oll.algNumber,currentAlgRef,currentAlgIndexRef)
        
        groupdict ={
            id:crypto.randomUUID(),
            name:ollCaseSet.cases[currentAlgRef].name,
            ollNumber:parseInt(ollCaseSet.cases[currentAlgRef].name.split(" ")[1]),
            algNumber:currentAlgIndexRef,
            differentAUF:allAUF.current,
            altAUF:allAltAUF.current,
            barMovements:barMovements,
            piecesMovement:piecesMovement,
            order:finalOrder,
            algAttemptCount:null,
            algSpeed:null,
            algTps:null,
            algs:ollCaseSet.cases[currentAlgRef].algs[currentAlgIndexRef],
            scrambles:ollCaseSet.cases[currentAlgRef].scrambles,
            group:ollCaseSet.cases[currentAlgRef].group,
            difficultCenters:[],
            difficultColors:[],
            groupRecUsed:true,
            sameOppUsed:true,
            // fullDiagCp:[...FirstPairOppTrueList,FirstPairSameTrueList,FirstPairBothTrueList],
            // leftRightCp:[...SecondPairOppTrueList,SecondPairSameTrueList,SecondPairBothTrueList],
            // frontBackCp:[...ThirdPairOppTrueList,ThirdPairSameTrueList,ThirdPairBothTrueList],
            
            fullDiagCp:[[...FirstPairOppTrueList][0]],
            leftRightCp:[[...SecondPairOppTrueList][0]],
            frontBackCp:[[...ThirdPairOppTrueList][0]],
            SameOpp:[[FirstPairSameOppTrueList[0]],[SecondPairSameOppTrueList[0]],[ThirdPairSameOppTrueList[0]]]
        
        }
        if(chosenAlg !=null){
            groupdict["id"]=oll.id
            groupdict["name"]=oll.name
            groupdict["ollNumber"]=oll.ollNumber
            groupdict["algNumber"]=oll.algNumber
            groupdict["algs"]=chosenAlg
            groupdict["group"]=oll.group
            console.log("GroupE")

        }
        // console.log("GroupD",groupdict,chosenAlg)
    }
    catch(error){
        console.error(error)
    }

    //Groupdict will be added in EasyRecognition Function

    //if(currentAlgRef+1<ollCaseSet.cases.length){

    // if(currentAlgRef+1<3){
    //     currentAlgRef+=1
    //     console.log(`Through, ${currentAlgRef}`)
    //     console.log()

   
    // scrambleIndex.current=0
    // setPathArrowList([]);
    // setAngleList([]);
    // setCenterPathList([]);
    // setCenterPath2List([]);
    // setCenterxList([]);
    // setCenterx2List([]);
    // setCenteryList([]);
    // setCentery2List([]);
    // setSquaresColors([]);
    // setArrowCombination([]);
    // setArrowColor([]);
    // setArrowCombinationSorted(false);
    // setArrowDone(false);

    // setScramble(ollCaseSet.cases[currentAlgRef].algs[currentAlgIndexRef])
    //  }

    //Clean Up and Next scramble generated at easyrecognition

    //  if(currentAlgRef+1==ollCaseSet.cases.length){
  
    //     console.log(`CopyToExport`,JSON.stringify(jsonArrowsToExport, null, 2))
    //     console.dir(jsonArrowsToExport, { depth: null });
    // }
    // Arrow(FirstPairOppTrueList[0][1][0],FirstPairOppTrueList[0][1][1],"blue")
    // Arrow(FirstPairOppTrueList[0][1][3],FirstPairOppTrueList[0][1][4],"red")
    //Arrow(6,16,"red")
}

function UpdateAUFs(jsonArrowsToExport){


    let updatedJsonArrowsToExport=[]

    if(oll?.algNumber==0){
         jsonArrowsToExport=[[...jsonArrowsToExport][1],[...jsonArrowsToExport][0]]

    }
    let maxLength=jsonArrowsToExport.length-1

    console.log("GivenJson",jsonArrowsToExport)
    
    jsonArrowsToExport.forEach((item,i)=>{
        // console.log("Item",i,jsonArrowsToExport)
        
        if(jsonArrowsToExport[i].algNumber==0&&i<maxLength &&jsonArrowsToExport[i+1].algNumber==1){

            AlgNumber1Data.current={...jsonArrowsToExport[i+1],differentAUF:jsonArrowsToExport[i].differentAUF}
            console.log("StoredData",AlgNumber1Data.current)
        }
        else if(jsonArrowsToExport[i].algNumber==0){
            updatedJsonArrowsToExport.push({...jsonArrowsToExport[i]})
        }
        if(jsonArrowsToExport[i].algNumber==1){
            
            let altAUFs=jsonArrowsToExport[i].altAUF
            let newAltAUFs= []

            console.log("ALtAUFS",altAUFs,jsonArrowsToExport[i].ollNumber,jsonArrowsToExport[i].algNumber)
            altAUFs.forEach((item)=>{
                console.log("altItm",item)
                if(item=="U"){
                    newAltAUFs.push("U'")
                }
                else if(item=="U'"){
                    newAltAUFs.push("U")
                }
                else{
                    newAltAUFs.push(item)
                }
            })
            console.log("NewAUF",newAltAUFs,AlgNumber1Data.current)
            updatedJsonArrowsToExport.push({...jsonArrowsToExport[i-1],altAUF:newAltAUFs})
            updatedJsonArrowsToExport.push(AlgNumber1Data.current)
        }


    })

    console.log("Pls",updatedJsonArrowsToExport)
    return updatedJsonArrowsToExport
}


useEffect(() => {
     console.log("Nothing>>>>",algRef.current+1,ollCaseSet.cases.length)
    // if (
    //     jsonArrowsToExport.length === 0 ||
    //     chosenAlg == null ||
    //     !dbOllCaseSet ||
    //     dbOllCaseSet.length === 0
    // ) {
    //     return;
    // }

    if(jsonArrowsToExport.length>0 &&chosenAlg!=null){

    console.log(dbOllCaseSet,"Print Json",chosenAlg,jsonArrowsToExport)
    if(chosenAlg !=null&&chosenAlg!==""){
        if(jsonArrowsToExport.length>1){
            let newJsonArrowsToExport = UpdateAUFs(jsonArrowsToExport)

            console.log("UpdateNewOll",jsonArrowsToExport,newJsonArrowsToExport)
            UpdateOll(newJsonArrowsToExport[0].id,newJsonArrowsToExport[0])    
            UpdateOll(newJsonArrowsToExport[1].id,newJsonArrowsToExport[1]) 
            
            console.log(
            "Temp arrowOllSet = " +
            JSON.stringify(newJsonArrowsToExport, null, 2)
                .replace(/"([^"]+)":/g, '$1:') + 
            ";\n\nexport default arrowOllSet;"
            );
            setChosenAlg(null)
            onSuccess()
            
        }
        else{
        let checkedAlgNumber=1
        if(oll.algNumber==0){
            checkedAlgNumber=1
        }
        else{
            checkedAlgNumber=0
        }

        console.log("LengthThest",dbOllCaseSet,checkedAlgNumber,chosenAlg,)
        if(dbOllCaseSet.length>1 && dbOllCaseSet[1].algs!=""){
            console.log("NewChosenAlg",checkedAlgNumber,dbOllCaseSet[checkedAlgNumber])
            setOll(dbOllCaseSet[checkedAlgNumber])
            console.log("NewOll",dbOllCaseSet[checkedAlgNumber])
            setChosenAlg(dbOllCaseSet[checkedAlgNumber].algs)
        }
        else{
            UpdateOll(jsonArrowsToExport[0].id,jsonArrowsToExport[0])  
            console.log(
    "Temp2 arrowOllSet = " +
    JSON.stringify(jsonArrowsToExport, null, 2)
        .replace(/"([^"]+)":/g, '$1:') + 
    ";\n\nexport default arrowOllSet;"
    );  
            setChosenAlg(null)
            onSuccess()
            
        }
        
    }
    }
}
    console.log("StillNothing>>",algRef.current,ollCaseSet.cases.length)
  if (algRef.current+1 === ollCaseSet.cases.length) {
    // const groupTable = {
    // "Cross": 0,
    // "Dot": 1,
    // "T Shape": 2,
    // "C Shape": 3,
    // "I Shape": 4,
    // "P Shape": 5,
    // "W Shape": 6,
    // "Small L Shape": 7,
    // "Small Lightning Bolt": 8,
    // "Big Lightning Bolt": 9,
    // "Square Shape": 10,
    // "Fish Shape": 11,
    // "Knight Move Shape": 12,
    // "Awkward Shape": 13,
    // "Corners Oriented": 14,
    // }
    // let groupedArray =Array.from({length:15},()=>[])
        
    // jsonArrowsToExport.forEach(ollAlg => {
    // const index = groupTable[ollAlg.group];
    // if (index !== undefined) {
    //     groupedArray[index].push(ollAlg);
    // }
    // });

    // // sort each group once
    // groupedArray.forEach(group => {
    // group.sort(
    //     (a, b) =>
    //     parseInt(a.group.split(" ")[1]) -
    //     parseInt(b.group.split(" ")[1])
    // );
    // });
        

    //Important!
    console.log(
    "const arrowOllSet = " +
    JSON.stringify(jsonArrowsToExport, null, 2)
        .replace(/"([^"]+)":/g, '$1:') + 
    ";\n\nexport default arrowOllSet;"
    );

let newJsonArrowsToExport = UpdateAUFs([...jsonArrowsToExport]);
    console.log("NewPls",newJsonArrowsToExport)
      
    //Important!
    console.log(
    "const arrowOllSet = " +
    JSON.stringify(newJsonArrowsToExport, null, 2)
        .replace(/"([^"]+)":/g, '$1:') + 
    ";\n\nexport default arrowOllSet;"
    );
  }


    

}, [jsonArrowsToExport,dbOllCaseSet]);


useEffect(()=>{


    if(arrowCombinationSorted==true){
    if (arrowCombination.length==6){//First Arrow Indices

        GroupRecognition()
        EasyRecognition()
    }}
   

    
},[arrowCombinationSorted])

function addYellowMovementToPiecesMovement(currentPiecesIndex,futurePiecesIndex,squaresColors){
    
    let closestYellowUp={
        1:6,
        2:7,
        3:8,
        5:6,
        9:8,
        10:11,
        14:13,
        15:16,
        19:18,
        21:16,
        22:17,
        23:18
    }

    console.log("Squarecol",currentPiecesIndex,futurePiecesIndex,squaresColors)
    for (let i=0; i<squaresColors.length;i++){
        let closeToYellowIndex
        let newYellowIndex
        if (squaresColors[i]=="yellow"){
            if (i!=12){
                if (i==5 ||i==10||i==13|| i==15){
                    closeToYellowIndex=currentPiecesIndex.findIndex(center => center==i+1)
                    newYellowIndex=closestYellowUp[futurePiecesIndex[closeToYellowIndex]]
                }
                if (i==9 ||i==11||i==16||i==14|| i==19){
                    closeToYellowIndex=currentPiecesIndex.findIndex(center => center==i-1)
                    newYellowIndex=closestYellowUp[futurePiecesIndex[closeToYellowIndex]]
                }
                if ( i==1 || i==2||i==3||i==16 || i==17||i==18){
                    closeToYellowIndex=currentPiecesIndex.findIndex(center => center==i+5)
                    newYellowIndex=closestYellowUp[futurePiecesIndex[closeToYellowIndex]]
                }
                if (i==6||i==7||i==8|| i==21||i==22||i==23){
                    closeToYellowIndex=currentPiecesIndex.findIndex(center => center==i-5)
                    newYellowIndex=closestYellowUp[futurePiecesIndex[closeToYellowIndex]]
                }
            console.log("CurrentYellow",i,closeToYellowIndex,currentPiecesIndex,futurePiecesIndex,closeToYellowIndex,newYellowIndex);
            currentPiecesIndex.push(i)
            futurePiecesIndex.push(newYellowIndex);
            }            
        }
    }
    return [currentPiecesIndex,futurePiecesIndex]
}

function getOrder(piecesMovement,squaresColors){

    const excluded = new Set([0, 4, 20, 24]);

    let values = Array.from({ length: 25 }, (_, i) => i)
    .filter(v => !excluded.has(v));

    const valueSet= new Set(values)
    console.log("OrderValues",piecesMovement,squaresColors);

    let currentPiecesIndex= piecesMovement.flat(2).filter((value,index,array)=>index%2==0)
    let futurePiecesIndex= piecesMovement.flat(2).filter((value,index,array)=>index%2==1)
    // currentPiecesIndex=currentPiecesIndex.filter((value,index,array)=>squaresColors[index]!="yellow")
    // futurePiecesIndex=futurePiecesIndex.filter((value,index,array)=>squaresColors[index]!="yellow")
    console.log("NewOrderLists",currentPiecesIndex,futurePiecesIndex);
    [currentPiecesIndex,futurePiecesIndex]=addYellowMovementToPiecesMovement(currentPiecesIndex,futurePiecesIndex,squaresColors)
    let orderList= Array.from({ length: 25 }, (_, i) => [])

    console.log("NewOrder",currentPiecesIndex,currentPiecesIndex)
    let cycleCount=0
    while (valueSet.size>0&&cycleCount<25){
        console.log("OrderSets",valueSet,cycleCount,valueSet.size)
        let newStart= [...valueSet][0]
        let newStartIndex= currentPiecesIndex.findIndex(center => center==newStart)
        let nextCenter= futurePiecesIndex[newStartIndex]
        let nextCenterIndex =currentPiecesIndex.findIndex(center => center==nextCenter)

        valueSet.delete(newStart)
        console.log("OrderMovementPushStart",newStart,cycleCount,orderList[cycleCount])
        orderList[cycleCount].push(newStart)
        if(newStart!=nextCenter &&nextCenter){
            orderList[cycleCount].push(nextCenter)
            valueSet.delete(nextCenter)
        }
        let innerLoopCount=0
        console.log("PreOrderMovement",newStart,nextCenter,nextCenterIndex)
        while (nextCenterIndex!=newStartIndex && innerLoopCount<13){
            nextCenter= futurePiecesIndex[nextCenterIndex]
            console.log("OrderMovement",currentPiecesIndex[nextCenterIndex],nextCenter)
            nextCenterIndex =currentPiecesIndex.findIndex(center => center==nextCenter)
            valueSet.delete(nextCenter)
            
            console.log("OrderMovementPush",nextCenter,cycleCount,orderList[cycleCount])
            if(newStart!=nextCenter){
                orderList[cycleCount].push(nextCenter)
            }
            innerLoopCount+=1
        }
        cycleCount+=1
    }


    console.log("getOrderDone",orderList)
    let cycleLengths=[]
    for (let i=0;i<orderList.length;i++){
        if(orderList[i].length>1){
            cycleLengths.push(orderList[i].length)
        }
    }
    console.log("CycleLengths",cycleLengths)
    let order= lcm(cycleLengths)
    console.log("OrderFound",order)
    return order
}

function gcd(a, b) {
    console.log("GCD",a,b)
  while (b !== 0) {
    console.log("GcdAlg",a,b,a%b);
    [a, b] = [b, a % b];
  }
  console.log("ReturnGCD",a)
  return a;
}
function lcm(cycleLengths){
    let last_a=cycleLengths[0]
    console.log("GcdLcmCycleLength",cycleLengths)
    for (let i=0;i<cycleLengths.length-1;i++){
        let b=cycleLengths[i+1]
        console.log("GcdLcm",last_a,b)
        last_a= Math.abs(last_a*b)/gcd(last_a,b)
    }
    return last_a
}

useEffect(()=>{
    if (tempArrowSet.size === 6) {
    // console.log("Found arrowCombination with 6 unique elements!");
    // console.log(Array.from(tempArrowSet).map(JSON.parse));
  }

},[tempArrowSet])

// useEffect(() => {
//   if (squaresColors.length === 0) return;
//   getPossibleArrows();
// }, [squaresColors]);

// useEffect(()=>{
//     if(arrowCombination.length>0){
//         // console.log("Here?")
//         // console.log(arrowCombination)
//         // console.log(arrowCombination[arrowCombination.length-1])
//         let color
//         for (let index=0;index<arrowCombination[arrowCombination.length-1].length;index++){
//         if(arrowCombination[arrowCombination.length-1][index][2]=="same"){
//             color="rgba(0, 255, 21, 1)"
//         }
//         else if (arrowCombination[arrowCombination.length-1][index][2]=="opp"){
//             color="rgba(4, 0, 255, 1)"
//         }
//         else{
//             color="red"
//         }
//     }
//     }
   
// },[arrowCombination])

const tempBarMovementRef = useRef([]);

 const overlayRef = useRef(null);
const altoverlayRefs = useRef(Array.from({ length: 4}, () => null));


    

     function getSquaresInfo(){
         const containerParent = overlayRef.current;
    let container= containerParent.querySelector("div")
    let containerSvg= container.querySelector("svg")
    let containerSvgSquaresInside= containerSvg.querySelectorAll("g")[1]
    let containerSvgSquaresInsideList= containerSvgSquaresInside.querySelectorAll("polygon")
    //console.log(containerSvgSquaresInsideList)
    
    let containerSvgSquaresOutside= containerSvg.querySelectorAll("g")[2]
     let containerSvgSquaresOutsideList= containerSvgSquaresOutside.querySelectorAll("polygon")
    
     let combinedSquaresList=[...containerSvgSquaresInsideList,...containerSvgSquaresOutsideList]
    combinedSquaresList=[...combinedSquaresList,...[0,0,0,0]]
     //console.log(combinedSquaresList)
    let Remapping = [
  [0,6],[1,7],[2,8],[3,11],[4,12],
  [5,13],[6,16],[7,17],[8,18],[9,19],
  [10,14],[11,9],[12,21],[13,22],[14,23],
  [15,5],[16,10],[17,15],[18,3],[19,2],
  [20,1],[21,24],[22,20],[23,4],[24,0]
];
    let newCombinedSquaresList=new Array(25).fill(0);
    //console.log(newCombinedSquaresList)
    combinedSquaresList.forEach((_,i)=>{
        newCombinedSquaresList[Remapping[i][1]]=combinedSquaresList[i]
    })
    return newCombinedSquaresList
}


function getAltHeadlightsMovement(){
    
    let containsOnlyYellowFound=false
    let noneSolveOll= true
    console.log("Altscrambles",scramble,altscramble,currentAlgIndexRef)
    if(altscramble[0]!==""){
    for(let i=0;i<4;i++){
        console.log(altoverlayRefs)
        const containerParent = altoverlayRefs.current[i];
        let altContainer= containerParent.querySelector("div")
        let altContainerSvg= altContainer.querySelector("svg")
        let altContainerSvgSquaresInside= altContainerSvg.querySelectorAll("g")[1]
        let altContainerSvgSquaresInsideList= altContainerSvgSquaresInside.querySelectorAll("polygon")
        //console.log(containerSvgSquaresInsideList)
        let altContainerSvgSquaresOutside= altContainerSvg.querySelectorAll("g")[2]
        let altContainerSvgSquaresOutsideList= altContainerSvgSquaresOutside.querySelectorAll("polygon")
        
        
        let containsOnlyYellow=true
        console.log("Not Yellow Check",altContainerSvgSquaresInsideList, i,containsOnlyYellow)
        altContainerSvgSquaresInsideList.forEach((item)=>{
            if(item.getAttribute("fill")=="yellow"){
                
            }
            else{
                containsOnlyYellow=false
                console.log("Fail",item,i)
            }
            
        })
        if(containsOnlyYellow){
            noneSolveOll=false
            

            console.log(altscramble)
            //if(scrambleIndex.current==1){
                
            console.log(`ReturnPassedIndex: ${[currentAlgRef,currentAlgIndexRef,i]}`)
            
                let aufIndex=i
                // if(aufIndex==1){
                //     aufIndex=2
                // }
                // else if(aufIndex==2){
                //     aufIndex=1
                // }
                console.log("CHangeAUF",chosenAlg,altscramble,allAUFPerm,aufIndex,currentAlgRef,currentAlgIndexRef)
                if(chosenAlg==null){
                     if(!allAltAUF.current.includes(allAUFPerm[aufIndex])&&currentAlgIndexRef==1){
                    allAltAUF.current.push(allAUFPerm[aufIndex])
                }
                if(!allAUF.current.includes(allAUFPerm[aufIndex])&&currentAlgIndexRef==0){
                    console.log("Yadd",allAUF.current,allAUFPerm[aufIndex],currentAlgRef)
                    allAUF.current.push(allAUFPerm[aufIndex])
                }
                }
                else{
                    console.log("Yaddi8",chosenAlg,oll,allAltAUF.current,allAUFPerm,aufIndex)
                     if(!allAltAUF.current.includes(allAUFPerm[aufIndex])&&oll.algNumber==1){
                         console.log("Yadd8",allAltAUF.current,allAUFPerm[aufIndex],currentAlgRef)
                    allAltAUF.current.push(allAUFPerm[aufIndex])
                }
                if(!allAUF.current.includes(allAUFPerm[aufIndex])&&oll.algNumber==0){
                    console.log("Yadd9",allAUF.current,allAUFPerm[aufIndex],currentAlgRef)
                    allAUF.current.push(allAUFPerm[aufIndex])
                }
                }
               
                
                
                    
           // }
            // if(scrambleIndex.current==2){
            //         let aufIndex=i
            //         if(aufIndex==1){
            //             aufIndex=2
            //         }
            //         else if(aufIndex==2){
            //             aufIndex=1
            //         }
            //         console.log("CHangeAUF")
            //         setAllAUF(prev=>[...prev,allAUFPerm[aufIndex]])
                
                
            // }
            
            
            tempBarMovementRef.current.push(getHeadlights(altContainerSvgSquaresOutsideList))
            
            console.log("Check45",barMovements,tempBarMovementRef.current)
            
            // if(!barMovements.includes([...tempBarMovementRef.current])){
            //         setBarMovements(prev=>[...prev,[...tempBarMovementRef.current]])
            //     }
            // setBarMovements(prev => (
            //     [...prev,[...tempBarMovementRef.current]]
            // ));
            if(scrambleIndex.current==0 && tempBarMovementRef.current[0]!=BarPositionDict[0]){
                console.log("Different CP Found",currentAlgRef,tempBarMovementRef.current,BarPositionDict[0],scrambleIndex.current)
            }
            // for(let i=0;i<barMovements.length;i++){
            //     tempBarMovement[i]=barMovements[i]
            // }
            // tempBarMovement[scrambleIndex.current].push(getHeadlights(altContainerSvgSquaresOutsideList))
            // setBarMovements(tempBarMovement)
            // console.log(`ScrambleIndex: ${scrambleIndex.current}`)
            // console.log(`THe problem:, ${JSON.stringify(tempBarMovement)}`)
            // setBarMovements(tempBarMovement)
            // console.log(`ScrambleIndex: ${scrambleIndex.current}`)
            // console.log(`THe problem:, ${JSON.stringify(tempBarMovement)}`)
            
        }

        

        //Log how bars move when using alternate alg
        // console.log("TempBarMovementsPushed",i)
        // tempBarMovement.push(getHeadlights(altContainerSvgSquaresOutsideList))
    }
  
 
    console.log("Yadd3rests2",allAltAUF.current,allAUF.current,currentAlgRef,currentAlgIndexRef)

    if (noneSolveOll){
        console.log("Stopping CornerPermutationPage because it doesn't solve the oll");
        if (onError) onError("Invalid OLL");  // notify parent
        return;                   // stop further updates
    }
    console.log("TempBarMovements",tempBarMovementRef.current,barMovements)
    }
     else{
        console.log("NoAlt",ollCaseSet.cases[currentAlgRef])
        allAltAUF.current=[null]
    }
}   

function computeSquaresColors(newCombinedSquaresList){
    let newSquaresColors=new Array(25).fill(0);
    newCombinedSquaresList.forEach((_,i)=>{
        if (newCombinedSquaresList[i]!=0){
             newSquaresColors[i]=newCombinedSquaresList[i].getAttribute("fill")
        }
        else{
            newSquaresColors[i]=0
        }
       
    })
  return newSquaresColors;
}

function getSquaresColors(newCombinedSquaresList){
    let newSquaresColors=computeSquaresColors(newCombinedSquaresList)

    setSquaresColors(newSquaresColors)
    return newSquaresColors
}


//console.log(squaresColors)


let colorCombinations=[["red","orange"],["#1f51ff","#00d800"],["orange","red"],["#00d800","#1f51ff"]]

function getPossibleArrows(){
    console.log("Getposarrows")
    console.log(squaresColors)
    console.log(scrambleIndex.current)
    if (squaresColors.length === 0) return;
    if (scrambleIndex.current==6) return;
    let Priority = [16,18,6,8,23,21,19,9,15];
    //let Priority=[6,8,16,18]
    let NewPriority=[]
    let tempArrowCombination=[]

    console.log(squaresColors)
    Priority.forEach(index => {
      if (squaresColors[index] !== "yellow") {
        NewPriority.push(index)
      }
    });
    for (let colorindex=0 ;colorindex<4;colorindex++){
        
     for (let i = 0; i < NewPriority.length; i++) {
        let index = NewPriority[i];
        //console.log("Indeces")
        //console.log(index,colorindex)
        
        if (squaresColors[index] == colorCombinations[colorindex][0]) {
            //console.log("NewIndex")
            //console.log(index)
            for (let j = 0; j < NewPriority.length; j++) {
                let leftSideUsed=false
                let rightSideUsed=false

                let index2 = NewPriority[j];
                if(index!=index2){
                    let skip=false
                     for (let k = 0; k < tempArrowCombination.length; k++) {
                        if(tempArrowCombination[k][0]==index2 && tempArrowCombination[k][1]==index){
                            skip=true
                        }
                    }

                if(skip==false){

                    //console.log(index,index2)
                    
                    let xdifference=(Centers[index][0]-Centers[index2][0])
                    let ydifference=(Centers[index][1]-Centers[index2][1])
                    let arrowlength=(xdifference**2+ydifference**2)**(1/2)
                    let penalty=0
                    if(index==21){
                        penalty+=5
                    }
                    if(index==9){
                        penalty+=30
                    }
                    if(index==15){
                        penalty+=40
                    }
                    if(index==19){
                        penalty+=10
                    }
                    if(index2==21){
                        penalty+=5
                    }
                    if(index2==9){
                        penalty+=30
                    }
                    if(index2==15){
                        penalty+=40
                    }
                    if(index2==19){
                        penalty+=10
                    }
                    if(85<arrowlength &&arrowlength<=110){
                        penalty+=3
                    }
                    if(110<arrowlength>0&&arrowlength<=125){
                        penalty+=6
                    }
                    if(125<arrowlength){
                        penalty+=10
                    }
                    
                    


                if (squaresColors[index2] == colorCombinations[colorindex][1]) {
                    tempArrowCombination.push([index, index2,"opp",penalty]);
                }
                else if (squaresColors[index2] == colorCombinations[colorindex][0]) {
                    tempArrowCombination.push([index, index2,"same",penalty]);
                }
                else {
                    tempArrowCombination.push([index, index2,"adj",penalty]);
                }
                
            }
            
        }}
        }
        }
        
    }
    console.log("New Combination",arrowCombination)
    console.log(tempArrowCombination)
    
  
if(arrowCombination.length<6){
    setArrowCombination((prev) => {
  let tempInSet = prev.some(existing =>
    JSON.stringify(existing) === JSON.stringify(tempArrowCombination)
  );

  if (!tempInSet) {
    return [...prev, tempArrowCombination];
  }

  return prev;
});
}
 

    }

  return (
        
        <>
    
        <div className='CpRecContainer' ref={overlayRef}>
              {/* <CaseImage
                size={200}
                //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                   alg={scramble.replace(/\s+/g, "")+"y2"}
                caseSetDetails={ScrambleVisualizerDetails}
                co="40"
            ></CaseImage> */}
            <CaseImage
                size={200}
                alg={""+scramble.replace(/\s+/g, "")+"y2"}
                //    alg={"U4"}
                caseSetDetails={ScrambleVisualizerDetails}
                co="40"
            ></CaseImage>
            <div className='CpRecOverlay' style={{marginTop:"0px"}}>
                {/* <svg width="100%" height="100%">
                    <polygon 
                    points="37,37 117,37 117,33 128,38 117,45 117,41 37,41" 
                    fill="rgba(255, 255, 255, 1)" 
                    stroke="rgba(8, 4, 4, 1)" 
                    strokeWidth="1"
                    transform="rotate(0 60 60)"
                    />
                </svg> */}
                {/* <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                    <path
                        d={pathArrow1}
                        fill="rgba(255, 0, 0, 1)"
                        stroke="rgba(0, 0, 0, 1)"
                        strokeWidth="1"
                        transform="rotate(0 127 39)"
                    />
                </svg> */}
                {
                    angleList.map((_,i)=>{
                        return (
                        <div key={`Angle_${i}`}>
                             <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                <path
                                    d={pathArrowList[i]}
                                    fill={`${arrowColor[i]}`}
                                    stroke="rgba(0, 0, 0, 1)"
                                    strokeWidth="1"
                                    //transform={`rotate(${angleList[i]} ${centerx2List[i]+1.25} ${centery2List[i]})`}
                                    //transform={`rotate(${-60} ${38} ${120.25})`}
                                    transform={`rotate(${180} ${centerx2List[i]+1} ${centery2List[i]})`}
                                />
                            </svg>
                            
                        </div>)
                    })
                }
                {/* <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                    <path
                        d={pathArrowList[0]}
                        fill="rgba(4, 0, 255, 1)"
                        stroke="rgba(0, 0, 0, 1)"
                        strokeWidth="1"
                        transform={`rotate(${angleList[0]} ${centerx2List[0]+1.25} ${centery2List[0]})`}
                    />
                </svg> */}
                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                    <path
                        d={centerPathList[0]}
                        fill="rgba(0, 255, 21, 1)"
                        stroke="rgba(0, 0, 0, 1)"
                        strokeWidth="0"
                        
                    />
                </svg>
                <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                    <path
                        d={centerPath2List[0]}
                        fill="rgba(0, 255, 26, 1)"
                        stroke="rgba(0, 0, 0, 1)"
                        strokeWidth="0"
                        
                    />
                </svg>
            </div>
            <div className='CpGridOverlay' style={{marginTop:"0px"}}>
                
            </div>
        </div>



        {altoverlayRefs.current.map((_,i)=>(

        
        <div key={`AltoverlayRef_${i}`} className='CpRecContainer' ref={el => altoverlayRefs.current[i]=el}>
              <CaseImage
                size={200}
                //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                   alg={altscramble[i].replace(/\s+/g, "")+"y2"}
                caseSetDetails={ScrambleVisualizerDetails}
                co="40"
            ></CaseImage>
            <div className='CpGridOverlay' style={{marginTop:"0px"}}>
            </div>
        </div>
        ))}
        </>
        
    )

}

export default ArrowDataGenerator
