import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../../contexts/AuthContext';

import Logo from '../../assets/images/logo_horizontal.png';
import LogoLight from '../../assets/images/logo_horizontal_light.png';
import LogoSbar from '../../assets/images/logo_sbar_horizontal_color.png';

import { Link } from 'react-router-dom';

const drawerWidth = 240;
const navItems = [
  {
  "name": "Passagem de Plantão",
  "url": "/"
  },
  {
  "name": "Linha do Tempo",
  "url": "/linha-tempo"
  }
];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout, user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <img width={130} src={Logo} />
      <Divider />
      <List>
        {navItems.map((item) => (
          <Link key={item} to={item.url} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem disablePadding>            
              <ListItemButton>
                <ListItemText primary={item.name} />
              </ListItemButton>          
           
          </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', gap: '15px' }}>
            {/* <img style={{height: '100%'}}  src={LogoSbar} alt="" /> */}
            <img style={{height: '80%'}}  src={LogoLight} />
          </Box>
          
          <Box sx={{ display: { xs: 'none', sm: 'block' , width: '100%' }, textAlign: 'right' }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }} component={Link} to={item.url}>
                {item.name}
              </Button>
            ))}
          </Box>
          <Button onClick={logout} color="inherit">
            Logout ({user?.name})
          </Button>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />       
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
