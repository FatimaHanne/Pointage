
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
import toast from 'react-hot-toast';

import { db } from "../../firebase";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

export default function ListEtudiant() {
  const [employés, setEmployés] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const normalizeNumber = (num) => {
    return num.replace(/\D/g, "").replace(/^221/, "");
  };

  const fetchEmployés = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ajout-pointeur"));
      const employésArray = [];
      querySnapshot.forEach((docSnap) => {
        employésArray.push({ id: docSnap.id, ...docSnap.data() });
      });
      setEmployés(employésArray);
    } catch (error) {
      console.error("Erreur de récupération des employés:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce pointeur ?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "ajout-pointeur", id));
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
      numeroUtilisateur: employé.numeroUtilisateur,
      phone: employé.numeroUtilisateur,
      role: employé.role,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const normalizedPhone = normalizeNumber(editData.phone);

      const adminSnapshot = await getDocs(collection(db, "admins"));
      const adminMatch = adminSnapshot.docs.find((doc) => {
        const adminPhone = normalizeNumber(doc.data().numeroUtilisateur || "");
        return adminPhone === normalizedPhone;
      });

      const role = adminMatch ? "admin" : "stagiaire";
      const updatedData = {
        ...editData,
        numeroUtilisateur: editData.phone,
        role
      };

      await updateDoc(doc(db, "ajout-pointeur", id), updatedData);
      setEmployés((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, ...updatedData } : emp))
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

  // Filtrage par numéro, nom ou prénom
  const filteredEmployés = employés.filter((emp) => {
    const query = searchTerm.toLowerCase();
    return (
      emp.numeroUtilisateur.toLowerCase().includes(query) ||
      emp.NomPointeur.toLowerCase().includes(query) ||
      emp.PrenomPointeur.toLowerCase().includes(query)
    );
  });

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
              left: "50%"
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
        sx={{
          padding: 4,
          borderRadius: 2,
          marginTop: 4,
        }}
      >
        <TextField
          label="Rechercher un numéro, nom ou prénom"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {filteredEmployés.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#85ACDC" }}>
                  <TableCell sx={{ color: "#fff" }}><strong>ID</strong></TableCell>
                  <TableCell sx={{ color: "#fff" }}><strong>Nom</strong></TableCell>
                  <TableCell sx={{ color: "#fff" }}><strong>Prénom</strong></TableCell>
                  <TableCell sx={{ color: "#fff" }}><strong>Numéro</strong></TableCell>
                  <TableCell sx={{ color: "#fff" }}><strong>Statut</strong></TableCell>
                  <TableCell sx={{ color: "#fff" }}><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployés.map((employé) => (
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
                        employé.numeroUtilisateur
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
          <Typography align="center">Aucun pointeur trouvé</Typography>
        )}
      </Stack>
    </Box>
  );
}

