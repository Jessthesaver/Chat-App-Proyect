import * as React from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  CssBaseline,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();

  const { user } = useSelector((state) => {
    return state;
  });

  const dispatch = useDispatch();

  const paperStyle = {
    padding: 20,
    width: 380,
    margin: "20px auto",
  };

  const [inputFields, setInputFields] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: null,
    password: null,
  });

  const handleChange = (event) => {
    setInputFields((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    const { username, password } = inputFields;

    if (username.trim() === "" && password.trim() === "") {
      setFormErrors({
        username: "Username field is empty",
        password: "Password field is empty",
      });
    } else if (username.trim() === "" && password.trim() !== "") {
      setFormErrors({
        username: "Username field is empty",
        password: null,
      });
    } else if (username.trim() !== "" && password.trim() === "") {
      setFormErrors({
        username: null,
        password: "Password field is empty",
      });
    } else {
      setFormErrors({
        username: null,
        password: null,
      });
    }
  };

  const handleBlur = (event) => {
    event.preventDefault();

    validateForm();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateForm();

    if (
      !formErrors.username &&
      !formErrors.password &&
      inputFields.username !== "" &&
      inputFields.password !== ""
    ) {
      dispatch({
        type: "login",
        payload: {
          user: inputFields,
        },
      });
    }
  };

  if (user.value) return <Navigate to="/" />;

  return (
    <Paper variant="outlined" style={paperStyle}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography level="h1" component="h1" variant="h5" sx={{ mb: 2 }}>
            {t("welcome")}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Box></Box>
          <TextField
            fullWidth
            name="username"
            type="text"
            placeholder="username123"
            label={"username"}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formErrors.username ? true : false}
            helperText={formErrors.username}
            inputProps={{ maxLength: 25 }}
            sx={{
              mb: 2,
            }}
          />
          <TextField
            fullWidth
            name="password"
            type="password"
            placeholder={"password"}
            label={"password"}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formErrors.password ? true : false}
            helperText={formErrors.password}
            inputProps={{ maxLength: 80 }}
            sx={{
              mb: 2,
            }}
          />
          <Button
            fullWidth
            type="submit"
            sx={{
              my: 1,
              backgroundColor: "#40B640",
              color: "whitesmoke",
            }}>
            {"Log In"}
          </Button>
        </Box>
        <Typography fontSize="sm" sx={{ alignSelf: "center" }}>
          {t("Donthaveanaccount")}

          <Link component={RouterLink} to="/signup">
            {t("signup")}
          </Link>
        </Typography>
      </Container>
    </Paper>
  );
};

export default Login;
