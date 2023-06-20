import React, { useState, useEffect } from "react";
import piedraIzquierda from "./../../img/piedraIzquierda.png";
import tijeraIzquierda from "./../../img/tijeraIzquierda.png";
import papelIzquierda from "./../../img/papelIzquierda.png";
import "./CreadorId.css";

const CreadorId = ({ onSelection }) => {
  const [imagen, setImagen] = useState(piedraIzquierda);

  const seleccionarPiedra = () => {
    setImagen(piedraIzquierda);
    onSelection("piedra");
  };

  const seleccionarPapel = () => {
    setImagen(papelIzquierda);
    onSelection("papel");
  };

  const seleccionarTijera = () => {
    setImagen(tijeraIzquierda);
    onSelection("tijera");
  };

  return (
    <div className="card">
      <h2>Creador</h2>
      <img src={imagen} alt="Seleccion del creador" />
      <div className="card-footer">
        <button onClick={seleccionarPiedra}>Piedra</button>
        <button onClick={seleccionarPapel}>Papel</button>
        <button onClick={seleccionarTijera}>Tijera</button>
      </div>
    </div>
  );
};

export default CreadorId;
