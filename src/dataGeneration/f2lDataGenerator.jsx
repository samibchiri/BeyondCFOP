import Dexie from "dexie";
import f2lCaseSet from "../data/f2lCaseSet";




export function F2lDataGenerator(){

  let f2lCases=[]
  

  if(f2lCases.length==0){
    console.log("f2lCases Start",f2lCases)
  f2lCaseSet.cases.forEach((f2l,i)=>{
    
    let newf2lDict1= {
      id:crypto.randomUUID(),
      name:f2l.name,
      group:f2l.group,
      f2lNumber:i,
      algNumber:0,
      algAttemptCount:null,
      algSpeed:null,
      algTps:null,
      algs:f2l.algs[0],
      scrambles:f2l.scrambles,
      slotsPerserved:null,

    }
    f2lCases.push(newf2lDict1)
  })
}

//Important!
    console.log(
    "const f2lCases = " +
    JSON.stringify(f2lCases, null, 2)
        .replace(/"([^"]+)":/g, '$1:') + 
    ";\n\nexport default f2lCases;"
    );

    return <div></div>
}
