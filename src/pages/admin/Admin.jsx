import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const Admin = () => {
  const [employés, setEmployés] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
 const isVerySmallScreen = useMediaQuery("(max-width:700px)");

  const fetchEmployés = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "pointeurs"));
    const pointeursData = querySnapshot.docs.map(doc => doc.data());
    setEmployés(pointeursData);
  };

  const fetchAdmins = async () => {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "admins"));
    const adminsData = querySnapshot.docs.map(doc => doc.data());
    setAdmins(adminsData);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("admin");
      navigate("/connexion");
    } catch (error) {
      console.error("Erreur de déconnexion : ", error);
    }
  };

  useEffect(() => {
      const styles = `
    .home-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      padding: 2rem;
      z-index: 5;
    }

    @media (max-width: 768px) {
      .home-content {
        position: relative !important;
        transform: none !important;
        top: auto !important;
        left: auto !important;
        margin-top: 7rem;
        margin-bottom: 2rem;
        z-index: 5;
      }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

    fetchEmployés();
    fetchAdmins();
  }, []);

  const handleRetour = () => navigate("/");
  const handlePointage = () => navigate("/add-pointage");
  const handleListe = () => navigate("/listetudiant");

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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

      {/* AppBar (fixée) */}
      <AppBar
  position="fixed"
  elevation={4}
  sx={{
    backgroundColor: "transparent",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 10,
  }}
>
  <Toolbar className="position-relative px-3 d-flex justify-content-between w-100">
    {/* Bouton retour + logo */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton edge="start" onClick={handleRetour} sx={{ color: "#000" }}>
        <i className="bi bi-arrow-left" style={{ fontSize: "24px" }}></i>
      </IconButton>
      <img src="/assets/defarsci.jpg" alt="Logo Defarsci" style={{ height: 40 }} />
    </Box>

    {/* Titre centré */}
    <Typography
      variant="h6"
      sx={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "#0D6EFD",
        whiteSpace: "nowrap",
      }}
    >
      Espace Administrateur
    </Typography>

    {/* Toujours afficher bouton déconnexion visible */}
    
{/* Toujours afficher bouton déconnexion visible ou caché selon taille écran */}
<Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
  {!isVerySmallScreen && (
    <Button
      size="small"
      sx={{
        backgroundColor: "#86ACDD",
        color: "#fff",
        fontWeight: "bold",
        px: 2,
        "&:hover": { backgroundColor: "#5b89c0" },
      }}
      onClick={handleLogout}
    >
      Déconnexion
    </Button>
  )}

  {/* Menu hamburger avec icône 3 barres */}
  <Box>
    <IconButton onClick={handleMenuClick} sx={{ color: "#000" }}>
      <MenuIcon />
    </IconButton>
    <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
      <MenuItem
        onClick={() => {
          navigate("/admin/creer-admin");
          handleMenuClose();
        }}
      >
        Créer un admin
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate("/admin/list-admin");
          handleMenuClose();
        }}
      >
        Liste des admins
      </MenuItem>
      {isVerySmallScreen && (
        <MenuItem
          onClick={() => {
            handleLogout();
            handleMenuClose();
          }}
        >
          Déconnexion
        </MenuItem>
      )}
    </Menu>
  </Box>
</Box>


  </Toolbar>
</AppBar>


      {/* Décalage pour compenser AppBar fixe */}
      <Toolbar />

      {/* Contenu principal */}
      <div className="container text-center home-content mt-5">
        <div className="p-4">
          <Typography variant="h5" gutterBottom>
            Bonjour ! Vous êtes sur la page d'admin.
          </Typography>
          <Typography variant="body1" className="mb-4">
            Voulez-vous ajouter un pointeur ou consulter la liste de vos étudiants ?
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
                Ajouter un pointeur
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
                Liste des étudiants
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Admin;
