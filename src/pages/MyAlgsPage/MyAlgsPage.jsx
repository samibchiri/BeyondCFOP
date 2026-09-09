import React, {useEffect, useContext, useState } from "react"; // removed 'use'
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

import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import ShowAlgCard from "../TrainSelectPage/cardPopUp.jsx";

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

import { useLiveQuery } from "dexie-react-hooks";
import {db} from '../../data/NewGeneratedData/db.js';

export default function MyAlgsPage() {

    const { darkMode } = useContext(ThemeContext)
    const [caseClicked, setCaseClicked] = useState(false)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [myOllAlgsClicked, setMyOllAlgsClicked] = useState(false)
    
    const [selectedCaseSet, setSelectedCaseSet] = useState(null)
 
    const [groupedOlls, setGroupedOlls] = useState({});
    const [openGroups, setOpenGroups] = useState({});

    const [selectedAlg, setSelectedAlg] = useState([])
    const [showPopUpCard, setShowPopUpCard] = useState([])
    const allOlls = useLiveQuery(() => db.olls.toArray(), []);
    
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


    const tableCellDark = {
        backgroundColor: "#ffffff"
    }

    const tableCellLight = {
        backgroundColor: "#000000"

    }

    
    useEffect(() => {
        if (!allOlls) return;

        const sorted = [...allOlls].sort(
            (a, b) => a.ollNumber - b.ollNumber
        );

        const grouped = sorted.reduce((acc, oll) => {
            if (!acc[oll.group]) {
                acc[oll.group] = [];
            }
            acc[oll.group].push(oll);
            return acc;
        }, {});
        console.log("Grouped",grouped)
        setGroupedOlls(grouped);

    }, [allOlls]);

    const toggleGroup = (group) => {
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    const handleAlgCaseSetClicked = (caseItem) => {
        setSelectedCaseSet(caseItem.title)
        setOpenGroups([])
        setSelectedAlg([])
        
        navigate(caseItem.route)
        
    }


    let AllCases = [cpllCaseSet, eollCaseSet, epllCaseSet, f2lCaseSet, ocllCaseSet, ollCaseSet, pllCaseSet]

    let dCrossShown = true

    const { xs } = useWindowDimensions();
    const cubeImageSize = xs ? "100" : "120";

    const [AlgGroups, setAlgGroups] = useState([]);

    const handleBackClicked = ()=>{
       
        if(!selectedCaseSet){
            navigate("/train")
        }
        else{
            setSelectedCaseSet(null)
        }
        
    }

    const handleAlgCardShown = (alg) => {
        console.log("HandleShown")
        console.log(alg)
        setShowPopUpCard([alg])
    }

    const resetToDefault = (alg) => {
        console.log("Reset to default", alg)
    }

    let AlgSets=
        [
            {
                title:"Oll",
                algs:["R U R' U R U2 R'"],
                database: db,
                route : "/myAlgs/Oll",
            },
            {
                title:"Removed",
                route : "/myAlgs/Removed",
            }
        ]

    

    return <>

        <div style={{ height: "50px", alignItems: "center" }} className='col p-0 justify-content-start d-flex'>
            <button
                onClick={() => { handleBackClicked()}}
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

        {!selectedCaseSet && (
                    <>
                        <div className='container'>
                            <h2 className=''>Which alg set do you want to see?</h2>
        
                            <div className='row'>
                                {AlgSets.map((caseItem, i) => (
                                    <div key={i} style={{ maxWidth: "1200px", minHeight: "100px" }} className='col-12 col-md-6 mb-3 d-flex justify-content-center'>
                                        <button onClick={() => { handleAlgCaseSetClicked(caseItem) }} className={`m-2 border btn-block btn ${darkMode ? "btn-dark" : "btn-primary"}`} style={buttonStyle}>
                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
                                                {
                                                caseItem.title=="Oll"?
                                                <div>
                                                    <CaseImage
                                                        size={80}
                                                        alg={caseItem.algs}
                                                        caseSetDetails={pllCaseSet.details}
                                                    ></CaseImage>
                                                </div>:
                                                <button id="myAlgsTrash" className='TestButton'>
                                                    <FaIcon icon="trash" style={{color:"white",fontSize:"20px"}} />
                                                </button>

                                                }
                                                <div className='col'>
                                                    <h2>{caseItem.title}</h2>
                                                </div>
                                                {
                                                caseItem.algs?
                                                <div>
                                                    <CaseImage
                                                        size={80}
                                                        alg={ollCaseSet.algs}
                                                        caseSetDetails={pllCaseSet.details}
                                                    ></CaseImage>
                                                </div>:
                                                <button id="myAlgsTrash" className='TestButton'>
                                                    <FaIcon icon="trash" style={{color:"white",fontSize:"20px"}} />
                                                </button>

                                                }
                                               
        
                                            </div>
                                        </button>
                                    </div>
                                ))}
        
                            </div>
                        </div>
        
                    </>)}
         {selectedCaseSet=="Osll" && (
         <>
        
        <table className="text-center table table-sm" style={{minWidth:"470px", tableLayout:"fixed", "--bs-table-color-state": darkMode ? "#ffffffff" : "#000000ff", "--bs-table-bg": "transparent" }} role="table">
            <thead className='trainTableHeader'>
                <tr style={{ width:"80px", height: "80px" }} role="row" >
                    <th className='align-middle' role="columnheader">
                        <div>
                            Group
                        </div>
                    </th>
                    <th className='align-middle' role="columnheader">
                        <div>
                            Case
                        </div>
                    </th>
                    <th style={{minWidth:"100px"}} className='d-none d-md-table-cell align-middle' role="columnheader">
                        <div>
                            Name
                        </div>
                    </th>
                    <th className=' d-sm-table-cell align-middle' role="columnheader">
                        <div>
                            Time
                        </div>
                    </th>
                    <th className='align-middle' role="columnheader">
                        <div>
                            Tps
                        </div>
                    </th>
                    <th className='align-middle' role="columnheader">
                        <div>
                            Num Solves
                        </div>
                    </th>
                    <th className='align-middle' role="columnheader">
                        <div>
                            Expected value
                        </div>
                    </th>
                    <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                        
                    </th>
                </tr>
            </thead>
            <tbody style={{ borderTop: "4px solid #343a40" }} >


                {Object.keys(groupedOlls).map(group => {
                    const FirstGroupCase = ollCaseSet.cases.find(alg => (
                        alg.group == group
                    ))



                    return (
                        <>

                            <tr className={`CasesGroupTableRow ${darkMode ? "darkGroupRow" : "lightGroupRow"} trainTableRow`} role="row" >
                                <td onClick={(() => toggleGroup(group))} className='align-middle' role="columnheader">
                                    {group}
                                    {!openGroups[group] ? <FaChevronRight style={{ marginLeft: '8px' }} /> : <FaChevronDown style={{ marginLeft: '8px' }} />}
                                </td>
                                <td>
                                    {FirstGroupCase && (
                                        <div>
                                            <CaseImage
                                                size={80}
                                                alg={FirstGroupCase.algs[0]}
                                                caseSetDetails={ollCaseSet.details}
                                            ></CaseImage>
                                        </div>
                                    )}

                                </td>
                                <td className='d-none d-md-table-cell align-middle' role="columnheader">
                                    
                                </td>
                                <td className=' d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className=' d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className=' d-sm-table-cell align-middle' role="columnheader">
                                    Item8
                                </td>
                                <td className=' d-sm-table-cell align-middle' role="columnheader">
                                    Item9
                                </td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    
                                </td>


                            </tr>
                            {groupedOlls[group].map(alg => {
                                return (


                                    alg.group == group && openGroups[group] &&
                                    <>

                                        <tr className={`${darkMode ? "darkRow" : "lightRow"} CasesAlgTableRow ${dCrossShown ? "" : "d-none"}`} role="row" >
                                            <td onClick={() => { handleAlgCardShown(alg) }}>

                                            </td>
                                            <td onClick={() => { handleAlgCardShown(alg) }} className='align-middle' role="columnheader">
                                                <div>
                                                    <CaseImage
                                                        size={80}
                                                        alg={alg.algs}
                                                        caseSetDetails={ollCaseSet.details}
                                                    ></CaseImage>
                                                </div>
                                            </td>
                                            <td onClick={() => { handleAlgCardShown(alg) }} className='d-none d-md-table-cell align-middle' role="columnheader">
                                                <div>
                                                    {alg.id}
                                                </div>
                                            </td>
                                            <td onClick={() => { handleAlgCardShown(alg) }} className=' d-sm-table-cell align-middle' role="columnheader">
                                                <div>
                                                    Item2
                                                </div>
                                            </td>
                                            <td onClick={() => { handleAlgCardShown(alg) }} className=' d-sm-table-cell align-middle' role="columnheader">
                                                <div>
                                                    Item3
                                                </div>
                                            </td>
                                            <td onClick={() => { handleAlgCardShown(alg) }} className=' d-sm-table-cell align-middle' role="columnheader">
                                                <div>
                                                    Item5
                                                </div>
                                            </td>
                                            <td onClick={() => { handleAlgCardShown(alg) }} className=' d-sm-table-cell align-middle' role="columnheader">
                                                <div>
                                                    Item6
                                                </div>
                                            </td>
                                            <td style={{verticalAlign: "middle"}}>
                                                <button className="ResetToDefaultButton" onClick={() => { resetToDefault(alg) }}>
                                                    Reset to default
                                                </button>
                                            </td>


                                        </tr>
                                    </>
                                )
                            })}

                        </>
                    )
                }
                )}


            </tbody>
        </table>

        {showPopUpCard.length > 0 && <ShowAlgCard alg={showPopUpCard[0]} onClose={() => setShowPopUpCard([])} AlgCasesSet={ollCaseSet} />}
        
        </>)}
    </>
}