import React from "react";
import "./Recargar.css";
import yape from "./../../img/ya-pe.png";
import { UseAuth } from "../../context/authContext";
import yape2 from "./../../img/yape2.jpg";
const Recargar = () => {
  const { user, logoUt, loading } = UseAuth();

  return (
    <div className="recargar-container">
      <div class="image-container">
        <span className="texto">
          Enviar en el mensaje del yape su name :{" "}
          <span className="userTexto">{user.displayName || user.email} </span>{" "}
          asi buscarlo en nuestra base de datos
        </span>
        <img src={yape2} alt="Imagen 1" />
      </div>

      <div className="recargar-card">
        <div className="recargar-image-grid">
          <div className="recargar-coil">
            <div className="fondo-saldo2"></div>
            <span className="coils-texto-saldo2">
              <span>S/.1 </span>
              <span className="icon-dolar">1,200💲</span>
            </span>
          </div>
          <div className="recargar-coil">
            <div className="fondo-saldo2"></div>
            <span className="coils-texto-saldo2">
              <span className="coils-texto-saldo2">
                <span>S/.8 </span>
                <span className="icon-dolar"> 9,620💲</span>
              </span>
            </span>
          </div>
          <div className="recargar-coil">
            <span className="coils-texto-saldo2">
              <span className="coils-texto-saldo2">
                <span>S/.24 </span>
                <span className="icon-dolar"> 28,850💲</span>
              </span>
            </span>
          </div>
          <div className="recargar-coil">
            <div className="fondo-saldo2"></div>
            <span className="coils-texto-saldo2">
              <span>S/.50 </span>
              <span className="icon-dolar"> 61,000💲</span>
            </span>
          </div>
          <div className="recargar-coil">
            <div className="fondo-saldo2"></div>
            <span className="coils-texto-saldo2">
              <span>S/.80 </span>
              <span className="icon-dolar"> 96,000💲</span>
            </span>
          </div>
          <div className="recargar-coil">
            <div className="fondo-saldo2"></div>
            <span className="coils-texto-saldo2">
              <span>S/.120 </span>
              <span className="icon-dolar"> 146,000💲</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recargar;
