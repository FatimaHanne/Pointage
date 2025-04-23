import {Box,Typography,Stack,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,AppBar,Toolbar,IconButton,} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ListPointage() {
  const navigate = useNavigate();
  const [pointages, setPointages] = useState([]);

  function getStartAndEndOfMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  const fetchPointagesMois = () => {
    const { start, end } = getStartAndEndOfMonth();
    axios.get("http://localhost:3000/pointages").then((res) => {
      const data = res.data.filter((p) => p.date >= start && p.date <= end);
      setPointages(data);
    });
  };

  useEffect(() => {
    fetchPointagesMois();
  }, []);

  return (
   <Box  sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
     <AppBar
         position="relative"
        elevation={4}
                  sx={{
          backgroundColor: "transparent",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
           top: 0,
          left: 0,
           right: 0,
                  
        }}
      >
         <Toolbar className="position-relative px-3 d-flex justify-content-between w-100">
          <IconButton edge="start" onClick={() => navigate("/pointeur")} sx={{ color: "#000" }}>
            <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
          </IconButton>
    
          <Typography
            variant="h6"
             sx={{
              position: "absolute",
               transform: "translateX(-50%)",
               fontWeight: "bold",
               color: "#0D6EFD",
                        
              left:"50%"
                        
             }}
          >
               Pointages du mois
          </Typography>
          <div>
            <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>
     <Stack alignItems="center" justifyContent="center" p={4} >
      <Box width="90%">
        {pointages.length === 0 ? (
          <Typography color="gray" mt={2}>
            Aucun pointage ce mois-ci.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{backgroundColor:""}}>
            <Table>
              <TableHead sx={{ backgroundColor: "#85ACDC" }}>
                <TableRow>
                  <TableCell><strong>Nom</strong></TableCell>
                  <TableCell><strong>Téléphone</strong></TableCell>
                  <TableCell><strong>Rôle</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Entrée</strong></TableCell>
                  <TableCell><strong>Sortie</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pointages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nom}</TableCell>
                    <TableCell>{p.phone}</TableCell>
                    <TableCell  >{p.role === "admin" ? "Admin" : "Étudiant"}</TableCell> 
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.entree || "—"}</TableCell>
                    <TableCell>{p.sortie || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Stack>
   </Box>
  );
}
