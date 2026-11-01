
import React, { useContext, useState, useEffect } from "react"; // removed 'use'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";

import TestPage from '../TestPage/TestPage.jsx';
import CornerPermutationPage from '../CpPage/CornerPermutationPage.jsx';
//import ArrowDataGenerator from '../../dataGeneration/ArrowDataGenerator.jsx'
import cpllCaseSet from "../../data/cpllCaseSet.js";
import eollCaseSet from "../../data/eollCaseSet.js";
import epllCaseSet from "../../data/epllCaseSet.js";
import f2lCaseSet from "../../data/f2lCaseSet.js";
import ocllCaseSet from "../../data/ocllCaseSet.js";
import ollCaseSet from "../../data/ollCaseSet.js";
import pllCaseSet from "../../data/pllCaseSet.js";
import BarPersevation from '../BarPersevationPage/BarPersevationPage.jsx';

// Bootstrap CSS fir-st
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaIcon } from '../../assets/fontAwesome.js';

// Your custom CSS after Bootstrap
import '../../styling/App.css';
import '../../styling/index.css';
import '../../styling/PopUp.css';

import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../data/NewGeneratedData/db.js';

import {sortOlls} from "../../context/OllContext.jsx"

import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import ShowAlgCard from "../TrainSelectPage/cardPopUp.jsx";
import Bar6Grid from "../BarPersevationPage/Bar6Grid.jsx";

import Stopwatch from '../../components/Train/Stopwatch.jsx';

import BarPersevationOverlay from "../../1OllBarInfo.jsx";

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

import LabsOllGroupButton, {LabsOllAlgButton,LabsPllGroupButton, LabsCellCopyNumber, AUFGrid} from "./LabsOllGroupButton.jsx";
import { LabsLastSlotButton } from "./LabsLastSlotButton.jsx"; 
import LabsCell from "./LabsCell.jsx";
import Labs2CellGrid, {Labs6CellLastSlotGrid, Labs6CellOLLGrid, Labs6CellPLLGrid} from "./LabsGrids.jsx";

import { defaultCellInfo } from "./LabsCell.jsx";

export default function LabsPage(){
    const { darkMode } = useContext(ThemeContext)
    const [caseClicked, setCaseClicked] = useState(false)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [cpClicked, setCpClicked] = useState(false)
    const [barClicked, setBarClicked] = useState(false)
    const [caseItem, setCaseItem] = useState()
    const [showPopUpCard, setShowPopUpCard] = useState([])
    
    const navigate = useNavigate();
    
    const buttonStyle = {
        width: "85%",
        height: "15vh",
        minHeight: "100px",
        color: darkMode ? "#ffffffff" : "#000000ff", // dark text for light grey, white text for dark




    };

    const BackButtonstyle = {
        width: "75px",
        height: "40px",
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",

    }

    const HintButtonstyle = {
        width: "75px",
        height: "40px",
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        
    }

    const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        height: "50px",
    }


    const tableCellDark = {
        backgroundColor: "#ffffff"
    }

    const tableCellLight = {
        backgroundColor: "#000000"

    }

    const dbOllCaseSet = useLiveQuery(()=>{
        
          return db.olls.where("algNumber").equals(0).toArray().then(arr => arr.sort(sortOlls));;
        },[]
      );

    const [selectedCaseSet, setSelectedCaseSet] = useState(ollCaseSet)

    let AllCases = [cpllCaseSet, eollCaseSet, epllCaseSet, f2lCaseSet, ocllCaseSet, ollCaseSet, pllCaseSet]

    let dCrossShown = true

    const { xs } = useWindowDimensions();
    const cubeImageSize = xs ? "100" : "120";

    const [cubeSize, setCubeSize] = useState(250);
    console.log("CuSize",cubeSize)
    const [openGroups, setOpenGroups] = useState({});
    const [selectedAlg, setSelectedAlg] = useState([])
    const [algCasesSet, setAlgCasesSet] = useState(ollCaseSet)
    const [AlgGroups, setAlgGroups] = useState([]);

    const [cpSameOpp,setCpSameOpp] = useState(false)
    const [recAnswered,setRecAnswered] = useState(false)

    const handleBackClicked = ()=>{
        navigate("/train")
    }

    const handleCellChange= (cellNumber,toChange, newAlg)=>{

    }

    let T_Perm= "R U R' U' R' F R2 U' R' U' R U R' F' "

    const shortGroupTable = {
  0: "Cross",
  1: "Dot",
  2: "T Shape",
  3: "C Shape",
  4: "I Shape",
  5: "P Shape",
  6: "W Shape",
  7: "Small L Shape",
  8: "Small Bolt",
  9: "Big Bolt",
  10: "Square Shape",
  11: "Fish Shape",
  12: "Knight Shape",
  13: "Awkward Shape",
  14: "Corners Oriented"
}

    

    // const [gridList,setGridList] = useState([["LastSlot",0],["2Grid",6],["PLL",8]])

    // const [gridList,setGridList] = useState([["2Grid",0]])
    
    const [gridList,setGridList] = useState([["2Grid",0]])

    const [customLinks,setCustomLinks] = useState([["LastSlot",[6,7]]])

    
    let unlinkableList=[]
    gridList.forEach((grid)=>{
        console.log("AllGrid",grid)
        if(grid[0]!="2Grid" && grid[0]!="Custom"){
            for(let i=grid[1];i<grid[1]+6;i++){
                unlinkableList.push(i)
            }
        }
        else if(grid[0]=="2Grid"){
            for(let i=grid[1];i<grid[1]+2;i++){
                unlinkableList.push(i)
            }
        }
    })

    console.log("TestLinkList",unlinkableList)
    
    function removeButton(index){
        console.log("RemoveButton", index)
    }

    function gridCellLength(type){

        return type=="2Grid"?2:6
    }

    const LastSlotAlgs=["R U R'", "L' U' L","R U' R'","L' U L'","R U2 R'", "L' U2 L", "R' F R F'", "L F' L' F"]

    const LastSlotWaysToSolve=["U R U2 R'","U' R' F R F'","",""]

    const addGrid =(type)=>{

        let maxCount=0
        if(gridList.length>0){
            maxCount= gridList[gridList.length-1][1]+(gridCellLength(gridList[gridList.length-1][0]))
            console.log("Maxcount",maxCount)
        }
        
        setGridList((prev)=>[...prev,[type,maxCount]])

        let addCellsList= []

        for (let i=0;i<gridCellLength(type);i++){
            console.log("LinkedWithOLLType",type,i)
            if(i==1 && type!="2Grid"){
                addCellsList.push({...defaultCellInfo(maxCount+i,true),gridNumber:gridList.length})
            }
            else if(i==0 && type=="LastSlot"){
                addCellsList.push({...defaultCellInfo(maxCount+i,false),gridNumber:gridList.length,lastSlotAlgSetup:"R U R'",lastSlotAlgSolve:"R U' R'",linkedHead:true})
            }
            // else if(i==1 && type=="LastSlot"){
            //     console.log("WayToSolve",i,LastSlotWaysToSolve[i-2])
            //     addCellsList.push({...defaultCellInfo(maxCount+i,true),gridNumber:gridList.length,lastSlotAlgSetup:"R U R'",lastSlotAlgSolve:LastSlotWaysToSolve[i-2]})
            // }
            else if(i>1 && type=="LastSlot"){
                console.log("WayToSolve",i,LastSlotWaysToSolve[i-2])
                addCellsList.push({...defaultCellInfo(maxCount+i,false),gridNumber:gridList.length,lastSlotAlgSetup:"R U R'",lastSlotAlgSolve:LastSlotWaysToSolve[i-2]})
            }
            else if(i==0 && type=="OLL"){
                addCellsList.push({...defaultCellInfo(maxCount+i,false),gridNumber:gridList.length,linkedHead:true})
            }
            else if(i>1 && type=="OLL"){
                addCellsList.push({...defaultCellInfo(maxCount+i,false),gridNumber:gridList.length,lastSlotAlgSetup:LastSlotAlgs[(i-2)*2]})
            }
            else if(i==0 && type=="PLL"){
                addCellsList.push({...defaultCellInfo(maxCount+i,false),gridNumber:gridList.length,linkedHead:true})
            }
            else if (type=="2Grid"){
                addCellsList.push({...defaultCellInfo(maxCount+i,false),gridNumber:gridList.length,linkedHead:true})
            }
            else{
                addCellsList.push({...defaultCellInfo(maxCount+i,false),gridNumber:gridList.length})
            }
            
        }

        setCells((prev)=>[...prev,...addCellsList])

        console.log("NoOLL",cells,gridList)
        return null
    }

    const [unlinkable, setUnlinkable] = useState(unlinkableList)
    const [linkedWith, setLinkedWith] = useState({
        "LastSlot":[[],[]],
        "OLL":[[],[]],
        "PLL":[[],[]],
    })

    const [cells, setCells] = useState(
        [
        {id: `cell-${0}`,
        cellNumber: 0,
        ollRec: "",
        lastSlotAlgSetup: "",
        preOllAUFSetup: "",
        ollAlgSetupNumber: 21,
        ollAlgNumber:0,
        prePllAUFSetup: "",
        pllAlgSetup: "",
        pllName:"",
        pllPermIndex:0,
        postPllAUFSetup: "",
        lastSlotAlgSolve:"",
        ollAlgSolve:"",
        pllAlgSolve:"",
        gridNumber: [],
        crossColor:"White",
        view:"plan",
        hidden: false,
        linkedHead:true},

        {id: `cell-${1}`,
        cellNumber: 1,
        ollRec: "",
        lastSlotAlgSetup: "",
        preOllAUFSetup: "",
        ollAlgSetupNumber: "",
        ollAlgNumber:"",
        prePllAUFSetup: "",
        pllAlgSetup: "",
        pllName:"",
        pllPermIndex:0,
        postPllAUFSetup: "",
        lastSlotAlgSolve:"",
        ollAlgSolve:"",
        pllAlgSolve:"",
        gridNumber: [],
        crossColor:"White",
        view:"plan",
        hidden: false,
        linkedHead:true}
    ]);

    let prevCount=0
    useEffect(()=>{
        unlinkableList=[]
        console.log("AddUnlinkable",unlinkable,unlinkableList,gridList)
        gridList.forEach((grid)=>{
        
        let startCountNumber= grid[1]
        if(grid[0]!="2Grid"){
            prevCount=0
            while(prevCount<6){
                console.log("AddUnl3",prevCount,startCountNumber,unlinkableList)
            unlinkableList.push(startCountNumber+prevCount)
            prevCount+=1
            }
        }
        prevCount=startCountNumber
    })
    console.log("AddUnlinkableList2",unlinkableList)
    setUnlinkable(unlinkableList)

    },[gridList])
    
    const ScrambleDetails = {
        id: "oll",
        title: "OLL",
        subTitle: "Full OLL",
        view: "plan",
        numCases: 57,
    }
    const ScrambleVisualizerDetails = {
        id: "oll",
        title: "OLL",
        subTitle: "Full OLL",
        view: "plan",
        stage: "cross",
        numCases: 57,
    }

    let scramble = "F L2 U2 L2 R2 B2 L2 U2 R2 F R2 F U L' F R2 B2 F2 R2 U' B D2 L"
    // let oll = dbOllCaseSet?dbOllCaseSet[0]:""
    // console.log("Oll",oll)
    let j=0


    return <>
            <div className='TestContainersCont'>

                <div className='Timercontainer '>
                    <div className='TestButtonsCont row align-items-center d-flex alignItems:"center"'>
                        <div style={{ height: "50px", alignItems: "center" }} className='col p-0 justify-content-start d-flex'>
                            <button onClick={() => { handleBackClicked() }}
                                className={`${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                style={{
                                    ...BackButtonstyle,

                                    "--bs-border-style": "solid",
                                    "--bs-border-color": "white",
                                    "--bs-btn-hover-border-color": "red",
                                    "--bs-btn-focus-border-color": "red",
                                    "--bs-btn-active-border-color": "red",
                                }}
                            >
                                Back
                            </button>
                        </div>
                       
                    </div>

                    <div className="TrainCont">
                        <h3 className="OllText">Labs</h3>
                        <h3 className='AlgText'> OLL 52</h3>

        
                    </div>
                    <div className={`LabsGridCont`}>
                    
                
                
                {gridList.map((item,i)=>{
                    if(item[0]=="LastSlot"){
                        return(
                            <Labs6CellLastSlotGrid removeButton={()=>{removeButton(i)}} startCountNumber={item[1]} cells={cells} setCells={setCells} unlinkable={unlinkable} cubeSize={cubeSize} setCubeSize={setCubeSize} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}> </Labs6CellLastSlotGrid>
                
                        )
                    }
                    if(item[0]=="2Grid"){
                        return(
                            // <h2></h2>
                            <Labs2CellGrid removeButton={()=>{removeButton(i)}} gridList={gridList} startCountNumber={item[1]} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} setLinkedWith={setLinkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize}LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}> </Labs2CellGrid>
                
                        )
                    }
                    if(item[0]=="OLL"){
                        return(
                            // <h2></h2>
                            <Labs6CellOLLGrid removeButton={()=>{removeButton(i)}} startCountNumber={item[1]} cells={cells} setCells={setCells} unlinkable={unlinkable} cubeSize={cubeSize} setCubeSize={setCubeSize} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}> </Labs6CellOLLGrid>
                
                        )
                    }
                    if(item[0]=="PLL"){
                        return(
                            // <h2></h2>
                            <Labs6CellPLLGrid removeButton={()=>{removeButton(i)}} startCountNumber={item[1]} cells={cells} setCells={setCells} unlinkable={unlinkable} cubeSize={cubeSize} setCubeSize={setCubeSize} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}> </Labs6CellPLLGrid>
                
                        )
                    }
                })}
                {/* <Labs2CellGrid startCountNumber={10} cells={cells} setCells={setCells} unlinkable={unlinkable} cubeSize={cubeSize} setCubeSize={setCubeSize} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}> </Labs2CellGrid> */}
                
                
                </div>
                

                <div className="AddLabsCellsCont">
            
                    <button onClick={()=>{addGrid("LastSlot")}} className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                   
                style={{
                
                    ...ContinueButtonstyle,

                    "--bs-border-style": "solid",
                    "--bs-border-color": "white",
                    "--bs-btn-hover-border-color": "red",
                    "--bs-btn-focus-border-color": "red",
                    "--bs-btn-active-border-color": "red",
                
                                        }}
                                        >Add 6 LastSlotCells</button>
                                <button onClick={()=>{addGrid("2Grid")}} className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                
                style={{
                
                    ...ContinueButtonstyle,

                    "--bs-border-style": "solid",
                    "--bs-border-color": "white",
                    "--bs-btn-hover-border-color": "red",
                    "--bs-btn-focus-border-color": "red",
                    "--bs-btn-active-border-color": "red",
                
                                        }}
                                        >Add 2 GridCells</button>
                                        <button onClick={()=>{addGrid("OLL")}} className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                
                style={{
                
                    ...ContinueButtonstyle,

                    "--bs-border-style": "solid",
                    "--bs-border-color": "white",
                    "--bs-btn-hover-border-color": "red",
                    "--bs-btn-focus-border-color": "red",
                    "--bs-btn-active-border-color": "red",
                
                                        }}
                                        >Add 6 OLLCells</button>

                                        <button onClick={()=>{addGrid("PLL")}} className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                
                style={{
                
                    ...ContinueButtonstyle,

                    "--bs-border-style": "solid",
                    "--bs-border-color": "white",
                    "--bs-btn-hover-border-color": "red",
                    "--bs-btn-focus-border-color": "red",
                    "--bs-btn-active-border-color": "red",
                
                                        }}
                                        >Add 6 PLLCells</button>

                </div>
                {/* <Labs2CellGrid removeButton={()=>{removeButton(i)}} gridList={gridList} startCountNumber={0} cells={cells} setCells={setCells} unlinkable={unlinkable} cubeSize={cubeSize} setCubeSize={setCubeSize}LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}> </Labs2CellGrid> */}
                
                </div>
                
            </div>

     </>
}
