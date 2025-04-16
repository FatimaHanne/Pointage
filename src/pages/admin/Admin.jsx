import React, { useEffect } from 'react'
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router-dom'
// import ListEtudiant from "./pages/listetudiant/ListEtudiant"
const Admin = () => {
    const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('admin')) {
      navigate('/connexion')
    }
    // axios.get("http://localhost:3000/publications").then((res) => {
    //   setPublications(res.data);
    // });
  }, [navigate]);
  const links = [
    { to: '/listetudiant', label: 'Liste des etudiants', color: '#2e7d32' },
    { to: '/add-pointage', label: 'Ajouter un', color: '#6a1b9a' },
  ];

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
      <Box>
          <img
            src="/src/assets/defarsci.jpg" // Assurez-vous que le chemin est correct
            alt="Logo"
            style={{ height: 40 }}
          />
        </Box>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 , justifyContent:"end"}}>
          {links.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              sx={{
                backgroundColor: link.color,
                color: '#fff',
                '&:hover': {
                  backgroundColor: link.color,
                  opacity: 0.8,
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
        
      </Toolbar>
    </AppBar>
  );
};

export default Admin;
