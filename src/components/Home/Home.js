import { UseAuth } from "../../context/authContext";
import "./Home.css";
import { useReducer, useEffect, useRef } from "react";
import Jugar from "../Jugar/Jugar";
import Perfil from "../Perfil/Perfil";
import Recargar from "../Recargar/Recargar";
import Torneo from "../Torneo/Torneo";
import imgBtn from "./../../img/img-btn.png";
import musicaJuego from "./../../img/musicaJuego.mp3";

const initialState = {
  contenido: "perfil",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "MOSTRAR_CONTENIDO":
      return { ...state, contenido: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const { loading } = UseAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef(null); // Referencia al elemento de audio

  useEffect(() => {
    dispatch({ type: "MOSTRAR_CONTENIDO", payload: "perfil" });

    // Comprobamos si el audio ya está cargado
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const handleMostrarContenido = (opcion) => {
    dispatch({ type: "MOSTRAR_CONTENIDO", payload: opcion });
  };

  const botones = [
    { nombre: "Jugar", opcion: "jugar" },
    { nombre: "Perfil", opcion: "perfil" },
    { nombre: "Recargar", opcion: "recargar" },
    { nombre: "Torneo", opcion: "torneo" },
  ];

  if (loading) return <h1>Cargando..</h1>;

  return (
    <div className="home-container">
      <div className="campo">
        <div className="botones-superiores">
          {botones.map((boton) => (
            <button
              key={boton.opcion}
              onClick={() => handleMostrarContenido(boton.opcion)}
              className={state.contenido === boton.opcion ? "activo" : ""}
              id="btn"
            >
              {boton.nombre}
            </button>
          ))}
        </div>
        <div className="contenido">
          {state.contenido === "jugar" && <Jugar />}
          {state.contenido === "perfil" && <Perfil />}
          {state.contenido === "recargar" && <Recargar />}
          {state.contenido === "torneo" && <Torneo />}
        </div>
      </div>
      {/* Agregamos el elemento de audio */}
      <audio ref={audioRef} loop>
        <source src={musicaJuego} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Home;
