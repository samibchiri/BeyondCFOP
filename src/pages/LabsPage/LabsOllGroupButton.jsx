
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

import { ThemeContext } from '../../context/DarkThemeContext.jsx';

import BarPersevationOverlay from "../../1OllBarInfo.jsx";

import { LabsLastSlotButton } from "./LabsLastSlotButton.jsx"; 


export function LabsOllGroupButton({onClick,text,subtext}){



    const { darkMode } = useContext(ThemeContext)

    const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
    }

    return(
  <button onClick={()=>{onClick(text)}} className={`LabsOLLGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                   
                                   style={{
                                 
                                        ...ContinueButtonstyle,

                                        "--bs-border-style": "solid",
                                        "--bs-border-color": "white",
                                        "--bs-btn-hover-border-color": "red",
                                        "--bs-btn-focus-border-color": "red",
                                        "--bs-btn-active-border-color": "red",
                                    
                                                            }}
                                                            >
                                                                <div><span>{text}</span></div>
                                                            <span style={{fontSize:"0.7rem"}}>{subtext}</span>
                                                            </button>
    )
}


export function LabsOllAlgButton({onClick,cellNumber, ollNumber, algNumber, text, lastslot,oll, pll}){



    const { darkMode } = useContext(ThemeContext)

    const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        height: "50px",
        width: "100px"
    }

    let alg= oll

    console.log("Test44",onClick)
    return(
        <>
       
       
  <button onClick={()=>{onClick(cellNumber,ollNumber,algNumber)}} className={`LabsOllAlgButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                   
                                   style={{
                                 
                                        ...ContinueButtonstyle,
                                        display:"flex",
                                        alignItems:"center",
                                        justifyContent:"center",
                                        gap:"10px",
                                        "--bs-border-style": "solid",
                                        "--bs-border-color": "white",
                                        "--bs-btn-hover-border-color": "red",
                                        "--bs-btn-focus-border-color": "red",
                                        "--bs-btn-active-border-color": "red",
                                    
                                                            }}
                                                            >{text}<BarPersevationOverlay
                        oll={""}
                        pll={alg}
                        permIndex={1}
                        cpEasyWanted={false}
                        cpSameOppWanted={false}
                        barMovementWanted={false}
                        cubeSize={80}
                        labsPageTrue={true}
                        cubeSizeFixed={true}
                        />
                                                            
                                                            </button>
     </>
)
}

export function LabsPllGroupButton({onClick, text}){
    

    const { darkMode } = useContext(ThemeContext)

    const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
    }

    return(
  <button onClick={()=>{onClick(text)}} className={`LabsPLLGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                   
                                   style={{
                                 
                                        ...ContinueButtonstyle,

                                        "--bs-border-style": "solid",
                                        "--bs-border-color": "white",
                                        "--bs-btn-hover-border-color": "red",
                                        "--bs-btn-focus-border-color": "red",
                                        "--bs-btn-active-border-color": "red",
                                    
                                                            }}
                                                            >
                                                                <div><span>{text}</span></div>
                                                            
                                                            </button>
    )
}

export function LabsCellCopyNumber({cells,setCells,cellNumber,text}){
 


    const { darkMode } = useContext(ThemeContext)

    const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        height: "50px",
        width: "100px"
    }

    const handleCopyClicked = (cellNumber, cellNumberToCopy)=>{
        
        console.log("Added5",cellNumber,cellNumberToCopy)
        setCells((prev)=>{
                
                let newCells=[...prev]
                
                newCells[cellNumber]={...cells[cellNumberToCopy],   id: `cell-${cellNumber}`,
        cellNumber: cellNumber,}
                // newCells[cellNumber]=defaultCellInfo(cellNumber)
                console.log("Added45",newCells)
                return newCells})
       
    }
    return(
        <>
        
       
  <button onClick={()=>{handleCopyClicked(cellNumber,text)}} className={`LabsAlgCopyNumberButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                   
                                   style={{
                                 
                                        ...ContinueButtonstyle,
                                        display:"flex",
                                        alignItems:"center",
                                        justifyContent:"center",
                                        gap:"10px",
                                        "--bs-border-style": "solid",
                                        "--bs-border-color": "white",
                                        "--bs-btn-hover-border-color": "red",
                                        "--bs-btn-focus-border-color": "red",
                                        "--bs-btn-active-border-color": "red",
                                    
                                                            }}
                                                            >{text+1}
                                                            
                                                            </button>
     </>
)   
}

export function AUFGrid({onClick}){

    let AUFList=["No AUF", "U2", "U", "U'"]
    return(
    //  <div className="LabsLastSlotGroupCont">
    
                               <> 
    {AUFList.map((alg)=>(
        <LabsLastSlotButton onClick={onClick} text={alg}></LabsLastSlotButton>
    ))}
</>   
    // <LabsLastSlotButton onClick={onClick} text={"No AUF"}></LabsLastSlotButton>
    // <LabsLastSlotButton onClick={onClick} text={"U2"}></LabsLastSlotButton>
    //         <LabsLastSlotButton onClick={onClick} text={"U"}></LabsLastSlotButton>
    // <LabsLastSlotButton onClick={onClick} text={"U'"}></LabsLastSlotButton>

// </div>
    )
}


export default LabsOllGroupButton


