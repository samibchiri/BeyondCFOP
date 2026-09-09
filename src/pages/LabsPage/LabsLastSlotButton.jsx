
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






export function LabsLastSlotButton({onClick,text,width}){



    const { darkMode } = useContext(ThemeContext)

    const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        height: "50px",
        width:width,
    }

    return(
        <>
        
       
  <button onClick={()=>{onClick(text)}} className={`LabsLastSlotButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                   
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
                                                            >{text}
                                                            
                                                            </button>
     </>
)
}