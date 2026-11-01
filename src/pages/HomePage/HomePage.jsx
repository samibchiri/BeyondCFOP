import React, { useContext, useState } from "react"; // removed 'use'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import CaseImage from "../../components/Oll/cubing/cubeImage.jsx";

import AlgTrainerPage from '../AlgTrainerPage/AlgTrainerPage.jsx';
import CornerPermutationPage from '../CpPage/CornerPermutationPage.jsx';
import ollCaseSet from "../../data/ollCaseSet.js";

// Bootstrap CSS fir-st
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaIcon } from '../../assets/fontAwesome.js';

// Your custom CSS after Bootstrap
import '../../styling/App.css';
import '../../styling/index.css';

import { ThemeContext } from '../../context/DarkThemeContext.jsx';

import useWindowDimensions from "../../hooks/useWindowDimensions.jsx";

import { useNavigate } from "react-router-dom";
import { router } from "../../Router.jsx";

export default function HomePage() {

    const { darkMode } = useContext(ThemeContext)
    const [caseClicked, setCaseClicked] = useState(false)
    const [buttonClicked, setButtonClicked] = useState(false)
    const [cpClicked, setCpClicked] = useState(false)
    const [barClicked, setBarClicked] = useState(false)
    const buttonStyle = {
        width: "80%",
        height: "120px",
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

    const navigate = useNavigate();


    const { width,xs } = useWindowDimensions();
    const cubeImageSize = xs ? "100" : "120";

    const TrainCategories = [
    { label: "Alg Trainer", route: "/train/alg" },
    
    { label: "CP Recognition", route: "/recognition/cp" },
    { label: "CP Trainer", route: "/train/cp" },

    { label: "Bar Recognition", route: "/recognition/bar" },
    { label: "Bar Trainer", route: "/train/bar" },
    
   { label: "Cp Trainer", route: "/labs" },
   
    { label: "Pll Trainer", route: "/train/pll"},

    { label: "Labs", route: "/labs" },
    { label: "My Algs", route: "/myAlgs" },
    ];
    
    return <>

        <div className='container-fluid'>
            <h2 className=''>Choose what you want to practice</h2>

            <div className='row'>
                {TrainCategories.map((caseItem, i) => (
                    <div key={2} style={{ maxWidth: "1200px", minHeight: "100px" }} 
                    className={`${i==0? " col-sm-12":" col-sm-6"} col-12 mb-3 d-flex justify-content-center`}>
                        <h2>{xs}</h2>
                        <button  onClick={() => navigate(caseItem.route)} className={`m-2 border btn-block btn ${darkMode ? "btn-dark" : "btn-primary"}`} style={{...buttonStyle, width:`${(i==0 &&width>=576)?"40%":"80%"}`}}>
                           {(width<1000 &&width>=576)? <div className='col'>
                                    <h2>{caseItem.label}</h2>
                                </div>
                                :
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >
                                <div>
                                    <CaseImage
                                        size={80}
                                        alg={"RUR'URU2R'"}
                                        caseSetDetails={ollCaseSet.details}
                                    ></CaseImage>
                                </div >
                                <div className='col'>
                                    <h2>{caseItem.label}</h2>
                                </div>
                                <div>
                                    <CaseImage
                                        size={80}
                                        alg={"RUR'URU2R'"}
                                        caseSetDetails={ollCaseSet.details}
                                    ></CaseImage>
                                </div>

                            </div>
                            }
                        </button>
                    </div>
                ))}

            </div>
        </div>
    </>
}
