import React, { useEffect, useRef, useState,useMemo } from "react"; // removed 'use'
import { Modal } from "react-bootstrap";
import { FaIcon } from '../../assets/fontAwesome.js';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import "../../styling/index.css";
import '../../styling/PopUp.css';
import {ArrowDataGenerator} from "../../dataGeneration/ArrowDataGenerator.jsx"


import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../data/NewGeneratedData/db.js';

// import { useOll } from "../../context/OllContext";

// import {sortOlls} from "../../context/OllContext.jsx"

// import { usePll } from "../../context/PllContext";

// import {sortPlls} from "../../context/PllContext.jsx"

import { useAlgs } from "../../context/AlgContext.jsx";
import CheckAlgCorrect from "./CheckAlgCorrect.jsx";
import f2lCaseSet from "../../data/f2lCaseSet.js";


// import { ChangeOlls } from "./ChangeOlls.jsx";

function ShowAlgCard({alg,algtype,onClose,algCasesSet}){
    console.log("Showing Card",algtype,alg)

     const {
            data,
            getAlgsByGroup,
            addAlg,
            createEmptySlot,
            swapAlgNumbers,
            changeAlg
        } = useAlgs();

    const cases = {
        oll: data.oll.all,
        pll: data.pll.all,
        f2l: data.f2l.all
    }[algtype] ?? algCasesSet?.cases ?? [];
        
    const table = data[algtype].table;

    const [editClick1,setEditClick1]= useState(false)
    const [editClick2,setEditClick2]= useState(false)
    const [editedAlg1,setEditedAlg1]=useState([])
    const [editedAlg2,setEditedAlg2]=useState([])
    const [existPrevAlg,setExistPrevAlg]= useState(false)

    // let handleSwapClicked= useRef(false)
    const [handleSwapClicked, setHandleSwapClicked] = useState(false);
    
    const [changedAlgArray,setChangedAlgArray]=useState(["","",false,null])

    const [loadF2lSlotsPerseved,setLoadF2lSlotsPerseved]=useState(true)
    
    // let AlgVersions = useLiveQuery(()=>{
            
    //     // if(algtype=="oll"){
    //     //       return cases.where("ollNumber").equals(alg.ollNumber).toArray().then(arr => [...arr].sort(sortOlls));;
    //     // }
    //     // if(algtype=="pll"){
    //     //     return cases.where("pllNumber").equals(alg.pllNumber).toArray().then(arr => [...arr].sort(sortPlls));;
    //     // }

    //     const {numberField,sortFunction} = data[algtype]
    //     let FilteredCases=cases.filter((algitem)=>algitem[numberField]==alg[numberField]).sort(sortFunction)
    //     console.log("CardPopUpData",FilteredCases,cases,numberField,alg,algtype)
    //     return FilteredCases
    //         },[algtype,alg]
    //       );

    const { numberField, sortFunction } = data[algtype];


    const AlgVersions = useMemo(() => {
    return cases
        .filter(
            algitem =>
                algitem[numberField] === alg[numberField]
        )
        .sort(sortFunction);
}, [cases, numberField, sortFunction, alg]);

    console.log("AlgVersions =", AlgVersions);
    
       
    const creatingSlotRef = useRef(false);

    useEffect(()=>{
    if(AlgVersions){
        if (AlgVersions.length==1){
            console.log("createOllEmptySlot",AlgVersions)
            if(creatingSlotRef.current){
                return
            }
            creatingSlotRef.current=true
            const createSlot = async ()=>{

            
                // if(algtype=="oll"){
                //     await createOllEmptySlot(AlgVersions[0].ollNumber, AlgVersions[0].group);
                // }
                // if(algtype=="pll"){
                //     await createPllEmptySlot(AlgVersions[0].pllNumber, AlgVersions[0].group);
                // }
                const { numberField } = data[algtype];

                await createEmptySlot(
                    algtype,
                    AlgVersions[0][numberField],
                    AlgVersions[0].group
                );
            }
        
        createSlot()
        }
        }
            
    },[AlgVersions])
       
console.log("AlgVersions2 =", AlgVersions);

    const InputAlg1= useRef(null)
    const InputAlg2= useRef(null)

    const [isChecking, setIsChecking] = useState(false);

    useEffect(()=>{
        if(editClick2 && InputAlg2.current){
            InputAlg2.current.focus()
        }
        if(editClick1 && InputAlg1.current){
            InputAlg1.current.focus()
        }
    })
    

    let DefaultAlg1= AlgVersions?AlgVersions[0].algs:""
    let DefaultAlg2= AlgVersions?.[1]?AlgVersions[1].algs:""

    let LastAlg1= AlgVersions?AlgVersions[0]:""
    let LastAlg2= AlgVersions?AlgVersions[1]:""

    // console.log("DefAlg12",editedAlg1,AlgVersions)
    // console.log("DefAlg12",LastAlg1.algs,LastAlg2.algs)

    const handleSwap = async () => {
        console.log("HandleSwapClciek",handleSwapClicked,changedAlgArray,AlgVersions,LastAlg1,LastAlg2)
    if(handleSwapClicked==false && LastAlg2?.algs){
        console.log("HandleSwapClciek2",)
        setHandleSwapClicked(true)
        setTimeout(() => {
            //handleSwapClicked.current=false
            setHandleSwapClicked(false)
        }, 200);
        if(changedAlgArray[2]==false){
            if (LastAlg1?.algs && editedAlg1.length==editedAlg2.length && LastAlg2?.algs) {
                console.log("edited1Here?3")
                setEditedAlg1((prev)=>[...prev,LastAlg2])
                //setEditedAlg1([AlgVersions[0]]);
        // }
            }
            //if(editedAlg2.length==0){
            
                if (LastAlg2?.algs) {
                    //setEditedAlg2([AlgVersions[1]]);
                    setEditedAlg2((prev)=>[...prev,LastAlg1])
        }
        console.log("StartSwap2",LastAlg1,LastAlg2)
        // if(algtype=="oll"){
        //     await swapOllsAlgnumber(LastAlg1, LastAlg2);
        // }
        // if(algtype=="pll"){
        //     await swapPllsAlgnumber(LastAlg1, LastAlg2);
        // }
        await swapAlgNumbers(algtype,LastAlg1,LastAlg2)
        }
        setExistPrevAlg(true)
    }
    
  };

//     const handleSwap = async () => {
//         console.log("HandleSwapClciek",handleSwapClicked,AlgVersions)
//     if(handleSwapClicked==false && AlgVersions[1]?.algs){
//         console.log("HandleSwapClciek2",)
//         setHandleSwapClicked(true)
//         setTimeout(() => {
//             //handleSwapClicked.current=false
//             setHandleSwapClicked(false)
//         }, 2000);
//         if(!changedAlgArray[2]){
//             if (AlgVersions?.[0]?.algs && editedAlg1.length==editedAlg2.length && AlgVersions?.[1]?.algs) {
//                 console.log("edited1Here?3")
//                 setEditedAlg1((prev)=>[...prev,AlgVersions[1]])
//                 //setEditedAlg1([AlgVersions[0]]);
//         // }
//             }
//             //if(editedAlg2.length==0){
            
//                 if (AlgVersions?.[1]?.algs) {
//                     //setEditedAlg2([AlgVersions[1]]);
//                     setEditedAlg2((prev)=>[...prev,AlgVersions[0]])
//         }
//         console.log("StartSwap2")
//         await swapOllsAlgnumber(AlgVersions[0], AlgVersions[1]);
//         }
//         setExistPrevAlg(true)
//     }
    
//   };
  
    useEffect(() => {
        if(!handleSwapClicked){

        
        console.log("Wut44",AlgVersions,editedAlg1,editedAlg2)
    if(editedAlg1.length==0){
        if (AlgVersions?.[0]?.algs &&(editedAlg1?.length==editedAlg2?.length)) {
            console.log("edited1Here?")
            // setEditedAlg1((prev)=>[...prev,AlgVersions[0]])
        setEditedAlg1([AlgVersions[0]]);
   }
    }
    if(editedAlg2.length==0 ){
        console.log("Wut55",AlgVersions,AlgVersions?.[1],AlgVersions?.[1]?.algs)
        if (AlgVersions?.[1]?.algs||AlgVersions?.[1]?.algs=="") {
            console.log("Wut55AddEditedAlg2",AlgVersions[1])
            setEditedAlg2([AlgVersions[1]]);
            // setEditedAlg2((prev)=>[...prev,AlgVersions[1]])
        }
        // else{
        //     setEditedAlg2([""])
        // }
        }
   }
    }, [AlgVersions]);

    const CloseAndClearPopUp= (onClose)=>{
        setEditClick1(false)
        setEditClick2(false)
        onClose()
    }

    const SaveInput1=(e)=>{
        if(e.key=="Enter"){
            e.preventDefault()
            SaveAndChange1()
            
        }
    }
    const SaveInput2=(e)=>{
        if(e.key=="Enter"){
            e.preventDefault()
            SaveAndChange2()
            
        }
    }

    const SaveAndChange1= async (newAlg1)=>{
        

        
        
        
        //let Alg1Input=document.getElementById("PopUpInputAlg1").value
        let  Alg1Input= InputAlg1.current?.value ?? "";

        
          console.log("Default1",Alg1Input,Alg1Input!=editedAlg1[editedAlg1.length-1].algs,editedAlg1[editedAlg1.length-1]?.algs)
        
        if(Alg1Input&&Alg1Input!=editedAlg1[editedAlg1.length-1].algs){
            console.log("Same",Alg1Input,editedAlg1[editedAlg1.length-1])
            console.log("Changalgarray1",[Alg1Input, AlgVersions[0], true])
            // setEditedAlg2((prev)=>[...prev,prev[prev.length-1]])
            // setEditedAlg1((prev)=>[...prev,Alg1Input])
            
            setChangedAlgArray([Alg1Input, AlgVersions[0], true,1])
            
        }
        

        console.log("UpdateAlg1",newAlg1,editedAlg1)
        // else{
        //     setEditedAlg1((prev)=>[...prev,prev[prev.length-1]])
        // }
        setEditClick1(false)

        
        if(Alg1Input&&Alg1Input!=editedAlg1[editedAlg1.length-1].algs){
            setExistPrevAlg(true)
        }
        console.log("Same2",editedAlg1)
    }


    const SaveAndChange2= async(newAlg2)=>{
        
        console.log("AlgVersions3 =", AlgVersions);
        let Alg2Input=InputAlg2.current?.value ?? "";
        
        console.log(Alg2Input)

         console.log("Default2",Alg2Input,editedAlg2[editedAlg2.length-1]?.algs)
        
        if(Alg2Input&&Alg2Input!=editedAlg2[editedAlg2.length-1]?.algs){
            // setEditedAlg1((prev)=>[...prev,prev[prev.length-1]])
            // setEditedAlg2((prev)=>[...prev,Alg2Input])
            
            console.log("Changalgarray2",[Alg2Input, AlgVersions[1], true])
            setChangedAlgArray([Alg2Input, AlgVersions[1], true,2])

        }

        // else{
        //     //setEditedAlg2((prev)=>[...prev,prev[prev.length-1]])
        // }
        setEditClick2(false)

        
        if(Alg2Input&&Alg2Input!=editedAlg2[editedAlg2.length-1]?.algs){
            setExistPrevAlg(true)
        }
    }

    const UndoAlgInput= async()=>{
        console.log("ConsoleUndo",editedAlg1,editedAlg2,changedAlgArray)

        let newAlg1 = editedAlg1.length > 1? editedAlg1.slice(0, -1): editedAlg1;
        let newAlg2 = editedAlg2.length > 1? editedAlg2.slice(0, -1): editedAlg2;
        
        
        if(!changedAlgArray[2]&& !handleSwapClicked){

            
            await changeAlg(algtype, editedAlg1[editedAlg1.length-2].algs, AlgVersions[0]);
            await changeAlg(algtype, editedAlg2[editedAlg2.length-2].algs, AlgVersions[1]);
            // await cases.update(AlgVersions[0].id,editedAlg1[editedAlg1.length-2]);
            // await cases.update(AlgVersions[1].id,editedAlg2[editedAlg2.length-2]);

        
        
        if(editedAlg1.length>1){
            if(editedAlg1.length>2){
                setExistPrevAlg(true)
            }
            else{
                setExistPrevAlg(false)
            }
            console.log("edited1Here?2")
            setEditedAlg1((prev)=>prev.slice(0,-1))
            // SaveAndChange1(newAlg1[newAlg1.length-1])
        }
        
        if(editedAlg2.length>1){
            if(editedAlg2.length>2){
                setExistPrevAlg(true)
            }
            else{
                setExistPrevAlg(false)
            }
            setEditedAlg2((prev)=>prev.slice(0,-1))
            // SaveAndChange2(newAlg2[newAlg2.length-1])
        }

        console.log("SameUndoing",editedAlg1,editedAlg2)

        setHandleSwapClicked(true)
        setTimeout(() => {
            //handleSwapClicked.current=false
            setHandleSwapClicked(false)
        }, 200);
        // if(editedAlg1.length > 1 || editedAlg2.length > 1){
        //      console.log("Exist Prev",editedAlg1,editedAlg2,editedAlg1.length,editedAlg2.length)
        //     setExistPrevAlg(true)
        // }
        // else{
        //     console.log("No Prev")
        //     setExistPrevAlg(true)
        // }
        }
        
    }

//     useEffect(() => {
//         console.log("Wut4",changedAlgArray,editedAlg1,editedAlg2,AlgVersions)
//   if (changedAlgArray[3] == 1) {
//     setEditedAlg1(prev => [...prev, prev[prev.length - 1]]);
//     setEditedAlg2(prev => [...prev, AlgVersions[1]]);
//   }

//   if (changedAlgArray[3] == 2) {
//     setEditedAlg1(prev => [...prev, AlgVersions[0]]);
//     setEditedAlg2(prev => [...prev, prev[prev.length - 1]]);
//   }

// }, [changedAlgArray,existPrevAlg]);


    console.log("EditedAlg",editedAlg1,editedAlg2)
    return (
        <Modal centered className="ModalPopUp" show={true} onHide={onClose}
        dialogClassName="alg-modal-dialog"
      contentClassName="alg-modal-content">
            <Modal.Header className="justify-content-center">
                <Modal.Title className="popUpTitle">{alg.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <CaseImage
                    size={200}
                    alg={algtype=="f2l"?f2lCaseSet.cases[AlgVersions[0]?.f2lNumber].algs[0]:DefaultAlg1?DefaultAlg1:""}
                    //F2l does not display correct side with rotations in algorithm
                    caseSetDetails={algCasesSet.details}
                ></CaseImage>
                <div className="popUpContainer">
                    <table className="popUpTable text-center">
                        <tbody>
                        <tr className="popUpRow">
                            <th>
                                Name
                            </th>
                            <th>
                                {alg.name}
                            </th>
                        </tr>
                        <tr className="popUpRow">
                            <td className="PopUpTd1">
                                Group
                            </td>
                            <td className="PopUpTd2">
                                {alg.group}
                            </td>
                        </tr>
                        <tr className="popUpRow">
                            <td className="PopUpTd1">
                                Case Set
                            </td>
                            <td className="PopUpTd2">
                                {algCasesSet.details.title}
                            </td>
                            
                        </tr>
                        <tr className="popUpRowScramble">
                            <td className="PopUpTd1">
                                Scramble
                            </td>
                            <td className="PopUpTd2">
                                {alg.scrambles[0]}
                            </td>
                            
                        </tr>
                        <tr className="popAlgUpRow">
                            <td className="PopUpTd1">
                                Algorithm 1
                            </td>
                            {
                                !editClick1 && 
                            <td className="PopUpTd2">
                                {editedAlg1[editedAlg1.length - 1]?.algs}
                            </td>
                            }
                           
                            {
                            editClick1 &&
                            <td className="PopUpTd2">
                                <input type="text" onKeyDown={SaveInput1} ref={InputAlg1} wrap="soft"  rows="2" id="PopUpInputAlg1" placeholder="Enter Algorithm"/>
                                
                            </td>
                           
                            }
                            <td className="PopUpTd3" >
                                <div id="buttonSaveAndCopy1">

                                <button className="PopUpCopyButton" onClick={() => {
                                    navigator.clipboard.writeText(editedAlg1[editedAlg1.length - 1]?.algs)}}>
                                    <FaIcon icon="copy"></FaIcon>
                                </button>
                                {editClick1 &&
                                 <button  className="PopUpButtonSave" onClick={()=>{SaveAndChange1()}}>Save 

                                 </button>
                                }
                                {!editClick1 &&
                                    <button className="PopUpButtonSave" onClick={()=>{ if (changedAlgArray[2] == true) return
                                                                                        setEditClick1((prev)=>!prev)}}>Edit </button>
                                }
                                 </div>
                            </td>
                        </tr>
                        <tr style={{height:"10px"}}>
                            <td>

                            </td>
                            <td>
                            <div className={`swapAlgsButton  ${!changedAlgArray[2]&&!handleSwapClicked ? "active" : ""}`} onClick={(()=>handleSwap())}>
                                 <FaIcon icon="arrows-up-down"  ></FaIcon>
                            </div>
                            </td>
                            <td>
                                
                            </td>
                        </tr>
                        <tr className="lastPopUpRow">
                            <td className="PopUpTd1">
                                Algorithm 2
                            </td>
                            
                                {!editClick2 &&
                                <td className="PopUpTd2">
                                {editedAlg2[editedAlg2.length - 1]?.algs}
                                </td>
                                }
                                {editClick2 &&
                                <td className="PopUpTd2">
                                    <input type="text" onKeyDown={SaveInput2} ref={InputAlg2} wrap="hard" rows="2" id="PopUpInputAlg2" placeholder="Enter Algorithm"/>
                                </td>
                                }
                            
                            <td>
                                <div id="buttonSaveAndCopy2">

                                <button className="PopUpCopyButton" onClick={() => {
                                    navigator.clipboard.writeText(editedAlg2[editedAlg2.length - 1]?.algs)}}>
                                    <FaIcon icon="copy"></FaIcon>
                                </button>
                                {editClick2 &&
                                 <button  className="PopUpButtonSave" onClick={()=>{SaveAndChange2()}}>Save 

                                 </button>
                                }
                                {!editClick2 &&
                                    <button className="PopUpButtonSave" onClick={()=>{ if (changedAlgArray[2] == true) return
                                                                                        setEditClick2((prev)=>!prev)}}>Edit </button>
                                }
                                 </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div>
                    {
                        existPrevAlg && !editClick1 &&!editClick2 &&
                        <button onClick={()=>{UndoAlgInput()}} className={`PopUpButtonClose ${!changedAlgArray[2]&&!handleSwapClicked ? "active" : ""}`}>Undo
                        </button>
                         
                    }
                    {
                        !existPrevAlg &&
                        <button className="PopUpButtonHidden">Undo
                        </button>
                    }
                    
                    {/* {
                        !editClick &&
                        <>
                            <button className="PopUpButtonClose" onClick={()=>{setEditClick((prev)=>!prev)}}>Edit </button>
                        </>
                    } */}
                    {/* {
                        editClick &&
                        <>
                        <button className="PopUpButtonClose" onClick={()=>{setEditClick((prev)=>(!prev))}}>Undo</button>
                        
                       
                        </>
                    } */}
                 <button className="PopUpButtonClose active" onClick={()=>CloseAndClearPopUp(onClose)}>Close </button>
                </div>
                
            </Modal.Footer>
            {console.log("CheckNewPage",algtype,changedAlgArray,editClick2)}
            {(algtype=="oll" && changedAlgArray.length>0 &&changedAlgArray[0] && changedAlgArray[1]!=null &&changedAlgArray[2]==true)  
                && (<>
                {console.log("NewPage",changedAlgArray)}
                
                    <ArrowDataGenerator
                      key={`${changedAlgArray[0]}-${changedAlgArray[1]}`}
                      newAlg={changedAlgArray[0]}
                      tempoll={changedAlgArray[1].algs!==""?changedAlgArray[1]:{...AlgVersions[0], id:changedAlgArray[1].id, algNumber:changedAlgArray[1].algNumber}}
                      onError={(errorMessage) => {
                      console.warn("CornerPermutation error:", errorMessage);
            
                      setChangedAlgArray([changedAlgArray[1], changedAlgArray[1], false,changedAlgArray[3]]);
                      setExistPrevAlg(false)
                    }}
                    onSuccess={() => {

                    if(changedAlgArray[3]==1){
                        const savedAlg = {
                    ...changedAlgArray[1],
                    algs: changedAlgArray[0]
                };

                setEditedAlg1(prev => [...prev, savedAlg]);
                setEditedAlg2(prev=> [...prev,prev[prev.length-1]])
                    }
                    if(changedAlgArray[3]==2){
                        const savedAlg = {
                    ...changedAlgArray[1],
                    algs: changedAlgArray[0]
                };
                
                setEditedAlg1(prev=> [...prev,prev[prev.length-1]])
                setEditedAlg2(prev => [...prev, savedAlg]);
              
                    }
                        

                        console.log("Succes",changedAlgArray)
                      setChangedAlgArray([changedAlgArray[0], changedAlgArray[1], false,changedAlgArray[3]]);
                    }}
                    />
                    </>
                    
                  )}
            {(algtype!="oll" && changedAlgArray.length>0 &&changedAlgArray[0] && changedAlgArray[1]!=null &&changedAlgArray[2]==true)  
                && (<>
                {console.log("NewPage",changedAlgArray)}
                
                    <CheckAlgCorrect
                      type={algtype}
                      newAlg={changedAlgArray[0]}
                      oldAlg={changedAlgArray[1].algs!==""?changedAlgArray[1]:{...AlgVersions[0], id:changedAlgArray[1].id, algNumber:changedAlgArray[1].algNumber}}
                      onError={(errorMessage) => {
                      console.warn("CornerPermutation error:", errorMessage);
            
                      setChangedAlgArray([changedAlgArray[1], changedAlgArray[1], false,changedAlgArray[3]]);
                      setExistPrevAlg(false)
                    }}
                    onSuccess={() => {

                        if(changedAlgArray[3]==1){
                        const savedAlg = {
                    ...changedAlgArray[1],
                    algs: changedAlgArray[0]
                };

                setEditedAlg1(prev => [...prev, savedAlg]);
                setEditedAlg2(prev=> [...prev,prev[prev.length-1]])
                    }
                    if(changedAlgArray[3]==2){
                        const savedAlg = {
                    ...changedAlgArray[1],
                    algs: changedAlgArray[0]
                };
                
                setEditedAlg1(prev=> [...prev,prev[prev.length-1]])
                setEditedAlg2(prev => [...prev, savedAlg]);
              
                    }
                        console.log("Succes",changedAlgArray)
                      setChangedAlgArray([changedAlgArray[0], changedAlgArray[1], false,changedAlgArray[3]]);
                    }}
                    />
                    </>
                    
                  )}
{console.log("NewNewPage",algtype,AlgVersions)}
                  {(algtype=="f2l" && loadF2lSlotsPerseved && AlgVersions[0] &&!AlgVersions[0].slotsPerseved)  
                && (<>
                
                {console.log("MewNewPage2",AlgVersions)}
                    <CheckAlgCorrect
                      type={algtype}
                      newAlg={AlgVersions[0].algs}
                      oldAlg={AlgVersions[0]}
                      onError={(errorMessage) => {
                      console.warn("F2l Slots error:", errorMessage);
                    }}
                    onSuccess={() => {
                        
                        console.log("AlgVersions",AlgVersions[0])
                        setLoadF2lSlotsPerseved(false)
                    }}
                    />
                    </>
                    
                  )}
            
        </Modal>
        
    )
}

export default ShowAlgCard