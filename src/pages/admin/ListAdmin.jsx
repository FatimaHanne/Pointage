import { useEffect, useState } from "react";
import { deleteDoc, doc , collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ListAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [authorized, setAuthorized] = useState(null);
  const navigate = useNavigate();
  const handleDeleteAdmin = async (uid) => {
    try {
      // 1. Trouver le document Firestore qui a ce uid
      const snapshot = await getDocs(query(collection(db, "users"), where("uid", "==", uid)));
      if (snapshot.empty) {
        alert("Admin non trouvé dans Firestore.");
        return;
      }

      const docId = snapshot.docs[0].id;

      // 2. Supprimer le document Firestore
      await deleteDoc(doc(db, "users", docId));

      // 3. Supprimer dans l'état local
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.uid !== uid));

       toast.success("Admin supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
       toast.error("Erreur lors de la suppression de l'admin.");
    }
  };

  useEffect(() => {
    // 1. Vérifier le rôle dans localStorage
    const stored = localStorage.getItem("admin");
    if (!stored) {
      setAuthorized(false);
      return;
    }

    let adminData;
    try {
      adminData = JSON.parse(stored);
    } catch {
      setAuthorized(false);
      return;
    }

    if (adminData.role !== "admin") {
      // Ce n'est pas l'admin principal
      setAuthorized(false);
      return;
    }

    // C'est l'admin principal
    setAuthorized(true);

    // 2. On peut charger la liste des autres admins
    (async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "admin"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAdmins(list);
      } catch (error) {
        console.error("Erreur lors du chargement des admins :", error);
      }
    })();
  }, []);

  // 3. En attente de la vérification, on peut afficher un loader ou rien
  if (authorized === null) {
    return null; // ou un petit spinner si tu veux
  }

  // 4. Si non autorisé, afficher le message
  if (!authorized) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #E3F2FD, #ffffff)",
          p: 3,
        }}
      >
        <IconButton
        onClick={() => navigate("/admin")}
        sx={{ position: "absolute", top: 16, left: 16, color: "#000" }}
        edge="start"
      >
        <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
      </IconButton>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Accès non autorisé
          </Typography>
          <Typography variant="body1">
            Vous n'avez pas les droits pour accéder à cette page.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/admin")}
          >
            Retour à la page admin
          </Button>
        </Paper>
      </Box>
    );
  }

  // 5. Sinon, on affiche la liste
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #E3F2FD, #ffffff)",
        minHeight: "100vh",
        pb: 4,
      }}
    >
      <AppBar
        position="relative"
        elevation={4}
        sx={{ backgroundColor: "transparent", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
      >
        <Toolbar className="position-relative px-3 d-flex justify-content-between w-100">
          <IconButton edge="start" onClick={() => navigate("/admin")} sx={{ color: "#000" }}>
            <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
              color: "#0D6EFD",
            }}
          >
            Liste des administrateurs
          </Typography>
          <div>
            <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>

      <Stack width="90%" maxWidth={900} mx="auto" mt={5}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <TableContainer>
            <Table>
            <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#0D6EFD" }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0D6EFD" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0D6EFD" }}>UID</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0D6EFD" }}>Numéro</TableCell> {/* Nouvelle colonne */}
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.nom}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.uid}</TableCell>
                <TableCell>{admin.phone}</TableCell> {/* Affiche le numéro */}
                <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteAdmin(admin.uid)}
                    >
                      Supprimer
                    </Button>
              </TableCell>

              </TableRow>
            ))}
          </TableBody>

            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ListAdmin;
