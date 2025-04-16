// Connexion.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';

const Connexion = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (data.mailUtilisateur === 'admin@example.com' && data.motDePasse === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } else {
      alert('Identifiants incorrects');
    }
  };

  return (
    <Stack alignItems="center" justifyContent="center" width="100%" height="100vh" sx={{ backgroundColor: 'lightgrey' }}>
      <Box width={400} sx={{ padding: 3, backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
        <Typography variant="h4">Connexion</Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
          <Stack direction="column" gap={2}>
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
                  message: "Veuillez saisir une adresse email valide"
                }
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
                  message: "Veuillez saisir un mot de passe de plus de 6 caractères"
                }
              })}
              error={!!errors.motDePasse}
              helperText={errors.motDePasse?.message}
            />
          </Stack>
          <Button variant="contained" sx={{ marginTop: 2 }} type="submit">Connexion</Button>
          <Typography paddingTop={2}>
            Voulez-vous créer un compte ? <Link to="/inscription">Cliquez ici</Link>
          </Typography>
        </form>
      </Box>
    </Stack>
  );
};

export default Connexion;
