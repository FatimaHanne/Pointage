import React, { useEffect } from "react";
import { AppBar, Toolbar, Button, Typography, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  const links = [
    { to: "/admin", label: "Admin", color: "#EA641B" },
    { to: "/pointeur", label: "Gestion", color: "#85ACDC" },
  ];

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

  .fade-in {
    animation: fadeIn 1.5s ease-in-out;
  }

  .home-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 2rem;
    z-index: 5;
  }

  .vectors-container {
    z-index: 1;
    position: relative;
  }

  @media (max-width: 768px) {
    .home-content {
      position: relative !important;
      transform: none !important;
      top: auto !important;
      left: auto !important;
      margin-top: 7rem;
      margin-bottom: 2rem;
      z-index: 5; /* Assure qu’on reste au-dessus même en mobile */
    }
  }

    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }, []);
  

  return (
    <div className="position-relative bg-light">
      {/* Vecteurs en haut */}
      <div className="d-flex justify-content-between">
        <div className="w-50">
          <img src="/assets/vector1.png" alt="Vector 1" className="img-fluid" />
        </div>
        <div className="w-50 d-flex justify-content-end">
          <img src="/assets/vector2.png" alt="Vector 2" className="img-fluid" />
        </div>
      </div>

      {/* AppBar */}
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
        <Toolbar className="d-flex justify-content-between px-4">
          <img src="/assets/defarsci.jpg" alt="Logo Defarsci" style={{ height: 50 }} />
          <div className="d-flex gap-2">
            {links.map((link) => (
              <Button onClick={() => navigate("/login")}
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
          </div>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <div className="container text-center home-content mt-5">

        <div className="p-4">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Bienvenue sur notre plateforme de pointage
          </Typography>
          <Typography variant="body1" className="mb-4 mx-auto" style={{ maxWidth: 600 }}>
            Gérez vos présences, utilisateurs, et statistiques facilement grâce à une interface moderne et intuitive.
          </Typography>

          {/* Cartes et image */}
          <div className="row align-items-center justify-content-center gy-4">
            {/* Cartes infos */}
            <div className="col-md-6">
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
                  desc: "Admin et Gestion avec accès personnalisés.",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="mb-3"
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
            </div>

            {/* Image */}
            <div className="col-md-4">
              <img
                src="/assets/poiintage.png"
                alt="Personne qui pointe"
                className="img-fluid rounded fade-in"
                style={{ width: "100%", maxHeight: 400 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
