import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom'
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
  Button
} from '@mui/material';
import axios from 'axios';

export default function ListEtudiant() {
  const [employés, setEmployés] = useState([]);
  const navigate = useNavigate()
  const fetchEmployés = async () => {
    try {
      const res = await axios.get("http://localhost:3000/ajout-pointeur");
      setEmployés(res.data);
    } catch (error) {
      console.error("Erreur de récupération des employés:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('admin')) {
      navigate('/connexion')
    }
    fetchEmployés();
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
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employés.map((employé) => (
                <TableRow key={employé.id}>
                  <TableCell>{employé.id}</TableCell>
                  <TableCell>{employé.NomPointeur}</TableCell>
                  <TableCell>{employé.PrenomPointeur}</TableCell>
                  <TableCell>{employé.phone}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => console.log("Modifier", employé.id)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => console.log("Supprimer", employé.id)}
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
