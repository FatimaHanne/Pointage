import {Box,Button,Stack,TextField,Typography} from "@mui/material";
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

  // Charger la liste des employés au montage
  useEffect(() => {
    if (!localStorage.getItem('add-pointage')) {
      navigate('/connexion')
    }
    fetchEmployés();
  }, []);

  const fetchEmployés = () => {
    axios.get("http://localhost:3000/ajout-pointeur").then((res) => {
      setEmployés(res.data);
    });
  };

  const onSubmit = (data) => {
    console.log("submit", data);
    axios
      .get(`http://localhost:3000/ajout-pointeur?phone=${data.phone}`)
      .then((res) => {
        if (res.data.length > 0) {
          toast.error("Ce numéro est déjà enregistré");
        } else {
          axios
            .post("http://localhost:3000/ajout-pointeur", data)
            .then((res) => {
              toast.success("Ajout effectué avec succès");
              reset();
              fetchEmployés(); // mise à jour de la liste
                // setEmployés((prev) => [...prev, res.data]); // Ajouter l'employé ajouté à la liste existante
                navigate("/Pointer");
            
            })
            .catch((err) => {
              console.error(err);
              toast.error("Une erreur est survenue");
            });
        }
      });
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingY: 4 }}
    >
      <Box
        width={400}
        sx={{
          backgroundColor: "#fff",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          marginBottom: 4,
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
  );
}
