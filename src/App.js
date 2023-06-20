import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./pages/ProtecterRoute/ProtectedRoute";
import Perfil from "./components/Perfil/Perfil";
import Jugar from "./components/Jugar/Jugar";
import Recargar from "./components/Recargar/Recargar";
import Torneo from "./components/Torneo/Torneo";
import Play from "./components/Play/Play";

function App() {
  return (
    <main className="main">
      <div>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recargar"
              element={
                <ProtectedRoute>
                  <Recargar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/torneo"
              element={
                <ProtectedRoute>
                  <Torneo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jugar"
              element={
                <ProtectedRoute>
                  <Jugar></Jugar>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil></Perfil>
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/play/:salaId"
              element={
                <ProtectedRoute>
                  <Play />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
          </Routes>
        </AuthProvider>
      </div>
    </main>
  );
}

export default App;
