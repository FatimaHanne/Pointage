import { Box, Button, Stack, TextField, Typography, Divider, AppBar, Toolbar, IconButton } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Pointer() {
  const navigate = useNavigate();
  const [pointages, setPointages] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  // const heureNow = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); // Donne "15:42"

  const fetchPointages = () => {
    axios.get(`http://localhost:3000/pointages?date=${today}`).then((res) => {
      // Trier par heure d’entrée
      const data = res.data.sort((a, b) => (a.entree > b.entree ? -1 : 1));
      setPointages(data);
    });
  };

  useEffect(() => {
    fetchPointages();
  }, []);

  const onSubmit = async ({ phone }) => {
    const now = new Date(); // <== à ne surtout pas oublier !
    const heureNow = now.toLocaleTimeString("fr-FR", { hour12: false });
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const morningStart = 8 * 60;
    const morningEnd = 12 * 60 + 0; // ou simplement 720
    const eveningStart = 15 * 60;
    const eveningEnd = 18 * 60;
  
    try {
      const resPointeur = await axios.get(`http://localhost:3000/ajout-pointeur?phone=${phone}`);
      const pointeur = resPointeur.data[0]; // Le pointeur trouv
  
      if (!pointeur) {
        toast.error("L'utilisateur n'existe pas !");
        return;
      }
      const role = pointeur.role === "admin" || pointeur.role === "etudiant" ? pointeur.role : "etudiant"; // Valeur par défaut "etudiant"
  
      const nomComplet = `${pointeur.PrenomPointeur} ${pointeur.NomPointeur}`;
  
      const resPointage = await axios.get(`http://localhost:3000/pointages?phone=${phone}&date=${today}`);
      const pointage = resPointage.data[0];
  
      const isInMorningWindow = currentTime >= morningStart && currentTime <= morningEnd;
      const isInEveningWindow = currentTime >= eveningStart && currentTime <= eveningEnd;
  
      if (!pointage) {
        if (isInMorningWindow) {
          const newPointage = {
            nom: nomComplet,
            phone: pointeur.phone,
            date: today,
            entree: heureNow,
            role: role, // Assigner le rôle récupéré de la base de donnée,
          };
          await axios.post("http://localhost:3000/pointages", newPointage);
          toast.success("Entrée enregistrée");
        } else {
          toast.error("L’entrée est autorisée uniquement de 8h à 12h");
        }
      } else if (!pointage.sortie) {
        if (isInEveningWindow) {
          await axios.patch(`http://localhost:3000/pointages/${pointage.id}`, {
            sortie: heureNow
          });
          toast.success("Sortie enregistrée");
        } else {
          toast.error("La sortie est autorisée uniquement de 15h à 18h");
        }
      } else {
        toast.error("Vous avez déjà pointé l'entrée et la sortie aujourd'hui.");
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
 {/* ✅ NAVBAR */}
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
            <img src="/src/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
          </div>
        </Toolbar>
      </AppBar>
    <Stack alignItems="center" justifyContent="center" width="100%" minHeight="100vh" sx={{  background: "linear-gradient(135deg, #E3F2FD, #ffffff)", padding: 4 }}>
    <Stack direction={{ xs: "column", md: "row" }} 
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
          }} >
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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
                    message: "Numéro invalide (au moins 9 chiffres)"
                  }
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
            display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" fontWeight="bold" marginBottom={2}>
            Liste des pointages du jour
          </Typography>
          <Divider />
          {pointages.length === 0 ? (
            <Typography color="gray" mt={2}>Aucun pointage pour aujourd’hui.</Typography>
          ) : (
            pointages.map((p) => (
              <Box key={p.id} mb={2} p={2} sx={{ backgroundColor: "#fff", borderRadius: 1, border: "1px solid #e0e0e0" }}>
                <Typography><strong>Nom :</strong> {p.nom}</Typography>
                <Typography><strong>Rôle :</strong> {p.role === "admin" ? "admin" : "etudiant"}</Typography>
                <Typography><strong>Téléphone :</strong> {p.phone}</Typography>
                <Typography color={p.entree ? "green" : "gray"}><strong>Entrée :</strong> {p.entree || "—"}</Typography>
                <Typography color={p.sortie ? "blue" : "gray"}><strong>Sortie :</strong> {p.sortie || "—"}</Typography>
  
              </Box>
            ))
          )}
        </Box>
      </Stack>
    </Stack>
    </>
  );
}
