
import arrowOllSet from "../../data/arrowOllSet.js";
//import arrowOllSet from "./data/arrowOllSet copy.js"
import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import React, { use, useContext,useRef, useEffect, useState, useLayoutEffect } from "react";
import '../../styling/index.css'
import { FaIcon } from '../../assets/fontAwesome.js';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import ollCaseSet from "../../data/ollCaseSet.js";
import { TbRuler } from "react-icons/tb";
import { range } from "lodash";
import { SiTrueup } from "react-icons/si";

import { db } from '../../data/NewGeneratedData/db.js';

import { useLiveQuery } from "dexie-react-hooks";
import {ArrowDataGenerator} from "../../dataGeneration/ArrowDataGenerator.jsx"

import { flushSync } from 'react-dom';

export function useWindowWidthLogic(setCubeSize,setStrokeWidth,setLineWidth,setRefsReady,altoverlayRefs,cubeSizeFixed) {
  

  const handleResize = () =>{

    if(!cubeSizeFixed){
    resizeStates(setCubeSize, setStrokeWidth, setLineWidth, setRefsReady);
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    
  
  }, []);

  function resizeStates(setCubeSize,setStrokeWidth,setLineWidth,setRefsReady,cubeSize){
    let sizeIndex
    let cubeSizes=[120,150,200] 
    let strokeWidths=[1,1.2,1.5] 
    let lineWidths=[3,3.5,4]

    let width=window.innerWidth
    
    let stateChanged=true

    if (width < 600) { 
      sizeIndex=0
      if(cubeSize==cubeSizes[0]){
        stateChanged=false
      }
    } 
    else if (width < 900) { 
      sizeIndex=1
      if(cubeSize==cubeSizes[1]){
        stateChanged=false
      }
    } 
    else if (width < 1100) { 
      sizeIndex=2
      if(cubeSize==cubeSizes[2]){
        stateChanged=false
      }
    } 
    else if (width < 1500) { 
      sizeIndex=0
      if(cubeSize==cubeSizes[0]){
        stateChanged=false
      }
    } 
    else { 
      sizeIndex=1
      if(cubeSize==cubeSizes[1]){
        stateChanged=false
      }
    } 

    if(stateChanged){
      setCubeSize(cubeSizes[sizeIndex])
      setStrokeWidth(strokeWidths[sizeIndex])
      setLineWidth(lineWidths[sizeIndex])
      setRefsReady(false)
    }

  }

  return {};
}

export function GetCentersPosition(cubeSize){

    //Cubesizes ranging from 100 to 400, incremented by 50, manually verified on my laptop
    let EmpericalcoordOffset=[[5.3,0.5],[5.3,0],[5.3,-0.5],[5.3,-0.9],[6,-0.9],[6,-1.5],[6,-2.2]]
    
    let BetweenArray=[Math.floor((cubeSize-100)/50),Math.ceil((cubeSize-100)/50)]

    let LowerEnd=BetweenArray[0]
    let UpperEnd=BetweenArray[1]

    if(LowerEnd<0){
      LowerEnd=0
      UpperEnd=0
    }
    if(LowerEnd>=EmpericalcoordOffset.length-1 ||UpperEnd>=EmpericalcoordOffset.length-1){
      LowerEnd=EmpericalcoordOffset.length-1
      UpperEnd=EmpericalcoordOffset.length-1
    }


    let xCoordOffset=EmpericalcoordOffset[LowerEnd][0]*(1-(cubeSize%50)/50)+EmpericalcoordOffset[UpperEnd][0]*(cubeSize%50)/50
    let yCoordOffset=EmpericalcoordOffset[LowerEnd][1]*(1-(cubeSize%50)/50)+EmpericalcoordOffset[UpperEnd][1]*(cubeSize%50)/50

    const xCoords = [9, 39, 79.5, 120,150];
    const yCoords = [10.5, 40, 81.5, 122.5, 153.5];

    let Centers = [];

    for (let y of yCoords) {
        for (let x of xCoords) {
            Centers.push([x*(cubeSize/200)+xCoordOffset, y*(cubeSize/200)+yCoordOffset]);
        }
    }
    return Centers

}

export function getCubeColors(altoverlayRefs,OllIndex,PermIndex){
    
    let containerparent = altoverlayRefs.current[OllIndex][PermIndex];
    
 
    if (!containerparent) {
      console.warn('GetBarsIndices: no ref for index', PermIndex);
      return ["","red"]
    }
    let container= containerparent.querySelector("div")
       console.log("NoSVGAltoverlay",altoverlayRefs.current,containerparent,OllIndex)
    let ContainerSvg = container.querySelector('svg');
    console.log(container)
    console.log(ContainerSvg)
  if (!ContainerSvg) {
    console.warn('GetBarsIndices: no svg inside container', container);
    return ["","red"]
  }
  let ContainerSvgSquaresInside= ContainerSvg.querySelectorAll("g")[1]
  let ContainerSvgSquaresInsideList= ContainerSvgSquaresInside.querySelectorAll("polygon")

  let ContainerSvgSquaresOutside= ContainerSvg.querySelectorAll("g")[2]
  
  let ContainerSvgSquaresOutsideList= ContainerSvgSquaresOutside.querySelectorAll("polygon")
  let combinedSquaresList=[...ContainerSvgSquaresInsideList,...ContainerSvgSquaresOutsideList]
  
  combinedSquaresList=[...combinedSquaresList,...[0,0,0,0]]

  let Remapping = [
      [0,6],[1,7],[2,8],[3,11],[4,12],
      [5,13],[6,16],[7,17],[8,18],[9,19],
      [10,14],[11,9],[12,21],[13,22],[14,23],
      [15,5],[16,10],[17,15],[18,3],[19,2],
      [20,1],[21,24],[22,20],[23,4],[24,0]
    ];
  
  //Store polygons as 5x5 grid
  let newCombinedSquaresList=Array.from( {length:25}, ()=> 0)
  combinedSquaresList.forEach((_,i)=>{
      newCombinedSquaresList[Remapping[i][1]]=combinedSquaresList[i]
  })

  //Put the color in newSquaresColors Array
  let newSquaresColors= Array.from( {length:25}, ()=> 0)
  newCombinedSquaresList.forEach((_,i)=>{
    if (newCombinedSquaresList[i]!=0){
        newSquaresColors[i]=newCombinedSquaresList[i].getAttribute("fill")
    }
    else{
        newSquaresColors[i]=0
    }
        
  })
  return {newSquaresColors,newCombinedSquaresList}
}

export function addInformationToColorIndexList(piecesMovement,newSquaresColors,newCombinedSquaresList,colorIndexList){
  
  for(let i=0;i<piecesMovement.length;i++){
      for(let j=0;j<piecesMovement[i].length;j++){
        
        let currentIndex=piecesMovement[i][j][0]
        let futureIndex=piecesMovement[i][j][1]

        let color = newSquaresColors[currentIndex]
        let Points=[]
        for(let j=0;j<4;j++){
          let tempPoints=newCombinedSquaresList[currentIndex].getAttribute("points").split(" ")
          Points.push(tempPoints[j].split(","))
          
        }
        let tempColorIndexDict={
          currentIndex:currentIndex,
          futureIndex:futureIndex,
          color:color,
          Points:Points
        }
        colorIndexList[i].push(tempColorIndexDict)
      }
    }
  return colorIndexList
}

export function isPositionLeft(Center1,SquareColors){
      let PositionLeft=false
      if (Center1==1){
       if (SquareColors[6]=="yellow"){ //If it is position doesnt change
           PositionLeft=false
       }
       else{
        PositionLeft=true
      }
      }
     
      if(Center1==3){
        if (SquareColors[8]=="yellow"){ //If it is position doesnt change
          PositionLeft=true
        }
        else{
          PositionLeft=false
        }
    }
    else if (Center1==5){
      if (SquareColors[6]=="yellow"){
        PositionLeft=true
      }
      else{
        PositionLeft=false
      }
    }
    else if (Center1==6){
      if (SquareColors[1]=="yellow"){
        PositionLeft=true
      }
    }
    else if (Center1==8){
      if (SquareColors[9]=="yellow"){
        PositionLeft=true
      }
      else{
        PositionLeft=false
      }
    }
    else if (Center1==9){{
      if (SquareColors[3]=="yellow"){
        PositionLeft=true
      }
      else{
        PositionLeft=false
      }
    }}

    else if (Center1==15){
      if (SquareColors[16]=="yellow"){
        PositionLeft=false
      }
      else{
        PositionLeft=true
      }
    }
    else if (Center1==16){
      if (SquareColors[21]=="yellow"){
        PositionLeft=false
      }
      else{
        PositionLeft=true
      }
    }
    else if (Center1==18){
      if (SquareColors[23]=="yellow"){
        PositionLeft=true
      }
      else{
        PositionLeft=false
      }
    }
    else if (Center1==19){{
      if (SquareColors[18]=="yellow"){
        PositionLeft=true
      }
    }}
    if (Center1==21){
      if (SquareColors[16]=="yellow"){
           PositionLeft=true
      }
    }
    if(Center1==23){
      if (SquareColors[18]=="yellow"){ 
           PositionLeft=false
      }
      else{
        PositionLeft=true
      }
    }
    // console.log("PositionLeft",Center1,PositionLeft)
      return PositionLeft
  }


//Sorts colorIndexList on Center,PositionLeft,PositionRight
export function sortCenterLeftRight(index,SquareColors){
  // console.log("sortCenterLeftRight",index,SquareColors)  
  let newIndex=index%10
    let returnedvalue=0
    if(newIndex<5){
      if(newIndex%2==0){
        return returnedvalue
      }
    }
    else if (newIndex==7){
      return returnedvalue
    }
    if (index==11 || index==13){
      return returnedvalue
    }

    let PositionLeft=isPositionLeft(index,SquareColors)
    if(PositionLeft){
      returnedvalue=1
    }
    else{
      returnedvalue=2
    }
    return returnedvalue
  }


export function sortPointsList(colorIndexList){
  colorIndexList.forEach(list=>{
        let averagex=0
        list.Points.forEach(item=>{
          
          averagex+=item[0]/4
        })
        let averagey=0
        list.Points.forEach(item=>{
          averagey+=item[1]/4
        })
        
        //Store topleft topright bottom right bottomleft
        let indextostore=[]
        for(let i=0;i<4;i++){
          let [x,y]=list.Points[i]
          
          if(y<averagey &&x<averagex){
            indextostore[i]=0
          }
          if(y<averagey &&x>averagex){
            indextostore[i]=1
          }
          if(y>averagey &&x>averagex){
            indextostore[i]=2
          }
          if(y>averagey &&x<averagex){
            indextostore[i]=3
          }
        }
        let TempPointsList=[...list.Points]
        for(let i=0;i<4;i++){
          list.Points[indextostore[i]]=TempPointsList[i]
        }
      })
    return colorIndexList
}


export function Connect2Points(centerx,centery,centerx2,centery2,lineWidth,arrowTipBoolean){

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
      Correction+=180
  }

  angle+=Correction

  let distance= CalculatePointsDistance(centerx,centery,centerx2,centery2)
  centerx=centerx2-distance //Calculate position of centerx such that distance between centerx and centerx2 is total line lenght                    
  let path

  if(arrowTipBoolean){
    //Path of pointing arrow
    path= pointingArrowPath(centerx,centerx2,centery2,lineWidth)  
  }
  else{
    //Path of line connecting centers
    path=linePath(centerx,centerx2,centery2,lineWidth)
  }
  return [path,angle,centerx2,centery2,distance]
  }


export function CalculatePointsDistance(centerx,centery,centerx2,centery2){

  let distance= ((centerx-centerx2)**2+(centery-centery2)**2)**(1/2)
  return distance

}
export function pointingArrowPath(centerx,centerx2,centery2,lineWidth){
  let pathArrow=`M ${centerx-lineWidth/2},${centery2} Q ${centerx-lineWidth/2},${centery2-lineWidth/2} ${centerx},${centery2-lineWidth/2} L ${centerx},${centery2-lineWidth/2} L ${centerx2-2-lineWidth/2},${centery2-lineWidth/2} L ${centerx2-2-lineWidth/2},${centery2-3-lineWidth/2} L ${centerx2+2+lineWidth/2},${centery2} L ${centerx2-2-lineWidth/2},${centery2+3+lineWidth/2} L ${centerx2-2-lineWidth/2},${centery2+lineWidth/2} L ${centerx},${centery2+lineWidth/2} Q ${centerx-lineWidth/2},${centery2+lineWidth/2} ${centerx-lineWidth/2},${centery2} Z`
  return pathArrow
}

export function linePath(centerx,centerx2,centery2,lineWidth){
  let linePath =`M ${centerx-lineWidth/2},${centery2} Q ${centerx-lineWidth/2},${centery2-lineWidth/2} ${centerx},${centery2-lineWidth/2} L ${centerx},${centery2-lineWidth/2} L ${centerx2-lineWidth/2},${centery2-lineWidth/2}  Q ${centerx2},${centery2-lineWidth/2} ${centerx2},${centery2} L ${centerx2},${centery2}  Q ${centerx2},${centery2+lineWidth/2} ${centerx2-lineWidth/2},${centery2+lineWidth/2} L ${centerx2-lineWidth/2},${centery2+lineWidth/2} L ${centerx2-lineWidth/2},${centery2+lineWidth/2} L ${centerx+lineWidth/2},${centery2+lineWidth/2} Q ${centerx-lineWidth/2},${centery2+lineWidth/2} ${centerx-lineWidth/2},${centery2} Z`
  return linePath
}

export function convert2CentersToCoordinates(Center1,Center2,cubeSize){
    let Centers=GetCentersPosition(cubeSize)
    let centerx= Centers[Center1][0]
    let centery= Centers[Center1][1]
    let centerx2= Centers[Center2][0]
    let centery2= Centers[Center2][1]
  
    return {centerx,centery,centerx2,centery2}
}


export function Connect2Centers(PointsInfo,CenterIndex,cubeSize,lineWidth ){

  
  let PiecesIndex=[]
  for(let i=0; i<PointsInfo.length;i++){
    PiecesIndex.push(PointsInfo[i].currentIndex)
  }
  
  let Centers=GetCentersPosition(cubeSize)

  let tempcenterx=Centers[PiecesIndex[(CenterIndex+1)%3]][0] //%3 So that no  error occurs 
  let tempcentery=Centers[PiecesIndex[(CenterIndex+1)%3]][1]
  let tempcenterx2=Centers[PiecesIndex[0]][0]
  let tempcentery2=Centers[PiecesIndex[0]][1]
  let [path,angle,centerx2,centery2,distance]= Connect2Points(tempcenterx,tempcentery,tempcenterx2,tempcentery2,lineWidth)
  
  if(CenterIndex==2){
     tempcenterx=Centers[PiecesIndex[1]][0] 
     tempcentery=Centers[PiecesIndex[1]][1]
     tempcenterx2=Centers[PiecesIndex[2]][0]
     tempcentery2=Centers[PiecesIndex[2]][1];
     [path,angle,centerx2,centery2,distance]= Connect2Points(tempcenterx,tempcentery,tempcenterx2,tempcentery2,lineWidth)
    
  }

  let tempConnectingLinesDict={
    linePath:path,
    lineRotation:angle,
    lineRotationCoordX:centerx2,
    lineRotationCoordY:centery2
  }

  return tempConnectingLinesDict
}



export function ArrowBarMovement(PointsInfo,Center1Used,Center2Used,Center3Used,cubeSize,lineWidth){
  
  let Centers= GetCentersPosition(cubeSize)
  let StartLocationX
  let StartLocationY
  let Center1
  let Center2
  let EndLocationIndex=PointsInfo[0].futureIndex

  let EndLocationX = Centers[EndLocationIndex][0]
  let EndLocationY = Centers[EndLocationIndex][1]

  if (Center1Used && Center2Used){
    StartLocationX=Centers[PointsInfo[0].currentIndex][0]
    StartLocationY=Centers[PointsInfo[0].currentIndex][1]
    EndLocationX = Centers[EndLocationIndex][0]
    EndLocationY = Centers[EndLocationIndex][1]
  }
  else if(Center1Used){
    //Average X and average Y coordinate
    StartLocationX=(Centers[PointsInfo[0].currentIndex][0]+Centers[PointsInfo[1].currentIndex][0])/2
    StartLocationY=(Centers[PointsInfo[0].currentIndex][1]+Centers[PointsInfo[1].currentIndex][1])/2
    EndLocationX = Centers[PointsInfo[0].futureIndex][0]+Centers[PointsInfo[1].futureIndex][0]
    EndLocationY = Centers[PointsInfo[0].futureIndex][1]+ Centers[PointsInfo[1].futureIndex][1]

    EndLocationX=EndLocationX/2
    EndLocationY=EndLocationY/2
    
  }
   else if(Center2Used){
    StartLocationX=(Centers[PointsInfo[0].currentIndex][0]+Centers[PointsInfo[2].currentIndex][0])/2
    StartLocationY=(Centers[PointsInfo[0].currentIndex][1]+Centers[PointsInfo[2].currentIndex][1])/2
    EndLocationX = Centers[PointsInfo[0].futureIndex][0]+Centers[PointsInfo[2].futureIndex][0]
    EndLocationY = Centers[PointsInfo[0].futureIndex][1]+Centers[PointsInfo[2].futureIndex][1]

    EndLocationX=EndLocationX/2
    EndLocationY=EndLocationY/2
  }
  else if(Center3Used){
    StartLocationX=(Centers[PointsInfo[1].currentIndex][0]+Centers[PointsInfo[2].currentIndex][0])/2
    StartLocationY=(Centers[PointsInfo[1].currentIndex][1]+Centers[PointsInfo[2].currentIndex][1])/2
   
    EndLocationX = Centers[EndLocationIndex][0]
    EndLocationY = Centers[EndLocationIndex][1]
  }
  
  let [pathArrow2,angle,centerx2,centery2,distance]=Connect2Points(StartLocationX,StartLocationY,EndLocationX,EndLocationY,lineWidth,true);
  if(!Center1Used && !Center2Used && !Center3Used){
    pathArrow2=""
    angle=""
  }
  if(Math.abs(StartLocationX-EndLocationX)<1 &&Math.abs(StartLocationY-EndLocationY)<1){
     pathArrow2=""
  }
  let tempArrowDict={
    arrowPath:pathArrow2,
    arrowRotation:angle,
    arrowRotationCoordX:centerx2,
    arrowRotationCoordY:centery2
  }
  return tempArrowDict
}

export function getCirclePath(Center,circleRadius,cubeSize){

  let Centers=GetCentersPosition(cubeSize)
  
  let midPointx1=Centers[Center][0]
  let midPointy1=Centers[Center][1]
  let circlePath=`M ${midPointx1+circleRadius},${midPointy1} A ${circleRadius},${circleRadius} 0 1 1 ${midPointx1-circleRadius},${midPointy1}
                                                              A ${circleRadius},${circleRadius} 0 1 1 ${midPointx1+circleRadius},${midPointy1}`    
  return circlePath

}

export function piecesMovementGen(newSquaresColors,newCombinedSquaresList){

  let Center1
  let Center2
  let EndLocationIndex
  let piecesMovement=[[],[],[],[]]

  let colorIndexList=[[],[],[],[],[],[]]
  let colorList= ["#00d800","orange","#1f51ff","red","yellow"]

  for(let i=0;i<newSquaresColors.length;i++){
      if(newSquaresColors[i]!=0){
        let index= colorList.findIndex(x=> x==newSquaresColors[i])
        let Points=[]
        
        for(let j=0;j<4;j++){
          let tempPoints=newCombinedSquaresList[i].getAttribute("points").split(" ")
          Points.push(tempPoints[j].split(","))
          
        }

        let tempColorIndexDict={
          currentIndex:i,
          futureIndex:"",
          color:colorList[index],
          Points:Points
        }
        colorIndexList[index].push(tempColorIndexDict)
      }
    }

  colorIndexList.forEach(list=>{
      list.sort((a,b)=>(sortCenterLeftRight(a.currentIndex,newSquaresColors)-sortCenterLeftRight(b.currentIndex,newSquaresColors)))

      //Sort Points clockwise
      list=sortPointsList(list)
    } 
  )

  let colorToEndLocationIndexDict={
    "#00d800": 22,
    "orange":14,
    "#1f51ff":2,
    "red":10
  }

  //Not including yellow
  console.log(colorIndexList)
  for(let i=0;i<4;i++){
    let PointsInfo=colorIndexList[i]
    EndLocationIndex=colorToEndLocationIndexDict[PointsInfo[0].color]

    let [Center1,Center2]=CenterNewPosition(PointsInfo,EndLocationIndex,newSquaresColors)

  //Store where bar came from [prev,new] for all 3 pieces
    piecesMovement[i]=[[PointsInfo[0].currentIndex,EndLocationIndex],[PointsInfo[1].currentIndex,Center1],[PointsInfo[2].currentIndex,Center2]]
    console.log("PiecesMovement",piecesMovement[i])
  }

  return piecesMovement
}

function CenterNewPosition(PointsInfo,EndLocationIndex,index){

  let NewCenter1
  let NewCenter2
  if (EndLocationIndex==2){
    NewCenter1=3
    NewCenter2=1
  }
  else if(EndLocationIndex==10){
    NewCenter1=5
    NewCenter2=15
  }
  else if (EndLocationIndex==22){
    NewCenter1=21
    NewCenter2=23
  }
  else if (EndLocationIndex==14){
    NewCenter1=19
    NewCenter2=9
  }
  return [NewCenter1,NewCenter2]
}

