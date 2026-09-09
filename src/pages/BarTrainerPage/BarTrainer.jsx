
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
import ShowBarFullHint from "./BarTrainerAnsPopup.jsx";

import Stopwatch from '../../components/Train/Stopwatch.jsx';

import BarPersevationOverlay from "../../1OllBarInfo.jsx";

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

export default function BarTrainer(){
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

    const [cubeSize, setCubeSize] = useState(300);
    console.log("CuSize",cubeSize)
    const [openGroups, setOpenGroups] = useState({});
    const [selectedAlg, setSelectedAlg] = useState([])
    const [algCasesSet, setAlgCasesSet] = useState(ollCaseSet)
    const [AlgGroups, setAlgGroups] = useState([]);

    const [cpSameOpp,setCpSameOpp] = useState(false)
    const [recAnswered,setRecAnswered] = useState(false)


    useEffect(()=>{
        setCaseItem(pllCaseSet)
    },[])

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

    useEffect(()=> {
        if(caseItem){
            if(caseItem.details.id="oll"){
                setSelectedCaseSet({
                    dbOllCaseSet,
                    details: {
                        id: "oll"
                    }
                });
            }
            else{
                setSelectedCaseSet(caseItem)
            }
        setOpenGroups([])
        setSelectedAlg([])
        setAlgCasesSet(caseItem)
        setAlgGroups([... new Set(caseItem.cases.map(alg => alg.group))])
        }
    },[caseItem,dbOllCaseSet])

    const handleAlgCaseSetClicked = (caseItem) => {
        console.log("Case",dbOllCaseSet)
        setCaseClicked(!caseClicked)
        if(caseItem.details.id="oll"){
            setSelectedCaseSet({
                dbOllCaseSet,
                details: {
                    id: "oll"
                }
            });
        }
        else{
            setSelectedCaseSet(caseItem)
        }
        
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
        navigate("/train")
    }

    const handleHintClicked = ()=>{
        setCpSameOpp(!cpSameOpp)
    }
    

     const TestBackClick = () => {
        setButtonClicked(prev => !prev)
        setCaseClicked(true)
    }



    
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
    let oll = dbOllCaseSet?dbOllCaseSet[0]:""
    console.log("Oll",oll)
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
                        <div className='col p=0 d-flex justify-content-end'>
                            <button
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
                                Skip
                            </button>
                        </div>
                    </div>

                    <div className="TrainCont">
                        <h3 className="OllText">Oll 21-1</h3>
                        <h3 className='AlgText'> {"R U R' U' R U2 R'"}</h3>

                        <Stopwatch></Stopwatch>

                    </div>
                                {//${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn }}
}
                    <div className={` ${!recAnswered?"CubeTrainContGrid":"CubeTrainCont"}`}>
                        <div>
                        {!recAnswered && 
                        <h3>Your Answer</h3>}
                        {dbOllCaseSet && oll && <BarPersevationOverlay
                            oll={oll}
                            pll={""}
                            permIndex={0}
                            cpEasyWanted={false}
                            cpSameOppWanted={!cpSameOpp}
                            barMovementWanted={false}
                            cubeSize={cubeSize}
                            setCubeSize={setCubeSize}
                            cubeSizeFixed={true}
                            />
                        }
                        </div>
                        
                        <div className="CubeTrainContMiddle">
                            <div style={{height:"2rem", width:"50px"}}></div>
                            <div style={{height:"300px", width:"50px", display:"flex", alignItems:"center"}}>
                                <div onClick={() => { handleAlgCardShown(oll) }} className={`hintAfterTrainAnswerButton active`}>
                                        <FaIcon icon="question" style={{scale:"1.7"}} ></FaIcon>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            {!recAnswered && 
                        <h3>Correct Answer</h3>}
                        {
                            !recAnswered && dbOllCaseSet && oll && <BarPersevationOverlay
                            oll={oll}
                            pll={""}
                            permIndex={1}
                            cpEasyWanted={false}
                            cpSameOppWanted={!cpSameOpp}
                            barMovementWanted={false}
                            cubeSize={cubeSize}
                            setCubeSize={setCubeSize}
                            cubeSizeFixed={true}
                            />
                        }
                        </div>
                </div>
                <div className="TrainInputCont">
                    <div style={{"width":"300px"}}>

                    </div>
                    <div>
                        {recAnswered && <input type="text" wrap="soft"  rows="2" className="TrainInputRec" placeholder="Enter Bar Position: (F/S, L/A, R/D, B/W) "/>
                            }     
                        {
                            !recAnswered && 
                            <div style={{"width":"450px"}}>

                                <button className={`${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                    style={{
                                        ...ContinueButtonstyle,

                                        "--bs-border-style": "solid",
                                        "--bs-border-color": "white",
                                        "--bs-btn-hover-border-color": "red",
                                        "--bs-btn-focus-border-color": "red",
                                        "--bs-btn-active-border-color": "red",
                                    }}>
                                    <h3 className="ContinueRecTrainCont">Continue</h3>
                                </button>
                            </div>
                        }  
                    </div>
                    <div style={{"width":"200px"}}>
                        <button onClick={() => { handleHintClicked() }}
                                className={`${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                style={{
                                    ...HintButtonstyle,

                                    "--bs-border-style": "solid",
                                    "--bs-border-color": "white",
                                    "--bs-btn-hover-border-color": "red",
                                    "--bs-btn-focus-border-color": "red",
                                    "--bs-btn-active-border-color": "red",
                                }}
                            >
                                Hint
                            </button>
                    </div>

                </div>
                </div>
                
            </div>

            {showPopUpCard.length > 0 && <ShowBarFullHint alg={showPopUpCard[0]} pll={""} cpEasyWanted={true}
                            cpSameOpp={!cpSameOpp}
                            barMovementWanted={false} cubeSizeFixed={true} cubeSize={250} setCubeSize={setCubeSize} onClose={() => setShowPopUpCard([])} algCasesSet={algCasesSet} />}
    </>
}
