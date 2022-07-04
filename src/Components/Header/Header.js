import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useToken } from "../../TokenContext";
import "./Header.css";

function Header() {
  const [token, setToken] = useToken();
  const [photo, setPhoto] = useState(null);
  const [dropdown, setDropdown] = useState(null);
  const open = Boolean(dropdown);

  const getUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:4000/user", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const body = await res.json();

      const user = body.data.user;

      setPhoto(user.photo);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (event) => {
    setDropdown(event.currentTarget);
  };

  const handleClose = () => {
    setDropdown(null);
  };

  useEffect(() => {
    getUserInfo();
  }, [token]);
  return (
    <>
      {!token && (
        <header>
          <NavLink to="/">
            <h1>DISK DRIVE</h1>
          </NavLink>
        </header>
      )}
      {token && (
        <header className="tokenHeader">
          <NavLink to="/">
            <h1>DISK DRIVE</h1>
          </NavLink>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{
                  width: "6vh",
                  height: "6vh",
                  fontSize: "4vh",
                }}
                alt="Profile photo"
                src={`http://localhost:4000/${photo}`}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={dropdown}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
          >
            <NavLink to="/profile">
              <MenuItem sx={{ color: "black" }}>
                <Avatar />
                Perfil
              </MenuItem>
            </NavLink>
            <Divider />
            <MenuItem onClick={() => setToken(null)}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </header>
      )}
    </>
  );
}

export default Header;
