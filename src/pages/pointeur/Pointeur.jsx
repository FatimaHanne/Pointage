import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
// import ListEtudiant from "./pages/listetudiant/ListEtudiant"
const Pointeur = () => {
  const links = [
    { to: '/list-pointage', label: 'Liste des pointages', color: '#2e7d32' },
    { to: '/pointer', label: 'Se Pointer', color: '#6a1b9a' },
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

export default Pointeur;
