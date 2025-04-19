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
  TextField
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
    <Stack
      spacing={2}
      width={"80%"}
      sx={{
        backgroundColor: "#fff",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        marginBottom: 4,
      }}
    >
      <Typography variant="h6" mb={2}>
        Liste des pointeurs
      </Typography>

      {employés && employés.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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
  );
}
