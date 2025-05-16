import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ADMIN_PRINCIPAL_UID } from "../../constants";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";

const CreerCompte = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Nouvel état pour savoir si on est autorisé
  const [authorized, setAuthorized] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Vérifie si on est bien l'admin principal
    if (!user) {
      setAuthorized(false);
    } else if (user.uid === ADMIN_PRINCIPAL_UID) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [user]);

  // Tant que l'autorisation n'est pas déterminée, on peut ne rien afficher
  if (authorized === null) {
    return null;
  }

  // Si non autorisé, on affiche un message et un bouton de retour
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
            Vous n'êtes pas l'administrateur principal.
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

  // Sinon, on affiche le formulaire de création d'admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email,
        nom,
        role: "admin",
        createdAt: new Date(),
      });

      setMessage("✅ Compte admin créé avec succès !");
      setEmail("");
      setPassword("");
      setNom("");
    } catch (error) {
      setMessage("❌ Erreur : " + error.message);
    }
  };

  return (
    <Box sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
      <AppBar
        position="relative"
        elevation={4}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
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
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: "bold",
              color: "#0D6EFD",
            }}
          >
            Création admin
          </Typography>

          <div>
            <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>

      <Stack spacing={2} width={"80%"} mx="auto" mt={5}>
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={3} color="#0D6EFD">
            Créer un compte admin
          </Typography>
          <form onSubmit={handleCreateAdmin}>
            <TextField
              label="Nom"
              fullWidth
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#0D6EFD", width: "20%" }}
            >
              Créer l’admin
            </Button>
          </form>

          {message && (
            <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default CreerCompte;
