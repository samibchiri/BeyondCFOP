
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from './layout/AppLayout.jsx'
import HomePage from "./pages/HomePage/HomePage.jsx";
import AlgTrainerPage from "./pages/AlgTrainerPage/AlgTrainerPage.jsx"
import TrainPage from "./pages/TrainSelectPage/TrainSelectPage.jsx";
import CornerPermutationPage from "./pages/CpPage/CornerPermutationPage.jsx";

import BarPersevationPage from "./pages/BarPersevationPage/BarPersevationPage.jsx";
import CpTrainer from './pages/CpTrainerPage/CpTrainerPage.jsx'
import BarTrainer from "./pages/BarTrainerPage/BarTrainer.jsx";
import PllTrainer from "./pages/PllTrainerPage/PllTrainerPage.jsx"
import LabsPage from "./pages/LabsPage/LabsPage.jsx";
// import LabsPage from "./1OllArrowGen.jsx"
import MyAlgsPage from "./pages/MyAlgsPage/MyAlgsPage.jsx";
import MyOllPage from "./pages/MyAlgsPage/MyOllPage.jsx"
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx'
import BarOverlay from "./pages/BarPersevationPage/SingleBarOverlay.jsx";

import { ArrowDataGenerator } from "./dataGeneration/ArrowDataGenerator.jsx";
import CheckAlgCorrect from "./pages/TrainSelectPage/CheckAlgCorrect.jsx";
import { PllDataGenerator } from "./dataGeneration/PllDataGenerator.jsx";
import { F2lDataGenerator } from "./dataGeneration/f2lDataGenerator.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, 
    children: [
      { index: true, element: <HomePage /> }, // homepage

      {
        path: "train",
        children: [
          { index: true, element: <HomePage /> },
          { path: "alg", element: <AlgTrainerPage /> },
          { path: "cp", element: <CpTrainer/> },
          { path: "bar", element: <BarTrainer /> },
          { path: "pll", element: <PllTrainer/>}
        ],
      },

      {
        path: "recognition",
        children: [
          { index: true, element: <CornerPermutationPage /> },
          { path: "cp", element: <CornerPermutationPage /> },
          { path: "bar", element: <BarPersevationPage /> },
        ],
      },

      { path: "labs", element: <LabsPage/>},
      // { path: "labs", element: <ArrowDataGenerator/>},
      { path: "myAlgs",
          children:[
            {index: true, element: <ArrowDataGenerator/>},
            // {index: true, element: <MyAlgsPage/>},
            { path: "oll", element: <MyOllPage/>}
          ] },
      { path: "*", element: <NotFoundPage /> },
      // <BarOverlay
                                  
      //                             ollAlg=""
      //                             pllAlg= "x R2 F R F' R U2 r' U r U2x'" 
      //                             ollId= "OLL 23-0"
      //                             /> 
    ],
    
  },
],
{
    basename: "/BeyondCFOP",
  });
