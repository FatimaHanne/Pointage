import {Box, Stack, Typography, TextField, Button, } from "@mui/material"
import React, { useEffect } from 'react'
import { useForm, } from "react-hook-form"
import { toast } from 'react-hot-toast';
import axios from "axios";
import {useNavigate, Link } from "react-router-dom";
export default function Connexion() {
   const navigate = useNavigate();
   useEffect(() =>{
   if (localStorage.getItem("admin")){
    navigate("/")
   }
   })
    const { register, handleSubmit,
      formState: { errors }} = useForm();
      const onSubmit = (data) => {
        console.log(data);
        axios.get(`http://localhost:3000/admin?mailUtilisateur=${data.mailUtilisateur}&motDePasse=${data.motDePasse}`
        ).then((res)=> {
          if(res.data.length>0){
            localStorage.setItem("admin", JSON.stringify(res.data[0]))
            toast.success("Connexion réussie");
            navigate("/");
          }else{
            toast.error("Connexion échouée");
          }
        })
      };
  return (
        <Stack alignItems={"center"} justifyContent={"center"} width={"100%"} height={"100vh"} backgroundColor={"lightgrey"}>
          <Box width={400} sx={{
            padding: 3,
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)"
          }}>
            <Typography variant={"h4"}>Connexion</Typography>
            <form style={{
                marginTop:4
            }}  onSubmit={handleSubmit(onSubmit)}
            >
                <Stack direction={"column"} gap={2}>
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
                </Stack>
                <Button variant="contained" sx={{
                    marginTop:2 
                }} type="submit">Connexion</Button>
                <Typography paddingTop={2}>Voulez-vous créer un compte ? {" "}<Link to="/inscription">Cliquez ici</Link></Typography>
            </form>
          </Box>
        </Stack>
  
  )
}
