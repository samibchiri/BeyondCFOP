//import arrowOllSet from "./data/arrowOllSet.js";

import arrowOllSet from "../../data/arrowOllSet copy.js"
import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import React, { useMemo, useContext,useRef, useEffect, useState, useLayoutEffect } from "react";
import '../../styling/index.css'
import { FaIcon } from '../../assets/fontAwesome.js';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import ollCaseSet from "../../data/ollCaseSet.js";
import OllCaseFilter from "../../components/Oll/OllCaseFilter.jsx";
import OllGroupSelector from "../../components/Oll/OllGroupSelect.jsx";
import { TbRuler } from "react-icons/tb";
import { range } from "lodash";
import { SiTrueup } from "react-icons/si";

import { db } from '../../data/NewGeneratedData/db.js';

import { useLiveQuery } from "dexie-react-hooks";
import {ArrowDataGenerator} from "../../dataGeneration/ArrowDataGenerator.jsx"

import {useWindowWidthLogic,GetCentersPosition,addInformationToColorIndexList,getCubeColors,
  sortPointsList,sortCenterLeftRight,isPositionLeft,Connect2Points,
  CalculatePointsDistance, convert2CentersToCoordinates, Connect2Centers,getCirclePath,ArrowBarMovement} from "./BarPersevationLogic.jsx"

export function BarOverlay({ollAlg,pllAlg,ollId}){


  const [ollSelectList,setOllSelectList]=useState([])

  const [cubeSize, setCubeSize] = useState(200);
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [lineWidth, setLineWidth] = useState(4);
  const [refsReady, setRefsReady] = useState(false);


  
  const altoverlayRefs = useRef([]);
  const rerenderRef = useRef(0);

  const [changedAlgArray,setChangedAlgArray]=useState(["","",false])
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

  
const allOlls = useLiveQuery(() => db.olls.toArray(), []);

const selectedOll= useLiveQuery(async ()=>{
    console.log("Search")
    if (ollId != null && ollId !=="") {
        let retrievedOll=  await db.olls.get(ollId)
        if(!retrievedOll){
            console.warn("ollId not found")
        }
    return retrievedOll??[]
    }
    else if(ollAlg !=null && ollAlg!==""){
        let simplifiedOllAlg= correctAlgString(ollAlg)
        const allOlls = await db.olls.toArray();
        
        // filter ignoring spaces
        let matchingOlls = allOlls.filter(oll => 
        correctAlgString(oll.algs)=== simplifiedOllAlg
        );
        if(!matchingOlls){
            console.warn("ollAlg not found")
            matchingOlls=db.olls.get("OLL 21-0").toArray()
        }
        return matchingOlls[0]

    }
    else{
        console.warn("No ollId or ollAlg given")
        return db.olls.get("OLL 21-0") 
    }

  },[]
);



useEffect(() => {
  altoverlayRefs.current = [];
  if(refsReady){
    setRefsReady(false);
  }

}, [selectedOll,cubeSize]);

  const [pathCalculated,setPathCalculated]= useState(false)
  const [overlayPaths, setOverlayPaths] = useState([]); // <-- new: store [path,color] per ref
  
  const [barColorsFiltered,setBarColorsFiltered]=useState([])

const noMovementCenterRef = useRef(
  Array.from({ length: 25 }, () => [false, false])  // 25 separate [false, false] arrays
);


useWindowWidthLogic(setCubeSize,setStrokeWidth,setLineWidth,setRefsReady,cubeSize);

const Scale=13.1/0.15740740740740744/150*cubeSize

  const piecesMovementRef = useRef([]) // mirror for immediate reads

  let T_Perm="R U R' U' R' F R2 U' R' U' R U R' F'"
  let Y_Perm="F R U' R' U' R U R' F' R U R' U' R' F R F'"
  let F_Perm="R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R"


  let CornerPermutations=["",T_Perm, "U2"+T_Perm   ,"U"+T_Perm,"U'"+T_Perm,Y_Perm]
  //let CornerPermutations=["","", "","","",""]
  let PermTable=[0,5,1,2,3,4]

  let CpLocation=["Full","Diag","Left","Right","Front","Back"]
    const ScrambleVisualizerDetails={
        id: "oll",
        title: "OLL",
        subTitle: "Full OLL",
        view: "plan",
        stage:"cross",
        numCases: 57,
    }
    const {darkMode}= useContext(ThemeContext)
    
let Centers= GetCentersPosition(cubeSize)


function GetBarsIndices(){
  
  //console.log("Rerenders",rerenderRef)
  rerenderRef.current+=1

  let PermIndex=0
  let OllIndex=0

  //let {newSquaresColors,newCombinedSquaresList}= getCubeColors(altoverlayRefs,OllIndex,PermIndex)
  let containerparent = altoverlayRefs.current[0];
    console.log("containeparent",containerparent)
    if (!containerparent) {
      console.warn('GetBarsIndices: no ref for index');
      return
    }
    let container= containerparent.querySelector("div")
    let ContainerSvg = container.querySelector('svg');
  if (!ContainerSvg) {
    console.warn('GetBarsIndices: no svg inside container', container);
    return
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

  //piecesMovementGen(newSquaresColors,newCombinedSquaresList)
  //console.log(newSquaresColors)
  
  let colorIndexList=[[],[],[],[],[]]
  let colorList=["#00d800","orange","#1f51ff","red","yellow"]
  let contrastingcolorList=["rgba(13, 139, 13, 1)","rgba(255, 128, 1, 1)","rgba(0, 71, 204, 1)","rgba(207, 1, 1, 1)","yellow"]


  //Put information of each piece in colorIndexList
  //Every array in colorIndexList forms a side after doing OLL
  
  //each colorIndexList[i,j]= [currentIndex,futureIndex,color,Points]
  console.log("SelectedOll",selectedOll)
  colorIndexList=addInformationToColorIndexList(selectedOll.piecesMovement,newSquaresColors,newCombinedSquaresList,colorIndexList)

  console.log("ColorIndexList",colorIndexList)
   colorIndexList.forEach(list=>{
      list.sort((a,b)=>(sortCenterLeftRight(a.currentIndex,newSquaresColors)-sortCenterLeftRight(b.currentIndex,newSquaresColors)))

      //Sort Points clockwise
      list=sortPointsList(list)
    } 
  )

  let ConnectingLines = Array.from({ length: 5 }, () =>(
    {
      ConnectedCenters:[[],[]],
      arrow:{
        arrowPath:"",
        arrowRotation:"",
        arrowRotationCoordX:"",
        arrowRotationCoordY:""
      },
      centerCircle:""
    })
  );
  let combinedColorList=Array.from({ length: 5 }, () => [])
  

  for(let i=0;i<4;i++){
      let distance
      let color
      let contrastingcolor
      let maxdistance=((Centers[6][0]-Centers[12][0])**2+(Centers[6][1]-Centers[12][1])**2)**(1/2)+1;
      
      //Bars can be connected if they are close to each other, 
      //or always if maxdistance is multiplied by a large number
      //Bars with hard to see pieces can be excluded with difficultCenters Array
      maxdistance=maxdistance*10
      if(colorIndexList[i][0].color!=colorIndexList[i][1].color){
        distance=10000
      }
      else if(selectedOll.difficultCenters.includes(colorIndexList[i][0].currentIndex)|| selectedOll.difficultCenters.includes(colorIndexList[i][1].currentIndex)){
        distance=10000
      }
      else{
        color=colorIndexList[i][0].color
        //CombinedColorList contains the color and contrastcolor of each side, used for connecting centers and pointing arrows
        if(combinedColorList[i].length==0){
          let colorIndex=(colorList.findIndex(x=>x==color))
          combinedColorList[i].push(colorList[colorIndex],contrastingcolorList[colorIndex])
        }
        contrastingcolor=combinedColorList[i][1]

        //Connect2Centers returns [path,angle,centerx2,centery2,distance,circlePath1]
        if(barColorsFiltered.includes(color)){
          distance=10000
        }
        else{
          let {centerx,centery,centerx2,centery2}=convert2CentersToCoordinates(colorIndexList[i][0].currentIndex,colorIndexList[i][1].currentIndex,cubeSize)
          distance=CalculatePointsDistance(centerx,centery,centerx2,centery2)
        }
      }
      
      let circlePath=""
      let Center1Used=false
      let Center2Used=false
      let Center3Used=false

      if (distance<maxdistance){
      ConnectingLines[i]["ConnectedCenters"][0]=Connect2Centers(colorIndexList[i],0,cubeSize,lineWidth)
      Center1Used=true
      }

      
      if(colorIndexList[i][0].color!=colorIndexList[i][2].color){
        distance=10000
      }
      else if(selectedOll.difficultCenters.includes(colorIndexList[i][0].currentIndex) ||selectedOll.difficultCenters.includes(colorIndexList[i][2].currentIndex)){
        distance=10000
      }
      else{
        color=colorIndexList[i][0].color
        if(combinedColorList[i].length==0){
          let colorIndex=(colorList.findIndex(x=>x==color))
          combinedColorList[i].push(colorList[colorIndex],contrastingcolorList[colorIndex])
        }
        contrastingcolor=combinedColorList[i][1]

        let {centerx,centery,centerx2,centery2}=convert2CentersToCoordinates(colorIndexList[i][0].currentIndex,colorIndexList[i][2].currentIndex,cubeSize)
        distance=CalculatePointsDistance(centerx,centery,centerx2,centery2)
        
        if(barColorsFiltered.includes(color)){
          distance=10000
        }
      }
      if (distance<maxdistance){
      ConnectingLines[i]["ConnectedCenters"][1]=Connect2Centers(colorIndexList[i],1,cubeSize,lineWidth)
      if (Center1Used){
        circlePath=getCirclePath(colorIndexList[i][0].currentIndex,3/200*cubeSize,cubeSize)
      }
      Center2Used=true
      }

  if (!Center1Used && !Center2Used){
      if(colorIndexList[i][1].color!=colorIndexList[i][2].color){
        distance=10000
      }
      else if(selectedOll.difficultCenters.includes(colorIndexList[i][1].currentIndex)||selectedOll.difficultCenters.includes(colorIndexList[i][2].currentIndex)){
        distance=10000
      }
      else{
        color=colorIndexList[i][1].color
        if(combinedColorList[i].length==0){
          let colorIndex=(colorList.findIndex(x=>x==color))
          combinedColorList[i].push(colorList[colorIndex],contrastingcolorList[colorIndex])
        }
        contrastingcolor=combinedColorList[i][1]
        let {centerx,centery,centerx2,centery2}=convert2CentersToCoordinates(colorIndexList[i][1].currentIndex,colorIndexList[i][2].currentIndex,cubeSize)
        distance=CalculatePointsDistance(centerx,centery,centerx2,centery2)
        
        if(barColorsFiltered.includes(color)){
          distance=10000
        }
      }

      if (distance<maxdistance){
        
          ConnectingLines[i]["ConnectedCenters"][1]=Connect2Centers(colorIndexList[i],2,cubeSize,lineWidth)
          Center3Used=true
      }
    }

      ConnectingLines[i]["centerCircle"]=circlePath
      ConnectingLines[i]["arrow"]=ArrowBarMovement(colorIndexList[i],Center1Used,Center2Used,Center3Used,cubeSize,lineWidth)

      for(let j=0;j<3;j++){
        let currentIndex=colorIndexList[i][j].currentIndex
        let NewIndex=colorIndexList[i][j].futureIndex //j=0 is center, j=1/2 are left/right centers
         
        let distance=((Centers[currentIndex][0]-Centers[NewIndex][0])**2+(Centers[currentIndex][1]-Centers[NewIndex][1])**2)**(1/2)+1;
        let smalldistance=Math.abs(Centers[6][0]-Centers[12][0])*1.3 //1.3 so that cornerpieces that are close to each other are also included
        let xdifference=(Centers[currentIndex][0]-Centers[NewIndex][0])
        let ydifference=(Centers[currentIndex][1]-Centers[NewIndex][1])
        
      if(PermIndex==0){
      if(distance<smalldistance){ 
        if(xdifference>1){
          noMovementCenterRef.current[currentIndex][0]=-1
        }
        else if(xdifference<-1){
          noMovementCenterRef.current[currentIndex][0]=1
        }
        else{
          noMovementCenterRef.current[currentIndex][0]=0
        }
        if(ydifference>1){
          noMovementCenterRef.current[currentIndex][1]=1
        }
        else if(ydifference<-1){
          noMovementCenterRef.current[currentIndex][1]=-1
        }
        else{
          noMovementCenterRef.current[currentIndex][1]=0
        }
      }
      else{
        noMovementCenterRef.current[currentIndex][0]=false
        noMovementCenterRef.current[currentIndex][1]=false
      }
      }  
    }
  }

  let [pathList,color]= centerOutLineInfo(colorIndexList)

  color=newSquaresColors[PermIndex]
  color="rgba(13, 139, 13, 1)"

  //FinalPath stores the outline of centers,grouped by color of pllskip, later color is hardcoded as white ("rgba(248, 246, 246, 1)")
  let finalPath=[[],[],[],[]]
  let noMovementCenterCircle=[]
  for (let i=0;i<4;i++){
    for (let j=0;j<3;j++){
      let currentIndex=colorIndexList[i][j].currentIndex
      let centerPoints=colorIndexList[i][j].Points
      let NewIndex=ConnectingLines[i]["arrow"][4+j]  //j=0 is center, j=1/2 are left/right centers
      if(noMovementCenterRef.current[currentIndex][0]!==false){
      finalPath[i]+=CalculateNewOutline(colorIndexList[i][j].Points,strokeWidth,currentIndex)
      finalPath[i]+=pathList[i][j]
      
      let changeX=noMovementCenterRef.current[currentIndex][0]
      let changeY=noMovementCenterRef.current[currentIndex][1]
      let circleX
      let circleY

      //[i][j][3] is array of point positions going from top left to top right to bottom right to bottom left
      if(changeX!==0 ||changeY!==0){
        if(changeX===0 &&changeY===1){
          circleX=centerPoints[0][0]/2+centerPoints[1][0]/2
          circleY=centerPoints[1][1]
        }
        if(changeX==1 &&changeY==1){
          circleX=centerPoints[1][0]
          circleY=centerPoints[1][1]
          
        }
        if(changeX==1 &&changeY==0){
          circleX=centerPoints[1][0]
          circleY=centerPoints[1][1]/2+centerPoints[2][1]/2
        }
        if(changeX==1 &&changeY==-1){
          
          circleX=centerPoints[2][0]
          circleY=centerPoints[2][1]

        }
        if(changeX==0 &&changeY==-1){
          circleX=centerPoints[2][0]/2+centerPoints[3][0]/2
          circleY=centerPoints[2][1]
        }
        if(changeX==-1 &&changeY==1){
          circleX=centerPoints[0][0]
          circleY=centerPoints[0][1]
        }
        if(changeX==-1 &&changeY==0){
          circleX=centerPoints[3][0]
          circleY=centerPoints[3][1]/2+centerPoints[0][1]/2
        }
        if(changeX==-1 &&changeY==-1){
          circleX=centerPoints[3][0]
          circleY=centerPoints[3][1]
        }
      }
      
      let StartingPointx=Centers[12][0]
      let StartingPointy=Centers[12][1]
      
      circleX=StartingPointx+circleX*Scale
      circleY=StartingPointy+circleY*Scale

      if(colorIndexList[i][j][0]%5>=1 &&colorIndexList[i][j][0]%5<=3){
        if(colorIndexList[i][j][0]>=5 &&colorIndexList[i][j][1]<=18){
          if(noMovementCenterRef.current[currentIndex][1]==1){
            circleY+=0.2/cubeSize*200
          }
          else if(noMovementCenterRef.current[currentIndex][1]==-1){
            circleY-=0/cubeSize*200
          }
          if(noMovementCenterRef.current[currentIndex][0]==1){
            circleX-=1/cubeSize*200
          }
          if(noMovementCenterRef.current[currentIndex]==-1){
            circleX-=1.2/cubeSize*200
          }
        }
      }

      if(noMovementCenterRef.current[currentIndex][0]===0 &&noMovementCenterRef.current[currentIndex][1]===0 ){
        circleX=Centers[colorIndexList[i][j].currentIndex][0]
        circleY=Centers[colorIndexList[i][j].currentIndex][1]
        }

        if(changeX!=0 &&changeY!=0){
          circleX-=1*changeX/200*cubeSize
          circleY+=1*changeY/200*cubeSize
        }
      
        let radius=2/200*cubeSize
      let smallCirclePath=drawSmallCircle(circleX,circleY,radius)
      noMovementCenterCircle.push(smallCirclePath)
    }
    }
  }

  let stringNoMovementCircle=""

  for (let i=0;i<noMovementCenterCircle.length;i++){
    stringNoMovementCircle+=noMovementCenterCircle[i]
  }

  let allInformationDict={
    centerOutLine:finalPath,
    connectingLines:[],
    arrow:[],
    centerCircle:[],
    noMovementCircle:stringNoMovementCircle,
    combinedColorList:combinedColorList,

  }
  for (let i=0;i<ConnectingLines.length;i++){
    allInformationDict["connectingLines"].push(ConnectingLines[i].ConnectedCenters)
    allInformationDict["arrow"].push(ConnectingLines[i].arrow)
    allInformationDict["centerCircle"].push(ConnectingLines[i].centerCircle)
  }

  return allInformationDict

}

function drawSmallCircle(x,y,radius){
  let circlePath=`M ${x+radius},${y} A ${radius},${radius} 0 1 1 ${x-radius},${y} A ${radius},${radius} 0 1 1 ${x+radius},${y} Z `
 
  return circlePath

}


//Calculate Outer Outline
function CalculateNewOutline(PointList,strokeWidth,index){

  //Alligns halfcenters with other centers (default was wider than normal)
  if(index%5==0||index%5==4){
    strokeWidth+=1
    
  }
   if(index%20<5){
    strokeWidth+=1
  }

  let Centers= GetCentersPosition(cubeSize)
  let StartingPointx=Centers[12][0]
  let StartingPointy=Centers[12][1]
  let newCoords=[]
  for(let i=0;i<4;i++){
    let [tempx,tempy]=PointList[i]
    tempx=StartingPointx+tempx*Scale
    tempy=StartingPointy+tempy*Scale
    newCoords[i]=[tempx,tempy]
  }
  
  let [x1,y1]=newCoords[0]
  let [x2,y2]=newCoords[1]
  let [x3,y3]=newCoords[2]
  let [x4,y4]=newCoords[3]

  let averagex=(x1+x2+x3+x4)/4
  let averagey=(y1+y2+y3+y4)/4

  let [slope1,c1]=CalculateSlope(x1,y1,x2,y2,strokeWidth,averagex,averagey)
  let [slope2,c2]=CalculateSlope(x2,y2,x3,y3,strokeWidth,averagex,averagey)
  let [slope3,c3]=CalculateSlope(x3,y3,x4,y4,strokeWidth,averagex,averagey)
  let [slope4,c4]=CalculateSlope(x4,y4,x1,y1,strokeWidth,averagex,averagey)

  newCoords[0]= CalculateNewCoordinates(c4,slope4,c1,slope1,x4,x1,strokeWidth,averagex)
  newCoords[1]= CalculateNewCoordinates(c1,slope1,c2,slope2,x1,x2,strokeWidth,averagex)
  newCoords[2]= CalculateNewCoordinates(c2,slope2,c3,slope3,x2,x3,strokeWidth,averagex)
  newCoords[3]= CalculateNewCoordinates(c3,slope3,c4,slope4,x3,x4,strokeWidth,averagex)

  let CentersOutlinePath=""
  let pointsPath=""
  for(let i=3;i>=0;i--){
    pointsPath+=" L "+ newCoords[i][0]+","+newCoords[i][1]+""
  }
  pointsPath+=" Z"
  CentersOutlinePath+=`M ${newCoords[3][0]},${newCoords[3][1]} ${pointsPath} `

  return CentersOutlinePath
}

function CalculateSlope(x1,y1,x2,y2,strokeWidth,averagex,averagey){

  //Solving y=ax+c going through (x1,y1) and (x2,y2)
  //Afterwards Move unit length * Strokwidth perpendicular to the slope, inwards
  let slope= (y2-y1)/(x2-x1)

  function normalizeVector(x, y) {
  const length = Math.sqrt(x*x + y*y);
  return [x / length, y / length];
}

  let newslope= -1/slope;
  let [x3,y3]=normalizeVector(1,newslope);

  if(x2==x1){
    x3=1
    y3=0
  }
  if(y1==y2){
    y3=1
    x3=0
  }

  x3=x3*strokeWidth
  y3=y3*strokeWidth

  let newx1= x1+x3
  let newy1= y1+y3

  if(Math.abs(newx1-averagex)>Math.abs(x1-averagex)){
    newx1= x1-x3
  }
  if(Math.abs(newy1-averagey)>Math.abs(y1-averagey)){
    newy1= y1-y3
  }

  newx1=parseFloat(newx1)
  newy1=parseFloat(newy1)
  slope=parseFloat(slope)

  let c=newy1-newx1*slope
  if(Math.abs(slope)=="Infnity"){
    c=0
  }
  return [slope,c]
}


function CalculateNewCoordinates(c1,slope1,c2,slope2,x1,x2,strokeWidth,averagex,outerCenterBoolean){

  let interceptx=(c2-c1)/(slope1-slope2)

  let tempStrokeWidth=1
  if(Math.abs(slope1)=="Infinity"){
    interceptx=x1+strokeWidth
    
    if(Math.abs(interceptx-averagex)>Math.abs(x1-averagex)){
      interceptx=x1-strokeWidth
    }
  }
  if(Math.abs(slope2)=="Infinity"){
    interceptx=x2+strokeWidth
    if(Math.abs(interceptx-averagex)>Math.abs(x1-averagex)){
      interceptx=x2-strokeWidth
    }
  }

  let y=interceptx*slope1+c1
  if(Math.abs(slope1)=="Infinity"){
    y=interceptx*slope2+c2
  }
  if(Math.abs(slope2)=="Infinity"){
    y=interceptx*slope1+c1
  }

  return [interceptx,y]
}

const setOverlayRef = (el)=> {

    altoverlayRefs.current = [el];

    if(!refsReady && selectedOll){
        console.log("RefsReady")
      setRefsReady(true);
    }
  
};

// compute overlayPaths after refs mount; run this AFTER refsReady becomes true
useLayoutEffect(() => {

  if (!refsReady) return;
  const paths = altoverlayRefs.current.map((ref) => {

      try {
        const result = GetBarsIndices(); 

        return result || ["","none"];
        
      } catch (err) {
        console.error('GetBarsIndices error', err)
        return ["","none"];
      }

  })

  console.log("Paths",paths)

  setOverlayPaths(paths[0]);
  setPathCalculated(true);
}, [refsReady,selectedOll,cubeSize]);


//Calculate inner outline
function centerOutLineInfo(IndexList){
  
  let Centers= GetCentersPosition(cubeSize)
  let CenterIndex=12

  let Points=[[],[],[],[],[]]
  for (let j=0;j<4;j++){
    for (let i=0;i<IndexList[j].length;i++){
    Points[j].push([])
  }}

  let StartingPointx=Centers[12][0]
  let StartingPointy=Centers[12][1]

  for (let i=0;i<4;i++){ // Color
     for (let j=0;j<Points[i].length;j++){ //Center
    
    let TempPointsList=IndexList[i][j].Points
    let tempTempPointsList=[]
    for(let k=0;k<TempPointsList.length;k++){
      let xCoord=TempPointsList[k][0]
      let yCoord=TempPointsList[k][1]
      xCoord=StartingPointx+xCoord*Scale
      yCoord=StartingPointy+yCoord*Scale

      if(IndexList[i][j].currentIndex%5>=1 &&IndexList[i][j].currentIndex%5<=3){
        if(IndexList[i][j].currentIndex>=5 &&IndexList[i][j].currentIndex<=18){
          if(k==0){
            xCoord-=0.5
            yCoord-=0.5
          }
          if(k==1){
            xCoord+=0.5
            yCoord-=0.5
          }
          if(k==2){
            xCoord+=0.5
            yCoord+=0.5
          }
          if(k==3){
            xCoord-=0.5
            yCoord+=0.5
          }
       }
      }
      tempTempPointsList.push([xCoord,yCoord])
    }
    Points[i][j]=tempTempPointsList
    if(IndexList[i][j].currentIndex%20<5||IndexList[i][j].currentIndex%5==0||IndexList[i][j].currentIndex%5==4){

  let [x1,y1]=tempTempPointsList[0]
  let [x2,y2]=tempTempPointsList[1]
  let [x3,y3]=tempTempPointsList[2]
  let [x4,y4]=tempTempPointsList[3]

  let averagex=(x1+x2+x3+x4)/4
  let averagey=(y1+y2+y3+y4)/4

  let tempstrokewidth=0.6
  let [slope1,c1]=CalculateSlope(x1,y1,x2,y2,tempstrokewidth,averagex,averagey)
  let [slope2,c2]=CalculateSlope(x2,y2,x3,y3,tempstrokewidth,averagex,averagey)
  let [slope3,c3]=CalculateSlope(x3,y3,x4,y4,tempstrokewidth,averagex,averagey)
  let [slope4,c4]=CalculateSlope(x4,y4,x1,y1,tempstrokewidth,averagex,averagey)

  tempTempPointsList[0]= CalculateNewCoordinates(c4,slope4,c1,slope1,x4,x1,tempstrokewidth,averagex)
  tempTempPointsList[1]= CalculateNewCoordinates(c1,slope1,c2,slope2,x1,x2,tempstrokewidth,averagex)
  tempTempPointsList[2]= CalculateNewCoordinates(c2,slope2,c3,slope3,x2,x3,tempstrokewidth,averagex)
  tempTempPointsList[3]= CalculateNewCoordinates(c3,slope3,c4,slope4,x3,x4,tempstrokewidth,averagex)
  Points[i][j]=tempTempPointsList
    }
  }    
  }

  let color="none"
  let CentersOutlinePath=[[],[],[],[],[]]
  let pointsPath=""
  for (let i=0;i< CentersOutlinePath.length; i++){
     for(let j=0;j<4;j++){ //Not including yellow
    CentersOutlinePath[i].push([])
     }
  }
  for(let i=0;i<5;i++){
  for(let j=0;j<Points[i].length;j++){
    pointsPath=""
    for(let k=1;k<4;k++){
      pointsPath+=" L "+ Points[i][j][k][0]+","+Points[i][j][k][1]+""
      if(Points[i][j][k][0]==undefined||Points[i][j][k][0]==undefined){
      }
    }
    pointsPath+=" Z"
    CentersOutlinePath[i][j]+=`M ${Points[i][j][0][0]},${Points[i][j][0][1]} ${pointsPath} `
  }}
  

  return [CentersOutlinePath,color]

}

function excludeCenters(e,OllIndex,oll){
  if(e.key=="Enter"){
      e.preventDefault()
      verifyAndUpdateExcludeBarInput(e.target.value,OllIndex,oll)
  }
    
}

function verifyAndUpdateExcludeBarInput(inputString,OllIndex,oll){

  let testList=[]
  try{
    if(inputString.includes(",")){
      inputString=inputString.split(",")
      for(let i=0;i<inputString.length;i++){   
        if(inputString[i]!==""){
          let intInputString=parseInt(inputString[i])
          if (!isNaN(intInputString)){
            if(intInputString<0 || intInputString>=25){
              throw new Error(`Invalid number: ${inputString[i]}`)
            }
            else{
              testList.push(intInputString);
            }
          }
          else{
            throw new Error(`Invalid number: ${inputString[i]}`)
          }
        }
      }
    }
    else{
      if(inputString!==""){
        let intInputString=parseInt(inputString)
        if (!isNaN(intInputString)) {
          if(intInputString<0 || intInputString>=25){
              throw new Error(`Invalid number: ${inputString}`)
            }
            else{
              testList.push(intInputString);
            }
        }
        else{
          throw new Error(`Invalid number: ${inputString[i]}`)
        }
      }
      else{
        testList=[]
      }
    }
  }
  catch (error){
    console.error(error)
    document.getElementById(`barExcludeCenters-${0}`).value=selectedOll.difficultCenters
    
  }

  const sortedOld = [...selectedOll.difficultCenters].sort((a,b) => a-b);
  const sortedNew = [...testList].sort((a,b) => a-b);


  const isDifferent = sortedOld.length !== sortedNew.length || 
                      sortedOld.some((val, idx) => val !== sortedNew[idx]);


  if (isDifferent) {
    updateDifficultCenters(oll,testList)
    
  }
}

async function updateDifficultCenters(oll,newDifficultCenters){
  let ollToChange= await db.olls.get(oll.id)
  if(!ollToChange){
    return
  }
  await db.olls.update(oll.id, {difficultCenters:newDifficultCenters})
  const updatedCount = await db.olls.update(oll.id, { difficultCenters: newDifficultCenters });
const updatedOll = await db.olls.get(oll.id);
}

async function updateDifficultColors(oll,newDifficultColors){
  let ollToChange= await db.olls.get(oll.id)
  if(!ollToChange){
    return
  }
  await db.olls.update(oll.id, {difficultColors:newDifficultColors})
  const updatedCount = await db.olls.update(oll.id, { difficultColors: newDifficultColors });
const updatedOll = await db.olls.get(oll.id);
}


function changeOllAlgEnterPressed(e,oll){
  if(e.key=="Enter"){
      e.preventDefault()
      changeOllAlg(e.target.value,oll)
      console.log("EnterPressed")
      e.target.value = "";
  }
    
}

function changeOllAlg(newAlg,oll){

//  let updatedNewAlg= correctAlgString(newAlg)

  if(newAlg!=oll.algs){
    setChangedAlgArray([newAlg,oll,true])
  }
  else{
    setChangedAlgArray([newAlg,oll,false])
  }
  
}

function correctAlgString(inputstring){
  //Remove brackets () and []
  inputstring = inputstring.replace(/[()\[\]]/g, "");

  //Remove whitespace
  inputstring= inputstring.replace(/\s+/g, "");
  let newinputstring=""

  let oddSpacing=0
  for (let i=0; i<inputstring.length;i++){
    newinputstring+=inputstring[i]

    if(inputstring[(i+1)%inputstring.length]!="'" &&inputstring[(i+1)%inputstring.length]!="2" ){
      newinputstring+=" "
    }

  }
  newinputstring=newinputstring.trim()
  return newinputstring

}

    
return (
  
    <>
    

    { true && (
        <>
                {(selectedOll &&     

 
                        <div className="RecCont"  ref={(el)=> setOverlayRef(el)}> 
                        
                        <CaseImage
                            size={cubeSize}
                            alg={(selectedOll.algs+pllAlg).replace(/\s+/g, "")+"y2"}
                            caseSetDetails={ScrambleVisualizerDetails}
                            co="40"
                        ></CaseImage>
                        
                        <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200+10}px`,width:`${cubeSize*160/200+10}px`,marginTop:`${-21+cubeSize/10}px`}}>

                        {
                            pathCalculated &&(
                        <>
                        
                            {
                            //In this array to prevent outline from overlapping with connecting lines
                            Array.from({ length: 5 }, (_, i) => i).map(i => (
                            <>
                            <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                
                                <path
                                d={overlayPaths?.centerOutLine?.[i] || ""}
                                //fill={overlayPaths?.[4]?.[i][1] || "black"}
                                fill={"rgba(248, 246, 246, 1)"}
                                fillRule="evenodd"
                                stroke="rgba(44, 44, 44, 1)"
                                strokeWidth="1"
                                strokeLinejoin="round"
                                filter="url(#shadow)"
                                />
                            </svg>

                            <svg id="SmallCirclePath" style={{height:`${cubeSize*160/200+10}px`,width:`${cubeSize*160/200+10}px`,zIndex: "100",position:"absolute"}}>

                            <path
                                d={overlayPaths?.noMovementCircle||""}
                                fill={"black"}
                                stroke="rgba(255, 255, 255, 1)"
                                strokeWidth="0.5"
                                strokeLinejoin="round"
                                
                            />
                            </svg>
                            </>
                            ))}

                            {
                                Array.from({length:5},(_,i)=>i).map(i=>(
                                <>
                                {Array.from({ length: 2 }, (_, j) => j).map(j => (
                            <>
                            
                            <svg style={{position:"absolute"}}id="ConnectingLines" width="100%" height="100%" >
                                
                                <path
                                d={overlayPaths?.connectingLines?.[i][j].linePath || ""}
                                fill={overlayPaths?.combinedColorList?.[i][0] || "black"}
                                
                                stroke="rgba(44, 44, 44, 1)"
                                strokeWidth="1"
                                strokeLinejoin="round"
                                
                                
                                transform={`rotate(${overlayPaths?.connectingLines?.[i][j].lineRotation || "0"} ${overlayPaths?.connectingLines?.[i][j].lineRotationCoordX ||"0"} ${overlayPaths?.connectingLines?.[i][j].lineRotationCoordY ||"0"})`}
                                />
                                
                            </svg>
                            </>
                            ))} 
                            </>
                            ))
                            }
                            {
                            
                            Array.from({ length: 5 }, (_, i) => i).map(i => (
                            <>                            
                                <svg style={{position:"absolute"}}id="PointingArrow" width="100%" height="100%" >
                            <path
                                d={overlayPaths?.arrow?.[i].arrowPath||""}
                                fill={overlayPaths?.combinedColorList?.[i][1] || "purple"}
                                stroke="rgba(0, 0, 0, 1)"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                transform={`rotate(${overlayPaths?.arrow?.[i].arrowRotation || "0"} ${overlayPaths?.arrow?.[i].arrowRotationCoordX ||"0"} ${overlayPaths?.arrow?.[i].arrowRotationCoordY ||"0"})`}
                            />
                            
                            </svg>
                        
                            <svg style={{position:"absolute"}}id="CirclePath" width="100%" height="100%" >
                                <path
                                    d={overlayPaths?.centerCircle?.[i]||""}
                                    fill={overlayPaths?.combinedColorList?.[i][1] || ""}
                                stroke="rgba(22, 22, 22, 1)"
                                strokeWidth="1"
                                />
                            </svg>

                            </>))
                        } 
                            
                    
                            </>
                            )
                        }
                        </div>
                        <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${45+cubeSize/10}px`}}>
                        
                        </div>
                        </div>

                    
                    )}
                
          </>
    )}
    </>

    )
}

export default BarOverlay