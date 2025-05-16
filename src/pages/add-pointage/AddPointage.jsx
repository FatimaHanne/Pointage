import {
  AppBar, Box, Button, IconButton, Stack, TextField, Toolbar, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase"; // Assure-toi que tu as bien cette configuration Firebase
import {
  collection, getDocs, query, where, addDoc
} from "firebase/firestore";

export default function AddPointage() {
  const navigate = useNavigate();
  const [employés, setEmployés] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Effectuer une vérification à chaque chargement de la page
  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/connexion");
    }
    fetchEmployés();
  }, []);

  // Fonction pour récupérer les employés depuis Firestore
  const fetchEmployés = async () => {
    const snapshot = await getDocs(collection(db, "ajout-pointeur"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEmployés(data);
  };

  const onSubmit = async (data) => {
  try {
    // Fonction pour normaliser les numéros de téléphone (éliminer les caractères non-numériques et le préfixe 221)
    const normalizeNumber = (num) => {
      if (!num) return "";
      return num.replace(/\D/g, "").replace(/^221/, "");
    };

    // Normalisation du numéro de téléphone saisi dans le formulaire
    const normalizedPhone = normalizeNumber(data.phone);

    // Récupération de tous les documents de la collection "admins"
    const adminSnapshot = await getDocs(collection(db, "admins"));

    // Vérification si le numéro existe dans la collection "admins"
    let isAdmin = false;
    adminSnapshot.forEach((doc) => {
      // Récupérer le numéro de l'administrateur et le normaliser
      const adminPhone = normalizeNumber(doc.data().numeroUtilisateur || "");
      
      // Afficher à des fins de débogage
      console.log("Numéro normalisé du pointeur:", normalizedPhone);
      console.log("Numéro normalisé de l'admin:", adminPhone);
      
      // Vérifier si les numéros correspondent
      if (normalizedPhone === adminPhone) {
        isAdmin = true;
      }
    });

    // Déterminer le rôle en fonction de la correspondance
    const role = isAdmin ? "admin" : "stagiaire";
    console.log("Rôle attribué:", role);

    // Vérifier si ce numéro existe déjà dans la collection "ajout-pointeur"
    const q = query(collection(db, "ajout-pointeur"), where("phone", "==", normalizedPhone));
    const doublonSnapshot = await getDocs(q);
    if (!doublonSnapshot.empty) {
      toast.error("Ce numéro est déjà enregistré");
      return;
    }

    // Préparer les données à envoyer avec le téléphone normalisé et le rôle
    const pointeurAvecRole = {
      NomPointeur: data.NomPointeur,
      PrenomPointeur: data.PrenomPointeur,
      phone: normalizedPhone,
      role: role,
    };
    console.log("objet a envoyer:", pointeurAvecRole)
    // Enregistrer dans Firestore
    await addDoc(collection(db, "ajout-pointeur"), pointeurAvecRole);
    toast.success(`Ajouté avec succès comme ${role}`);
    reset();
    fetchEmployés();
    navigate("/Pointer");

  } catch (err) {
    console.error(err);
    toast.error("Une erreur est survenue");
  }
};
  return (
    <Box sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
      <AppBar position="absolute" elevation={4} sx={{ backgroundColor: "transparent", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", zIndex: 10 }}>
        <Toolbar className="position-relative px-3 d-flex justify-content-between w-100">
          <IconButton edge="start" onClick={() => navigate("/admin")} sx={{ color: "#000" }}>
            <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
          </IconButton>
          <Typography variant="h6" sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontWeight: "bold", color: "#0D6EFD" }}>
            Ajouter un pointeur
          </Typography>
           <div>
            <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>

      <Stack alignItems={"center"} justifyContent={"center"} width={"100%"} height={"100vh"}>
        <Box width={400} sx={{ backgroundColor: "#fff", padding: 4, borderRadius: 2, boxShadow: 3, marginTop: 4 }}>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Ajouter un pointeur
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Prénom"
                size="small"
                {...register("PrenomPointeur", {
                  required: "Veuillez saisir votre prénom",
                  minLength: { value: 3, message: "Au moins 3 caractères" },
                })}
                error={!!errors.PrenomPointeur}
                helperText={errors.PrenomPointeur?.message}
              />
              <TextField
                label="Nom"
                size="small"
                {...register("NomPointeur", {
                  required: "Veuillez saisir votre nom",
                  minLength: { value: 2, message: "Au moins 2 caractères" },
                })}
                error={!!errors.NomPointeur}
                helperText={errors.NomPointeur?.message}
              />
              <TextField
                label="Téléphone"
                size="small"
                type="tel"
                {...register("phone", {
                  required: "Veuillez entrer un numéro valide",
                  pattern: {
                    value: /^[0-9]{9,}$/,
                    message: "Numéro invalide (au moins 9 chiffres)",
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <Button variant="contained" type="submit">Ajouter</Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Box>
  );
}
