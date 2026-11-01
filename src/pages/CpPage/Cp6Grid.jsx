import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import CpRecOverlay from "../../assetsGeneration/CpOverlay.jsx"
// import {getSameOppInfo,GetColor,getArrowTipCoord,getRotation,getPath,getCenter1And2} from "../CpPage/CornerPermutationPage.jsx"
import BarPersevationOverlay from "../../1OllBarInfo.jsx";




function Cp6Grid({oll,cubeSize,setCubeSize,cpEasyWanted,cpSameOppWanted}){


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


return (
    <>
    
    <div className="OllGrid">
                            
                                                    
                                                    {CornerPermutations.map((_,j)=>
                                                    <div className="RecCont">  
                                                    <h2 className="OllCpLocation">{CpLocation[j]}</h2>
                                                    
                                                     <div id="tempCont" style={{position:"relative",height:`${cubeSize*160/200+20}px`,width:`${cubeSize*160/200}`,marginBottom:"20px"}}>
                                                   
                                                    {/* <CaseImage
                                                        size={cubeSize}
                                                        //alg={""+scramble2.replace(/\s+/g, "")+"y2"}
                                                            alg={(oll.algs+CornerPermutations[PermTable[j]]).replace(/\s+/g, "")+"y2"}
                                                        caseSetDetails={ScrambleVisualizerDetails}
                                                        co="40"
                                                    ></CaseImage> */}
                                                    {/* <div  className='CpRecOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-20+cubeSize/10}px`}}>
                                                       
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
                                                        
                                                    </div> */}
                                                    {/* <CpRecOverlay
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
                                                        /> */}
                                                        {console.log("2erro?",oll,oll.ollNumber,oll.algNumber,CornerPermutations[PermTable[j]])}
                                                        <BarPersevationOverlay
                                                            oll={oll}
                                                            pll={CornerPermutations[PermTable[j]]}
                                                            permIndex={j}
                                                            // cpEasyWanted={cpEasyWanted}
                                                            // cpSameOppWanted={cpSameOppWanted}
                                                            cpWanted={"cpEasy"}
                                                            barMovementWanted={false}
                                                            cubeSize={cubeSize}
                                                            setCubeSize={setCubeSize}
                                                            cubeSizeFixed={false}
                                                            view={"plan"}
                                                            />
                                                    </div>
                                                    <div className='CpGridOverlay' style={{height:`${cubeSize*160/200}px`,width:`${cubeSize*160/200}px`,marginTop:`${-20+cubeSize/10}px`}}>
                                                        
                                                    </div>
                            </div>
                            )}
                        
                    
                    
    
    </div>
    </>
)
}
export default Cp6Grid