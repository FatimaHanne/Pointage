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
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ListPointage() {
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
    <Stack alignItems="center" justifyContent="center" p={4}>
      <Box width="90%">
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Pointages du mois
        </Typography>

        {pointages.length === 0 ? (
          <Typography color="gray" mt={2}>
            Aucun pointage ce mois-ci.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell><strong>Nom</strong></TableCell>
                  <TableCell><strong>Téléphone</strong></TableCell>
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
  );
}
