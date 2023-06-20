import React, { useState } from "react";
import piedraDerecha from "./../../img/piedraDerecha.png";
import tijeraDerecha from "./../../img/tijeraDerecha.png";
import papelDerecha from "./../../img/papelDerecha.png";
import "./UsuarioId.css";

const UsuarioId = ({ onSelection }) => {
  const [imagen, setImagen] = useState(piedraDerecha);

  const seleccionarPiedra = () => {
    setImagen(piedraDerecha);
    onSelection("piedra");
  };

  const seleccionarPapel = () => {
    setImagen(papelDerecha);
    onSelection("papel");
  };

  const seleccionarTijera = () => {
    setImagen(tijeraDerecha);
    onSelection("tijera");
  };

  // Enviar la selección al componente Play

  return (
    <div className="card">
      <h2>Usuario</h2>
      <img src={imagen} alt="Seleccion del usuario" />
      <div className="card-footer">
        <button onClick={seleccionarPiedra}>Piedra</button>
        <button onClick={seleccionarPapel}>Papel</button>
        <button onClick={seleccionarTijera}>Tijera</button>
      </div>
    </div>
  );
};

export default UsuarioId;
