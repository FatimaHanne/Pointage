// import React, { useEffect } from "react";
// import {
//   Box,
//   Stack,
//   Typography,
//   TextField,
//   Button,
//   AppBar,
//   Toolbar,
//   IconButton,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// export default function Connexion() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (localStorage.getItem("admin")) {
//       navigate("/admin");
//     }
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     axios
//       .get(
//         `http://localhost:3000/admin?mailUtilisateur=${data.mailUtilisateur}&motDePasse=${data.motDePasse}`
//       )
//       .then((res) => {
//         if (res.data.length > 0) {
//           localStorage.setItem("admin", JSON.stringify(res.data[0]));
//           toast.success("Connexion réussie");
//           navigate("/admin");
//         } else {
//           toast.error("L'admin n'existe pas");
//         }
//       });
//   };

//   return (
//     <Box sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
//       <AppBar
//         position="absolute"
//         elevation={4}
//         sx={{
//           backgroundColor: "transparent",
//           boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 10,
//         }}
//       >
//         <Toolbar className="position-relative px-3 d-flex justify-content-between w-100">
//           <IconButton edge="start" onClick={() => navigate("/")} sx={{ color: "#000" }}>
//             <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
//           </IconButton>

//           <Typography
//             variant="h6"
//             sx={{
//               position: "absolute",
//               left: "50%",
//               transform: "translateX(-50%)",
//               fontWeight: "bold",
//               color: "#0D6EFD",
//             }}
//           >
//            Se Connecter
//           </Typography>

//           <div>
//             <img src="/assets/defarsci.jpg" alt="Logo" style={{ height: 50 }} />
//           </div>
//         </Toolbar>
//       </AppBar>

//       <Stack
//         alignItems={"center"}
//         justifyContent={"center"}
//         width={"100%"}
//         height={"100vh"}
//       >
//         <Box
//           width={400}
//           sx={{
//             padding: 3,
//             backgroundColor: "white",
//             boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
//             mt: 10,
//           }}
//         >
//           <Typography variant={"h4"}>Connexion</Typography>
//           <form style={{ marginTop: 16 }} onSubmit={handleSubmit(onSubmit)}>
//             <Stack direction={"column"} gap={2}>
//               <TextField
//                 label="Veuillez saisir votre adresse email"
//                 variant="outlined"
//                 fullWidth
//                 size="small"
//                 type="email"
//                 {...register("mailUtilisateur", {
//                   required: "Veuillez saisir votre adresse mail",
//                   pattern: {
//                     value: /^\S+@\S+\.\S+$/,
//                     message: "Veuillez saisir une adresse email valide",
//                   },
//                 })}
//                 error={!!errors.mailUtilisateur}
//                 helperText={errors.mailUtilisateur?.message}
//               />
//               <TextField
//                 label="Veuillez saisir un mot de passe"
//                 variant="outlined"
//                 fullWidth
//                 size="small"
//                 type="password"
//                 {...register("motDePasse", {
//                   required: "Veuillez saisir un mot de passe",
//                   minLength: {
//                     value: 6,
//                     message: "Veuillez saisir un mot de passe de plus de 6 caractères",
//                   },
//                 })}
//                 error={!!errors.motDePasse}
//                 helperText={errors.motDePasse?.message}
//               />
//             </Stack>
//             <Button variant="contained" sx={{ marginTop: 2 }} type="submit">
//               Connexion
//             </Button>
//             <Typography paddingTop={2}>
//               Vous n'avez pas de compte ?{" "}
//               <Link to="/inscription">Cliquez ici</Link>
//             </Typography>
//           </form>
//         </Box>
//       </Stack>
//     </Box>
//   );
// }

import React, { useEffect } from "react";
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
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";


export default function Connexion() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("admin")) {
      navigate("/admin");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.mailUtilisateur,
        data.motDePasse
      );
      const user = userCredential.user;

      // Vérifier si l'utilisateur est bien un admin dans Firestore
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        localStorage.setItem("admin", JSON.stringify(adminSnap.data()));
        toast.success("Connexion réussie");
        navigate("/admin");
      } else {
        toast.error("Vous n'avez pas les droits administrateur");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      toast.error("Email ou mot de passe incorrect");
    }
  };

  return (
    <Box sx={{ background: "linear-gradient(135deg, #E3F2FD, #ffffff)", minHeight: "100vh" }}>
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
          <IconButton edge="start" onClick={() => navigate("/")} sx={{ color: "#000" }}>
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
            <Typography paddingTop={2}>
              Vous n'avez pas de compte ?{" "}
              <Link to="/inscription">Cliquez ici</Link>
            </Typography>
          </form>
        </Box>
      </Stack>
    </Box>
  );
}
