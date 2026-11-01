import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import CpRecOverlay from "../../assetsGeneration/CpOverlay.jsx"
// import {getSameOppInfo,GetColor,getArrowTipCoord,getRotation,getPath,getCenter1And2} from "../CpPage/CornerPermutationPage.jsx"
import BarPersevationOverlay from "../../1OllBarInfo.jsx";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../data/NewGeneratedData/db.js';
import {sortOlls} from "../../context/OllContext.jsx"


function Bar6Grid({oll,cubeSize,setCubeSize,cpEasyWanted,cpSameOppWanted}){


 

let T_Perm="R U R' U' R' F R2 U' R' U' R U R' F'"
let Y_Perm="F R U' R' U' R U R' F' R U R' U' R' F R F'"

let CornerPermutations=["",T_Perm,"U2 "+T_Perm   ,"U "+T_Perm,"U' "+T_Perm,Y_Perm]
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


//   const dbOllCaseSet = useLiveQuery(()=>{
        
//         return db.olls.where("group").equals(group).toArray().then(arr => arr.sort(sortOlls));;
//     },[]
//     );

    let i=0
    // console.log("Db2",dbOllCaseSet)

return (
    <>
   <div className="OllGrid">
                                 
                                 {CornerPermutations.map((_,j)=>{
                                //    if(j>=1){
                                //      return
                                //    }
   
                                 const refIndex = i * CornerPermutations.length + j;
                                 const OllIndex=i
                                 const PermIndex=j
                                 return(
                                   <>
                                 <div className="RecCont"> 
                                 <h2 className="OllCpLocation">{CpLocation[j]}</h2>
                                 

                                 <BarPersevationOverlay
                                        oll={oll}
                                        pll={""}
                                        permIndex={1}
                                        cpEasyWanted={false}
                                        cpSameOppWanted={false}
                                        barMovementWanted={true}
                                        cubeSize={cubeSize}
                                        setCubeSize={setCubeSize}
                                        cubeSizeFixed={false}
                                        view={"plan"}
                                        />
                                 {/* <CaseImage
                                     size={cubeSize}
                                     alg={(oll.algs+CornerPermutations[PermTable[j]]).replace(/\s+/g, "")+"y2"}
                                     caseSetDetails={ScrambleVisualizerDetails}
                                     co="40"
                                 ></CaseImage>
                                
                                 <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200+10}px`,width:`${cubeSize*160/200+10}px`,marginTop:`${33+cubeSize/10}px`}}>
   
                                  {
                                   pathCalculated && showPopUpCard.length==0 &&(
                                  <>
                                  
                                   {
                                     //In this array to prevent outline from overlapping with connecting lines
                                     Array.from({ length: 5 }, (_, i) => i).map(i => (
                                     <>
                                     <svg style={{position:"absolute"}}id="GoodLine" width="100%" height="100%">
                                       
                                       <path
                                         d={overlayPaths[OllIndex][PermIndex]?.centerOutLine?.[i] || ""}
                                         //fill={overlayPaths[OllIndex][PermIndex]?.[4]?.[i][1] || "black"}
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
                                         d={overlayPaths[OllIndex][PermIndex]?.noMovementCircle||""}
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
                                         d={overlayPaths[OllIndex][PermIndex]?.connectingLines?.[i][j].linePath || ""}
                                         fill={overlayPaths[OllIndex][PermIndex]?.combinedColorList?.[i][0] || "black"}
                                         
                                         stroke="rgba(44, 44, 44, 1)"
                                         strokeWidth="1"
                                         strokeLinejoin="round"
                                         
                                         
                                         transform={`rotate(${overlayPaths[OllIndex][PermIndex]?.connectingLines?.[i][j].lineRotation || "0"} ${overlayPaths[OllIndex][PermIndex]?.connectingLines?.[i][j].lineRotationCoordX ||"0"} ${overlayPaths[OllIndex][PermIndex]?.connectingLines?.[i][j].lineRotationCoordY ||"0"})`}
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
                                         d={overlayPaths[OllIndex][PermIndex]?.arrow?.[i].arrowPath||""}
                                         fill={overlayPaths[OllIndex][PermIndex]?.combinedColorList?.[i][1] || "purple"}
                                       stroke="rgba(0, 0, 0, 1)"
                                         strokeWidth="1.5"
                                         strokeLinejoin="round"
                                         transform={`rotate(${overlayPaths[OllIndex][PermIndex]?.arrow?.[i].arrowRotation || "0"} ${overlayPaths[OllIndex][PermIndex]?.arrow?.[i].arrowRotationCoordX ||"0"} ${overlayPaths[OllIndex][PermIndex]?.arrow?.[i].arrowRotationCoordY ||"0"})`}
                                     />
                                     
                                   </svg>
                                  
                                    <svg style={{position:"absolute"}}id="CirclePath" width="100%" height="100%" >
                                       <path
                                           d={overlayPaths[OllIndex][PermIndex]?.centerCircle?.[i]||""}
                                           fill={overlayPaths[OllIndex][PermIndex]?.combinedColorList?.[i][1] || ""}
                                         stroke="rgba(22, 22, 22, 1)"
                                         strokeWidth="1"
                                       />
                                     </svg>
   
                                   </>))
                                  } 
                                   
                                   
                                   {/* <svg style={{position:"absolute", zIndex:"100"}}id="GoodLine" width="100%" height="100%">
   
                                       
                                       <path
                                         d={"M 58,54 L 58,56 L 133,56 L 133,54 Z "}
                                         fill={"rgba(207, 1, 1, 1)"}
                                         stroke="rgba(255, 0, 234, 1)"
                                         strokeWidthstrokeWidth="0.1"
                                         filter="url(#shadow)"
                                         transform="rotate(45)"
                                       />
                                   </svg>                              }
                                   </>
                                   )
                               }
                               </div>
                                 <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${45+cubeSize/10}px`}}>
                               
                                  </div> */}
                                 
                                 </div>
                                  
                           </>
                                 )})}
                             
                         
                         </div>

    </>
)
}
export default Bar6Grid
