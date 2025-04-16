import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  const links = [
    { to: "/admin", label: "Admin", color: "#EA641B" },
    { to: "/pointeur", label: "Pointeur", color: "#85ACDC" },
  ];

  // Inject CSS animation
  useEffect(() => {
    const styles = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <Box sx= {{ position: "relative", height: "100vh",  backgroundColor: "#E5E5E5",}}>
      {/* 🖼️ Images de fond */}
      <Box sx={{ display: "flex", height: "100vh",   }}>
        <Box sx={{ width: "50%" }}>
          <img
            src="/src/assets/vector1.png"
            alt="Vector 1"
            style={{ height: "100%", width: "100%", objectFit: "cover", backgroundColor: "#E5E5E5" }}
          />
        </Box>
        <Box sx={{ width: "50%" }}>
          <img
            src="/src/assets/vector2.png"
            alt="Vector 2"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>

      {/* 📌 AppBar */}
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
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 4,
          }}
        >
          <Box>
            <img
              src="/src/assets/defarsci.jpg"
              alt="Logo Defarsci"
              style={{ height: 50 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {links.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  backgroundColor: link.color,
                  color: "#fff",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: link.color,
                    opacity: 0.85,
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🎯 Contenu central */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          textAlign: "center",
          px: 4,
          width: "90%",
          maxWidth: "1200px",
          marginTop:"15%"
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            color: "black",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Bienvenue sur notre plateforme de pointage
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 4,
            }}
          >
            Gérez vos présences, utilisateurs, et statistiques facilement grâce à une interface moderne et intuitive.
          </Typography>

          {/* 👤 Image + cartes */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              mb:5,
              flexWrap: "wrap",
            }}
          >
            {/* Image du pointeur */}
           

            {/* Cartes infos */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: { xs: "100%", md: "50%" },
                mb:15
              }}
            >
              {[
                {
                  title: "Pointage rapide",
                  desc: "Enregistrez les entrées/sorties en un clic.",
                },
                {
                  title: "Statistiques en temps réel",
                  desc: "Consultez les données de présence à tout moment.",
                },
                {
                  title: "Gestion des rôles",
                  desc: "Admin et Pointeur avec accès personnalisés.",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  elevation={4}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Box
              component="img"
              src="src/assets/poiintage.png" // 🖼️ Remplace avec le chemin réel
              alt="Personne qui pointe"
              sx={{
                width: { xs: "100%", md: "40%" },
                maxWidth: 400,
                borderRadius: 3,
                mb:15,
                // boxShadow: 3,
                animation: "fadeIn 1.5s ease-in-out",
              }}
            />
          </Box>
          {/* <Button variant="contained" color="primary" sx={{ px: 4, py: 1.5 }}>
            Commencer maintenant
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
