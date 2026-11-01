import { GetCentersPosition } from "./pages/BarPersevationPage/BarPersevationLogic";
export default function arrowsInfoGen(oll,permIndex,cubeSize,cpWanted,cpEasyWanted,cpSameOppWanted){


    console.log("NoArrow",cpWanted)
    let arrowsInfo=[]
//     function GetCentersPosition(cubeSize){
 
//     const xCoords = [9.5, 39.5, 79.5, 119.5,149.5];
//     const yCoords = [9.75, 39.75, 79.75, 119.75, 149.75];

//     let Centers = [];

   
//     for (let y of yCoords) {
//         for (let x of xCoords) {
//             Centers.push([x*(cubeSize/200), y*(cubeSize/200)]);
//         }
//     }
    
//     return Centers

// }

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

let CornerPermutations=["",T_Perm,"U2"+T_Perm   ,"U"+T_Perm,"U'"+T_Perm,Y_Perm]
let PermTable=[0,5,1,2,3,4]

let CpLocation=["Full","Diag","Left","Right","Front","Back"]


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

function getEasierRecognitionInfo(oll,index,arrowNumber,cubeSize,lowestPen){
    let infoList=oll.easierRecognition[0]
    // let infoList

    if(lowestPen){
        infoList=oll.lowestPenaltyRecognition[0]
    }
    console.log("NewAlgLowestPen",infoList[index],index)

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

    return {rotation:rotation,path:pathArrow,color:color,arrowTipCoord:arrowTipCoord}



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

    let arrowsInfoEasy=[]
    let arrowsInfoSameOpp=[]

    // console
    
    if(cpWanted=="LowestPen"){
        arrowsInfo=[
            {
            path: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize,true).path,
            color: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize,true).color,
            rotation: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize,true).rotation,
            rotateX: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize,true).arrowTipCoord[0],
            rotateY: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize,true).arrowTipCoord[1]
            },
            {
            path: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize,true).path,
            color: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize,true).color,
            rotation: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize,true).rotation,
            rotateX: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize,true).arrowTipCoord[0],
            rotateY: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize,true).arrowTipCoord[1]
            },
        ]
    }
    else if(cpWanted=="EasierRec"){
        arrowsInfo=[
            {
            path: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize).path,
            color: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize).color,
            rotation: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize).rotation,
            rotateX: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize).arrowTipCoord[0],
            rotateY: getEasierRecognitionInfo(oll,PermTable[permIndex],0,cubeSize).arrowTipCoord[1]
            },
            {
            path: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize).path,
            color: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize).color,
            rotation: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize).rotation,
            rotateX: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize).arrowTipCoord[0],
            rotateY: getEasierRecognitionInfo(oll,PermTable[permIndex],1,cubeSize).arrowTipCoord[1]
            },
        ]
    }
    
    else if(cpWanted=="cpEasy"){
        
        arrowsInfo=[
            {
            path: getPath(oll, PermTable[permIndex], 0, cubeSize),
            color: GetColor(oll, PermTable[permIndex], 0),
            rotation: getRotation(oll, PermTable[permIndex], 0, cubeSize),
            rotateX: getArrowTipCoord(oll, PermTable[permIndex], 0, cubeSize)[0],
            rotateY: getArrowTipCoord(oll, PermTable[permIndex], 0, cubeSize)[1],
            },
            {
            path: getPath(oll, PermTable[permIndex], 1, cubeSize),
            color: GetColor(oll, PermTable[permIndex], 1),
            rotation: getRotation(oll, PermTable[permIndex], 1, cubeSize),
            rotateX: getArrowTipCoord(oll, PermTable[permIndex], 1, cubeSize)[0],
            rotateY: getArrowTipCoord(oll, PermTable[permIndex], 1, cubeSize)[1],
            }
        ]
    }
    else if(cpWanted=="SameOpp"){
        
       arrowsInfo=[
            {
            path: getSameOppInfo(oll,PermTable[permIndex],0,cubeSize).path,
            color: getSameOppInfo(oll,PermTable[permIndex],0,cubeSize).color,
            rotation: getSameOppInfo(oll,PermTable[permIndex],0,cubeSize).rotation,
            rotateX: getSameOppInfo(oll,PermTable[permIndex],0,cubeSize).rotateX,
            rotateY: getSameOppInfo(oll,PermTable[permIndex],0,cubeSize).rotateY,
            },
            {
            path: getSameOppInfo(oll,PermTable[permIndex],1,cubeSize).path,
            color: getSameOppInfo(oll,PermTable[permIndex],1,cubeSize).color,
            rotation: getSameOppInfo(oll,PermTable[permIndex],1,cubeSize).rotation,
            rotateX: getSameOppInfo(oll,PermTable[permIndex],1,cubeSize).rotateX,
            rotateY: getSameOppInfo(oll,PermTable[permIndex],1,cubeSize).rotateY,
            }]
        }
    
// console.log("ArrowsInfo",arrowsInfo,cpEasyWanted)
return arrowsInfo
}