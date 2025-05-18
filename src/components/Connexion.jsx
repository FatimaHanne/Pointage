import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingRedirect, setLoadingRedirect] = useState(true);

  // Redirection automatique si utilisateur admin est déjà connecté
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      const parsedData = JSON.parse(adminData);
      // On vérifie que c'est bien un admin (role admin ou user admin)
      if (parsedData.role === "admin" || parsedData.role === "user") {
        // Rediriger vers la page admin si on est sur la page connexion
        if (location.pathname === "/connexion") {
          navigate("/admin", { replace: true });
        }
      }
    }
    setLoadingRedirect(false);
  }, [location.pathname, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.mailUtilisateur,
        data.motDePasse
      );
      const user = userCredential.user;

      // 1. Chercher dans la collection admins
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        localStorage.setItem(
          "admin",
          JSON.stringify({ ...adminData, role: "admin" })
        );
        toast.success("Connexion réussie ");
        navigate("/admin", { replace: true });
        return;
      }

      // 2. Chercher dans la collection users (admins secondaires ?)
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        localStorage.setItem(
          "admin",
          JSON.stringify({ ...userData, role: "user" })
        );
        toast.success("Connexion réussie");
        navigate("/admin", { replace: true });
        return;
      }

      // Pas trouvé → pas droit admin
      toast.error("Vous n'avez pas les droits administrateur");
    } catch (error) {
      console.error("Erreur de connexion :", error);
      toast.error("Email ou mot de passe incorrect");
    }
  };

  if (loadingRedirect) {
    return <div>Chargement...</div>;
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #E3F2FD, #ffffff)",
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="absolute"
        elevation={4}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Toolbar className="position-relative px-3 d-flex justify-content-between w-100">
          <IconButton
            edge="start"
            onClick={() => navigate("/")}
            sx={{ color: "#000" }}
          >
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
            Se Connecter
          </Typography>

          <div>
            <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>

      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
        height={"100vh"}
      >
        <Box
          width={400}
          sx={{
            padding: 3,
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            mt: 10,
          }}
        >
          <Typography variant={"h4"}>Connexion</Typography>
          <form style={{ marginTop: 16 }} onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={"column"} gap={2}>
              <TextField
                label="Veuillez saisir votre adresse email"
                variant="outlined"
                fullWidth
                size="small"
                type="email"
                {...register("mailUtilisateur", {
                  required: "Veuillez saisir votre adresse mail",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Veuillez saisir une adresse email valide",
                  },
                })}
                error={!!errors.mailUtilisateur}
                helperText={errors.mailUtilisateur?.message}
              />
              <TextField
                label="Veuillez saisir un mot de passe"
                variant="outlined"
                fullWidth
                size="small"
                type="password"
                {...register("motDePasse", {
                  required: "Veuillez saisir un mot de passe",
                  minLength: {
                    value: 6,
                    message: "Mot de passe de 6 caractères minimum",
                  },
                })}
                error={!!errors.motDePasse}
                helperText={errors.motDePasse?.message}
              />
            </Stack>
            <Button variant="contained" sx={{ marginTop: 2 }} type="submit">
              Connexion
            </Button>
          </form>
        </Box>
      </Stack>
    </Box>
  );
}
