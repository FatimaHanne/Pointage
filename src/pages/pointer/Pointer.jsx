import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
// 🔥 Assure-toi que db est bien importé

export default function Pointer() {
  const navigate = useNavigate();
  const [pointages, setPointages] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const today = new Date().toISOString().split("T")[0];

  const fetchPointages = async () => {
    try {
      const q = query(collection(db, "pointages"), where("date", "==", today));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        statut: doc.data().statut,  
      }));
      const sorted = data.sort((a, b) => (a.entree > b.entree ? -1 : 1));
      setPointages(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des pointages.");
    }
  };

  useEffect(() => {
    fetchPointages();
  }, []);

const onSubmit = async ({ phone }) => {
  const now = new Date();
  const heures = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = heures * 60 + minutes; // Total de minutes depuis minuit
    console.log("Current Time (en minutes depuis minuit) :", currentTime); // Ajouter ce log

  const matinDebut = 8 * 60;     // 8h00
  const matinFin = 12 * 60;      // 12h00 inclus
  const soirDebut = 15 * 60;     // 15h00
  const soirFin = 18 * 60;       // 18h00 inclus

  const isInMorningWindow = currentTime >= matinDebut && currentTime <= matinFin;
  const isInEveningWindow = currentTime >= soirDebut && currentTime <= soirFin;

  try {
    const qPointeur = query(collection(db, "ajout-pointeur"), where("phone", "==", phone));
    const resPointeur = await getDocs(qPointeur);
    const pointeurDoc = resPointeur.docs[0];

    if (!pointeurDoc) {
      toast.error("L'utilisateur n'existe pas !");
      return;
    }

    const pointeur = pointeurDoc.data();
    const role = pointeur.role === "admin" ? "admin" : "stagiaire";
    const nomComplet = `${pointeur.PrenomPointeur} ${pointeur.NomPointeur}`;

    const today = new Date().toISOString().split("T")[0];
    const qPointage = query(
      collection(db, "pointages"),
      where("phone", "==", phone),
      where("date", "==", today)
    );
    const resPointage = await getDocs(qPointage);
    const pointageDoc = resPointage.docs[0];

    if (!pointageDoc) {
      // Si aucune entrée encore aujourd'hui
      if (isInMorningWindow) {
        await addDoc(collection(db, "pointages"), {
          nom: nomComplet,
          phone: pointeur.phone,
          date: today,
          entree: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          statut: role,
        });
        toast.success("Entrée enregistrée !");
      } else {
        toast.error("L’entrée est autorisée uniquement de 8h00 à 12h00.");
      }
    } else {
      // Si une entrée existe déjà, on vérifie si la sortie est déjà enregistrée
      const pointage = pointageDoc.data();
      if (!pointage.sortie) {
        if (isInEveningWindow) {
          await updateDoc(doc(db, "pointages", pointageDoc.id), {
            sortie: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          });
          toast.success("Sortie enregistrée !");
        } else {
          toast.error("La sortie est autorisée uniquement de 15h00 à 18h00.");
        }
      } else {
        toast.error("Vous avez déjà pointé l'entrée et la sortie aujourd'hui.");
      }
    }

    fetchPointages();
    reset();
  } catch (error) {
    console.error("Erreur lors du pointage :", error);
    toast.error("Une erreur s'est produite.");
  }
};


  return (
    <>
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
          <IconButton edge="start" onClick={() => navigate("/pointeur")} sx={{ color: "#000" }}>
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
            Pointage
          </Typography>
          <div>
            <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>

      <Stack alignItems="center" justifyContent="center" width="100%" minHeight="100vh" sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", padding: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="flex-start"
          justifyContent="center"
          width="100%"
          minHeight="100vh"
          sx={{
            background: "linear-gradient(135deg, #E3F2FD, #ffffff)",
            paddingTop: "100px",
            overflowX: "auto",
            flexWrap: "nowrap",
          }}
        >
          {/* Formulaire */}
          <Box
            width={400}
            sx={{
              flex: 1,
              maxWidth: 500,
              padding: 4,
              borderRadius: 2,
              border: "1px solid #ddd",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="column" spacing={2}>
                <Typography fontWeight="bold">Téléphone</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
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
                <Stack direction="row" justifyContent="center">
                  <Button variant="contained" type="submit" sx={{ marginTop: 1, paddingX: 3, paddingY: 1 }}>
                    Pointer
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>

          {/* Liste des pointages */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 500,
              padding: 4,
              borderRadius: 2,
              border: "1px solid #ddd",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" fontWeight="bold" marginBottom={2}>
            Liste des présents
          </Typography>
          <Divider />
          {pointages.length === 0 ? (
            <Typography color="gray" mt={2}>
              Aucun pointage pour aujourd’hui.
            </Typography>
          ) : (
            pointages.map((p) => (
              <Box
                key={p.id}
                mb={2}
                p={2}
                sx={{ backgroundColor: "#fff", borderRadius: 1, border: "1px solid #e0e0e0" }}
              >
              <Typography><strong>Statut :</strong> {p.statut}</Typography>
    
                <Typography><strong>Téléphone :</strong> {p.phone}</Typography>
                <Typography color={p.entree ? "green" : "gray"}>
                  <strong>Entrée :</strong> {p.entree || "—"}
                </Typography>
                <Typography color={p.sortie ? "blue" : "gray"}>
                  <strong>Sortie :</strong> {p.sortie || "—"}
                </Typography>
              </Box>
            ))
          )}
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
