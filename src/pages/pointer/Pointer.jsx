import { Box, Button, Stack, TextField, Typography, Divider } from '@mui/material';
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
  const heureNow = new Date().toLocaleTimeString(); // HH:MM:SS

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
  const onSubmit = ({ phone }) => {
    const now = new Date();
    const heureNow = now.toLocaleTimeString("fr-FR", { hour12: false });
  
    // On extrait les heures et minutes
    const heures = now.getHours();
    const minutes = now.getMinutes();
  
    axios.get(`http://localhost:3000/ajout-pointeur?phone=${phone}`).then(res => {
      if (res.data.length === 0) {
        toast.error("L'utilisateur n'existe pas !");
      } else {
        const pointeur = res.data[0];
  
        axios.get(`http://localhost:3000/pointages?phone=${phone}&date=${today}`).then((res) => {
          const pointage = res.data[0];
  
          // 🎯 Vérifier le créneau horaire
          const currentTime = now.getHours() * 60 + now.getMinutes(); // temps en minutes
          const morningStart = 8 * 60;   //  => 480 minutes
          const morningEnd = 12 * 60;    // => 720 minutes
          const eveningStart = 15 * 60;  
          const eveningEnd = 18 * 60;    

          const isInMorningWindow = currentTime >= morningStart && currentTime <= morningEnd;
          const isInEveningWindow = currentTime >= eveningStart && currentTime <= eveningEnd;
          

          if (!pointage) {
            // Entrée
            if (isInMorningWindow) {
              const newPointage = {
                nom: `${pointeur.PrenomPointeur} ${pointeur.NomPointeur}`, // 👈 nom complet
                phone: pointeur.phone,
                date: today,
                entree: heureNow
              };
              axios.post("http://localhost:3000/pointages", newPointage).then(() => {
                toast.success("Entrée enregistrée");
                fetchPointages();
                reset();
              });
            } else {
              toast.error("L’entrée est autorisée uniquement de 8h à 12h");
            }
          } else if (!pointage.sortie) {
            // Sortie
            if (isInEveningWindow) {
              axios.patch(`http://localhost:3000/pointages/${pointage.id}`, {
                sortie: heureNow
              }).then(() => {
                toast.success("Sortie enregistrée");
                fetchPointages();
                reset();
              });
            } else {
              toast.error("La sortie est autorisée uniquement de 15h à 18h");
            }
          } else {
            toast.error("Vous avez déjà pointé l'entrée et la sortie aujourd'hui.");
          }
        });
      }
    });
  };
  
  return (
    <Stack alignItems="center" justifyContent="center" width="100%" minHeight="100vh" sx={{ backgroundColor: "white", padding: 4 }}>
      <Stack spacing={4} direction="column" alignItems="flex-start">
        {/* Formulaire */}
        <Box
          width={400}
          sx={{
            backgroundColor: "#fff",
            padding: 5,
            border: "1px solid rgb(134, 177, 221)",
            boxShadow: "0px 0px 10px rgba(9, 11, 14, 0.2)",
            borderRadius: 2
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
          width={400}
          sx={{
            padding: 4,
            borderRadius: 2,
            border: "1px solid #ddd",
            // boxShadow: "0px 0px 10px rgba(0,0,0,0.05)",
            maxHeight: "80vh",
            overflowY: "auto"
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
                {/* <Typography><strong>Nom :</strong> {p.nom}</Typography> */}
                <Typography><strong>Nom :</strong> {p.nom || "—"}</Typography>
                <Typography><strong>Téléphone :</strong> {p.phone}</Typography>
                <Typography><strong>Entrée :</strong> {p.entree || "—"}</Typography>
                <Typography><strong>Sortie :</strong> {p.sortie || "—"}</Typography>
              </Box>
            ))
          )}
        </Box>
      </Stack>
    </Stack>
  );
}




// // import { Box, Button, Stack, TextField, Typography } from '@mui/material';
// // import axios from 'axios';
// // import React, { useEffect, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import toast, { Toaster } from 'react-hot-toast';
// // import { useNavigate } from 'react-router-dom';

// // export default function Pointer() {
// //   const navigate = useNavigate();
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //     reset,
// //   } = useForm();
// //   const onSubmit = (data) => {
// //     console.log("submit", data);
// //     axios.get(`http://localhost:3000/ajout-pointeur?phone=${data.phone}`)
// // .then((res) =>{
// //       if (res.data.length === 0) {
// //         toast.error("L'utilisateur n'existe pas!");
// //       }else{
// //         axios
// //         .post("http://localhost:3000/pointages", data)
// //         .then((res) =>{
// //           toast.success("pointé");
// //           reset();
// //         })
// //       }
// //     })
// //   };
// //   return (
// //     <Stack
// //       alignItems="center"
// //       justifyContent="center"
// //       width="100%"
// //       height="100vh"
// //       sx={{ backgroundColor: "white" }}
// //     >
// //       {/* Toaster pour les notifications */}
// //       {/* <Toaster position="top-right" /> */}

// //       <Box
// //         width={400}
// //         sx={{
// //           backgroundColor: "#fff",
// //           padding: 5,
// //           border: "1px solid rgb(134, 177, 221)",
// //           boxShadow: "0px 0px 10px rgba(9, 11, 14, 0.2)",
// //           borderRadius: 2
// //         }}
// //       >
// //         <form onSubmit={handleSubmit(onSubmit)}>
// //           <Stack direction="column" spacing={2}>
// //             <Typography fontWeight="bold">Téléphone</Typography>
// //             <TextField
// //               id="phone-field"
// //               variant="outlined"
// //               fullWidth
// //               size="small"
// //               type="tel"
// //               {...register("phone", {
// //                 required: "Veuillez entrer un numéro valide",
// //                 pattern: {
// //                   value: /^[0-9]{9,}$/,
// //                   message: "Numéro invalide (au moins 9 chiffres)"
// //                 }
// //               })}
// //               error={!!errors.phone}
// //               helperText={errors.phone?.message}
// //             />
// //             <Stack direction="row" justifyContent="center">
// //               <Button
// //                 variant="contained"
// //                 type="submit"
// //                 sx={{ marginTop: 1, paddingX: 3, paddingY: 1 }}
// //               >
// //                 Pointer
// //               </Button>
// //             </Stack>
// //           </Stack>
// //         </form>
// //       </Box>
// //     </Stack>
// //   );
// // }
