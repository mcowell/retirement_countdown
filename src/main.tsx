import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AdminPage from "./AdminPage";
import "./index.css";

const isAdmin = window.location.pathname === "/admin";

createRoot(document.getElementById("root")!).render(
  <StrictMode>{isAdmin ? <AdminPage /> : <App />}</StrictMode>
);