import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ref,
  onValue,
  off,
  database,
  set,
  update,
  remove,
} from "../../firebase";
import { ClipLoader } from "react-spinners";
import bgCoils from "./../../img/bg-coils.png";
import piedraDerecha from "./../../img/piedraDerecha.png"; // PARA EL USUARIO
import piedraIzquierda from "./../../img/piedraIzquierda.png"; // PARA EL CREADOR
import tijeraDerecha from "./../../img/tijeraDerecha.png"; // PARA EL USUARIO
import tijeraIzquierda from "./../../img/tijeraIzquierda.png"; //PARA EL CREADOR
import papelDerecha from "./../../img/papelDerecha.png"; //PARA EL USUARIO
import papelIzquierda from "./../../img/papelIzquierda.png"; // PARA EL CREADOR
import { UseAuth } from "../../context/authContext";

import winSound from "./../../img/win.mp3"; // PARA EL CREADOR

import "./Play.css";

const Play = () => {
  const { salaId } = useParams();
  const { updatePuntos, puntos, setPuntos } = UseAuth();
  // setPuntos((prevPuntos) => prevPuntos - puntosRequeridos);
  // updatePuntos(puntos - puntosRequeridos);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const creadorId = searchParams.get("creadorId");
  const usuarioId = searchParams.get("usuarioId");

  const coilsCreador = searchParams.get("coilsCreador");
  const coilsUsuario = searchParams.get("coilsUsuario");

  const usuarioKey = searchParams.get("usuarioKey");
  const creadorKey = searchParams.get("creadorKey");

  const navigate = useNavigate();

  const [creadorName, setCreadorName] = useState("");
  const [usuarioName, setUsuarioName] = useState("");

  const [usuarioKeys, setUsuarioKeys] = useState("");
  const [creadorKeys, setCreadorKeys] = useState("");

  const [coilCreador, setCoilsContador] = useState(0);
  const [coilUsuario, setCoilsUsuario] = useState(0);

  const [coilsRequeridos, setCoilsRequeridos] = useState("");
  const [botonesCreadorVisibles, setBotonesCreadorVisibles] = useState(true);
  const [botonesUserVisibles, setBotonesUserVisibles] = useState(true);

  const [mostrarCambioCreador, setMostrarCambioCreador] = useState(false);

  const [mostrarCambioUsuario, setMostrarCambioUsuario] = useState(false);

  const [scoreCreador, setScoreCreador] = useState(0);
  const [scoreUser, setScoreUser] = useState(0);
  const [usuariosPresentes, setUsuariosPresentes] = useState(false);

  /////////////////////// SE GUARDARA LOS DATOS DE LOS BOTONES QUE SE PRESIONARON /////////////////////
  const [jugadaCreador, setJugadaCreador] = useState("");
  const [cambiarUserTijera, setCambiarUserTijera] = useState(false);
  const [cambiarUserPapel, setCambiarUserPapel] = useState(false);
  const [cambiarUserPiedra, setCambiarUserPiedra] = useState(false);

  const [jugadaUsuario, setJugadaUsuario] = useState("");
  const [cambiarCreadorTijera, setCambiarCreadorTijera] = useState(false);
  const [cambiarCreadorPapel, setCambiarCreadorPapel] = useState(false);
  const [cambiarCreadorPiedra, setCambiarCreadorPiedra] = useState(false);

  const [mostrarCambioUsuarioPadre, setMostrarCambioUsuarioPadre] =
    useState(false);

  const [contador, setContador] = useState(15);
  useEffect(() => {
    const playRef = ref(database, `play/${salaId}`);
    onValue(playRef, (snapshot) => {
      const playData = snapshot.val();
      if (playData) {
        const {
          usuarioKey,
          creadorKey,

          coilsCreador,
          coilsUsuario,

          creadorId,
          usuarioId,

          coils,
          contador,
          scoreCreador,
          scoreUser,
          jugadaUsuario,
          cambiarCreadorTijera,
          cambiarCreadorPapel,
          cambiarCreadorPiedra,
          jugadaCreador,
          cambiarUserTijera,
          cambiarUserPapel,
          cambiarUserPiedra,
        } = playData;

        setCreadorKeys(creadorKey);
        setUsuarioKeys(usuarioKey);

        setCreadorName(creadorId);
        setUsuarioName(usuarioId);

        setCoilsContador(coilsCreador);
        setCoilsUsuario(coilsUsuario);

        setCoilsRequeridos(coils);

        setUsuariosPresentes(creadorId && usuarioId);
        setContador(contador || 15);
        setScoreCreador(scoreCreador || 0);
        setScoreUser(scoreUser || 0);

        setJugadaUsuario(jugadaUsuario);
        setCambiarCreadorTijera(cambiarCreadorTijera);
        setCambiarCreadorPapel(cambiarCreadorPapel);
        setCambiarCreadorPiedra(cambiarCreadorPiedra);
        setJugadaCreador(jugadaCreador);
        setCambiarUserTijera(cambiarUserTijera);
        setCambiarUserPapel(cambiarUserPapel);
        setCambiarUserPiedra(cambiarUserPiedra);

        if (scoreCreador === 3 || scoreUser === 3) {
          if (scoreCreador === 3) {
            navigate("/");
          } else {
            navigate("/");
          }

          remove(playRef) // Eliminar la sala del Realtime Database
            .catch((error) => {
              console.error("Error al eliminar la sala:", error);
            });
        }
      } else {
        set(playRef, {
          contador: 15,
          creadorId,
          usuarioId,

          creadorKey,
          usuarioKey,

          coilsCreador,
          coilsUsuario,

          coils: coilsRequeridos,
          scoreCreador: 0,
          scoreUser: 0,
          jugadaUsuario: "",
          cambiarCreadorTijera: false,
          cambiarCreadorPapel: false,
          cambiarCreadorPiedra: false,
          jugadaCreador: "",
          cambiarUserTijera: false,
          cambiarUserPapel: false,
          cambiarUserPiedra: false,
        });
      }
    });

    return () => {
      off(playRef);
    };
  }, [salaId]);

  useEffect(() => {
    if (!creadorId && !usuarioId) {
      // Si no hay creadorId ni usuarioId en la URL, redirigir a la URL correspondiente para que ingrese su ID

      navigate(`/play/${salaId}`);
    }
  }, [salaId, creadorId, usuarioId, navigate]);

  useEffect(() => {
    if (usuariosPresentes) {
      const interval = setInterval(() => {
        setContador((prevContador) => {
          const updatedCount = prevContador - 1;

          if (updatedCount === 0) {
            setMostrarCambioCreador(true);
            setMostrarCambioUsuario(true);
            clearInterval(interval);
            set(ref(database, `play/${salaId}/contador`), 15); // Restablecer el valor del contador a 15

            return 15; // Devolver 15 para reiniciar el conteo
          } else if (updatedCount === 3) {
            ganador(); // Lógica de ganador cuando el contador llega a 1 segundo
          } else if (updatedCount <= 6 && updatedCount >= 1) {
            setMostrarCambioCreador(true);
            setMostrarCambioUsuario(true);
            setBotonesCreadorVisibles(false);
            setBotonesUserVisibles(false);
          } else {
            setMostrarCambioCreador(false);
            setMostrarCambioUsuario(false);
            setBotonesCreadorVisibles(true);
            setBotonesUserVisibles(true);
          }

          set(ref(database, `play/${salaId}/contador`), updatedCount);
          return updatedCount;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }

    // Verificar si alguno de los puntajes alcanza 3
  }, [
    usuariosPresentes,
    salaId,
    jugadaCreador,
    jugadaUsuario,
    contador,
    scoreCreador,
    scoreUser,
  ]);
  // const salaRef = ref(database, `rooms/${salaId}`);
  // remove(salaRef);

  // const coilsCreador = searchParams.get("coilsCreador");
  // const coilsUsuario = searchParams.get("coilsUsuario");

  //const usuarioKey=searchParams.get("usuarioKey");
  //const creadorKey=searchParams.get("creadorKey");
  // setPuntos((prevPuntos) => prevPuntos - puntosRequeridos);
  // updatePuntos(puntos - puntosRequeridos);

  // const usuarioPuntosRef = ref(database, `users/${usuarioId}/coils`);
  // const nuevosPuntos = puntos - salaSeleccionada.coils;
  // set(usuarioPuntosRef, nuevosPuntos);

  // const [coilCreador, setCoilsContador] = useState(0);
  // const [coilUsuario, setCoilsUsuario] = useState(0);

  const ganador = () => {
    if (jugadaCreador === "tijera" && jugadaUsuario === "papel") {
      const newScoreCreador = scoreCreador + 1;
      setScoreCreador(newScoreCreador);
      set(ref(database, `play/${salaId}/scoreCreador`), newScoreCreador);

      // Actualizar los "coils" del creador si ha ganado
      if (newScoreCreador === 3) {
        console.log("El creador ganó la partida. Puntaje: 3 - 0");
        const creatorId = creadorKeys;
        const creatorPuntosRef = ref(database, `users/${creatorId}/coils`);
        const nuevosPuntosCreator = coilCreador + coilsRequeridos;
        set(creatorPuntosRef, nuevosPuntosCreator);
      }
    } else if (jugadaCreador === "papel" && jugadaUsuario === "piedra") {
      const newScoreCreador = scoreCreador + 1;
      setScoreCreador(newScoreCreador);
      set(ref(database, `play/${salaId}/scoreCreador`), newScoreCreador);

      // Actualizar los "coils" del creador si ha ganado
      if (newScoreCreador === 3) {
        console.log("El creador ganó la partida. Puntaje: 3 - 0");
        const creatorId = creadorKeys;
        const creatorPuntosRef = ref(database, `users/${creatorId}/coils`);
        const nuevosPuntosCreator = coilCreador + coilsRequeridos;
        set(creatorPuntosRef, nuevosPuntosCreator);
      }
    } else if (jugadaCreador === "piedra" && jugadaUsuario === "tijera") {
      const newScoreCreador = scoreCreador + 1;
      setScoreCreador(newScoreCreador);
      set(ref(database, `play/${salaId}/scoreCreador`), newScoreCreador);

      // Actualizar los "coils" del creador si ha ganado
      if (newScoreCreador === 3) {
        console.log("El creador ganó la partida. Puntaje: 3 - 0");
        const creatorId = creadorKeys;
        const creatorPuntosRef = ref(database, `users/${creatorId}/coils`);
        const nuevosPuntosCreator = coilCreador + coilsRequeridos;
        set(creatorPuntosRef, nuevosPuntosCreator);
      }
    } else if (jugadaUsuario === "tijera" && jugadaCreador === "papel") {
      const newScoreUser = scoreUser + 1;
      setScoreUser(newScoreUser);
      set(ref(database, `play/${salaId}/scoreUser`), newScoreUser);

      // Actualizar los "coils" del usuario si ha ganado
      if (newScoreUser === 3) {
        console.log("El usuario ganó la partida. Puntaje: 0 - 3");
        const userId = usuarioKeys;
        const userPuntosRef = ref(database, `users/${userId}/coils`);
        const nuevosPuntosUser = coilUsuario + coilsRequeridos;
        set(userPuntosRef, nuevosPuntosUser);
      }
    } else if (jugadaUsuario === "papel" && jugadaCreador === "piedra") {
      const newScoreUser = scoreUser + 1;
      setScoreUser(newScoreUser);
      set(ref(database, `play/${salaId}/scoreUser`), newScoreUser);

      // Actualizar los "coils" del usuario si ha ganado
      if (newScoreUser === 3) {
        console.log("El usuario ganó la partida. Puntaje: 0 - 3");
        const userId = usuarioKeys;
        const userPuntosRef = ref(database, `users/${userId}/coils`);
        const nuevosPuntosUser = coilUsuario + coilsRequeridos;
        set(userPuntosRef, nuevosPuntosUser);
      }
    } else if (jugadaUsuario === "piedra" && jugadaCreador === "tijera") {
      const newScoreUser = scoreUser + 1;
      setScoreUser(newScoreUser);
      set(ref(database, `play/${salaId}/scoreUser`), newScoreUser);

      // Actualizar los "coils" del usuario si ha ganado
      if (newScoreUser === 3) {
        console.log("El usuario ganó la partida. Puntaje: 0 - 3");
        const userId = usuarioKeys;
        const userPuntosRef = ref(database, `users/${userId}/coils`);
        const nuevosPuntosUser = coilUsuario + coilsRequeridos;
        set(userPuntosRef, nuevosPuntosUser);
      }
    } else {
      // Si no hay ganador, no es necesario actualizar los puntajes en el Realtime Database
      setScoreCreador(scoreCreador);
      setScoreUser(scoreUser);
    }
  };

  const handleCreadorButtonClick = (jugadaCreador) => {
    const playRef = ref(database, `play/${salaId}`);
    const updates = {};

    if (jugadaCreador === "tijera") {
      setJugadaCreador(jugadaCreador);
      setCambiarUserTijera(true);

      updates.jugadaCreador = jugadaCreador;
      updates.cambiarUserTijera = true;
    } else if (jugadaCreador === "papel") {
      setJugadaCreador(jugadaCreador);
      setCambiarUserPapel(true);

      updates.jugadaCreador = jugadaCreador;
      updates.cambiarUserPapel = true;
    } else if (jugadaCreador === "piedra") {
      setJugadaCreador(jugadaCreador);
      setCambiarUserPiedra(true);

      updates.jugadaCreador = jugadaCreador;
      updates.cambiarUserPiedra = true;
    }

    update(playRef, updates);
  };

  const handleUserButtonClick = (jugadaUser) => {
    const playRef = ref(database, `play/${salaId}`);
    const updates = {};

    if (jugadaUser === "tijera") {
      setJugadaUsuario(jugadaUser);
      setCambiarCreadorTijera(true);

      updates.jugadaUsuario = jugadaUser;
      updates.cambiarCreadorTijera = true;
    } else if (jugadaUser === "papel") {
      setJugadaUsuario(jugadaUser);
      setCambiarCreadorPapel(true);

      updates.jugadaUsuario = jugadaUser;
      updates.cambiarCreadorPapel = true;
    } else if (jugadaUser === "piedra") {
      setJugadaUsuario(jugadaUser);
      setCambiarCreadorPiedra(true);

      updates.jugadaUsuario = jugadaUser;
      updates.cambiarCreadorPiedra = true;
    }

    update(playRef, updates);
  };

  return (
    <div className="portada-play">
      <div className="coils">
        <div className="coils-content">
          <div className="coils-animation">
            <img src={bgCoils} alt="bg-coils" className="btn_background_img" />
            <span className="coils-text" id="coilsElement">
              {coilsRequeridos > 1000
                ? coilsRequeridos.toLocaleString()
                : coilsRequeridos}{" "}
            </span>
          </div>
          <div className="contador">{contador} </div>
        </div>
      </div>

      <div className="usuarios-container">
        {creadorId && (
          <div className="campo-creador">
            <div className="usuario-left">
              <p className="name-creador">{creadorName}</p>
              <p className="score-creador">Score: {scoreCreador}</p>

              {/* IMAGEN POR DEFECTO DE CREADOR */}
              <img
                src={
                  jugadaCreador === "tijera"
                    ? tijeraIzquierda
                    : jugadaCreador === "papel"
                    ? papelIzquierda
                    : piedraIzquierda
                }
                className="animated-image" // Agrega la clase para la animación
              />

              {creadorId === creadorName && botonesCreadorVisibles && (
                <div className="botones-user">
                  <button
                    className="creador-button"
                    onClick={() => handleCreadorButtonClick("tijera")}
                  >
                    Tijera
                  </button>
                  <button
                    className="creador-button"
                    onClick={() => handleCreadorButtonClick("papel")}
                  >
                    Papel
                  </button>
                  <button
                    className="creador-button"
                    onClick={() => handleCreadorButtonClick("piedra")}
                  >
                    Piedra
                  </button>
                </div>
              )}
            </div>
            <div className="campo-img">
              {usuarioName ? (
                <p className="name-creador">{usuarioName}</p>
              ) : (
                <p className="waiting-effect">
                  Esperando a que un usuario se una...
                </p>
              )}
              <p className="score-creador"> Score: {scoreUser}</p>

              {/* AQUÍ SE MOSTRARÁN LOS CAMBIOS QUE HIZO EL USUARIO */}
              {mostrarCambioCreador ? (
                <img
                  src={
                    jugadaUsuario === "tijera"
                      ? tijeraDerecha
                      : jugadaUsuario === "papel"
                      ? papelDerecha
                      : piedraDerecha
                  }
                  id="usuario-img"
                />
              ) : (
                <img
                  src={piedraDerecha}
                  alt="piedra-derecha"
                  className="animated-image" // Agrega la clase para la animación
                  id="usuario-img"
                />
              )}
            </div>
          </div>
        )}

        {usuarioId && (
          <div className="campo-usuario">
            <div className="campo-img">
              <p className="name-creador">{creadorName}</p>

              <p className="score-creador">Score: {scoreCreador}</p>
              {/* AQUÍ SE MOSTRARÁN LOS CAMBIOS QUE HIZO EL CREADOR */}
              {mostrarCambioUsuario ? (
                <img
                  src={
                    jugadaCreador === "tijera"
                      ? tijeraIzquierda
                      : jugadaCreador === "papel"
                      ? papelIzquierda
                      : piedraIzquierda
                  }
                  id="usuario-img"
                />
              ) : (
                <img
                  src={piedraIzquierda}
                  alt="piedra-derecha"
                  className="animated-image" // Agrega la clase para la animación
                  id="usuario-img"
                />
              )}
            </div>

            <div className="usuario-right">
              <p className="name-creador">{usuarioName}</p>
              <p className="score-creador">Score: {scoreUser}</p>

              {/* IMAGEN POR DEFECTO DE USUARIO */}
              <img
                src={
                  jugadaUsuario === "tijera"
                    ? tijeraDerecha
                    : jugadaUsuario === "papel"
                    ? papelDerecha
                    : piedraDerecha
                }
                className="animated-image" // Agrega la clase para la animación
              />

              {usuarioId !== creadorName && botonesUserVisibles && (
                <div className="botones-user">
                  <button
                    className="creador-button"
                    onClick={() => handleUserButtonClick("tijera")}
                  >
                    Tijera
                  </button>
                  <button
                    className="creador-button"
                    onClick={() => handleUserButtonClick("papel")}
                  >
                    Papel
                  </button>
                  <button
                    className="creador-button"
                    onClick={() => handleUserButtonClick("piedra")}
                  >
                    Piedra
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
