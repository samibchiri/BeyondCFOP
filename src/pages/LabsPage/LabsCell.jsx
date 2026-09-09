
import React, { useContext, useState, useEffect, useRef } from "react"; // removed 'use'
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
import Dropdown from "bootstrap/js/dist/dropdown";
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

import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

import { Inverse } from "../../dataGeneration/ArrowDataGenerator.jsx";


export function LabsCell({celltype,cellNumber,cells,setCells,unlinkable,linkedWith,cubeSize,setCubeSize,oll, pll, LastSlotAlgs, shortGroupTable}){
    
    console.log("LabsCellInfo",cells,setCells,cubeSize,setCubeSize,oll, LastSlotAlgs)
    
    const { darkMode } = useContext(ThemeContext)
        
    const mainDropdownRef = useRef(null);

    useEffect(() => {
    if (mainDropdownRef.current) {
        Dropdown.getOrCreateInstance(mainDropdownRef.current);
    }
}, []);

    const [ollRecognitionClicked,setOllRecognitionClicked] = useState(false)
    const [viewClicked,setViewClicked] = useState(false)
     const [viewGroupClicked, setViewGroupClicked]= useState(false)
        

    const [lastSlotClicked,setLastSlotClicked] = useState(false)
    const [preOllAUFClicked,setPreOllAUFClicked] = useState(false)
    const [prePllAUFClicked,setPrePllAUFClicked] = useState(false)
    const [postPllAUFClicked,setPostPllAUFClicked] = useState(false)
    const [algsToSolveClicked,setAlgsToSolveClicked] = useState(false)

     const [caseClicked, setCaseClicked] = useState(false)
        const [buttonClicked, setButtonClicked] = useState(false)
        const [cpClicked, setCpClicked] = useState(false)
        const [barClicked, setBarClicked] = useState(false)
        const [caseItem, setCaseItem] = useState()
        const [showPopUpCard, setShowPopUpCard] = useState([])
        
        const [cpSameOpp,setCpSameOpp] = useState(false)
          
        const [ollGroupClicked, setOllGroupClicked]= useState(false)
        
        const [pllGroupClicked, setPllGroupClicked]= useState(false)

        const [ollNumberGroupList, setOllNumberGroupList] = useState([])

        const crossColorList=[
            "White","Yellow","Red","Orange","Blue","Green"
        ]

        const fullGroupTable = {
        0: "Cross",
        1: "Dot",
        2: "T Shape",
        3: "C Shape",
        4: "I Shape",
        5: "P Shape",
        6: "W Shape",
        7: "Small L Shape",
        8: "Small Lightning Bolt",
        9: "Big Lightning Bolt",
        10: "Square Shape",
        11: "Fish Shape",
        12: "Knight Move Shape",
        13: "Awkward Shape",
        14: "Corners Oriented"
        }

        const AUFList=["No AUF", "U2", "U", "U'"]

        const PllList = [
            "E",
            "Ua",
            "Ra",
            "T",
            "Ga",
            "Na",
            "Ub",
            "Rb",
            "F",
            "Gb",
            "Nb",
            "H",
            "Ja",
            "Aa",
            "Gc",
            "V",
            "Z",
            "Jb",
            "Ab",
            "Gd",
            "Y",
            "",
            "",
            "No pll"
            ];


        const lastSlotSetupLinkedDict={
            "R U R'":[
                "R U' R'","","U R U2 R'","U' R' F R F'","",""
            ],
            "L' U' L":[
                "L' U L","","U' L' U2 L","U L F' L' F","",""
            ],
            "R U' R'":[
                "R U R'","","R U' R' U' R U' R'","R U2 R' U R U2 R'","R U' R' U2 R' F R F'","R U2 R' U' R' F R F'"
            ],
            "L U L'":[
                "L U L'","","","","",""
            ],
            "R U2 R'":[
                "R U2 R'","","","","",""
            ],
            "L' U2 L":[
                "L' U2 L","","","","",""
            ],
            "R' F R F'":[
                "R' F R F'","","","","",""
            ],
            "L F' L' F":[
                "L F' L' F","","","","",""
            ],
        }

        console.log("StartLabsCell",cells,cellNumber)
        if(!cells[cellNumber]){
            return
        }
        
        let tempAlgsToSolveList = [cells[cellNumber].lastSlotAlgSolve,cells[cellNumber].ollAlgSolve, cells[cellNumber].pllAlgSolve]

        let algToSolveList = []

        tempAlgsToSolveList.forEach((alg,i)=>{
            if(alg!=""){
                console.log("AlgsSOlve",i)
                if(i==0){
                    algToSolveList.push("Last Slot")
                }
                if(i==1){
                    algToSolveList.push("OLL")
                }
                if(i==2){
                    algToSolveList.push("PLL")
                }
                
            }
        })

        const LastSlotSetupInputRef= useRef(null)

        const PreOLLSetupInputRef= useRef(null)

        const AlgsToSolveLastSlotInputRef= useRef("")
        const AlgsToSolveOllInputRef= useRef("")
        const AlgsToSolvePllInputRef= useRef("")
        
        const ollCaseSetByGroup = useRef([])

        const dbOllCaseSet = useLiveQuery(()=>{
                
            return db.olls.toArray().then(arr => arr.sort(sortOlls));;
        },[]
        );


        const hideDropDown = () => {
            console.log("HideDropdown",mainDropdownRef.current)
            if (!mainDropdownRef.current) return;

            Dropdown.getOrCreateInstance(mainDropdownRef.current).hide();
        };

        const toggleDropDown = () => {
            // console.log("ShowDropdown",mainDropdownRef.current)
            if (!mainDropdownRef.current) return;

            Dropdown.getOrCreateInstance(mainDropdownRef.current).toggle();
        };

        const handleOutsideClick = () => {
    console.log("Dropdown is closing");
};

        useEffect(() => {
        const button = mainDropdownRef.current;

        if (!button) return;

        const handleHide = () => {
            console.log("Clicked outside / dropdown closing");
            handleOutsideClick();
        };

        button.addEventListener("hide.bs.dropdown", handleHide);

        return () => {
            button.removeEventListener("hide.bs.dropdown", handleHide);
        };
    }, []);

            const handleBackClicked = ()=>{
                navigate("/train")
            }
        
            const handleKeyPressed = (location)=>{
                console.log("KeyPressed",location)
            }
            const handleLastSlotSetupClicked = (value)=>{


                let newLastSlotSetupAlg=value

                console.log("CheckGrid",cells[cellNumber],cells[cellNumber].gridNumber)
                
                if(cells[cellNumber].linkedHead==true && linkedWith[1]=="LastSlot"){
                    console.log("LinkedWith",linkedWith, cells[cellNumber])
                    setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    for(let i=0;i<6;i++){
                        console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                        newCells[cellNumber+i].lastSlotAlgSetup=value
                        newCells[cellNumber+i].lastSlotAlgSolve=lastSlotSetupLinkedDict[value][i]
                    }
                    
                    
                    return newCells
                })
                    
                }
                else{
                      setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    
                    newCells[cellNumber].lastSlotAlgSetup=value
                    return newCells
                })
                }
                
            
            }

            const handleViewClicked = (value)=>{
                setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    let newView=""
                    if(value=="Last Layer"){
                        newView="plan"
                    }
                    newCells[cellNumber].view=newView
                    
                    return newCells
                })
                setViewGroupClicked(false)
                hideDropDown()
            }

            const handleCrossColorClicked =(value)=>{
                
                console.log("ChangeCross",value)
                setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    newCells[cellNumber].crossColor=value
                    
                    return newCells
                })
                setViewGroupClicked(false)
                hideDropDown()
            }
        
            const handlePreOLLSetupClicked = (value)=>{
                
                
                if(cells[cellNumber].linkedHead==true && (linkedWith[1]=="LastSlot"||linkedWith[1]=="OLL" ||linkedWith[1]=="PLL")){
                    console.log("LinkedWith",linkedWith, cells[cellNumber])
                    setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    if(value=="No AUF"){
                        value=""
                    }

                    for(let i=0;i<6;i++){
                        newCells[cellNumber+i].preOllAUFSetup=value
                    }
                    
                    return newCells
                })
                    
                }
                else{
                    setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    if(value=="No AUF"){
                        value=""
                    }
                    newCells[cellNumber].preOllAUFSetup=value

                    return newCells
                })
                }
                

                
            }
        
            const handleOLLSetupClicked1 = (value)=>{
                console.log("ClickedSetup1",ollGroupClicked,value)
                if(ollGroupClicked!=false){
                    setOllGroupClicked(false)
                }
                else{
                    setOllGroupClicked("Group")
                }
                
            }
            const handleOLLSetupClicked2 = (value)=>{
                if(value==null){
                    // OllNumber/AlgNumber is null if No Oll
                    // console.log("ResetOLL",value,ollNumber,algNumber)

                    if(cells[cellNumber].linkedHead==true && (linkedWith[1]=="LastSlot"||linkedWith[1]=="OLL" ||linkedWith[1]=="PLL")){
                        // console.log("LinkedWith",linkedWith, cells[cellNumber])
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].ollAlgSetupNumber=null
                            newCells[cellNumber+i].ollAlgNumber=null
                        }
                        
                        return newCells
                    })
                        
                    }
                    else{
                        setCells((prev)=>{
                    
                        let newCells=[...prev]

                        newCells[cellNumber].ollAlgSetupNumber=null
                        newCells[cellNumber].ollAlgNumber=null
                        return newCells
                        })
                        setOllGroupClicked(false)
                    }
                    
                }
                else{
                console.log("ClickedSetup2",value)
                let groupNumber= value.split(" ")[1]
                ollCaseSetByGroup.current= dbOllCaseSet.filter((oll)=>oll.group===fullGroupTable[Number(groupNumber)-1])
                let ollNumberList=[]
                ollCaseSetByGroup.current.forEach(oll => {
                    
                    ollNumberList.push([oll.ollNumber,oll.algNumber])
                    
                });
                console.log("OLLAlgList",value,groupNumber,ollNumberList,ollCaseSetByGroup.current)
            
                
                setOllNumberGroupList(ollNumberList)
                setOllGroupClicked("OLL")
                }
            }

              const handleOLLSetupClicked3 = (cellNumber,ollNumber,algNumber)=>{
                
                console.log("LinkedWithOLL2",linkedWith, cells[cellNumber])
                if(cells[cellNumber].linkedHead==true && (linkedWith[1]=="LastSlot"||linkedWith[1]=="OLL"|| linkedWith[1]=="PLL")){
                        console.log("LinkedWithOLL",linkedWith, cells[cellNumber])
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].ollAlgSetupNumber=ollNumber
                            newCells[cellNumber+i].ollAlgNumber=algNumber
                            if(linkedWith[1]=="PLL"){
                                if(i>1){
                                    const specificOLLDB = dbOllCaseSet?.filter((alg)=>alg.ollNumber==cells[cellNumber].ollAlgSetupNumber)
        

                                    console.log("Cells6",cells,specificOLLDB,dbOllCaseSet,cells[cellNumber].ollAlgSetupNumber,cells[cellNumber].ollAlgNumber)

                                    let altOLL = ""

                                    console.log("Check",specificOLLDB,specificOLLDB?.length, cells[cellNumber].ollAlgNumber)
                                    console.log("Check2",0< specificOLLDB?.length, cells[cellNumber].ollAlgNumber< specificOLLDB?.length , cells[cellNumber].ollAlgNumber!=="")
                                    if(0< specificOLLDB?.length ){
                                        console.log("NewAlg2",specificOLLDB, cells[cellNumber]?.ollAlgNumber)
                                        
                                         
                                        if(algNumber==1){
                                            altOLL = specificOLLDB?.[0].algs
                           
                                            newCells[cellNumber+i].ollAlgSolve=altOLL
                                            if(specificOLLDB?.[0].altAUF.length>0){
                                                newCells[cellNumber+i].preOllAUFSetup=specificOLLDB?.[0].altAUF[0]
                                            }
                                            
                                        }
                                        else{
                                            if(1< specificOLLDB?.length ){
                                                altOLL = specificOLLDB?.[1].algs
                                                
                                                newCells[cellNumber+i].ollAlgSolve=altOLL
                                                if(specificOLLDB?.[1].altAUF.length>0){
                                                newCells[cellNumber+i].preOllAUFSetup=specificOLLDB?.[1].altAUF[0]
                                            }
                                            }
                                            else{
                                                altOLL = specificOLLDB?.[0].algs
                                                console.log("NOAltOLL",altOLL)
                                                newCells[cellNumber+i].ollAlgSolve=""
                                            }
                                            
                                        }
                                    }
 
                                   
                                    
                                }
                            }
                           
                        }
                        
                        return newCells
                    })
                        
                }
                else{
                    setCells((prev)=>{
                
                    let newCells=[...prev]
                    
                    newCells[cellNumber].ollAlgSetupNumber=ollNumber
                    newCells[cellNumber].ollAlgNumber=algNumber
                    
                    console.log("Updated5",newCells)
                        return newCells
                    })
                }

                
                
              
              setOllGroupClicked(false)
                
                }
                
                
            const handlePrePLLSetupClicked = (value)=>{
                
                if(cells[cellNumber].linkedHead==true && (linkedWith[1]=="OLL"|| linkedWith[1]=="PLL")){
                        console.log("LinkedWithOLL",linkedWith, cells[cellNumber])
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        if(value=="No AUF"){
                            value=""
                        }
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].prePllAUFSetup=value
                        }
                        
                        return newCells
                    })
                        
                }
                else{
                    setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    if(value=="No AUF"){
                        value=""
                    }

                    newCells[cellNumber].prePllAUFSetup=value


                    return newCells
                })
                }

                
            }
            const handlePLLSetupClicked1 = (value)=>{
                console.log("PLLClickedSetup1",ollGroupClicked,value)
                
                if(pllGroupClicked!=false){
                    setPllGroupClicked(false)
                }
                else{
                    console.log("PLLClickedSetup15",ollGroupClicked,value)
                    setPllGroupClicked("Group")
                }
                
            }
            const handlePLLSetupClicked2 = (value)=>{
                console.log("PLLClickedSetup2",pllCaseSet,value)
                pllCaseSet.cases.forEach((pll)=>{
                    console.log("JbError",pll.name,pll.name.split(" ")[0],pll.name.split(" ")[0]=="Ub")
                })

                if(cells[cellNumber].linkedHead==true && (linkedWith[1]=="OLL")){
                        console.log("LinkedWithOLL",linkedWith, cells[cellNumber])
                        if(value=="No pll"){
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        newCells[cellNumber].pllAlgSetup=""
                        console.log("Updated25",newCells)
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].pllAlgSetup=""
                            newCells[cellNumber+i].pllName=""
                        }
                        setPllGroupClicked(false)
                        hideDropDown()
                        return newCells
                    })

                    }
                    let newPLL = pllCaseSet.cases.find((pll)=>pll.name.split(" ")[0]==value)
                    
                    let pllAlg= newPLL.algs[0]
                    
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
  
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].pllAlgSetup=pllAlg
                            newCells[cellNumber+i].pllName=newPLL.name.split(" ")[0]
                        }
                        
                        return newCells
                    })
                        
                }
                else{
                    
                    if(cells[cellNumber].linkedHead==true && (linkedWith[1]=="PLL")){
                    
                            console.log("LinkedWithOLL",linkedWith, cells[cellNumber])
                        if(value=="No pll"){
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        newCells[cellNumber].pllAlgSetup=""
                        console.log("Updated25",newCells)
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].pllAlgSetup=""
                            newCells[cellNumber+i].pllName=""
                        }
                        setPllGroupClicked(false)
                        hideDropDown()
                        return newCells
                    })

                    }
                    let newPLL = pllCaseSet.cases.find((pll)=>pll.name.split(" ")[0]==value)
                    
                    let pllAlg= newPLL.algs[0]
                    
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
  
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].pllAlgSetup=pllAlg
                            newCells[cellNumber+i].pllName=newPLL.name.split(" ")[0]
                            if(i>2){
                                console.log("AUFList",AUFList[i-2])
                                newCells[cellNumber+i].prePllAUFSetup=AUFList[i-2]
                            }
                            
                        }
                        
                        return newCells
                    })
                    }
              
                    else if(value=="No pll"){
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        newCells[cellNumber].pllAlgSetup=""
                        newCells[cellNumber].pllName=""
                        console.log("Updated25",newCells)
                        setPllGroupClicked(false)
                        hideDropDown()
                        return newCells
                    })

                    }
                    let pll = pllCaseSet.cases.find((pll)=>pll.name.split(" ")[0]==value)
                    
                    let pllAlg= pll.algs[0]

                    console.log("PLLAlg",pllAlg)
                    setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        newCells[cellNumber].pllAlgSetup=pllAlg
                        newCells[cellNumber].pllName=pll.name.split(" ")[0]
                        console.log("Updated5",newCells)
                        return newCells
                    })

                }
                setPllGroupClicked(false)
                hideDropDown()
            }

            const handlePLLSetupClicked3 = (cellNumber,ollNumber,algNumber)=>{
                
                setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    newCells[cellNumber].ollAlgSetupNumber=ollNumber
                    newCells[cellNumber].ollAlgNumber=algNumber
                    
                    console.log("Updated5",newCells,ollNumber,algNumber)
                    return newCells
                })
              
              setOllGroupClicked(false)
                }

            const handlePLLClicked = (value)=>{
                console.log("ClickedSetup",value)
            }
        
            const handlePostPLLSetupClicked = (value)=>{
                
                if(cells[cellNumber].linkedHead==true && (linkedWith[1]=="OLL")){
                        console.log("LinkedWithOLL",linkedWith, cells[cellNumber])
                        setCells((prev)=>{
                        
                        let newCells=[...prev]
                        
                        if(value=="No AUF"){
                            value=""
                        }
                        for(let i=0;i<6;i++){
                            // console.log("CellNumberLastSlot",cellNumber,i,lastSlotSetupLinkedDict[value][i],lastSlotSetupLinkedDict[value])
                            newCells[cellNumber+i].postPllAUFSetup=value
                        }
                        
                        return newCells
                    })
                        
                }
                else{
                    setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    if(value=="No AUF"){
                        value=""
                    }
                    newCells[cellNumber].postPllAUFSetup=value


                    return newCells
                
                })
                }

                
            }

            const handleResetClicked = ()=>{
                
                setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    newCells[cellNumber]=defaultCellInfo(cellNumber,false)


                    return newCells
                })
            }
            const handleAlgsToSolveSaveClicked = ()=>{

                setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    newCells[cellNumber].lastSlotAlgSolve=AlgsToSolveLastSlotInputRef.current.value
                    newCells[cellNumber].ollAlgSolve=AlgsToSolveOllInputRef.current.value
                    console.log("InputPLLSOLVe2",AlgsToSolvePllInputRef.current.value)
                    if(AlgsToSolvePllInputRef.current.value.length<3){
                        console.log("InputPLLSOLVe",AlgsToSolvePllInputRef.current.value)
                        let newPLL = pllCaseSet.cases.find((pll)=>pll.name.split(" ")[0].toLowerCase()==AlgsToSolvePllInputRef.current.value.toLowerCase())
                    
                        console.log("InputPLLSOLVe",AlgsToSolvePllInputRef.current.value,newPLL)
                        if(newPLL){
                            let pllAlg= newPLL.algs[0]
                            newCells[cellNumber].pllAlgSolve=pllAlg
                        }
                        else{
                            newCells[cellNumber].pllAlgSolve=""
                        }
                        
                    }
                    else{
                        newCells[cellNumber].pllAlgSolve=AlgsToSolvePllInputRef.current.value
                    }
                    


                    return newCells
                })

                console.log("AlgsToSolve",AlgsToSolveLastSlotInputRef.current.value,AlgsToSolveOllInputRef.current.value,AlgsToSolvePllInputRef.current.value)
            
                if (AlgsToSolveLastSlotInputRef.current) {
                AlgsToSolveLastSlotInputRef.current.value = "";
            }

            if (AlgsToSolveOllInputRef.current) {
                AlgsToSolveOllInputRef.current.value = "";
            }

            if (AlgsToSolvePllInputRef.current) {
                AlgsToSolvePllInputRef.current.value = "";
            }

            setAlgsToSolveClicked(false)
            }
            
            

            const handleChainedClicked = ()=>{

            }
            

            const handleDeletedClicked =(cellNumber)=>{

                console.log("Deleted",cells,cellNumber)
                setCells((prev)=>{
                    
                    let newCells=[...prev]
                    
                    newCells[cellNumber].hidden=true
                    // console.log("Deleted2",newCells,cellNumber,(!newCells[cellNumber].hidden))
                    return newCells})

            }
        
            
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

        const specificOLLDB = dbOllCaseSet?.filter((alg)=>alg.ollNumber==cells[cellNumber].ollAlgSetupNumber)
        

        console.log("Cells6",cells,specificOLLDB,dbOllCaseSet,cells[cellNumber].ollAlgSetupNumber,cells[cellNumber].ollAlgNumber)

        let alg = ""
        let tempOllAlg = ""

        console.log("Check",specificOLLDB,specificOLLDB?.length, cells[cellNumber].ollAlgNumber)
        console.log("Check2",0< specificOLLDB?.length, cells[cellNumber].ollAlgNumber< specificOLLDB?.length , cells[cellNumber].ollAlgNumber!=="")
        if(0< specificOLLDB?.length && cells[cellNumber].ollAlgNumber< specificOLLDB?.length && cells[cellNumber]?.ollAlgNumber!=="" ){
            console.log("NewAlg2",specificOLLDB, cells[cellNumber]?.ollAlgNumber)
            tempOllAlg = specificOLLDB?.[cells[cellNumber]?.ollAlgNumber]?.algs
            console.log("NewAlg",tempOllAlg, oll,cellNumber)
        }
        else{
            alg = ""
        }

        if(tempOllAlg==null ||tempOllAlg==undefined){
            tempOllAlg=""
        }

        let crossColorRotationDict={
            "White":"",
            "Yellow":"z2",
            "Red":"z",
            "Orange":"z'",
            "Blue":"x'",
            "Green":"x"
        }
        let crossColorRotation=""
        console.log("BadRotation",crossColorRotationDict[cells[cellNumber].crossColor],cells[cellNumber].crossColor)
        // alg =  cells[cellNumber].lastSlotAlgSetup+tempOllAlg
        // console.log("InverseTest",cells[cellNumber].lastSlotAlgSolve,Inverse(cells[cellNumber].lastSlotAlgSolve))
        console.log("Updated6",cells,cellNumber,cells[cellNumber])
        console.log("LastSlotSetupSolve",cellNumber,cells[cellNumber].lastSlotAlgSetup,"Solve",cells[cellNumber].lastSlotAlgSolve) 
        
        alg = Inverse(cells[cellNumber].pllAlgSolve)+ Inverse(cells[cellNumber].ollAlgSolve) + Inverse(cells[cellNumber].lastSlotAlgSolve)
            +Inverse(cells[cellNumber].lastSlotAlgSetup)+ Inverse(cells[cellNumber].preOllAUFSetup)+tempOllAlg+ Inverse(cells[cellNumber].prePllAUFSetup)
                +cells[cellNumber].pllAlgSetup+ Inverse(cells[cellNumber].postPllAUFSetup)
                +crossColorRotationDict[cells[cellNumber].crossColor]
    return (
        <div className="LabsCell">
                                    <div className="LabsTrashButtonCont">
                                        <button className='LabsTrashButton' onClick={()=>handleDeletedClicked(cellNumber)}>
                                                <FaIcon icon="trash" style={{ color: "white", fontSize: "20px" }} />
                                            </button>
        
                                    </div>
                                    <div className="LabsCopyButtonCont">
                                            <div className="LabsCellNumberCont">
                                                <h4 className="LabsCellNumber">{cellNumber+1}</h4>
                                            </div>
                                            
                                            <div className='navbar-nav ms-auto'>
                                                    <ul className="navbar-nav">
                                                      <li className='nav-item dropdown ms-ltr-5 list-unstyled'>
                                            
                                            
                                            <button className={`LabsCopyButton dropdown-toggle ${darkMode ? "btn-dark border-2 btn-back-dark" : "btn-secondary border-2 border-dark btn-back-light"} border border-2 btn `}
                                             data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                data-bs-auto-close="outside"
                                                >
                                                <FaIcon icon="copy"></FaIcon>
                                            </button>
                                            <ul className="dropdown-menu LabsCellNumberDropdownCont">
                                                <h4 className="LabsCellCopyNumberHeader">Which cell <br></br>to copy? </h4>
                                                   <li>
                                                    <hr className="dropdown-divider LabsCellCopyNumberDivider" />
                                                </li>
        
                                                <li className="LabsCellCopyNumberCont">
                                                    {cells.map((cell)=>
                                                        
                                                        <LabsCellCopyNumber cells={cells} setCells={setCells} cellNumber={cellNumber} text={cell.cellNumber}></LabsCellCopyNumber>
                                                    )

                                                    }
                                                    {/* <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
              
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
        
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
                                                    
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
        
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
        
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber> */}
                                                                   
                                            </li>
        
        
                                             </ul>
                                            </li>
                                            </ul>
                                            </div>
                                            {linkedWith.length==0 &&<div className='navbar-nav ms-auto'>
                                                    <ul className="navbar-nav">
                                                      <li className='nav-item dropdown ms-ltr-5 list-unstyled'>
                                            
                                            
                                            <button className={`LabsLinkButton dropdown-toggle ${darkMode ? "btn-dark border-2 btn-back-dark" : "btn-secondary border-2 border-dark btn-back-light"} border border-2 btn `}
                                             data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                data-bs-auto-close="outside"
                                                >
                                                <FaIcon icon="link"></FaIcon>
                                            </button>
                                            <ul className="dropdown-menu LabsLinkDropdownCont">
                                                <div className="CellLinkQuestionCont">
                                                        <h4 className="LabsCellCopyNumberHeader">Which part <br></br>to link? <button className="LabsHintChainButton"><FaIcon icon="question"></FaIcon></button></h4>
                                                         
                                           
                                                    <LabsLastSlotButton text={`Last Slot`}></LabsLastSlotButton>
                                                    <div style={{marginTop:"10px"}}></div>
                                                    <LabsLastSlotButton text={"Oll"}></LabsLastSlotButton>
                                                    <div style={{marginTop:"10px"}}></div>
                                                    <LabsLastSlotButton text={"Pll"}></LabsLastSlotButton>

        
                                                </div>
                                                <li style={{marginTop:"20px"}}>
                                                    <hr className="dropdown-divider LabsCellCopyNumberDivider" />
                                                </li>
                                                <h4 className="LabsCellCopyNumberHeader">Which cell <br></br>to link? </h4>
                                                   <li>
                                                    <hr className="dropdown-divider LabsCellCopyNumberDivider" />
                                                </li>
        
                                                <li className="LabsCellCopyNumberCont">
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
              
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
        
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
                                                    
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
        
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
        
                                                    <LabsCellCopyNumber text={"111"}></LabsCellCopyNumber>
                                                                   
                                            </li>
        
        
                                             </ul>
                                            </li>
                                            </ul>
                                            </div>}
                                        </div>
        
        
                                    <div className="LabsPopUpCont" >
                                        
                                        <div className='navbar-nav ms-auto'>
                                                    <ul className="navbar-nav">
                                                      <li className='nav-item dropdown ms-ltr-5 list-unstyled'>
                                            <button className={`LabsInfoButton dropdown-toggle ${darkMode ? "btn-dark border-2 btn-back-dark" : "btn-secondary border-2 border-dark btn-back-light"} border border-2 btn `}  
                                                ref={mainDropdownRef}
                                                onClick={toggleDropDown}
                                                id={`navbarDropdown-${cellNumber}`}
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                data-bs-auto-close="outside"
                                                
                                            >
                                                
                                            </button>
                                                        <ul className={`LabsDropDownMenu dropdown-menu`} aria-labelledby={`navbarDropdown-${cellNumber}`}>
                                                        <li  className="dropdown LabsNestedDropdown">
        
                                                            <button onClick={()=>setOllRecognitionClicked((prev)=>!prev)}className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >Oll Recognition</button>
        
                    
                                                      {/* <div  className="dropdown-menu LabsLastSlotGroupCont" > */}
                                                            <div style={{display: ollRecognitionClicked ? "grid" : "none"}} className="LabsLastSlotGroupMenu">
                                                               
                                                                                                                           
                                                               <LabsLastSlotButton text={"Nothing"}></LabsLastSlotButton>
                                                               <LabsLastSlotButton text={"Bar Movement"}></LabsLastSlotButton>
                                                                <LabsLastSlotButton text={"Cp Easy"}></LabsLastSlotButton>
                                                               <LabsLastSlotButton text={"Cp Same Opp"}></LabsLastSlotButton>
                                                           
                                                           <LabsLastSlotButton text={"Cp Lowest Pen"}></LabsLastSlotButton>
                                                           
                                                           </div>
                                                                  
                                                        {/* </div> */}
                                                        </li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li  className="dropdown LabsNestedDropdown">
        
                                                            <button onClick={()=>setViewClicked((prev)=>!prev)}className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >View </button>
        
                    
                                                      {/* <div style={{display: viewClicked ? "block" : "none"}} className="LabsLastSlotGroupCont" > */}
                                                            <div style={{display: viewClicked ? "grid" : "none"}}  className="LabsOneColumnGroupMenu">
                                                               
                                                                                                                           
                                                            <LabsLastSlotButton onClick={handleViewClicked} text={"F2L"} width={"130px"}></LabsLastSlotButton>
                                                            <LabsLastSlotButton onClick={handleViewClicked} text={"Last Layer"} width={"130px"}></LabsLastSlotButton>
                                                            <LabsLastSlotButton onClick={()=>{setViewGroupClicked(prev=>!prev),setViewClicked(prev=>!prev)}} text={"Change Cross Color"} width={"130px"}></LabsLastSlotButton>
                                                                
                                                           </div>
                                                                  
                                                        {/* </div>    */}
                                                        <div style={{display:`${viewGroupClicked?"grid":"none"}`}} className="dropdown-menu LabsOLLAlgMenu ">

                                                                    {crossColorList.map((color) =>{
                                                                        // console.log("Test3",ollCaseSetByGroup.current,ollCaseSetByGroup.current?.find((oll)=>oll.ollNumber===ollNumber)?.algs)
                                                                        return(
                                                                        <LabsLastSlotButton onClick={handleCrossColorClicked} text={color}></LabsLastSlotButton>
                                                                        )   
                                                                    })}
                                                            </div>
                                                        </li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li style={{marginTop:"30px"}}>
                                                             <button disabled={true} className="dropdown-item LabsDropDownItem"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{fontWeight:"700", borderBottomLeftRadius:"6px",borderBottomRightRadius:"6px"}}
                                                        >Setup</button>
                                                        </li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li className="dropdown LabsNestedDropdown">
        
                                                            <button onClick={()=>setLastSlotClicked((prev)=>!prev)} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                    
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >Last Slot {`${cells[cellNumber].lastSlotAlgSetup!=""?`(${cells[cellNumber].lastSlotAlgSetup})` :""}`}</button>
                                                                {/* <div className="dropdown-menu LabsOLLMenu"> */}
                                                                {console.log("GroupClicked",shortGroupTable,ollGroupClicked,ollGroupClicked=="Group")}
                                                                <div style={{display: lastSlotClicked ? "flex" : "none"}} className="flex-column">
                                                                <div style={{display: lastSlotClicked ? "grid" : "none"}} className="LabsLastSlotGroupMenu">
                                                               
                                                                {LastSlotAlgs.map((alg)=>(
                                                                    <LabsLastSlotButton onClick={handleLastSlotSetupClicked} text={alg}></LabsLastSlotButton>
                                                                ))}
                                                                {/* <li className="dropdown LabsNestedDropdown"> */}
        
                                                            {/* <button onClick={()=>setLastSlotClicked((prev)=>!prev)} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >Last Slot {`${cells[cellNumber]?.lastSlotAlgSetup!=""?cells[cellNumber]?.lastSlotAlgSetup:""}`}</button>
                                                        {console.log("WTF",lastSlotClicked,ollRecognitionClicked)}
                                                        <div style={{display: lastSlotClicked ? "block" : "none"}} className="dropdown-menu LabsLastSlotGroupCont" >
                                                            
                                                            
                                                            <div className="LabsLastSlotGroupMenu"></div> */}
                                                                
                                                                </div>
                                                                    <div className="LabsLastSlotInputCont">
                                                                            <input onKeyDown={()=>handleKeyPressed("LastSlotSetup")} ref={LastSlotSetupInputRef} className="LastSlotCustomInput"></input>
                                                                        <div id="buttonSaveAndCopy1">
                                                                        
                                                                        <button onClick={() => handleLastSlotSetupClicked(LastSlotSetupInputRef.current?.value ?? "")} className="LabsLastSlotButtonSave" >Save
                                                                        </button>
                                                                    </div>
                                                                    </div>
                                                                  
                                                                
                                                        </div>
                                                                             <div className="dropdown-menu LabsLastSlotGroupCont" >
                                                            <div className="LabsLastSlotGroupMenu">
        
                                                            
                                                                   <LabsLastSlotButton text={"Hi"}></LabsLastSlotButton>
                                                                   <LabsLastSlotButton text={"Bye"}></LabsLastSlotButton>
                                                                          <LabsLastSlotButton text={"Hi"}></LabsLastSlotButton>
                                                                   <LabsLastSlotButton text={"Bye"}></LabsLastSlotButton>
        
                                                                </div>
                                                                   <div className="LabsLastSlotInputCont">
                                                                         <input className="LastSlotCustomInput"></input>
                                                                    <div id="buttonSaveAndCopy1">
                                                                    
                                                                    <button className="LabsLastSlotButtonSave" >Save
                                                                    </button>
                                                                   </div>
                                                                  
                                                                
                                                                        </div>
                                                        </div>
                                                        </li>
        
                                                        <li><hr className="dropdown-divider" /></li>
        
                                                        <li className="dropdown LabsNestedDropdown">
        
                                                            <button onClick={()=>setPreOllAUFClicked((prev)=>!prev)} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >Pre-OLL AUF {`${cells[cellNumber].preOllAUFSetup!=""?`(${cells[cellNumber].preOllAUFSetup})` :""}`}</button>
                                                                {/* <div className="dropdown-menu LabsOLLMenu"> */}
                                                                {console.log("GroupClicked",shortGroupTable,ollGroupClicked,ollGroupClicked=="Group")}
                                                                {/* <div style={{display: lastSlotClicked ? "flex" : "none"}} className="flex-column"> */}
                                                                <div style={{display: preOllAUFClicked ? "grid" : "none"}} className="LabsLastSlotGroupCont">
                                                               
                                                                {AUFList.map((alg)=>(
                                                                    <LabsLastSlotButton onClick={handlePreOLLSetupClicked} text={alg}></LabsLastSlotButton>
                                                                ))}
                                       {/* <button onClick={()=>setLastSlotClicked((prev)=>!prev)} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                    
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >Last Slot {`${cells[cellNumber].ollAlgSetupNumber!=""?`(OLL ${cells[cellNumber].ollAlgSetupNumber}-${cells[cellNumber].ollAlgNumber})` :""}`}</button>
                                                                {/* <div className="dropdown-menu LabsOLLMenu"> */}
                                                                {/* {console.log("GroupClicked",shortGroupTable,ollGroupClicked,ollGroupClicked=="Group")}
                                                                <div style={{display: lastSlotClicked ? "flex" : "none"}} className="flex-column">
                                                                <div style={{display: lastSlotClicked ? "grid" : "none"}} className="LabsLastSlotGroupCont">
                                                                */}
             
                                                                    {/* <div style={{display: ollPreAUFClicked ? "grid" : "none"}} className="dropdown-menu LabsLastSlotGroupCont" > */}
                                                           {/* {AUFGrid({onClick:handlePreOLLSetupClicked})} */}
                                                           {/* {AUFList.map((alg)=>(
                                                                   <LabsLastSlotButton onClick={handlePreOLLSetupClicked} text={alg}></LabsLastSlotButton>
                                                               ))} */}
                                                         
                                                                  
                                                        </div>
                                                        </li>
        
                                                       <li><hr className="dropdown-divider" /></li>
        
                                                          <li className="dropdown LabsNestedDropdown">
        
                                                            <button onClick={()=>{handleOLLSetupClicked1()}} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                    
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >OLL Group {`${cells[cellNumber].ollAlgSetupNumber!=""&&cells[cellNumber].ollAlgSetupNumber?`(OLL ${cells[cellNumber].ollAlgSetupNumber}-${cells[cellNumber].ollAlgNumber})` :""}`}</button>
                                                                {/* <div className="dropdown-menu LabsOLLMenu"> */}
                                                                {console.log("GroupClicked",shortGroupTable,ollGroupClicked,ollGroupClicked=="Group")}
                                                                <div style={{display:`${ollGroupClicked=="Group"?"grid":"none"}`}} className="LabsOLLGroupMenu">
                                                                    {/* <button  className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                           
                                           style={{
                                         
                                                ...ContinueButtonstyle,
        
                                                "--bs-border-style": "solid",
                                                "--bs-border-color": "white",
                                                "--bs-btn-hover-border-color": "red",
                                                "--bs-btn-focus-border-color": "red",
                                                "--bs-btn-active-border-color": "red",
                                            
                                                                    }}
                                                                    >Group 1</button> */}
                                                                    {Object.entries(shortGroupTable).map(([i, group]) => {
                                                                        let GroupNumber= Number(i)+1
                                                                        console.log("GroupNum",group, i,GroupNumber)
                                                                        return <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={`Group ${GroupNumber}`} subtext={group}></LabsOllGroupButton>
                                                                    })}
                                                                    
                                                                     <div></div>
                                                                      <div></div>
                                                                    <LabsOllGroupButton onClick={()=>handleOLLSetupClicked2(null)} text={`No OLL`}></LabsOllGroupButton>
                                                                    {/* <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={``}></LabsOllGroupButton> */}
                                                                    {/* <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={``}></LabsOllGroupButton> */}
                                                                     


                                                                    {/* <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 1"} subtext={"Small Bolt"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 2"} subtext={"Knight Move"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 3"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 4"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 5"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 6"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 7"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 8"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 9"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 10"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 11"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 12"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 13"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 14"}></LabsOllGroupButton>
                                                                    <LabsOllGroupButton onClick={handleOLLSetupClicked2} text={"Group 15"} subtext={"Knight Move"}></LabsOllGroupButton> */}
                                                                </div>
                                                                    {console.log("Test2",ollGroupClicked,ollGroupClicked=="Oll")}
                                                                <div style={{display:`${ollGroupClicked=="OLL"?"grid":"none"}`}} className="dropdown-menu LabsOLLAlgMenu ">
                                                                    {/* <button  className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                           
                                           style={{
                                         
                                                ...ContinueButtonstyle,
        
                                                "--bs-border-style": "solid",
                                                "--bs-border-color": "white",
                                                "--bs-btn-hover-border-color": "red",
                                                "--bs-btn-focus-border-color": "red",
                                                "--bs-btn-active-border-color": "red",
                                            
                                                                    }}
                                                                    >Group 1</button> */}
                                                                    {ollNumberGroupList.map(([ollNumber,algNumber])=>{
                                                                        console.log("Test3",ollCaseSetByGroup.current,ollCaseSetByGroup.current?.find((oll)=>oll.ollNumber===ollNumber)?.algs)
                                                                        return(
                                                                        <LabsOllAlgButton cellNumber={cellNumber} onClick={handleOLLSetupClicked3} ollNumber={ollNumber} algNumber={algNumber} text={`OLL ${ollNumber}-${algNumber}`} oll={ollCaseSetByGroup.current?.find((oll)=>oll.ollNumber===ollNumber)?.algs}></LabsOllAlgButton>
                                                                        )   
                                                                    })}
                                                                   
                                                                    {/* <LabsOllAlgButton text={"Alg 2"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 3"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 4"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 5"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 6"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 7"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 8"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton> */}
                                                                </div>
        {/* 
                                                                <hr className="dropdown-divider" />
        
                                                                <div className="LabsOLLGrid">
                                                                    <button>OLL 51</button>
                                                                    <button>OLL 52</button>
                                                                    <button>OLL 53</button>
                                                                    <button>OLL 54</button>
                                                                    <button>OLL 55</button>
                                                                    <button>OLL 56</button>
                                                                </div> */}
        
                                                            {/* </div> */}
                                                          </li>
                                                          <li><hr className="dropdown-divider" /></li>
                                                           <li className="dropdown LabsNestedDropdown">
        
                                                            <button onClick={()=>setPrePllAUFClicked((prev)=>!prev)} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >Pre-PLL AUF {`${cells[cellNumber].prePllAUFSetup!=""?`(${cells[cellNumber].prePllAUFSetup})` :""}`}</button>
                                                                {/* <div className="dropdown-menu LabsOLLMenu"> */}
                                                                {console.log("GroupClicked",shortGroupTable,ollGroupClicked,ollGroupClicked=="Group")}
                                                                {/* <div style={{display: lastSlotClicked ? "flex" : "none"}} className="flex-column"> */}
                                                                <div style={{display: prePllAUFClicked ? "grid" : "none"}} className="LabsLastSlotGroupCont">
                                                               
                                                                {AUFList.map((alg)=>(
                                                                    <LabsLastSlotButton onClick={handlePrePLLSetupClicked} text={alg}></LabsLastSlotButton>
                                                                ))}
                                                                </div>
                                                                  
                                                        
                                                        </li>
        
                                                       <li><hr className="dropdown-divider" /></li>
        
                                                            <li className="dropdown LabsNestedDropdown">
        
                                                            <button onClick={()=>{handlePLLSetupClicked1()}} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >PLL Group {cells[cellNumber].pllName!=""?`(${cells[cellNumber].pllName})`:""}</button>
                                                                {/* <div className="dropdown-menu LabsOLLMenu"> */}

                                                                <div style={{display:`${pllGroupClicked=="Group"?"grid":"none"}`}} className="LabsPLLGroupMenu">
                                                                    {/* <button  className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                           
                                           style={{
                                         
                                                ...ContinueButtonstyle,
        
                                                "--bs-border-style": "solid",
                                                "--bs-border-color": "white",
                                                "--bs-btn-hover-border-color": "red",
                                                "--bs-btn-focus-border-color": "red",
                                                "--bs-btn-active-border-color": "red",
                                            
                                                                    }}
                                                                    >Group 1</button> */}
                                                                    {(PllList).map((pll) => {
                                                                        if(pll==""){
                                                                            return <div></div>
                                                                        }
                                                                        return <LabsPllGroupButton onClick={handlePLLSetupClicked2} text={pll}></LabsPllGroupButton>
                                                                    })}

                                                                    {/* <LabsPllGroupButton text="E" />
                                                                    <LabsPllGroupButton text="Ua" />
                                                                    <LabsPllGroupButton text="Ra" />
                                                                    <LabsPllGroupButton text="T" />
                                                                    <LabsPllGroupButton text="Ga" />
                                                                    
                                                                    <LabsPllGroupButton text="Na" />
                                                                    <LabsPllGroupButton text="Ub" />
                                                                    <LabsPllGroupButton text="Rb" />
                                                                    <LabsPllGroupButton text="F" />
                                                                    <LabsPllGroupButton text="Gb" />
                                                                    
                                                                    <LabsPllGroupButton text="Nb" />
                                                                    <LabsPllGroupButton text="H" />
                                                                    <LabsPllGroupButton text="Ja" />
                                                                    <LabsPllGroupButton text="Aa" />
                                                                    <LabsPllGroupButton text="Gc" />
                                                                    
                                                                    <LabsPllGroupButton text="V" />
                                                                    <LabsPllGroupButton text="Z" />
                                                                    <LabsPllGroupButton text="Jb" />
                                                                    <LabsPllGroupButton text="Ab" />
                                                                    <LabsPllGroupButton text="Gd" />
        
                                                                    <LabsPllGroupButton text="Y" />
             */}
                                                                </div>
                                                                <div style={{display:`${ollGroupClicked=="OLL"?"grid":"none"}`}} className="dropdown-menu LabsOLLAlgMenu ">
                                                                    {/* <button  className={`LabsGroupButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                                           
                                           style={{
                                         
                                                ...ContinueButtonstyle,
        
                                                "--bs-border-style": "solid",
                                                "--bs-border-color": "white",
                                                "--bs-btn-hover-border-color": "red",
                                                "--bs-btn-focus-border-color": "red",
                                                "--bs-btn-active-border-color": "red",
                                            
                                                                    }}
                                                                    >Group 1</button> */}
                                                                    {ollNumberGroupList.map(([ollNumber,algNumber])=>{
                                                                        console.log("Test3",ollCaseSetByGroup.current,ollCaseSetByGroup.current?.find((oll)=>oll.ollNumber===ollNumber)?.algs)
                                                                        return(
                                                                        <LabsOllAlgButton cellNumber={cellNumber} onClick={handleOLLSetupClicked3} ollNumber={ollNumber} algNumber={algNumber} text={`OLL ${ollNumber}-${algNumber}`} oll={ollCaseSetByGroup.current?.find((oll)=>oll.ollNumber===ollNumber)?.algs}></LabsOllAlgButton>
                                                                        )   
                                                                    })}
                                                                    {/* <LabsOllAlgButton cellNumber={cellNumber} onClick={handleOLLSetupClicked3} text={`No Oll`}></LabsOllAlgButton> */}
                                                                      
                                                                   
                                                                    {/* <LabsOllAlgButton text={"Alg 2"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 3"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 4"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 5"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 6"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 7"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton>
                                                                    <LabsOllAlgButton text={"Alg 8"} oll={"R U R' U R U2 R' "}></LabsOllAlgButton> */}
                                                                </div>
        
                                                             
                                                          </li>
                                                          <li><hr className="dropdown-divider" /></li>
                                                           <li className="dropdown LabsNestedDropdown">
        
                                                           <button onClick={()=>setPostPllAUFClicked((prev)=>!prev)} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{borderTopLeftRadius:"6px",borderTopRightRadius:"6px"}}
                                                        >Post-PLL AUF {`${cells[cellNumber].postPllAUFSetup!=""?`(${cells[cellNumber].postPllAUFSetup})` :""}`}</button>
                                                                {/* <div className="dropdown-menu LabsOLLMenu"> */}
                                                                {console.log("GroupClicked",shortGroupTable,ollGroupClicked,ollGroupClicked=="Group")}
                                                                {/* <div style={{display: lastSlotClicked ? "flex" : "none"}} className="flex-column"> */}
                                                                <div style={{display: postPllAUFClicked ? "grid" : "none"}} className="LabsLastSlotGroupCont">
                                                               
                                                                {AUFList.map((alg)=>(
                                                                    <LabsLastSlotButton onClick={handlePostPLLSetupClicked} text={alg}></LabsLastSlotButton>
                                                                ))}
                                                                </div>
                                                        </li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li className="dropdown LabsNestedDropdown" style={{marginTop:"20px"}}>
                                                             <button onClick={()=>setAlgsToSolveClicked((prev)=>!prev)} className="dropdown-item LabsDropDownItem dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        style={{borderBottomLeftRadius:"6px",borderBottomRightRadius:"6px"}}
                                                        >Algs to Solve {algToSolveList.length>0?`(${algToSolveList.join(", ")})`:""}</button>

                                                        
        
                                                        <div style={{display: algsToSolveClicked ? "flex" : "none"}} className="flex-column LabsLastSlotGroupCont">
                                                               
                                                            
                                                                <div className="d-flex align-items-center">
                                                                     <label style={{color:"white",marginRight:"auto"}} htmlFor="LastSlotSolveAlg">Last Slot:</label>
                                                                      <input onDoubleClick={()=>{AlgsToSolveLastSlotInputRef.current.value=cells[cellNumber].lastSlotAlgSolve}} ref={AlgsToSolveLastSlotInputRef} placeholder={`${cells[cellNumber].lastSlotAlgSolve}`} id="LastSlotSolveAlg" name="LastSlotSolveAlg" className="LastSlotSolveInput"></input>
                                                                </div>

                                                                <div className="d-flex align-items-center">
                                                                     <label style={{color:"white",marginRight:"auto"}} htmlFor="OLLSolveAlg">OLL:</label>
                                                                      <input ref={AlgsToSolveOllInputRef} placeholder={`${cells[cellNumber].ollAlgSolve}`} id="OLLSolveAlg" name="OLLSolveAlg" className="LastSlotSolveInput"></input>
                                                                </div>

                                                                <div className="d-flex align-items-center">
                                                                     <label style={{color:"white", marginRight:"auto"}} htmlFor="PLLSolveAlg">PLL:</label>
                                                                      <input ref={AlgsToSolvePllInputRef} placeholder={`${cells[cellNumber].pllAlgSolve}`} id="PLLSolveAlg" name="PLLSolveAlg" className="LastSlotSolveInput"></input>
                                                                </div>


                                                                <div className="d-flex justify-content-center" style={{marginTop:"10px"}}>
                                                                <button style={{marginBottom:"10px"}} onClick={handleAlgsToSolveSaveClicked} className="barExcludeButtonSave"> Save</button>
                                                                </div>

                                                        </div>
                                                        </li>
                                                        
                                                        
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li style={{marginTop:"30px"}}>
                                                             <button onClick={handleResetClicked} className="dropdown-item LabsDropDownItem"
                                                        type="button"
                                                        style={{fontWeight:"700", borderBottomLeftRadius:"6px",borderBottomRightRadius:"6px"}}
                                                        >Reset to Default</button>
                                                        </li>
        
                                                     
                                                        </ul>
                                                      </li>
                                                    </ul>
                                                  </div>
                                    </div>
                                    {(specificOLLDB?.length>0 || !oll) && <BarPersevationOverlay
                                    oll={""}
                                    pll={alg}
                                    permIndex={1}
                                    cpEasyWanted={false}
                                    cpSameOppWanted={!cpSameOpp}
                                    barMovementWanted={false}
                                    cubeSize={cubeSize}
                                    setCubeSize={setCubeSize}
                                    cubeSizeFixed={true}
                                    labsPageTrue={true}
                                    view={cells[cellNumber].view}
                                    />
                                }
                                </div>
    )
    
}

export const defaultCellInfo = (cellNumber,hidden)=>{

    let defaultInfo= {
        id: `cell-${cellNumber}`,
        cellNumber: cellNumber,
        ollRecSetting: "",
        lastSlotAlgSetup: "",
        preOllAUFSetup: "",
        ollAlgSetupNumber: "",
        ollAlgNumber:"",
        prePllAUFSetup: "",
        pllName: "",
        pllAlgSetup:"",
        postPllAUFSetup: "",
        lastSlotAlgSolve:"",
        ollAlgSolve:"",
        pllAlgSolve:"",
        gridNumber: [],
        crossColor:"White",
        view:"plan",
        hidden: hidden
    }
    console.log("AddedHidden",defaultInfo,cellNumber,hidden)
    return defaultInfo
}

export function AddLabsCell({celltype,cellNumber,cells,setCells, linkedWith}){


    const { darkMode } = useContext(ThemeContext)

    const handleAddClicked = (cellNumber)=>{
        
        console.log("Added25",cellNumber,linkedWith)
        setCells((prev)=>{
                
                let newCells=[...prev]
                // console.log("Added35",newCells.length)
                let k=newCells.length
                while(cellNumber>newCells.length){
                    newCells.push(defaultCellInfo(k,true))
                    // console.log("Lengths",newCells,newCells.length)
                    k+=1
                }
                // console.log("Added40",cellNumber,newCells.length)
                
                if(linkedWith.length>0){
                    console.log("Added755",newCells,linkedWith,linkedWith[0])
                    newCells[cellNumber]={...newCells[linkedWith[0][0]],linkedHead:false, hidden:false}
                }
                else{
                    newCells[cellNumber]=defaultCellInfo(cellNumber,false)
                }
                
                console.log("Added75",newCells[cellNumber],cellNumber)
                
                // newCells[cellNumber]=defaultCellInfo(cellNumber)
                // console.log("Added45",newCells)
                return newCells})
    }

    
    return (
        <div className="AddLabsCellCont d-flex align-items-center justify-content-center" >
        
            <button onClick={()=>{handleAddClicked(cellNumber)}} className={`AddLabsCellButton ${darkMode ? "btn-dark border-2 btn-back-dark" : "btn-secondary border-2 border-dark btn-back-light"} border border-2 btn `}
                >
                <FaIcon icon="plus"  fontSize="3rem"></FaIcon>
            </button>

        </div>
    )
}


export default LabsCell

export function CombinedAddRemoveLabsCell({celltype,cellNumber,cells,setCells,cubeSize,setCubeSize,oll, unlinkable, linkedWith,LastSlotAlgs, shortGroupTable}){

    // console.log("Added65",cells,cellNumber,cells?.[cellNumber]?.hidden)
    return(
        <>
        {/* {console.log("Deleted3",cellNumber,cells?.[cellNumber]?.hidden)} */}
         {cells?.[cellNumber]?.hidden!=false &&
                    <AddLabsCell celltype={celltype} cellNumber={cellNumber} cells={cells} setCells={setCells} linkedWith={linkedWith}></AddLabsCell>}
                    {cells?.[cellNumber]?.hidden==false &&
                    <LabsCell celltype={celltype} cellNumber={cellNumber} cells={cells} setCells={setCells} cubeSize={cubeSize} setCubeSize={setCubeSize} unlinkable={unlinkable} linkedWith={linkedWith} oll={oll} LastSlotAlgs={LastSlotAlgs} shortGroupTable={shortGroupTable}></LabsCell>}
        </>         
    )
}