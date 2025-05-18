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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function ListPointage() {
  const navigate = useNavigate();
  const [pointages, setPointages] = useState([]);
  const [rolesParNumero, setRolesParNumero] = useState({});

  function getStartAndEndOfMonth() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  // 1. Charger tous les rôles par numéro depuis "ajout-pointeur"
  const fetchPointeurs = async () => {
    try {
      const snap = await getDocs(collection(db, "ajout-pointeur"));
      const data = snap.docs.map(doc => doc.data());
      const mapping = {};
      data.forEach(u => {
        // Assure-toi que le champ s'appelle bien "numeroUtilisateur"
        mapping[u.numeroUtilisateur] = u.role;
      });
      setRolesParNumero(mapping);
    } catch (err) {
      console.error("Erreur fetch pointeurs :", err);
    }
  };

  // 2. Charger les pointages du mois
  const fetchPointagesMois = async () => {
    try {
      const { start, end } = getStartAndEndOfMonth();
      const snap = await getDocs(collection(db, "pointages"));
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = all.filter(p => p.date >= start && p.date <= end);
      setPointages(filtered);
    } catch (err) {
      console.error("Erreur fetch pointages :", err);
    }
  };

  useEffect(() => {
    // On charge d'abord les rôles, puis les pointages
    async function init() {
      await fetchPointeurs();
      await fetchPointagesMois();
    }
    init();
  }, []);

  // Détermine le statut affiché (Admin vs Stagiaire) selon le rôle exact
  const getStatutAffiche = (numero) => {
    const role = rolesParNumero[numero];
    if (role === "admin" || role === "admin-principal") return "Admin";
    if (role) return "Stagiaire";
    return "Inconnu";
  };

  // Détermine la couleur selon le statut
  const getColorStatut = (statut) => {
    if (statut === "Admin") return "green";
    if (statut === "Stagiaire") return "blue";
    return "gray";
  };

  return (
    <Box sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
      <AppBar
        position="relative"
        elevation={4}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          top: 0, left: 0, right: 0,
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
              left: "50%",
            }}
          >
            Pointages du mois
          </Typography>
          <div>
            <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>
      <Stack alignItems="center" justifyContent="center" p={4}>
        <Box width="90%">
          {pointages.length === 0 ? (
            <Typography color="gray" mt={2}>
              Aucun pointage ce mois-ci.
            </Typography>
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
                  {pointages.map((p) => {
                    const statutAffiche = getStatutAffiche(p.numeroUtilisateur || p.phone);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{p.nom}</TableCell>
                        <TableCell>{p.numeroUtilisateur || p.phone}</TableCell>
                        <TableCell sx={{ color: getColorStatut(statutAffiche) }}>
                          {statutAffiche}
                        </TableCell>
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
