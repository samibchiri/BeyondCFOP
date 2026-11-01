import React, { useEffect, useRef, useState } from "react"; // removed 'use'
import { Modal } from "react-bootstrap";
import { FaIcon } from '../../assets/fontAwesome.js';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";
import "../../styling/index.css";
// import '../../styling/PopUp.css';
import {ArrowDataGenerator} from "../../dataGeneration/ArrowDataGenerator.jsx"

import Cp6Grid from "../CpPage/Cp6Grid.jsx";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../data/NewGeneratedData/db.js';

import { useOll } from "../../context/OllContext";

import {sortOlls} from "../../context/OllContext.jsx"
import BarPersevationOverlay from "../../1OllBarInfo.jsx";

import Bar6Grid from "../BarPersevationPage/Bar6Grid.jsx";

function ShowBarFullHint({alg,pll, sixGridWanted,cpEasyWanted, cpSameOpp, cubeSizeFixed, cubeSize, setCubeSize, onClose,algCasesSet}){
    console.log("Showing Card",alg)

    const {swapOllsAlgnumber,createOllEmptySlot } = useOll();

        
    const [editClick1,setEditClick1]= useState(false)
    const [editClick2,setEditClick2]= useState(false)
    const [editedAlg1,setEditedAlg1]=useState([])
    const [editedAlg2,setEditedAlg2]=useState([])
    const [existPrevAlg,setExistPrevAlg]= useState(false)

    // let handleSwapClicked= useRef(false)
    const [handleSwapClicked, setHandleSwapClicked] = useState(false);
    
    const [changedAlgArray,setChangedAlgArray]=useState(["","",false,null])

    let AlgVersions = useLiveQuery(()=>{
            
              return db.olls.where("ollNumber").equals(alg.ollNumber).toArray().then(arr => [...arr].sort(sortOlls));;
            },[]
          );

    console.log("UpdateO2",AlgVersions)
    
       
    useEffect(()=>{
    if(AlgVersions){
        if (AlgVersions.length==1){
            console.log("createOllEmptySlot")
            const createSlot = async ()=>{

            
            await createOllEmptySlot(AlgVersions[0].ollNumber, AlgVersions[0].group);
            }
        
        createSlot()
        }
        }
            
    },[AlgVersions])
       
    console.log(AlgVersions)

    const InputAlg1= useRef(null)
    const InputAlg2= useRef(null)

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
        console.log("HandleSwapClciek",handleSwapClicked,AlgVersions,LastAlg1,LastAlg2)
    if(handleSwapClicked==false && LastAlg2?.algs){
        console.log("HandleSwapClciek2",)
        setHandleSwapClicked(true)
        setTimeout(() => {
            //handleSwapClicked.current=false
            setHandleSwapClicked(false)
        }, 2000);
        if(!changedAlgArray[2]){
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
        await swapOllsAlgnumber(LastAlg1, LastAlg2);
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
    //if(editedAlg1.length==0){
        if (AlgVersions?.[0]?.algs &&(editedAlg1?.length==editedAlg2?.length)) {
            console.log("edited1Here?")
            setEditedAlg1((prev)=>[...prev,AlgVersions[0]])
        //setEditedAlg1([AlgVersions[0]]);
   // }
    }
    //if(editedAlg2.length==0){
        if (AlgVersions?.[1]?.algs) {
            //setEditedAlg2([AlgVersions[1]]);
            setEditedAlg2((prev)=>[...prev,AlgVersions[1]])
        }
        // else{
        //     setEditedAlg2([""])
        // }
        }
   // }
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

        

        if(!newAlg1 &&Alg1Input&&Alg1Input!=editedAlg1[editedAlg1.length-1].algs){
            console.log("Same",Alg1Input,editedAlg1[editedAlg1.length-1])
            console.log("Changalgarray1",[Alg1Input, AlgVersions[0], true])
            // setEditedAlg2((prev)=>[...prev,prev[prev.length-1]])
            // setEditedAlg1((prev)=>[...prev,Alg1Input])
            
            setChangedAlgArray([Alg1Input, AlgVersions[0], true,1])
            
        }

        console.log("UpdateAlg1",newAlg1,editedAlg1)
        if(newAlg1){
            await db.olls.update(
                newAlg1.id,
                {...newAlg1}
            );
        }
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
        
       
        let Alg2Input=InputAlg2.current?.value ?? "";
        
        console.log(Alg2Input)

         console.log("Default2",Alg2Input,editedAlg2)
        
        if(!newAlg2 &&Alg2Input&&Alg2Input!=editedAlg2[editedAlg2.length-1]){
            // setEditedAlg1((prev)=>[...prev,prev[prev.length-1]])
            // setEditedAlg2((prev)=>[...prev,Alg2Input])
            console.log("Changalgarray2",[Alg2Input, AlgVersions[1], true])
            setChangedAlgArray([Alg2Input, AlgVersions[1], true,2])

        }
        if(newAlg2){
            await db.olls.update(
                newAlg2.id,
                {...newAlg2}
            );
        }
        // else{
        //     //setEditedAlg2((prev)=>[...prev,prev[prev.length-1]])
        // }
        setEditClick2(false)

        
        if(Alg2Input&&Alg2Input!=editedAlg2[editedAlg2.length-1]){
            setExistPrevAlg(true)
        }
    }

    const UndoAlgInput= async()=>{
        console.log("ConsoleUndo",editedAlg1,editedAlg2,changedAlgArray)

        let newAlg1 = editedAlg1.length > 1? editedAlg1.slice(0, -1): editedAlg1;
        let newAlg2 = editedAlg2.length > 1? editedAlg2.slice(0, -1): editedAlg2;
        
        setHandleSwapClicked(true)
        setTimeout(() => {
            //handleSwapClicked.current=false
            setHandleSwapClicked(false)
        }, 2000);
        
        if(!changedAlgArray[2]&& !handleSwapClicked){
            // await db.olls.update(AlgVersions[0].id,editedAlg1[editedAlg1.length-2]);
            // await db.olls.update(AlgVersions[1].id,editedAlg2[editedAlg2.length-2]);

        
        
        if(editedAlg1.length>1){
            if(editedAlg1.length>2){
                setExistPrevAlg(true)
            }
            else{
                setExistPrevAlg(false)
            }
            console.log("edited1Here?2")
            setEditedAlg1(newAlg1)
            SaveAndChange1(newAlg1[newAlg1.length-1])
        }
        
        if(editedAlg2.length>1){
            if(editedAlg2.length>2){
                setExistPrevAlg(true)
            }
            else{
                setExistPrevAlg(false)
            }
            setEditedAlg2(newAlg2)
            SaveAndChange2(newAlg2[newAlg2.length-1])
        }

        console.log("SameUndoing",editedAlg1,editedAlg2)
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
       <>
       !sixGridWanted &&(
        
        <Modal centered className="ModalPopUpSmall" show={true} onHide={onClose}
        dialogClassName="alg-modal-dialog"
      contentClassName="alg-modal-content">
            <Modal.Header className="justify-content-center">
                <Modal.Title className="popUpTitle">{alg.name}</Modal.Title>
                <div className="popUpSubtitle">
                    R U R' U' R U2 R'
                </div>
            </Modal.Header>
            <Modal.Body className="text-center">
             {/* <Modal.Body> */}
             
                    <div className="Cube2Grid">
                        <div>
                            <h2 className="OllCpLocation">Jb-Perm</h2>
                        {console.log}
                        <BarPersevationOverlay
                                oll={alg}
                                pll={""}
                                permIndex={1}
                                cpEasyWanted={cpEasyWanted}
                                cpSameOppWanted={!cpSameOpp}
                                barMovementWanted={false}
                                cpWanted={"cpEasy"}
                                cubeSize={cubeSize}
                                setCubeSize={setCubeSize}
                                cubeSizeFixed={true}
                                view={"plan"}
                                />
                        </div>
                        <div>
                        <h2 className="OllCpLocation">PLL-Skip</h2>
                        <BarPersevationOverlay
                                oll={alg}
                                pll={""}
                                permIndex={1}
                                cpEasyWanted={cpEasyWanted}
                                cpSameOppWanted={!cpSameOpp}
                                barMovementWanted={false}
                                cpWanted={"cpEasy"}
                                cubeSize={cubeSize}
                                setCubeSize={setCubeSize}
                                cubeSizeFixed={true}
                                view={"plan"}
                                />
                        </div>
                    </div>
            </Modal.Body>
            
        </Modal>
    )

    
        {sixGridWanted &&(

        <Modal centered className="ModalCpPopUp" show={true} onHide={onClose}
        dialogClassName="alg-modal-dialog"
      contentClassName="alg-modal-content">
            <Modal.Header className="justify-content-center">
                <Modal.Title className="popUpTitle">{alg.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">

                    <Bar6Grid oll={alg} cubeSize={cubeSize} setCubeSize={setCubeSize} cpEasyWanted={true} cpSameOppWanted={false}></Bar6Grid>
            
            </Modal.Body>
            
        </Modal>
    
        )}
        </>
    );
}
export default ShowBarFullHint