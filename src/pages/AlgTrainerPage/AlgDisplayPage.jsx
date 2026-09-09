
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

import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../data/NewGeneratedData/db.js';

// import { useOll } from "../../context/OllContext.jsx";

// import {sortOlls} from "../../context/OllContext.jsx"

// import { usePll } from "../../context/PllContext.jsx";
// import {sortPlls} from "../../context/PllContext.jsx"

import { useAlgs } from "../../context/AlgContext.jsx";

import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import ShowAlgCard from "../TrainSelectPage/cardPopUp.jsx";

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

export default function AlgDisplayPage(
    {selectedCaseSet,
  setSelectedCaseSet,
  openGroups,
  setOpenGroups,
  selectedAlg,
  setSelectedAlg,
  algGroups,
  setAlgGroups,
  algCasesSet,
  setAlgCasesSet,
  caseClicked,
  setCaseClicked})
  {
    const { darkMode } = useContext(ThemeContext)
    //const [caseClicked, setCaseClicked] = useState(false)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [cpClicked, setCpClicked] = useState(false)
    const [barClicked, setBarClicked] = useState(false)
    //const [caseItem, setCaseItem] = useState()
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

    // const dbOllCaseSet = useLiveQuery(()=>{
        
    //       return db.olls.where("algNumber").equals(0).toArray().then(arr => arr.sort(sortOlls));;
    //     },[]
    //   ) ?? [];
    
    //   const dbPllCaseSet = useLiveQuery(()=>{
        
    //       return db.plls.where("algNumber").equals(0).toArray().then(arr => arr.sort(sortPlls));;
    //     },[]
    //   ) ?? [];;
    
    //   const { allOlls, getOllsByGroup, addOllAlg, createOllEmptySlot, swapOllsAlgnumber } = useOll();
    //   const { allPlls, getPllsByGroup, addPllAlg, createPllEmptySlot, swapPllsAlgnumber } = usePll();
      
    const {
        data,
        getAlgsByGroup,
        addAlg,
        createEmptySlot,
        swapAlgNumbers
    } = useAlgs();

    const type = algCasesSet?.details?.id;

    const cases = {
        oll: data.oll.all,
        pll: data.pll.all,
        f2l: data.f2l.all,
    }[type] ?? algCasesSet?.cases ?? [];
    //   console.log("UseCont",allOlls,getOllsByGroup("Dot"))
      
    console.log("CasesType",cases,type)
//    const [selectedCaseSet, setSelectedCaseSet] = useState(null)

    let AllCases = [cpllCaseSet, eollCaseSet, epllCaseSet, f2lCaseSet, ocllCaseSet, ollCaseSet, pllCaseSet]

    let dCrossShown = true

    const { xs } = useWindowDimensions();
    const cubeImageSize = xs ? "100" : "120";


    //const [openGroups, setOpenGroups] = useState({});
    //const [selectedAlg, setSelectedAlg] = useState([])
    const [showPopUpCard, setShowPopUpCard] = useState([])
    //const [AlgCasesSet, setAlgCasesSet] = useState(null);
   // const [AlgGroups, setAlgGroups] = useState([]);

   console.log("SelAlg",selectedAlg,algGroups,algCasesSet)

   

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
        //console.log("ClickedSelG",dbOllCaseSet,group,algCasesSet,selectedAlg,ChosenGroupAlgs)
        
        // if(algCasesSet.details.id!="oll"){
        //     algCasesSet.cases.forEach((alg) => {
        //         if (alg.group == group) {
        //             ChosenGroupAlgs.push(alg)
        //         }
        //     })
        // }
        // else{
        //     dbOllCaseSet.forEach((alg)=>{
        //         if (alg.group == group) {
        //             ChosenGroupAlgs.push(alg)
        //         }
        //     })
        // }
        cases.forEach((alg)=>{
            if(alg.group ==group){
                ChosenGroupAlgs.push(alg)
            }
        })
        const GroupAlgsInSelected = ChosenGroupAlgs.every((alg) => selectedAlg.includes(alg))

        return GroupAlgsInSelected
    }
    const toggleSelectedAlgGroup = (group => {


        let ChosenGroupAlgs = []

        cases.forEach((alg)=>{
            if(alg.group== group){
                ChosenGroupAlgs.push(alg)
            }
        })
        // if(algCasesSet.details.id!="oll" && algCasesSet.details.id!="pll"){
        //     algCasesSet.cases.forEach((alg) => {
        //         if (alg.group == group) {
        //             ChosenGroupAlgs.push(alg)
        //         }
        //     })
        // }
        // else{

        // }
        // }
        // else if(algCasesSet.details.id=="oll"){
        //     dbOllCaseSet.forEach((alg) => {
        //     if (alg.group == group) {
        //         ChosenGroupAlgs.push(alg)
        //     }
        // })
        // }
        // else{
        //     dbPllCaseSet.forEach((alg) => {
        //     if (alg.group == group) {
        //         ChosenGroupAlgs.push(alg)
        //     }
        // })
        // }
       



        const GroupAlgsInSelected = ChosenGroupAlgs.every((alg) => selectedAlg.includes(alg))
        if (GroupAlgsInSelected) {
            setSelectedAlg((prev) => prev.filter((item) => !ChosenGroupAlgs.includes(item)))
        }
        else {

            let AlgsToAdd = ChosenGroupAlgs.filter((item) => !selectedAlg.includes(item))


            setSelectedAlg((prev) => [...prev, ...AlgsToAdd])
        }
    })


    const toggleGroup = (group) => {
        setOpenGroups((prev) => {

            console.log("SetOpen",openGroups,prev)
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

        // if(algCasesSet.details.id!="oll"&& algCasesSet.details.id!="pll"){
        //     return algCasesSet.cases.every(alg => selectedAlg.includes(alg))
        // }
        // else if(algCasesSet.details.id=="oll"){
        //     return dbOllCaseSet.every(alg => selectedAlg.includes(alg))
        // }
        // else{
        //     return dbPllCaseSet.every(alg => selectedAlg.includes(alg))
        // }
        return cases.every(alg => selectedAlg.includes(alg))
        

    }


    const CheckAllAlgs = () => {

        if (AreAllAlgsChecked()) {
            setSelectedAlg([])
        }
        // else {
        //     if(algCasesSet.details.id!="oll"&& algCasesSet.details.id!="pll"){
        //     setSelectedAlg([...algCasesSet.cases])
        //     }
        //     else if(algCasesSet.details.id=="oll"){
        //         setSelectedAlg([...dbOllCaseSet])
        //     }
        //     else{
        //         setSelectedAlg([...dbPllCaseSet])
        //     }
        // }
        setSelectedAlg([...cases])
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
        console.log("HandleShown",alg)

        setShowPopUpCard([alg])
    }

    // useEffect(()=> {
    //     if(caseItem){
    //         if(caseItem.details.id="oll"){
    //             setSelectedCaseSet({
    //                 dbOllCaseSet,
    //                 details: {
    //                     id: "oll"
    //                 }
    //             });
    //         }
    //         else{
    //             setSelectedCaseSet(caseItem)
    //         }
    //     setOpenGroups([])
    //     setSelectedAlg([])
    //     setAlgCasesSet(caseItem)
    //     setAlgGroups([... new Set(caseItem.cases.map(alg => alg.group))])
    //     }
    // },[caseItem,dbOllCaseSet])

    // const handleAlgCaseSetClicked = (caseItem) => {
    //     console.log("Case",dbOllCaseSet)
    //     setCaseClicked(!caseClicked)
    //     if(caseItem.details.id="oll"){
    //         setSelectedCaseSet({
    //             dbOllCaseSet,
    //             details: {
    //                 id: "oll"
    //             }
    //         });
    //     }
    //     else{
    //         setSelectedCaseSet(caseItem)
    //     }
        
    //     setOpenGroups([])
    //     setSelectedAlg([])
    //     setAlgCasesSet(caseItem)
    //     setAlgGroups([... new Set(caseItem.cases.map(alg => alg.group))])
    // }

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

    useEffect(()=>{
        
        let newCaseItem ={
            cases:cases,
            details:type
        }
        // if(algCasesSet.details.id=="oll"){
        //     newCaseItem={
        //         dbOllCaseSet:dbOllCaseSet,
        //         details: {
        //             id: "oll"
        //         }
        //     };
        // }
        // else if(algCasesSet.details.id=="pll"){
        //     newCaseItem={
        //         dbPllCaseSet:dbPllCaseSet,
        //         details: {
        //             id: "pll"
        //         }
        //     };
        // }
        //     else {
        //     newCaseItem = algCasesSet;
        // }
        // console.log("Case2",dbOllCaseSet,algCasesSet)
        setSelectedCaseSet(newCaseItem)
        
    },[cases])




    return <>
        {/* {console.log("Case3",selectedCaseSet,caseClicked,dbOllCaseSet,dbOllCaseSet==true)} */}
        {selectedCaseSet && caseClicked && <div className='container-fluid '>
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
                                const FirstGroupCase = algCasesSet.cases.find(alg => (
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
                                                            caseSetDetails={algCasesSet.details}
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
                                       
                                        {cases.map(alg => {
                                            
                                            return (


                                                alg.group == group && alg.algNumber==0 && openGroups[group] &&
                                                <>

                                                    <tr className={`${darkMode ? "darkRow" : "lightRow"} CasesAlgTableRow ${dCrossShown ? "" : "d-none"}`} role="row" >
                                                        <td onClick={() => { handleAlgCardShown(alg) }}>

                                                        </td>
                                                        <td onClick={() => { handleAlgCardShown(alg) }} className='align-middle' role="columnheader">
                                                            <div>
                                                                <CaseImage
                                                                    size={80}
                                                                    // alg={alg instanceof Array?alg.algs[0]:alg.algs}
                                                                    alg={selectedCaseSet.details=="f2l"?f2lCaseSet.cases[alg.f2lNumber].algs[0]:alg instanceof Array?alg.algs[0]:alg.algs}
                    
                                                                    caseSetDetails={algCasesSet.details}
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
                                                                {alg.order}
                                                            </div>
                                                        
                                                        </td>}
                                                        <td>
                                                            <input style={{ margin: "20px", width: "20px", height: "30px" }} className="align-middle" type="checkbox" checked={selectedAlg.includes(alg)} onChange={() => { toggleSelectedAlg(alg) }}>
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
                    {showPopUpCard.length > 0 && <ShowAlgCard alg={showPopUpCard[0]} algtype={type} onClose={() => setShowPopUpCard([])} algCasesSet={algCasesSet} />}

                </div>}
    </>
}
