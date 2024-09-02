import React, { useContext, useRef } from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  MenuItem,
  Tooltip,
  Menu,
  IconButton,
  styled,
} from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { IProduct } from "../dto/IProduct";
import BasePopUp from "./BasePopup";
import BuildingPlan from "./MapPopup";
import Historique from "./HistoriquePopup";
import { UserContext } from "../UserContext";

interface AppBarPopUpProps {
  product: IProduct;
}

const StyledButton = styled(Button)({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  marginRight: "1.5rem",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});

const ResponsiveAppBar: React.FC<AppBarPopUpProps> = ({ product }) => {
  const [menuOpened, setMenuOpened] = React.useState<null | HTMLElement>(null);
  const [selectedTab, setSelectedTab] = React.useState<number>(-1);
  const iconRef = useRef(null);
  const pages = ["Historique d'utilisation", "Localisation dans le labo"];
  const more = ["Save", "Edit"];
  const unauthorizedRoles = ['User', 'CNRS', 'LCC', 'INP'];
  const {user} = useContext(UserContext);
  const handleSave = (updatedProduct: IProduct) => {
    // Perform the database update logic here with the updatedProduct
    console.log("Updating database with:", updatedProduct);
    // Add your logic to update the database
  };
  const OpenMenuMore = (event: React.MouseEvent<HTMLElement>) => {
    setMenuOpened(event.currentTarget);
  };

  const CloseMenuMore = () => {
    setMenuOpened(null);
  };

  const HandleSelectedTab = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <div>
      <AppBar position="relative" color="primary">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <StyledButton color="inherit" onClick={() => HandleSelectedTab(-1)}>
              Home
            </StyledButton>
            {user && !unauthorizedRoles.includes(user.user_type) && (
            <><Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <Menu
                  id="menu-appbar"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(menuOpened)}
                  onClose={CloseMenuMore}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box><Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  {pages.map((page, index) => (
                    <StyledButton
                      key={page}
                      sx={{ color: "white", display: "block" }}
                      onClick={() => HandleSelectedTab(index)}
                    >
                      {page}
                    </StyledButton>
                  ))}
                </Box><Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="More">
                    <IconButton ref={iconRef} onClick={OpenMenuMore}>
                      <UnfoldMoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={iconRef.current}
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(menuOpened)}
                    onClose={CloseMenuMore}
                  >
                    {more.map((moreItem) => (
                      <MenuItem key={moreItem} onClick={CloseMenuMore}>
                        <Typography textAlign="center">{moreItem}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box></>)}
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ padding: "1rem" }}>
        {selectedTab === 0 && (
          <div>
            <Historique product={product}></Historique>
          </div>
        )}
        {selectedTab === 1 && (
          <div>
            {/* Contenu pour l'onglet "Localisation dans le labo" */}
            <BuildingPlan product={product} />
          </div>
        )}
        {selectedTab === -1 && (
          <div>
            <BasePopUp product={product} onSave={handleSave}></BasePopUp>
          </div>
        )}
      </Box>
   </div>
  );
};

export default ResponsiveAppBar;
