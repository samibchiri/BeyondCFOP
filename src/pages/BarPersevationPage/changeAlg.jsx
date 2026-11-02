

export function ChangeOllCont({refIndex,oll,setChangedAlgArray}){

// console.log("SetChanged",setChangedAlgArray)
return (
<div className="barExcludeCont">
  <div></div>
  <div style={{display:"flex", justifyContent:"center",justifySelf :"end"}}>
   <label htmlFor={`barchangeOllAlg-${refIndex}`}>Change alg:</label>
   </div>
   <div>
   <input id={`barchangeOllAlg-${refIndex}`} className="barExcludeCentersInput" placeholder="Enter new alg, ex: R U R' U R U2 R'" onKeyDown={ (e)=>(changeOllAlgEnterPressed(e,oll,setChangedAlgArray))}></input>
  <button className="barExcludeButtonSave" onClick={() => {
    const value = document.getElementById(`barchangeOllAlg-${refIndex}`).value;
    changeOllAlg(value, oll,setChangedAlgArray);
    document.getElementById(`barchangeOllAlg-${refIndex}`).value=""
  }}> Save</button> </div>
  </div>
)
}


function changeOllAlgEnterPressed(e,oll,setChangedAlgArray){
  if(e.key=="Enter"){
      e.preventDefault()
      changeOllAlg(e.target.value,oll,setChangedAlgArray)
      console.log("EnterPressed")
      e.target.value = "";
  }
    
}
function changeOllAlg(newAlg,oll,setChangedAlgArray){

//  let updatedNewAlg= correctAlgString(newAlg)

console.log("ChangedOllAlg",newAlg,oll)
  
  if(newAlg!=oll.algs){
    console.log("SetChanges",[newAlg,oll,true])
    setChangedAlgArray([newAlg,oll,true])
  }
  else{
    setChangedAlgArray([newAlg,oll,false])
  }
  
}