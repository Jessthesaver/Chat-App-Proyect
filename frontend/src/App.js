import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./views/signup";
import Login from "./views/login";
import Dashboard from "./views/dashboard";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import NotificationBar from "./components/NotificationBar/NotificationBar.js";
import ChatWindow from "./components/ChatWindow/ChatWindow.js";
import { green } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: green[400],
    },
    secondary: {
      main: green[100],
    },
    mode: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Box>
          <NotificationBar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />}>
                <Route path="/conversation/:chatId" element={<ChatWindow />} />
              </Route>

              <Route path="/signup" element={<Signup />} />

              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </Box>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
