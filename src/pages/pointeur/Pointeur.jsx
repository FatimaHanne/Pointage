import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Button, Typography, AppBar, Toolbar, IconButton } from "@mui/material";

import { useNavigate,Link } from "react-router-dom";

const Pointeur = () => {
   

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
  

  const navigate = useNavigate();

  const handleRetour = () => {
    navigate("/"); // Redirection vers la page d'accueil
  };

  const handlePointage = () => {
    navigate("/pointer");
  };

  const handleListe = () => {
    navigate("/list-pointage");
  };
        return (
          <div className="position-relative bg-light">
            {/* Vecteurs en haut */}
            <div className="d-flex justify-content-between">
              <div className="w-50">
                <img src="/src/assets/vector1.png" alt="Vector 1" className="img-fluid" />
              </div>
              <div className="w-50 d-flex justify-content-end">
                <img src="/src/assets/vector2.png" alt="Vector 2" className="img-fluid" />
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
            <Toolbar className="position-relative px-3 d-flex justify-content-between w-100">
              {/* Icône retour à gauche */}
              <IconButton edge="start" onClick={handleRetour} sx={{ color: "#000" }}>
                <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
              </IconButton>

              {/* Titre centré en bleu */}
              <Typography
                variant="h6"
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontWeight: "bold",
                  color: "#0D6EFD", // Bleu Bootstrap
                }}
              >
                Ressource Humains
              </Typography>

              {/* Logo à droite */}
              <div>
                <img src="/src/assets/defarsci.jpg" alt="Logo Defarsci" style={{ height: 50 }} />
              </div>
            </Toolbar>
          </AppBar>
              <div className="container text-center home-content mt-5">
                <div className="p-4">
                <Typography variant="h5" gutterBottom>
                  Bonjour ! Vous êtes sur la page de pointage.
                </Typography>
                <Typography variant="body1" className="mb-4">
                  Voulez-vous vous pointer ou consulter la liste de vos pointages ?
                </Typography>
                <Row className="justify-content-center">
                  <Col xs={12} sm={6} md={4} className="mb-3">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handlePointage}
                      style={{ padding: "10px 20px", fontSize: "16px" }}
                    >
                      Se pointer
                    </Button>
                  </Col>
                  <Col xs={12} sm={6} md={4} className="mb-3">
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={handleListe}
                      style={{ padding: "10px 20px", fontSize: "16px" }}
                    >
                      Liste des pointages
                    </Button>
                  </Col>
                </Row>
                </div>
              </div>
    </div>
  );
};

export default Pointeur;
