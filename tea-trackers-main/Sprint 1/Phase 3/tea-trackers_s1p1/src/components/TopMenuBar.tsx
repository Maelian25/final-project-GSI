import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, ListItemIcon, Box, Avatar, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

const TopMenu: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const toggleDrawer = (open: boolean) => (event: React.MouseEvent | React.KeyboardEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: 'Profile', icon: <AccountCircleIcon /> },
        { text: 'Settings', icon: <SettingsIcon /> },
    ];

    const drawerContent = () => (
        <Box
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            sx={{ width: 250 }}
        >
            <Box sx={{ padding: 2, backgroundColor: 'primary.main' }}>
                <Typography variant="h6" color="inherit">Welcome!</Typography>
                <Box display="flex" alignItems="center" paddingY={1}>
                    <Avatar sx={{ marginRight: 1 }} />
                    <Typography variant="subtitle1" color="inherit">Username</Typography>
                </Box>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItemButton key={item.text} href={item.text}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <a href='#'>
                        <img alt='Tea Trackers' src='/assets/inline_logo.png' style={{height: '4rem'}}/>
                    </a>
                </Typography>
                <Box>
                    <IconButton color="inherit" href="dashboard">Dashboard</IconButton>
                    <IconButton color='inherit' href="labnotebook">Lab Notebook</IconButton>
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon style={{paddingLeft: '2rem'}}/>
                </IconButton>
                </Box>

                <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                    {drawerContent()}
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}

export default TopMenu;
