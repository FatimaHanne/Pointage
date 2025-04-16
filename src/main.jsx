import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
 import Layout from "./components/Layout";
import Home from "./pages/Home"; 
import Admin from "./pages/admin/Admin";
 import Pointeur from "./pages/pointeur/Pointeur";
 import ListPointage from "./pages/list-pointage/ListPointage";
 import ListEtudiant from "./pages/listetudiant/ListEtudiant"
import AddPointage from "./pages/add-pointage/AddPointage"
import Pointer from "./pages/pointer/Pointer"
import { Toaster } from "react-hot-toast";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// import PrivateRoute from './components/PrivateRoute';
import Connexion from './components/Connexion';
import Inscription from "./components/Inscription";
// Définition des routes avec `createBrowserRouter`
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, // Page d'accueil par défaut
      { path: "/admin", element: <Admin />},
      { path: "/pointeur", element: <Pointeur /> },
      { path: "/listetudiant", element: <ListEtudiant /> },
       { path: "/add-pointage", element: <AddPointage /> },
      { path: "/list-pointage", element: <ListPointage /> },
      { path: "/pointer", element: <Pointer /> },
      { path: "/connexion", element: <Connexion /> },
      { path: "/inscription", element: <Inscription /> },
      // autres routes...
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster/>
      <RouterProvider router={router}> </RouterProvider>
  </React.StrictMode>
);
