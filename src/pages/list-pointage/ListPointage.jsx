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

  const fetchPointeurs = async () => {
    try {
      const snap = await getDocs(collection(db, "ajout-pointeur"));
      const data = snap.docs.map(doc => doc.data());
      const mapping = {};
      data.forEach(u => {
        mapping[u.numeroUtilisateur] = u.role;
      });
      setRolesParNumero(mapping);
    } catch (err) {
      console.error("Erreur fetch pointeurs :", err);
    }
  };

  const fetchPointagesMois = async () => {
    try {
      const { start, end } = getStartAndEndOfMonth();
      const snap = await getDocs(collection(db, "pointages"));
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = all.filter(p => p.date >= start && p.date <= end);
      setPointages(filtered);
    } catch (err) {
      console.error("Erreur fetch pointages :", err);
    }
  };

  useEffect(() => {
    async function init() {
      await fetchPointeurs();
      await fetchPointagesMois();
    }
    init();
  }, []);

  const getStatutAffiche = (numero) => {
    const role = rolesParNumero[numero];
    if (role === "admin" || role === "admin-principal") return "Admin";
    if (role) return "Stagiaire";
    return "Inconnu";
  };

  const getColorStatut = (statut) => {
    if (statut === "Admin") return "green";
    if (statut === "Stagiaire") return "blue";
    return "gray";
  };

  // 🔍 Filtrage des pointages selon la recherche
  const pointagesFiltres = pointages.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nom?.toLowerCase().includes(term) ||
      p.numeroUtilisateur?.toLowerCase().includes(term) ||
      p.phone?.toLowerCase().includes(term)
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
          <TextField
            fullWidth
            label="Rechercher par nom ou téléphone"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          {pointagesFiltres.length === 0 ? (
            <Typography color="gray" mt={2}>
              Aucun pointage trouvé.
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
                  {pointagesFiltres.map((p) => {
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
