import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ListEtudiant() {
  const [employés, setEmployés] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const fetchEmployés = async () => {
    try {
      const res = await axios.get("http://localhost:3000/ajout-pointeur");
      setEmployés(res.data);
    } catch (error) {
      console.error("Erreur de récupération des employés:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce pointeur ?");
    if (confirm) {
      try {
        await axios.delete(`http://localhost:3000/ajout-pointeur/${id}`);
        setEmployés((prev) => prev.filter((emp) => emp.id !== id));
        toast.success("Pointeur supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        toast.error("Échec de la suppression !");
      }
    }
  };

  const handleEdit = (employé) => {
    setEditingId(employé.id);
    setEditData({
      NomPointeur: employé.NomPointeur,
      PrenomPointeur: employé.PrenomPointeur,
      phone: employé.phone,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const updated = {
        ...employés.find(emp => emp.id === id),
        ...editData
      };
      await axios.put(`http://localhost:3000/ajout-pointeur/${id}`, updated);
      setEmployés((prev) =>
        prev.map((emp) => (emp.id === id ? updated : emp))
      );
      toast.success("Pointeur mis à jour !");
      setEditingId(null);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      toast.error("Erreur lors de la mise à jour !");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('admin')) {
      navigate('/connexion');
    } else {
      fetchEmployés();
    }
  }, []);

  return (
    <Box sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
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
                <IconButton edge="start" onClick={() => navigate("/admin")} sx={{ color: "#000" }}>
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
                Liste des pointeurs
                </Typography>
      
                <div>
                  <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
                </div>
              </Toolbar>
            </AppBar>
            <Stack
            spacing={2}
            width={"80%"}
            position={"relative"}
            zIndex={"10"}
            // marginTop={"20%"}
            sx={{
              // backgroundColor: "#fff",
              // position: "absolute",
              padding: 4,
              borderRadius: 2,
              // boxShadow: 3,
              marginTop: 4,
               
            }}
          >
            {employés && employés.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#85ACDC" }}> 
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Nom</strong></TableCell>
                      <TableCell><strong>Prénom</strong></TableCell>
                      <TableCell><strong>Numéro</strong></TableCell>
                      <TableCell><strong>Rôle</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employés.map((employé) => (
                      <TableRow key={employé.id}>
                        <TableCell>{employé.id}</TableCell>
                        <TableCell>
                          {editingId === employé.id ? (
                            <TextField
                              name="NomPointeur"
                              value={editData.NomPointeur}
                              onChange={handleEditChange}
                              size="small"
                            />
                          ) : (
                            employé.NomPointeur
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === employé.id ? (
                            <TextField
                              name="PrenomPointeur"
                              value={editData.PrenomPointeur}
                              onChange={handleEditChange}
                              size="small"
                            />
                          ) : (
                            employé.PrenomPointeur
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === employé.id ? (
                            <TextField
                              name="phone"
                              value={editData.phone}
                              onChange={handleEditChange}
                              size="small"
                            />
                          ) : (
                            employé.phone
                          )}
                        </TableCell>
                        <TableCell>
                          <strong style={{ color: employé.role === "admin" ? "green" : "blue" }}>
                            {employé.role}
                          </strong>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            {editingId === employé.id ? (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => handleSave(employé.id)}
                              >
                                Enregistrer
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(employé)}
                              >
                                Modifier
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleDelete(employé.id)}
                            >
                              Supprimer
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Aucun pointeur ajouté</Typography>
            )}
          </Stack>
    </Box>
  );
}
