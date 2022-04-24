/* tslint:disable */

import React from "react";
import ReactDOM from "react-dom";
import "./fonts/SourceSansPro/font-face.css";
import "./index.css";
import App from "./components/app";
import reportWebVitals from "./reportWebVitals";
import ThemeContext from "./contexts/ThemeContext";
import GlobalStyles from "./components/styles/GlobalStyles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContext>
        <GlobalStyles />
        <Routes>
          <Route
            path="/*"
            element={
              <NotificationsProvider>
                <App />
              </NotificationsProvider>
            }
          />
        </Routes>
      </ThemeContext>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
