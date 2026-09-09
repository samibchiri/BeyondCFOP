import React, { use, useContext, useEffect, useState } from "react";
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import { FaChevronRight,FaChevronDown } from 'react-icons/fa';
import CornerPermutationPage from '../CpPage/CornerPermutationPage.jsx'
//import ArrowDataGenerator from './ArrowDataGenerator.jsx'
import BarPersevation from '../BarPersevationPage/BarPersevationPage.jsx'
import cpllCaseSet from "../../data/cpllCaseSet.js";
import eollCaseSet from "../../data/eollCaseSet.js";
import epllCaseSet from "../../data/epllCaseSet.js";
import f2lCaseSet from "../../data/f2lCaseSet.js";
import ocllCaseSet from "../../data/ocllCaseSet.js";
import ollCaseSet from "../../data/ollCaseSet.js";
import pllCaseSet from "../../data/pllCaseSet.js";
import tsleCaseSet from "../../data/tsleCaseSet.js";
import ttllCaseSet from "../../data/ttllCaseSet.js";

// Bootstrap CSS fir-st
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaIcon } from '../../assets/fontAwesome.js';

// Your custom CSS after Bootstrap
import '../../styling/index.css'
import '../../styling/App.css';

import ShowAlgCard from "./cardPopUp.jsx";
import { ThemeContext } from '../../context/DarkThemeContext.jsx';

import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";
import AlgTrainerPage from "../AlgTrainerPage/AlgTrainerPage.jsx";


export default function TrainSelectPage() {

    const {darkMode}= useContext(ThemeContext)
    const [caseClicked,setCaseClicked]= useState(false)
    const [buttonClicked,setButtonClicked]= useState(false)
    const [cpClicked,setCpClicked]=useState(false)
    const [barClicked,setBarClicked]=useState(false)
    const buttonStyle = {
    width: "85%",
    height: "15vh",
    minHeight:"100px",
    color: darkMode ? "#ffffffff" : "#000000ff", // dark text for light grey, white text for dark

    

   
  };

  const BackButtonstyle={
    width: "75px",
    height: "40px",
    alignItems:"center",
    fontWeight:"bold",
    borderWidth:"2px",

  }


  const tableCellDark={
    backgroundColor:"#ffffff"
  }

  const tableCellLight={
    backgroundColor:"#000000"

  }

  const [selectedCaseSet,setSelectedCaseSet]=useState(null)

  let dCrossShown=true

  const { xs } = useWindowDimensions();
 const cubeImageSize = xs ? "100" : "120";


 const [openGroups, setOpenGroups] = useState({});
 const [selectedAlg, setSelectedAlg]= useState([])
const [showPopUpCard,setShowPopUpCard]= useState([])
const [AlgCasesSet, setAlgCasesSet] = useState(null);
const [AlgGroups, setAlgGroups] = useState([]);
 const toggleSelectedAlg =(alg =>{
    
    

    if(!(selectedAlg.includes(alg))){
        setSelectedAlg((prev)=>[...prev,alg])
        }
    else{
        setSelectedAlg((prev)=>[...prev].filter(item=>item!==alg))
    }
    
 })

    const CheckGroupSelected= (group)=>{
        
        let ChosenGroupAlgs=[]
    
    AlgCasesSet.cases.forEach((alg)=>{
        if (alg.group==group){
            ChosenGroupAlgs.push(alg)
        }
    })
    const GroupAlgsInSelected= ChosenGroupAlgs.every((alg)=>selectedAlg.includes(alg))
    
    return GroupAlgsInSelected
    }
 const toggleSelectedAlgGroup =(group =>{


    let ChosenGroupAlgs=[]
    
    AlgCasesSet.cases.forEach((alg)=>{
        if (alg.group==group){
            ChosenGroupAlgs.push(alg)
        }
    })
    console.log("Groups")
    console.log(ChosenGroupAlgs)
    const GroupAlgsInSelected= ChosenGroupAlgs.every((alg)=>selectedAlg.includes(alg))
    if (GroupAlgsInSelected){
        setSelectedAlg((prev)=>prev.filter((item)=>!ChosenGroupAlgs.includes(item)))
    }
    else{
        
        let AlgsToAdd=ChosenGroupAlgs.filter((item)=>!selectedAlg.includes(item))    
           
    
        setSelectedAlg((prev)=>[...prev,...AlgsToAdd])
    }
    console.log(selectedAlg)
 })


  const toggleGroup = (group) => {
    setOpenGroups((prev)=>{

    
    if(!(group in openGroups)){

        return {...prev,[group]:true};
    }
    else{
         return {...prev, [group]: !prev[group]}
    }
    
    })
   
};


const AreAllAlgsChecked= ()=>{

    return AlgCasesSet.cases.every(alg=>selectedAlg.includes(alg))
    
}


const CheckAllAlgs= ()=>{

    if(AreAllAlgsChecked()){
        setSelectedAlg([])
    }
    else{
        setSelectedAlg([...AlgCasesSet.cases])
    }
}

const DissableLearnBtn= ()=>{
    
    if (selectedAlg.length>0){
        return false
    }
    else{
        return true
    }
}


const DissableTestBtn=()=>{
    
    if (selectedAlg.length>1){
        return false
    }
    else{
        return true
    }
}
const handleAlgCardShown=(alg)=>{
    console.log("HandleShown")
    console.log(alg)
    setShowPopUpCard([alg])
}


const handleAlgCaseSetClicked=(caseItem)=>{
    setCaseClicked(!caseClicked)
    setSelectedCaseSet(caseItem)
    setOpenGroups([])
    setSelectedAlg([])
    setAlgCasesSet(caseItem)
    setAlgGroups([... new Set(caseItem.cases.map(alg=>alg.group))])
}

const TestButtonClick=()=>{
    setCaseClicked(prev=>!prev)
    setButtonClicked(prev=>!prev)
    
}





    let AllCases=[cpllCaseSet,eollCaseSet,epllCaseSet,f2lCaseSet,ocllCaseSet,ollCaseSet,pllCaseSet]

    return <>

    {
        cpClicked && (
            <>
            <ArrowDataGenerator algGroup={AlgGroups} testedAlgs={selectedAlg} setButtonClicked={setButtonClicked} setCaseClicked={setCaseClicked}/>
            </>
        )
        
    }
    {barClicked && (
            <>
            <BarPersevation algGroup={AlgGroups} testedAlgs={selectedAlg} setButtonClicked={setButtonClicked} setCaseClicked={setCaseClicked}/>
            </>
        )}

    {!cpClicked && !barClicked && !caseClicked && !buttonClicked &&(
      <>
      <div className='container'>
        <h2 className=''>Choose what you want to practice</h2>
            
        <div className='row'>
            {AllCases.map((caseItem,i)=>(
                <div key={i} style={{maxWidth:"1200px",minHeight:"100px"}} className='col-12 col-md-6 mb-3 d-flex justify-content-center'>
                <button onClick={()=>{handleAlgCaseSetClicked(caseItem)}} className={`m-2 border btn-block btn ${darkMode? "btn-dark":"btn-primary"}`} style={buttonStyle}>
                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}} >
                        <div>
                        <CaseImage
                        size={80}
                        alg={caseItem.cases[Math.floor(Math.random()*(caseItem.cases.length-1))].algs[0]}
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
        
    </> )}
    


    


    {caseClicked && (
 <>
    
    <div className='container '>
        <div className='row align-items-center'>
            <div style={{height:"50px", alignItems:"center"}} className='col p-0 justify-content-start d-flex'>
                <button
                onClick={() => {setCaseClicked(!caseClicked); setButtonClicked(false)}}
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
            <div className='col justify-content-end d-flex p-0'>
                <button className={`${darkMode? "dark-learn-btn":"light-learn-btn"} m-1 btn btn-info `} disabled={DissableLearnBtn()} type='button'>
                    Learn
                </button>

                <button onClick={()=>TestButtonClick()} className='m-1 btn btn-success test-btn'disabled={DissableTestBtn()} type='button'>
                    Test
                </button>
                
            </div>
            
        </div>

        <table className="text-center table table-sm" style={{ "--bs-table-color-state": darkMode ? "#ffffffff" : "#000000ff" , "--bs-table-bg": "transparent" } } role="table">
                <thead className='trainTableHeader'>
                <tr style={{height:"80px"}}role="row" >
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
                    <th className='d-none d-sm-table-cell align-middle' role="columnheader">
                        <div>
                            Name
                        </div>
                    </th>
                    <th className='d-none d-sm-table-cell align-middle' role="columnheader">
                        <div>
                            <FaIcon icon="spinner" />
                        </div>
                    </th>
                    <th className='d-none d-sm-table-cell align-middle' role="columnheader">
                        <div>
                            Good
                        </div>
                    </th>
                    <th className='align-middle' role="columnheader">
                        <div>
                            Ok
                        </div>
                    </th>
                    <th className='d-none d-sm-table-cell align-middle' role="columnheader">
                        <div>
                            Bad
                        </div>
                    </th>
                    <th className='d-none d-sm-table-cell align-middle' role="columnheader">
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
                            Status
                        </div>
                    </th>
                    <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                        <input style={{ margin:"10px",width:"20px", height:"20px", verticalAlign:"middle"}}type="checkbox" checked={AreAllAlgsChecked()} onChange={CheckAllAlgs}>
                        </input>
                    </th>
                </tr>
            </thead>
            <tbody style={{borderTop:"4px solid #343a40"}} >

                   
                    {AlgGroups.map(group=>{
                        const FirstGroupCase=AlgCasesSet.cases.find(alg =>(
                            alg.group==group
                        ))
                        
                        

                        return(
                        <>
                            
                            <tr className={`CasesGroupTableRow ${darkMode ? "darkGroupRow" : "lightGroupRow"} trainTableRow`} role="row" >
                                <td  style={{minWidth:"180px"}} onClick={(()=>toggleGroup(group))}  className='align-middle' role="columnheader">
                                    {group} 
                                    {!openGroups[group]? <FaChevronRight style={{ marginLeft: '8px'}}/>:<FaChevronDown style={{ marginLeft: '8px'}}/>}
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
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Item6
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td className='d-none d-sm-table-cell align-middle' role="columnheader">
                                    Hey
                                </td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                    <input
                                        type="checkbox"
                                        checked={CheckGroupSelected(group)}
                                        onChange={() => toggleSelectedAlgGroup(group)}
                                        style={{ margin:"10px", width: "20px", height: "20px" }}
                                    />
                                </td>


                            </tr>
                            {AlgCasesSet.cases.map(alg=>{
                                return (
                                        

                                alg.group==group && openGroups[group]&&
                                <>
                                    
                                    <tr className={ `${darkMode ? "darkRow" : "lightRow"} CasesAlgTableRow ${dCrossShown?"":"d-none"}`} role="row" >
                                        <td onClick={()=>{handleAlgCardShown(alg)}}>

                                        </td>
                                       <td onClick={()=>{handleAlgCardShown(alg)}} className='align-middle' role="columnheader">
                                            <div>
                                                <CaseImage
                                                size={80}
                                                alg={alg.algs[0]}
                                                caseSetDetails={AlgCasesSet.details}
                                                ></CaseImage>
                                            </div>
                                        </td>
                                         <td onClick={()=>{handleAlgCardShown(alg)}} className='d-none d-sm-table-cell align-middle' role="columnheader">
                                            <div>
                                                {alg.name}
                                            </div>
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='d-none d-sm-table-cell align-middle' role="columnheader">
                                            <div>
                                                Item2
                                            </div>
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='d-none d-sm-table-cell align-middle' role="columnheader">
                                            <div>
                                                Item3
                                            </div>
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='align-middle' role="columnheader">
                                            <div>
                                                Item4
                                            </div>
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='d-none d-sm-table-cell align-middle' role="columnheader">
                                            <div>
                                                Item5
                                            </div>
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='d-none d-sm-table-cell align-middle' role="columnheader">
                                            Item 6
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='align-middle' role="columnheader">
                                            <div>
                                                Item7
                                            </div>
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='align-middle' role="columnheader">
                                            <div>
                                                Item8
                                            </div>
                                        </td>
                                        <td onClick={()=>{handleAlgCardShown(alg)}} className='align-middle' role="columnheader">
                                            <div>
                                                Item9
                                            </div>
                                        </td>
                                        <td>
                                           <input style={{ margin:"20px", width: "20px", height: "30px" }} className="align-middle" type="checkbox" checked={selectedAlg.includes(alg)} onClick={()=>{toggleSelectedAlg(alg)}}>
                                           </input> 
                                        </td>


                                    </tr>
                                </>
                            )
                            })}
                            
                        </>
                        )}
                    )}

                  
                 </tbody>
        </table>
        {showPopUpCard.length>0 && <ShowAlgCard alg={showPopUpCard[0]} onClose={() => setShowPopUpCard([])} AlgCasesSet={AlgCasesSet}/>}
                    
    </div>
    
 </>
)}

{
        buttonClicked && (
            <>
    
            <AlgTrainerPage testedAlgs={selectedAlg} setButtonClicked={setButtonClicked} setCaseClicked={setCaseClicked}/>
            </>
        )
    }
    </>
}
