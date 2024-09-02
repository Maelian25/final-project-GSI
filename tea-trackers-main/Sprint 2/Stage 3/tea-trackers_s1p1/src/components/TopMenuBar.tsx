import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Box,
  Avatar,
  ListItemButton, Button, Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';

import Dialog from "@mui/material/Dialog";
import AddForm from "./AddPopUp";
import TakeForm from "./TakeForm";
import DeleteProd from "./DeleteProd";
import CreateProd from "./CreateProd";
import { Delete } from "@mui/icons-material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { UserContext } from '../UserContext';

const TopMenu: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [AddStockOpen, setAddStockOpen] = useState<boolean>(false);    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate(); // Hook from react-router-dom to navigate to different routes

    const unauthorizedRoles = ['User', 'CNRS', 'LCC', 'INP'];
    const handleLogout = () => {
        localStorage.removeItem('username');
        setUser(null);
        navigate('/');
    };

  const [TakeStockOpen, setTakeStockOpen] = useState<boolean>(false);
  const [CreateProdOpen, setCreateProdOpen] = useState<boolean>(false);
  const [DeleteProdOpen, setDeleteProdOpen] = useState<boolean>(false);

  const toggleDrawer =
    (open: boolean) => (event: React.MouseEvent | React.KeyboardEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const menuItems = [
    { text: "Profile", icon: <AccountCircleIcon />, onClick: () => navigate('/profile') },
    { text: "Settings", icon: <SettingsIcon />, onClick: () => navigate('/settings') },
        { text: 'Logout', icon: <ExitToAppIcon />, onClick: handleLogout }, // Import ExitToAppIcon from @mui/icons-material
  ];
  const handleCloseAddForm = () => {
    setAddStockOpen(false);
  };
  const handleCloseTakeForm = () => {
    setTakeStockOpen(false);
  };

  const handleCloseCreateProd = () => {
    setCreateProdOpen(false);
  };

  const handleCloseDeleteProd = () => {
    setDeleteProdOpen(false);
  };

    const drawerContent = () => (
        <Box
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            sx={{ width: 250, backgroundColor: '#3498db', color: '#fff' }}
        >
            <Box sx={{ padding: 2, borderBottom: '1px solid #ddd' }}>
                <Typography variant="h6" color="inherit">Welcome!</Typography>
                <Box display="flex" alignItems="center" paddingY={1}>
                    <Avatar sx={{ marginRight: 1 }} />
                    <Typography variant="subtitle1" color="inherit">Username</Typography>
                </Box>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItemButton key={item.text} onClick={item.onClick} sx={{ color: '#fff' }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
    

    return (
      <AppBar position="fixed" sx={{ backgroundColor: '#3498db', boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img alt="Tea Trackers" src="/assets/inline_logo.png" style={{ height: '4rem' }} />
            </a>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && !unauthorizedRoles.includes(user.user_type) && (
            <Tooltip title = "Create Product">
            <CreateIcon color="inherit" onClick={() => setCreateProdOpen(true)} sx={{
    marginRight: '1rem',
    outline: 'none',
    '&:hover': {
      transform: 'scale(1.3)', // Agrandit le bouton
      cursor: 'pointer', // Change le curseur en pointeur
    },
  }} /> 
  </Tooltip>)}
            {user && !unauthorizedRoles.includes(user.user_type) && (
            <Tooltip title = "Delete Product">
            <DeleteIcon color="inherit" onClick={() => setDeleteProdOpen(true)} sx={{
    marginRight: '1rem',
    outline: 'none',
    '&:hover': {
      transform: 'scale(1.3)', // Agrandit le bouton
      cursor: 'pointer', // Change le curseur en pointeur
    },
  }} />
  </Tooltip>)}
{user && !unauthorizedRoles.slice(1).includes(user.user_type) && (
  <Tooltip title = "Add into stock">
  <AddIcon color="inherit" onClick={() => setAddStockOpen(true)} sx={{
    marginRight: '1rem',
    outline: 'none',
    '&:hover': {
        transform: 'scale(1.3)', // Agrandit le bouton
        cursor: 'pointer', // Change le curseur en pointeur
    },
}} /></Tooltip>)}
  {user && !unauthorizedRoles.slice(1).includes(user.user_type) && (
      <Tooltip title = "Withdraw from stock">
<InventoryIcon color="inherit" onClick={() => setTakeStockOpen(true)} sx={{
  marginRight: '1rem',
  outline: 'none',
  '&:hover': {
    transform: 'scale(1.3)', // Agrandit le bouton
    cursor: 'pointer', // Change le curseur en pointeur
  },
}} />
</Tooltip>)}
            
            <IconButton color="inherit" href="dashboard" sx={{ marginRight: '1rem', outline: 'none' }} disableTouchRipple>
              Dashboard
            </IconButton>
            
            {user && !unauthorizedRoles.slice(1).includes(user.user_type) && (
              
            <MenuIcon color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{
    marginRight: '1rem',
    outline: 'none',
    '&:hover': {
      transform: 'scale(1.3)', // Agrandit le bouton
      cursor: 'pointer', // Change le curseur en pointeur
    },
  }} />)}
              
          </Box>
          {user && !unauthorizedRoles.slice(1).includes(user.user_type) && (
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent()}
          </Drawer>)}
          {user && unauthorizedRoles.slice(1).includes(user.user_type) && (
            <ExitToAppIcon onClick = {handleLogout} sx={{
              marginRight: '1rem',
              outline: 'none',
              '&:hover': {
                transform: 'scale(1.3)', // Agrandit le bouton
                cursor: 'pointer', // Change le curseur en pointeur
              },
            }}  />
          )}
        </Toolbar>
        <Dialog open={CreateProdOpen} onClose={() => setCreateProdOpen(false)}>
          <CreateProd handleClose={handleCloseCreateProd} />
        </Dialog>
        <Dialog open={DeleteProdOpen} onClose={() => setDeleteProdOpen(false)}>
          <DeleteProd handleClose={handleCloseDeleteProd} />
        </Dialog>
        <Dialog open={AddStockOpen} onClose={() => setAddStockOpen(false)}>
          <AddForm handleClose={handleCloseAddForm} />
        </Dialog>
        <Dialog open={TakeStockOpen} onClose={() => setTakeStockOpen(false)}>
          <TakeForm handleClose={handleCloseTakeForm} />
        </Dialog>
      </AppBar>
    );
    };    

export default TopMenu;
