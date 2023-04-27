import { Stack } from "@mui/material";
import { Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";

function Dashboard() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    dispatch({
      type: "authUser",
    });
  }, [dispatch]);

  if (user) {
    return (
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
        }}>
        <Navbar></Navbar>
      </Stack>
    );
  } else if (!user) {
    return <Navigate to="/login" />;
  }
}

export default Dashboard;
