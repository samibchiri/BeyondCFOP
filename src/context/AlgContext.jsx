import React, { createContext, useContext } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/NewGeneratedData/db.js";

const AlgContext = createContext(null);

export const useAlgs = () => useContext(AlgContext);

export const AlgProvider = ({ children }) => {

    const allOlls = useLiveQuery(
        () => db.olls.toArray().then(arr =>
            arr.sort((a, b) =>
                a.ollNumber - b.ollNumber ||
                a.algNumber - b.algNumber
            )
        ),
        []
    ) ?? [];

    const allPlls = useLiveQuery(
        () => db.plls.toArray().then(arr =>
            arr.sort((a, b) =>
                a.pllNumber - b.pllNumber ||
                a.algNumber - b.algNumber
            )
        ),
        []
    ) ?? [];

    const allf2ls = useLiveQuery(
        () => db.f2ls.toArray().then(arr =>
            arr.sort((a, b) =>
                a.f2lNumber - b.f2lNumber ||
                a.algNumber - b.algNumber
            )
        ),
        []
    ) ?? [];

    const data = {
        oll: {
            all: allOlls,
            table: db.olls,
            numberField: "ollNumber",
            sortFunction: (a, b) =>
            a.ollNumber - b.ollNumber ||
            a.algNumber - b.algNumber,
            createEmpty: (existing, number, group, algNumber) => ({
            ...existing,
            id: crypto.randomUUID(),
            ollNumber: number,
            algNumber,
            group,
            algs: "",
            algSpeed: null,
            algTps: null,
            algAttemptCount: null,

            // OLL-specific fields
            // ...
        })
    
        },
        pll: {
            all: allPlls,
            table: db.plls,
            numberField: "pllNumber",
            sortFunction: (a, b) =>
            a.pllNumber - b.pllNumber ||
            a.algNumber - b.algNumber,
            createEmpty: (existing, number, group, algNumber) => ({
            ...existing,
            id: crypto.randomUUID(),
            pllNumber: number,
            algNumber,
            group,
            algs: "",

            // PLL-specific fields
            // ...
        })
        },
        f2l: {
            all: allf2ls,
            table: db.f2ls,
            numberField: "f2lNumber",
            sortFunction: (a, b) =>
            a.f2lNumber - b.f2lNumber ||
            a.algNumber - b.algNumber,
            createEmpty: (existing, number, group, algNumber) => ({
            ...existing,
            id: crypto.randomUUID(),

        name: existing.name,
        group: group,

        f2lNumber: number,
        algNumber: algNumber,

        algAttemptCount: null,
        algSpeed: null,
        algTps: null,

        algs: "",

        scrambles: existing.scrambles,

        slotsPerserved: []

            // f2l-specific fields
            // ...
        })
        }
    };


    const changeAlg = async(type,newAlg, oldAlg) =>{
        const { table, numberField, all } = data[type];

        await table.update(oldAlg.id, {
            ...oldAlg,
            algs: newAlg,
            algSpeed:null,
            algTps:null,
            algAttemptCount:null
        });
    } 

    const getAlgsByGroup = (type, group) => {
        return data[type].all.filter(alg => alg.group === group);
    };

    const addAlg = async (type, number, group, newAlg) => {
        const { table, numberField, all } = data[type];

        const existing = all.filter(
            alg => alg[numberField] === number
        );

        const maxAlgNumber = existing.length > 0
            ? Math.max(...existing.map(alg => alg.algNumber))
            : -1;

        await table.add({
            id: crypto.randomUUID(),
            [numberField]: number,
            algNumber: maxAlgNumber + 1,
            group,
            algs: newAlg,

           ...(type === "f2l" && {
            slotsPerserved: []})
        });
    };

   const createEmptySlot = async (type, number, group) => {
    const { table, numberField, createEmpty } = data[type];

    const existing = await table
        .where(numberField)
        .equals(number)
        .toArray();

    console.log("CreateEmptySlot", existing);

    const hasEmptySlot = existing.some(
        alg => alg.algs === ""
    );

    if (hasEmptySlot) {
        console.log("HasEmptySlot");
        return;
    }

    if (existing.length === 0) {
        return;
    }

    const maxAlgNumber = Math.max(
        ...existing.map(alg => alg.algNumber)
    );

    const newSlot = createEmpty(
        existing[0],
        number,
        group,
        maxAlgNumber + 1
    );

    await table.add(newSlot);

    console.log(
        "Created empty slot:",
        newSlot
    );
    const allAlgs = await table.toArray();
    console.log("ALL ALGS IN DB:", allAlgs);
};

    const swapAlgNumbers = async (type, firstAlg, secondAlg) => {
        const table = data[type].table;

        await db.transaction("rw", table, async () => {
            await table.update(firstAlg.id, {
                algNumber: secondAlg.algNumber
            });

            await table.update(secondAlg.id, {
                algNumber: firstAlg.algNumber
            });
        });
    };

    return (
        <AlgContext.Provider
            value={{
                data,
                getAlgsByGroup,
                addAlg,
                createEmptySlot,
                swapAlgNumbers,
                changeAlg
            }}
        >
            {children}
        </AlgContext.Provider>
    );
};