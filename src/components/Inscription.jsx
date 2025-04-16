import {Box, Stack, Typography, TextField, Button} from "@mui/material"
import React from 'react'
import { useForm, } from "react-hook-form"
import { toast } from 'react-hot-toast';
import axios from "axios";
import {useNavigate, Link } from "react-router-dom";
export default function Inscription() {
   const navigate = useNavigate();
    const { register, handleSubmit,  watch,
      formState: { errors },} = useForm();
      const onSubmit = (data) => {
        if(data.motDePasse !== data.motDePasseConfirmation){
          toast.error("Les mots de passe ne sont pas identiques");
        }else {
         axios.get(`http://localhost:3000/admin?mailUtilisateur=${data.mailUtilisateur}`).then((res) => {
           if(res.data.length > 0){
             toast.error("Cette adresse email est déjà utilisée");
           }else{
             axios.post("http://localhost:3000/admin", data).then((res)=>{
               console.log(res);
               toast.success("Inscription réussie");
               // Rediriger vers la page de connexion après inscription réussie
               navigate("/connexion");
             }).catch((err)=>{
                  console.log(err);
                  toast.error("Une erreur est survenue");
             })
           }
         });
       }
     };
     
      
  return (
        <Stack alignItems={"center"} justifyContent={"center"} width={"100%"} height={"100vh"} backgroundColor={"lightgrey"}>
          <Box width={400} sx={{
            padding: 3,
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"
          }}>
            <Typography variant={"h4"}>Inscription</Typography>
            <form style={{
                marginTop:4
            }}  onSubmit={handleSubmit(onSubmit)}
            >
                <Stack direction={"column"} gap={2}>
                    <TextField id="filled-basic"  label="Veuillez saisir votre nom"  variant="outlined" 
                      fullWidth size="small"   {...register("nomUtilisateur",  
                          { required: "Veuillez saisir un nom", minLength:{value:5, 
                        message:"Veuillez saisir un nom de plus de 5 caractères" } })}
                    />
                 
                    <TextField id="filled-basic" label="Veuillez saisir votre adresse email" variant="outlined" fullWidth size="small"
                    type="email"
                    {...register("mailUtilisateur", 
                      { required: "Veuillez saisir votre adresse mail", pattern:{value:/^\S+@\S+\.\S+$/, 
                      message:"Veuillez saisir une adresse email valide" } })}
                    />
                    <TextField id="filled-basic" label="Veuiillez saisir un mot de passe" variant="outlined" 
                      fullWidth size="small" type="password"   {...register("motDePasse",  
                      { required: "Veuillez saisir un mot de passe", minLength:{value:6, 
                      message:" Veuillez saisir un mot de passe de plus de 6 caractères" } })} 
                   />
                    <TextField id="filled-basic" label="Veuillez confirmez votre mot de passe"  variant="outlined" fullWidth size="small" type="password"
                    {...register("motDePasseConfirmation", 
                      { required: "Veuillez confirmer votre mot de passe",})}
                    
                    />
                </Stack>
                <Button variant="contained" sx={{
                    marginTop:2
                }} type="submit">Inscription</Button>
            </form>
          </Box>
        </Stack>
  
  )
}
