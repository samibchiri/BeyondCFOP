
import React, { useContext, useState, useEffect } from "react"; 

import { ThemeContext } from '../../context/DarkThemeContext.jsx';
import { FaIcon } from '../../assets/fontAwesome.js';

export function LabsRemoveButton({onClick}){
    
    const { darkMode } = useContext(ThemeContext)
    
     const ContinueButtonstyle = {
        alignItems: "center",
        fontWeight: "bold",
        borderWidth: "2px",
        height: "80px",
        backgroundColor:"red",
        fontSize: "1.5rem",
    }

    return          <button onClick={onClick} className={`LabsRemoveButton ${darkMode ? "btn-dark border-3 btn-back-dark" : "btn-secondary border-3 border-dark btn-back-light"} border border-2 btn `}
                    
                    style={{
                    
                        ...ContinueButtonstyle,
                                            }}
                                            > Remove <FaIcon icon="trash" style={{color:"white",fontSize:"30px"}} />
                                                                        </button>
}