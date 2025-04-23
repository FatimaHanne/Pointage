import {AppBar, Box,Button,Icon,IconButton,Stack,TextField,Toolbar,Typography} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import ListPointeur from "./components/ListPointeur"

export default function AddPointage() {
  const user = JSON.parse(localStorage.getItem("pointeur"));
  const navigate = useNavigate();
  const [employés, setEmployés] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

   useEffect(() => {
      if (!localStorage.getItem('admin')) {
        navigate('/connexion')
      }
      fetchEmployés();
    }, []);

  const fetchEmployés = () => {
    axios.get("http://localhost:3000/ajout-pointeur").then((res) => {
      setEmployés(res.data);
    });
  };

  const onSubmit = async (data) => {
    try {
      // 1. Récupère les utilisateurs de la base admin
      const resAdmin = await axios.get("http://localhost:3000/admin");
      
      // 2. Vérifie si le numéro entré existe dans la base admin
      const adminMatch = resAdmin.data.find(
        (admin) => admin.numeroUtilisateur === data.phone
      );
  
      const role = adminMatch ? "admin" : "stagiaire";
      const pointeurAvecRole = { ...data, role };
  
      // 3. Vérifie si ce numéro existe déjà dans la base de pointage
      const doublon = await axios.get(`http://localhost:3000/ajout-pointeur?phone=${data.phone}`);
      if (doublon.data.length > 0) {
        toast.error("Ce numéro est déjà enregistré");
        return;
      }
  
      // 4. Ajoute le pointeur avec le rôle correct
      await axios.post("http://localhost:3000/ajout-pointeur", pointeurAvecRole);
      toast.success("Ajout effectué avec succès");
      reset();
      fetchEmployés();
      navigate("/Pointer");
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue");
    }
  };
  
  
  return (
    <Box
       sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
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
               Ajouter un pointeur
              </Typography>
    
              <div>
                <img src="/src/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
              </div>
            </Toolbar>
          </AppBar>
          <Stack alignItems={"center"} justifyContent={"center"} width={"100%"} height={"100vh"}>
          <Box
            width={400}
            sx={{
              backgroundColor: "#fff",
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              marginTop: 4,
            }}
          >
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
                <Button variant="contained" type="submit">
                  Ajouter
                </Button>
              </Stack>
            </form>
          </Box>
          </Stack>
    </Box>
  );
}
