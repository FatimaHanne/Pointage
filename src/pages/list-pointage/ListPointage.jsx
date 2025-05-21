import {
  Box,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function ListPointage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pointages, setPointages] = useState([]);
  const [rolesParNumero, setRolesParNumero] = useState({});
  const navigate = useNavigate();

  // 🔁 Récupère les rôles à partir de la collection "ajout-pointeur"
  const fetchRoles = async () => {
    const snap = await getDocs(collection(db, "ajout-pointeur"));
    const mapping = {};
    snap.docs.forEach(doc => {
      const { phone, role } = doc.data();
      mapping[phone] = role;
    });
    setRolesParNumero(mapping);
  };

  // 📆 Récupère les pointages du mois en cours
  const fetchPointagesDuMois = async () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    const snap = await getDocs(collection(db, "pointages"));
    const data = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.date >= start && p.date <= end);

    setPointages(data);
  };

  useEffect(() => {
    fetchRoles();
    fetchPointagesDuMois();
  }, []);

  // 🏷️ Statut à afficher
  const getStatut = (phone) => {
    const role = rolesParNumero[phone];
    if (role === "admin" || role === "admin-principal") return "Admin";
    if (role) return "Stagiaire";
    return "Inconnu";
  };

  const getCouleurStatut = (statut) => {
    if (statut === "Admin") return "green";
    if (statut === "Stagiaire") return "blue";
    return "gray";
  };

  // 🔍 Filtrage de la recherche
 const pointagesFiltres = pointages.filter((p) => {
  const term = searchTerm.toLowerCase();

  // On récupère les champs en string ou chaine vide sinon
  const nom = p.nom ? String(p.nom).toLowerCase() : "";
  const numeroUtilisateur = p.numeroUtilisateur ? String(p.numeroUtilisateur).toLowerCase() : "";
  const phone = p.phone ? String(p.phone).toLowerCase() : "";

  return nom.includes(term) || numeroUtilisateur.includes(term) || phone.includes(term);
});


  return (
    <Box sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
      <AppBar position="relative" elevation={4} sx={{ backgroundColor: "transparent", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
        <Toolbar className="px-3 d-flex justify-content-between w-100">
          <IconButton onClick={() => navigate("/pointeur")} sx={{ color: "#000" }}>
            <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0D6EFD" }}>
            Pointages du mois
          </Typography>
          <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
        </Toolbar>
      </AppBar>

      <Stack alignItems="center" justifyContent="center" p={4}>
        <Box width="90%">
          <TextField
            fullWidth
            label="Rechercher par nom ou téléphone"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          {pointagesFiltres.length === 0 ? (
            <Typography color="gray" mt={2}>Aucun pointage trouvé.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#85ACDC" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}><strong>Nom</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>Téléphone</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>Statut</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>Date</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>Entrée</strong></TableCell>
                    <TableCell sx={{ color: "#fff" }}><strong>Sortie</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pointagesFiltres.map(p => {
                    const statut = getStatut(p.phone);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{p.nom}</TableCell>
                        <TableCell>{p.phone}</TableCell>
                        <TableCell sx={{ color: getCouleurStatut(statut) }}>{statut}</TableCell>
                        <TableCell>{p.date}</TableCell>
                        <TableCell>{p.entree || "—"}</TableCell>
                        <TableCell>{p.sortie || "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
