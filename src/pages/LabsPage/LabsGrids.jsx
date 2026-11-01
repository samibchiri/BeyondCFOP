
import React, { useContext, useState, useEffect } from "react"; 
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

import LabsOllGroupButton, {LabsOllAlgButton,LabsPllGroupButton, LabsCellCopyNumber, AUFGrid} from "./LabsOllGroupButton.jsx";
import { LabsLastSlotButton } from "./LabsLastSlotButton.jsx"; 
import LabsCell, {AddLabsCell,CombinedAddRemoveLabsCell} from "./LabsCell.jsx";

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

import { LabsRemoveButton } from "./LabsRemoveButton.jsx";


export function Labs2CellGrid({gridList,startCountNumber,cells,setCells,cubeSize,setCubeSize,linkedWith,setLinkedWith, unlinkable,oll, LastSlotAlgs,shortGroupTable}){
    
    console.log("ShortTable0",unlinkable ,linkedWith)


    // let linkedWith1=[]
    
    // if(unlinkable.includes(cells[startCountNumber].cellNumber)){
    //     linkedWith.forEach(list => {
    //         if(list.includes(cells[startCountNumber].cellNumber)){
    //             linkedWith1=list
    //         }
    //     });
    // }

    

    

    //Important

    // let nestedGridNumberList1= cells[startCountNumber]?.gridNumber

    // let linkedWith1=[]
    // nestedGridNumberList1.forEach((number)=>{
    //     linkedWith1.push([[gridList[number]][2],gridList[number][1]])
    // })
    
    // let nestedGridNumberList2= cells[startCountNumber+1].gridNumber

    // let linkedWith2=[]
    // nestedGridNumberList2.forEach((number)=>{
    //     linkedWith2.push([[gridList[number]][2],gridList[number][1]])
    // })






    // if(unlinkable.includes(num)){
    //     gridList.forEach((grid) => {
    //         if(grid[0]=="Custom"){
    //             if(grid[2].includes[num]){
    //                 linkedWith1.push(grid[2],grid[1])
    //             }
    //         }
            
    //     });
    // }

    // if(unlinkable.includes(num+1)){
    //     gridList.forEach((grid) => {
    //         if(grid[0]=="Custom"){
    //             if(grid[2].includes[num+1]){
    //                 linkedWith2.push(grid[2],grid[1])
    //             }
    //         }
            
    //     });
    // }


    const { darkMode } = useContext(ThemeContext)
    
    return (
        
        <div className="Labs2CellGridCont">

            <CombinedAddRemoveLabsCell celltype={"2Grid"} cellNumber={startCountNumber+0} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} setLinkedWith={setLinkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"2Grid"} cellNumber={startCountNumber+1} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} setLinkedWith={setLinkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>
            
 
        </div>
    )
}

export default Labs2CellGrid




export function Labs6CellLastSlotGrid({startCountNumber,cells,setCells,unlinkable,cubeSize,setCubeSize,oll, LastSlotAlgs, shortGroupTable}){
    
    console.log("ShortTable1",shortGroupTable)

    const { darkMode } = useContext(ThemeContext)


    
    let num=startCountNumber
    let linkedWith= [[num,num+1,num+2,num+3,num+4,num+5],"LastSlot"]
    

    
    return (
        <>
        <div className="Labs4CellGridCont">

            <h2 style={{fontWeight:"600", marginBottom:"20px"}}> Last Slot Grid</h2>

        
        <div className="Labs4CellGrid">

            <div>
                <h5 style={{height:"1.25rem"}}></h5>
                <h5 style={{height:"1.25rem"}}></h5>
                <CombinedAddRemoveLabsCell celltype={"LastSlotGrid"} cellNumber={startCountNumber+0} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            </div>
           
            <div style={{width:"100%",height:"100%"}}>
                <h5 style={{height:"1.25rem", display:`${cells[startCountNumber+1].hidden?"none":"block"}`}} >Setup: {cells[startCountNumber+1].lastSlotAlgSetup}</h5>
                <h5 style={{height:"1.25rem", display:`${cells[startCountNumber+1].hidden?"none":"block"}`}}>Solve: {cells[startCountNumber+1].lastSlotAlgSolve}</h5>
                <CombinedAddRemoveLabsCell celltype={"LastSlotGrid"} cellNumber={startCountNumber+1} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            </div>

            <div>
                <h5 style={{display:`${cells[startCountNumber+2].hidden?"none":"block"}`}}>Setup: {cells[startCountNumber+2].lastSlotAlgSetup}</h5>
                <h5 style={{display:`${cells[startCountNumber+2].hidden?"none":"block"}`}}>Solve: {cells[startCountNumber+2].lastSlotAlgSolve}</h5>
                <CombinedAddRemoveLabsCell celltype={"LastSlotGrid"} cellNumber={startCountNumber+2} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            </div>

            <div>
                <h5 style={{display:`${cells[startCountNumber+3].hidden?"none":"block"}`}}>Setup: {cells[startCountNumber+3].lastSlotAlgSetup}</h5>
                <h5 style={{display:`${cells[startCountNumber+3].hidden?"none":"block"}`}}>Solve: {cells[startCountNumber+3].lastSlotAlgSolve}</h5>
                <CombinedAddRemoveLabsCell celltype={"LastSlotGrid"} cellNumber={startCountNumber+3} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            </div>

            <div>
                <h5 style={{display:`${cells[startCountNumber+4].hidden?"none":"block"}`}}>Setup: {cells[startCountNumber+4].lastSlotAlgSetup}</h5>
                <h5 style={{display:`${cells[startCountNumber+4].hidden?"none":"block"}`}}>Solve: {cells[startCountNumber+4].lastSlotAlgSolve}</h5>
                <CombinedAddRemoveLabsCell celltype={"LastSlotGrid"} cellNumber={startCountNumber+4} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            </div>

            <div>
                <h5 style={{display:`${cells[startCountNumber+5].hidden?"none":"block"}`}}>Setup: {cells[startCountNumber+5].lastSlotAlgSetup}</h5>
                <h5 style={{display:`${cells[startCountNumber+5].hidden?"none":"block"}`}}>Solve: {cells[startCountNumber+5].lastSlotAlgSolve}</h5>
                <CombinedAddRemoveLabsCell celltype={"LastSlotGrid"} cellNumber={startCountNumber+5} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            </div>

        </div>
        </div>
        </>
    )
}

export function Labs6CellOLLGrid({removeButton,startCountNumber,cells,setCells,unlinkable,cubeSize,setCubeSize,oll, LastSlotAlgs, shortGroupTable}){
    

    const { darkMode } = useContext(ThemeContext)

    console.log("ShortTable2",shortGroupTable)
    let num=startCountNumber
    let linkedWith= [[num,num+1,num+2,num+3,num+4,num+5],"OLL"]
    
    
    const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        height: "80px",
        backgroundColor:"red",
        fontSize: "1.5rem",
    }
    

    return (
        <>
        <div className="Labs4CellGridCont">

            <h2 style={{fontWeight:"600", marginBottom:"20px"}}> OLL Grid</h2>

        
        <div className="Labs4CellGrid">

            <CombinedAddRemoveLabsCell celltype={"OLL"} cellNumber={startCountNumber+0} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"OLL"} cellNumber={startCountNumber+1} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"OLL"} cellNumber={startCountNumber+2} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"OLL"} cellNumber={startCountNumber+3} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>
        
            <CombinedAddRemoveLabsCell celltype={"OLL"} cellNumber={startCountNumber+4} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"OLL"} cellNumber={startCountNumber+5} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

        </div>

            <LabsRemoveButton onClick={removeButton}></LabsRemoveButton>

        </div>
        </>
    )
}

export function Labs6CellPLLGrid({startCountNumber,cells,setCells,unlinkable,cubeSize,setCubeSize,oll, LastSlotAlgs,shortGroupTable}){
    
    console.log("ShortTable3",shortGroupTable)
    let num=startCountNumber
    let linkedWith= [[num,num+1,num+2,num+3,num+4,num+5],"PLL"]

    return (
        <>
        <div className="Labs4CellGridCont">

            <h2 style={{fontWeight:"600", marginBottom:"20px"}}> PLL Grid</h2>

        
        <div className="Labs4CellGrid">

            <CombinedAddRemoveLabsCell celltype={"PLL"} cellNumber={startCountNumber+0} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"PLL"} cellNumber={startCountNumber+1} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"PLL"} cellNumber={startCountNumber+2} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"PLL"} cellNumber={startCountNumber+3} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>
        
            <CombinedAddRemoveLabsCell celltype={"PLL"} cellNumber={startCountNumber+4} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

            <CombinedAddRemoveLabsCell celltype={"PLL"} cellNumber={startCountNumber+5} cells={cells} setCells={setCells} unlinkable={unlinkable} linkedWith={linkedWith} cubeSize={cubeSize} setCubeSize={setCubeSize} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></CombinedAddRemoveLabsCell>

        </div>
        </div>
        </>
    )
}

