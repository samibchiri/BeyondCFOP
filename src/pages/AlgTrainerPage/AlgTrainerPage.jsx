import React, { useContext, useState } from "react"; // removed 'use'
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

import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../data/NewGeneratedData/db.js';

import {sortOlls} from "../../context/OllContext.jsx"
import {sortPlls} from "../../context/PllContext.jsx"


import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import ShowAlgCard from "../TrainSelectPage/cardPopUp.jsx";
import AlgDisplayPage from "./AlgDisplayPage.jsx";

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

export default function AlgTrainerPage() {

    const { darkMode } = useContext(ThemeContext)
    const [caseClicked, setCaseClicked] = useState(false)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [cpClicked, setCpClicked] = useState(false)
    const [barClicked, setBarClicked] = useState(false)
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

    const dbOllCaseSet = useLiveQuery(()=>{
        
          return db.olls.where("algNumber").equals(0).toArray().then(arr => arr.sort(sortOlls));;
        },[]
      );

      const dbEollCaseSet = useLiveQuery(async () => {
        const [alg0, alg1] = await Promise.all([
            db.olls
                .where("algNumber")
                .equals(0)
                .filter(
                    oll => oll.ollNumber === 2 || oll.ollNumber === 45
                )
                .toArray(),

            db.olls
                .where("algNumber")
                .equals(1)
                .filter(
                    oll => oll.ollNumber === 44
                )
                .toArray()
        ]);

        return [...alg0, ...alg1].sort(sortOlls)
    }, []);

     const dbOcllCaseSet = useLiveQuery(() => {
        return db.olls
            .where("algNumber")
            .equals(0)
            .filter(oll => oll.group === "Cross")
            .sortBy("ollNumber");
    }, []);

    const dbPllCaseSet = useLiveQuery(()=>{
    
        return db.plls.where("algNumber").equals(0).toArray().then(arr => arr.sort(sortPlls));;
    },[]
    );

    const dbCpllCaseSet = useLiveQuery(() => {
        return db.plls
            .where("algNumber")
            .equals(0)
            .filter(pll => 12<=pll.pllNumber <= 13) //T-Perm or Y-Perm
            .sortBy("ollNumber");
    }, []);

    const [selectedCaseSet, setSelectedCaseSet] = useState(null)

    let AllCases = [cpllCaseSet, eollCaseSet, epllCaseSet, f2lCaseSet, ocllCaseSet, ollCaseSet, pllCaseSet]

    let dCrossShown = true

    const { xs } = useWindowDimensions();
    const cubeImageSize = xs ? "100" : "120";


    const [openGroups, setOpenGroups] = useState({});
    const [selectedAlg, setSelectedAlg] = useState([])
    const [showPopUpCard, setShowPopUpCard] = useState([])
    const [algCasesSet, setAlgCasesSet] = useState(null);
    const [algGroups, setAlgGroups] = useState([]);
    const toggleSelectedAlg = (alg => {



        if (!(selectedAlg.includes(alg))) {
            setSelectedAlg((prev) => [...prev, alg])
        }
        else {
            setSelectedAlg((prev) => [...prev].filter(item => item !== alg))
        }

    })

    const CheckGroupSelected = (group) => {

        let ChosenGroupAlgs = []

        algCasesSet.cases.forEach((alg) => {
            if (alg.group == group) {
                ChosenGroupAlgs.push(alg)
            }
        })
        const GroupAlgsInSelected = ChosenGroupAlgs.every((alg) => selectedAlg.includes(alg))

        return GroupAlgsInSelected
    }
    const toggleSelectedAlgGroup = (group => {


        let ChosenGroupAlgs = []

        algCasesSet.cases.forEach((alg) => {
            if (alg.group == group) {
                ChosenGroupAlgs.push(alg)
            }
        })
        console.log("Groups")
        console.log(ChosenGroupAlgs)
        const GroupAlgsInSelected = ChosenGroupAlgs.every((alg) => selectedAlg.includes(alg))
        if (GroupAlgsInSelected) {
            setSelectedAlg((prev) => prev.filter((item) => !ChosenGroupAlgs.includes(item)))
        }
        else {

            let AlgsToAdd = ChosenGroupAlgs.filter((item) => !selectedAlg.includes(item))


            setSelectedAlg((prev) => [...prev, ...AlgsToAdd])
        }
        console.log(selectedAlg)
    })


    const toggleGroup = (group) => {
        setOpenGroups((prev) => {


            if (!(group in openGroups)) {

                return { ...prev, [group]: true };
            }
            else {
                return { ...prev, [group]: !prev[group] }
            }

        })

    };


    const AreAllAlgsChecked = () => {
        if (!algCasesSet) return false;
        return algCasesSet.cases.every(alg => selectedAlg.includes(alg))

    }


    const CheckAllAlgs = () => {

        if (AreAllAlgsChecked()) {
            setSelectedAlg([])
        }
        else {
            setSelectedAlg([...algCasesSet.cases])
        }
    }

    const DissableLearnBtn = () => {

        if (selectedAlg.length > 0) {
            return false
        }
        else {
            return true
        }
    }


    const DissableTestBtn = () => {

        if (selectedAlg.length > 1) {
            return false
        }
        else {
            return true
        }
    }
    const handleAlgCardShown = (alg) => {
        console.log("HandleShown")
        console.log(alg)
        setShowPopUpCard([alg])
    }


    const handleAlgCaseSetClicked = (caseItem) => {
        
        setCaseClicked(!caseClicked)
        let newCaseItem=caseItem
        if(caseItem.details.id=="oll"){
            newCaseItem={
                dbOllCaseSet,
                details: {
                    id: "oll"
                }
            };
        }

        if(caseItem.details.id=="ocll"){
            newCaseItem={
                dbPllCaseSet,
                details: {
                    id: "pll"
                }
            };
        }

        if(caseItem.details.id=="pll"){
            newCaseItem={
                dbPllCaseSet,
                details: {
                    id: "pll"
                }
            };
        }

        if(!dbOllCaseSet || !dbPllCaseSet){
            newCaseItem=[]
        }
        console.log("NewCase",newCaseItem,dbOllCaseSet,dbPllCaseSet)
        setSelectedCaseSet(newCaseItem)
        
        setOpenGroups([])
        setSelectedAlg([])
        setAlgCasesSet(caseItem)
        setAlgGroups([... new Set(caseItem.cases.map(alg => alg.group))])
    }

    const TestButtonClick = () => {
        setCaseClicked(prev => !prev)
        setButtonClicked(prev => !prev)

    }

    const handleBackClicked = ()=>{
        if (!caseClicked){
            navigate("/train")

        }
        setCaseClicked(!caseClicked); 
        setButtonClicked(false)
    }


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

        {
            cpClicked && (
                <>
                    <CornerPermutationPage algGroup={algGroups} testedAlgs={selectedAlg} setButtonClicked={setButtonClicked} setCaseClicked={setCaseClicked} />
                </>
            )

        }
        {barClicked && (
            <>
                <BarPersevation algGroup={algGroups} testedAlgs={selectedAlg} setButtonClicked={setButtonClicked} setCaseClicked={setCaseClicked} />
            </>
        )}

        {!cpClicked && !barClicked && !caseClicked && !buttonClicked && (
            <>
                <div className='container'>
                    <h2 className=''>Choose what you want to practice</h2>

                    <div className='row'>
                        {AllCases.map((caseItem, i) => (
                            <div key={i} style={{ maxWidth: "1200px", minHeight: "100px" }} className='col-12 col-md-6 mb-3 d-flex justify-content-center'>
                                <button onClick={() => { handleAlgCaseSetClicked(caseItem) }} className={`m-2 border btn-block btn ${darkMode ? "btn-dark" : "btn-primary"}`} style={buttonStyle}>
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
                                        <div>
                                            <CaseImage
                                                size={80}
                                                alg={caseItem.cases[Math.floor(Math.random() * (caseItem.cases.length - 1))].algs[0]}
                                                caseSetDetails={caseItem.details}
                                            ></CaseImage>
                                        </div >
                                        <div className='col'>
                                            <h2>{caseItem.details.title}</h2>
                                        </div>
                                        <div>
                                            <CaseImage
                                                size={80}
                                                alg={caseItem.cases[0].algs[-1]}
                                                caseSetDetails={caseItem.details}
                                            ></CaseImage>
                                        </div>

                                    </div>
                                </button>
                            </div>
                        ))}

                    </div>
                </div>

            </>)}






        {selectedCaseSet  && (
            
            <>
             <AlgDisplayPage    
             selectedCaseSet={selectedCaseSet}
             setSelectedCaseSet={setSelectedCaseSet}
            openGroups={openGroups}
            setOpenGroups={setOpenGroups}
            selectedAlg={selectedAlg}
            setSelectedAlg={setSelectedAlg}
            algGroups={algGroups}
            setAlgGroups={setAlgGroups}
            algCasesSet={algCasesSet}
            setAlgCasesSet={setAlgCasesSet}
            caseClicked={caseClicked}
            setCaseClicked={setCaseClicked}
            />

                {/* <div className='container-fluid '>
                    <div className='row align-items-center'>
                        <div className='col justify-content-end d-flex p-0'>
                            <button className={`${darkMode ? "dark-learn-btn" : "light-learn-btn"} m-1 btn btn-info `} disabled={DissableLearnBtn()} type='button'>
                                Learn
                            </button>

                            <button onClick={() => TestButtonClick()} className='m-1 btn btn-success test-btn' disabled={DissableTestBtn()} type='button'>
                                Test
                            </button>

                        </div>

                    </div>

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
                                {selectedCaseSet.details.id=="oll" &&
                                    <th className='align-middle' role="columnheader">
                                    <div>
                                        Order
                                    </div>
                                </th>
                                }
                                <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    <input style={{ margin: "10px", width: "20px", height: "20px", verticalAlign: "middle" }} type="checkbox" checked={AreAllAlgsChecked()} onChange={CheckAllAlgs}>
                                    </input>
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: "4px solid #343a40" }} >


                            {algGroups.map(group => {
                                const FirstGroupCase = AlgCasesSet.cases.find(alg => (
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
                                                            caseSetDetails={AlgCasesSet.details}
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
                                                Item9
                                            </td>
                                            {selectedCaseSet.details.id=="oll" &&
                                            <td className=' d-sm-table-cell align-middle' role="columnheader">
                                                
                                            </td>
                                            }
                                            
                                            <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                                <input
                                                    type="checkbox"
                                                    checked={CheckGroupSelected(group)}
                                                    onChange={() => toggleSelectedAlgGroup(group)}
                                                    style={{ margin: "10px", width: "20px", height: "20px" }}
                                                />
                                            </td>


                                        </tr>
                                        {(selectedCaseSet.details.id=="oll"?selectedCaseSet.dbOllCaseSet:AlgCasesSet.cases).map(alg => {
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
                                                                    alg={alg instanceof Array?alg.algs[0]:alg.algs}
                                                                    caseSetDetails={AlgCasesSet.details}
                                                                ></CaseImage>
                                                            </div>
                                                        </td>
                                                        <td onClick={() => { handleAlgCardShown(alg) }} className='d-none d-md-table-cell align-middle' role="columnheader">
                                                            <div>
                                                                {alg.name}
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
                                                        {selectedCaseSet.details.id=="oll" &&
                                                        
                                                        <td onClick={() => { handleAlgCardShown(alg) }} className=' d-sm-table-cell align-middle' role="columnheader">
                                                            <div>
                                                                {console.log(alg)}
                                                                {alg.order}
                                                            </div>
                                                        
                                                        </td>}
                                                        <td>
                                                            <input style={{ margin: "20px", width: "20px", height: "30px" }} className="align-middle" type="checkbox" checked={selectedAlg.includes(alg)} onClick={() => { toggleSelectedAlg(alg) }}>
                                                            </input>
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
                    {showPopUpCard.length > 0 && <ShowAlgCard alg={showPopUpCard[0]} onClose={() => setShowPopUpCard([])} AlgCasesSet={AlgCasesSet} />}

                </div> */}

            </>
        )}

        {
            buttonClicked && (
                <>

                    <TestPage testedAlgs={selectedAlg} setButtonClicked={setButtonClicked} setCaseClicked={setCaseClicked} />
                </>
            )
        }
    </>
}
