import Dexie from "dexie";
import arrowOllSet from "../arrowOllSet.js";
import pllCaseSet from "../pllCaseSet.js";
import ollCaseSet from "../ollCaseSet.js";

import pllCases from "../customPllSet.js";
import f2lCases from "../customf2lSet.jsx";

export const db = new Dexie("ollDatabase");


/*
  We store each algorithm variant as ONE ROW.
  id is a string like "OLL 21-0"
*/
db.version(1).stores({
  olls: `
    id,
    ollNumber,
    algNumber,
    group
  `,
  plls: `
    id,
    pllNumber,
    algNumber,
    pllName,
    group
  `,
  f2ls: `
    id,
    f2lNumber,
    algNumber,
    group
  `,
  deletedOlls: `
  id,
  ollNumber,
  algNumber,
  group,
  algs`
});

export async function seedDatabaseIfEmpty() {

  console.log("PLLCaseSet1",pllCaseSet.cases,pllCaseSet.cases.length)

//   let pllCases=[]

//   if(pllCases.length==0){
//     console.log("PllCases Start",pllCases)
//   pllCaseSet.cases.forEach((pll,i)=>{
    
//     let newPllDict1= {
//       id:crypto.randomUUID(),
//       name:pll.name,
//       group:pll.group,
//       pllNumber:i,
//       algNumber:0,
//       algAttemptCount:null,
//       algSpeed:null,
//       algTps:null,
//       algs:pll.algs[0],
//       scrambles:pll.scrambles,

//     }
//     let newPllDict2= {
//       id:crypto.randomUUID(),
//       name:pll.name,
//       group:pll.group,
//       pllNumber:i,
//       algNumber:1,
//       algAttemptCount:null,
//       algSpeed:null,
//       algTps:null,
//       scrambles:pll.scrambles,
//       algs:pll.algs[1]
//     }
//     console.log("AddPll",i,newPllDict1,newPllDict2)
//     pllCases.push(newPllDict1)
//     pllCases.push(newPllDict2)
//   })
// }

  try {
    const count = await db.olls.count();
    console.log("Seeding",arrowOllSet)
    if (count>=0) { //Change to ===0 later
      await db.olls.clear();
      console.log("Seeding IndexedDB with default OLLs...");
      await db.olls.bulkPut(arrowOllSet);
      let newCount = await db.olls.count();
      console.log(`IndexedDB seeded — ${newCount} records now present.`);
      

      await db.plls.clear();
      console.log("Seeding IndexedDB with default OLLs...");

      await db.plls.bulkPut(pllCases);
      newCount = await db.plls.count();
      console.log(`IndexedDB seeded — ${newCount} records now present.`);

      await db.f2ls.clear();

      console.log("F2L after clear:", await db.f2ls.toArray());
      await db.f2ls.bulkPut(f2lCases)
      newCount = await db.f2ls.count();
      console.log(`IndexedDB seeded — ${newCount} records now present.`);

      console.log("F2L after clear2:", await db.f2ls.toArray());
    } else {
      console.log(`IndexedDB already has data (${count} records); skipping seed.`);
    }
  } catch (err) {
    console.error("Error while seeding IndexedDB:", err);
  }
}