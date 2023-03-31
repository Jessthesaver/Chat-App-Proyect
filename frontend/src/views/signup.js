import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  TextField,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch } from "react-redux";
import { validator } from "../validator/validator";
import useForm from "../hooks/formHooks";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const paperStyle = {
    padding: 20,
    width: 380,
    margin: "20px auto",
  };

  const MAX_LENGTH = 25;

  const initState = {
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const submit = (userInput) => {
    dispatch({
      type: "signup",
      payload: {
        signup: userInput,
      },
    });

    navigate("/login");

    return;
  };

  const { handleChange, handleSubmit, handleBlur, state, errors } = useForm({
    initState,
    callback: submit,
    validator,
  });

  return (
    <Paper elevation={5} style={paperStyle}>
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
            {t("signup")}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t("username")}
                placeholder="Username"
                name="username"
                defaultValue={state.username}
                onChange={handleChange}
                error={errors.username ? true : false}
                helperText={errors.username}
                onBlur={handleBlur}
                inputProps={{ maxLength: MAX_LENGTH }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t("name")}
                name="name"
                defaultValue={state.name}
                onChange={handleChange}
                error={errors.name ? true : false}
                helperText={errors.name}
                onBlur={handleBlur}
                inputProps={{ maxLength: MAX_LENGTH }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t("email")}
                name="email"
                defaultValue={state.email}
                onChange={handleChange}
                error={errors.email ? true : false}
                helperText={errors.email}
                onBlur={handleBlur}
                inputProps={{ maxLength: 80 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t("password")}
                name="password"
                type="password"
                defaultValue={state.password}
                onChange={handleChange}
                error={errors.password ? true : false}
                helperText={errors.password}
                onBlur={handleBlur}
                inputProps={{ maxLength: 80 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t("confirmPassword")}
                name="confirmPassword"
                type="password"
                defaultValue={state.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword ? true : false}
                helperText={errors.confirmPassword}
                onBlur={handleBlur}
                inputProps={{ maxLength: 80 }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 1, backgroundColor: "#40B640" }}>
            {t("signup")}
          </Button>
          <Grid container>
            <Grid item textAlign="center">
              {t("alreadyHave")}
              <Link href="login">{t("login")}</Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Paper>
  );
}
