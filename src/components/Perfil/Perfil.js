import React, { useEffect, useState } from "react";
import { UseAuth } from "../../context/authContext";
import { database, ref, onValue, set } from "../../firebase";

import "./Perfil.css";

const Perfil = () => {
  const { user, logoUt, loading } = UseAuth();
  const { puntos, setPuntos } = UseAuth();

  const [activeButton, setActiveButton] = useState("");
  const [btnRetirar, setBtnRetirar] = useState("");
  const [mostrarImg, setMostrarImg] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);

  const handleLogout = async () => {
    try {
      await logoUt();
    } catch (error) {
      console.error(error);
    }
  };

  const handlerRetirar = () => {
    if (puntos >= 1200) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
      setShowAlert2(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };
  const closeAlert2 = () => {
    setShowAlert2(false);
  };
  useEffect(() => {
    // Aquí puedes realizar cualquier otra lógica adicional que necesites para el componente Perfil
    console.log(user);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h1 className="loading-text">Cargando...</h1>
      </div>
    );
  }

  return (
    <div
      className={`perfil-container ${
        activeButton === "perfil" ? "perfil-activo" : ""
      }`}
    >
      <div className="card-bienvenido">
        <h1 className="perfil-welcome">
          Bienvenido,{" "}
          <span className="user">{user.displayName || user.email}</span>{" "}
        </h1>
        <div className="perfil-image-container">
          <img className="perfil-image" src={user.photoURL} alt="User" />
        </div>
        <button className="btn-cerrarSesion" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      <div className="card-retirar-saldo">
        <div className="perfil-card">
          <h2 className="">Saldo</h2>
          <div className="coil-saldo">
            <div className="fondo-saldo"></div>
            <span className="coils-texto-saldo">
              {puntos > 1000 ? puntos.toLocaleString() : puntos}
              <span className="icon-dolar">💲</span>
            </span>
          </div>
        </div>
        <div className="perfil-card">
          <h2 className="">Retirar</h2>
          <input className="perfil-input" type="" readOnly />
          <div>
            <button className="btn-cerrarSesion" onClick={handlerRetirar}>
              Retirar
            </button>

            {showAlert && (
              <div className="alert-container">
                <div className="alert-box">
                  <span className="close-btn" onClick={closeAlert}>
                    &times;
                  </span>
                  <p className="alert-text">
                    Enviar imagen QR de su <span className="yape">yape </span>,
                    los coils <span className="icon-dolar">💲</span> a retirar y
                    su name{" "}
                    <span className="user">
                      {user.displayName || user.email}
                    </span>{" "}
                    al <span className="fb">fb</span> :<br></br>{" "}
                    <a
                      className="link"
                      href="https://www.facebook.com/profile.php?id=100092137910740"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Dev_Web
                    </a>
                  </p>
                </div>
              </div>
            )}
            {showAlert2 && (
              <div className="alert-container">
                <div className="alert-box">
                  <span className="close-btn" onClick={closeAlert2}>
                    &times;
                  </span>
                  <p className="alert-text">
                    No cuenta con suficientes Coils💲 para retirar!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
