import React, { useState, useEffect } from "react";
import { UseAuth } from "../../context/authContext";
import {
  ref,
  onChildAdded,
  onValue,
  off,
  database,
  onChildRemoved,
  set,
  push,
  remove,
  get,
  update,
} from "../../firebase";
import { useNavigate } from "react-router-dom";

import btnSuma from "./../../img/img-juegoBtn+.png";
import btnResta from "./../../img/img-juegoBtn-.png";

import "./Jugar.css";

const Jugar = () => {
  const navigate = useNavigate();

  const { puntos, setPuntos, user, loading, updatePuntos } = UseAuth();
  const [modoTranqui, setModoTranqui] = useState(1200);
  const [modoRebelde, setModoRebelde] = useState(9600);
  const [modoEnfermo, setModoEnfermo] = useState(68000);
  const [roomsDisponibles, setRoomsDisponibles] = useState([]);
  const [usuarioRoomsIds, setUsuarioRoomsIds] = useState([]);

  const [salaCreada, setSalaCreada] = useState(false);

  const [salaCreadaId, setSalaCreadaId] = useState("");
  const [creadorSala, setCreadorSala] = useState("");

  const [showAlertCrear, setShowAlertCrear] = useState(false);

  const [showAlertUnir, setShowAlertUnir] = useState(false);

  // Función de utilidad para formatear los puntos con coma si superan los mil

  useEffect(() => {
    // Obtener las salas disponibles al cargar el componente
    obtenerRoomsDisponibles();

    // Suscribirse al evento onChildAdded para recibir actualizaciones en tiempo real
    const roomsRef = ref(database, "rooms");
    const childAddedCallback = (snapshot) => {
      const nuevaRoom = snapshot.val();
      setRoomsDisponibles((prevRooms) => {
        // Filtrar las salas duplicadas
        const salaExistente = prevRooms.find(
          (room) => room.id === nuevaRoom.id
        );
        if (!salaExistente) {
          return [...prevRooms, nuevaRoom];
        }
        return prevRooms;
      });
    };
    onChildAdded(roomsRef, childAddedCallback);

    // Suscribirse al evento onChildRemoved para recibir actualizaciones en tiempo real
    const childRemovedCallback = (snapshot) => {
      const roomEliminada = snapshot.val();
      setRoomsDisponibles((prevRooms) =>
        prevRooms.filter((room) => room.id !== roomEliminada.id)
      );
    };
    onChildRemoved(roomsRef, childRemovedCallback);

    // Retornar una función de limpieza para desuscribirse de los eventos al desmontar el componente
    return () => {
      off(roomsRef, "child_added", childAddedCallback);
      off(roomsRef, "child_removed", childRemovedCallback);
    };
  }, []);

  const obtenerRoomsDisponibles = () => {
    // Lógica para obtener las salas disponibles inicialmente
    const roomsRef = ref(database, "rooms");
    const roomsSnapshotCallback = (snapshot) => {
      const rooms = snapshot.val();
      if (rooms) {
        const roomsArray = Object.values(rooms);
        setRoomsDisponibles(roomsArray);
      }
    };
    onValue(roomsRef, roomsSnapshotCallback);
  };

  const verificarSalasCreadas = () => {
    const usuarioId = user.uid;
    const usuarioRoomsRef = ref(database, `users/${usuarioId}/rooms`);
    const usuarioRoomsSnapshotCallback = (snapshot) => {
      const usuarioRooms = snapshot.val();
      const tieneSalasCreadas = usuarioRooms !== null;

      // setTieneSala(tieneSalasCreadas)

      if (tieneSalasCreadas) {
        // Guardar en el almacenamiento local que el usuario ha creado una sala
        localStorage.setItem("salaCreada", "true");
      } else {
        // Eliminar el registro del almacenamiento local si el usuario no tiene salas creadas
        localStorage.removeItem("salaCreada");
      }
    };
    onValue(usuarioRoomsRef, usuarioRoomsSnapshotCallback);
  };

  const aumentarCoils = (modo, setModo, max, incremento) => {
    if (modo < max) {
      if (modo >= 6000) {
        incremento = 900;
      }
      setModo((prevModo) => Math.min(prevModo + incremento, max));
    }
  };

  const disminuirCoils = (modo, setModo, min, decremento) => {
    if (modo > min) {
      if (modo > 6000) {
        decremento = 400;
      } else {
        decremento = 50;
      }
      setModo((prevModo) => Math.max(prevModo - decremento, min));
    }
  };

  const crearRoom = (puntosRequeridos) => {
    const usuarioYaCreoSala = roomsDisponibles.some(
      (room) => room.creador === user.email
    );

    if (usuarioYaCreoSala) {
      alert(
        "Ya has creado una sala. Solo puedes tener una sala activa a la vez."
      );
      return;
    }

    if (puntos >= puntosRequeridos) {
      const roomRef = ref(database, "rooms");
      const usuarioId = user.uid;
      const usuarioNombre = user.email;

      const nuevaRoomRef = push(roomRef);

      const nuevaRoom = {
        id: nuevaRoomRef.key,
        puntosRequeridos,
        name: user.displayName,
        creador: usuarioNombre,
        creadorImagen: user.photoURL,
        modo:
          puntosRequeridos === modoTranqui
            ? "Modo tranqui"
            : puntosRequeridos === modoRebelde
            ? "Modo rebelde"
            : "Modo enfermo",
        coils:
          puntosRequeridos === modoTranqui
            ? modoTranqui
            : puntosRequeridos === modoRebelde
            ? modoRebelde
            : modoEnfermo,
      };

      set(nuevaRoomRef, nuevaRoom);

      const nuevoPlayRef = ref(database, `play/${nuevaRoomRef.key}`);
      const nuevoPlay = {
        salaId: nuevaRoomRef.key,

        usuarioId: "", // Establecer como cadena vacía
        creadorId: usuarioNombre,

        coils: nuevaRoom.coils, // Agregar los coils requeridos para crear la sala
        coilsCreador: puntos,
        coilsUsuario: 0,

        creadorKey: user.uid,
        usuarioKey: "",
      };

      set(nuevoPlayRef, nuevoPlay);

      setSalaCreadaId(nuevaRoom.id);
      setSalaCreada(true);
      setCreadorSala(usuarioNombre);

      const usuarioRoomRef = ref(
        database,
        `users/${usuarioId}/rooms/${nuevaRoomRef.key}`
      );
      set(usuarioRoomRef, true);

      setPuntos((prevPuntos) => prevPuntos - puntosRequeridos);
      updatePuntos(puntos - puntosRequeridos);

      const url = `/play/${nuevaRoom.id}?creadorId=${encodeURIComponent(
        usuarioNombre
      )}&usuarioId=`;
      navigate(url);
    } else {
      setShowAlertCrear(true);
    }
  };
  const closeAlert = () => {
    setShowAlertCrear(false);
  };
  const eliminarRoom = (roomId, puntosRequeridos) => {
    const roomRef = ref(database, `rooms/${roomId}`);
    remove(roomRef);

    // Actualizar el estado de roomsDisponibles excluyendo la sala eliminada
    setRoomsDisponibles((prevRooms) =>
      prevRooms.filter((room) => room.id !== roomId)
    );

    // Verificar nuevamente las salas creadas por el usuario después de eliminar una sala
    verificarSalasCreadas();

    // Reembolsar los coils deducidos
    setPuntos((prevPuntos) => prevPuntos + puntosRequeridos);
    updatePuntos(puntos + puntosRequeridos); // Llama a la función updatePuntos y pasa el nuevo valor de puntos
    // Restablecer el estado tieneSala a false
    setSalaCreada(false);
    // setTieneSala(false);
  };
  const unirseASala = async (salaId, usuarioEmail) => {
    try {
      const salaSeleccionada = roomsDisponibles.find(
        (room) => room.id === salaId
      );

      if (salaSeleccionada && salaSeleccionada.coils <= puntos) {
        const nuevoPlayRef = ref(database, `play/${salaId}`);

        const updates = {
          usuarioId: usuarioEmail,
          coilsUsuario: puntos,
          usuarioKey: user.uid,
        };

        await update(nuevoPlayRef, updates);

        const usuarioId = user.uid;
        const usuarioPuntosRef = ref(database, `users/${usuarioId}/coils`);
        const nuevosPuntos = puntos - salaSeleccionada.coils;
        await set(usuarioPuntosRef, nuevosPuntos);

        const url = `/play/${salaId}?creadorId=&usuarioId=${encodeURIComponent(
          usuarioEmail
        )}`;
        navigate(url);

        const salaRef = ref(database, `rooms/${salaId}`);
        await remove(salaRef);
      } else {
        setShowAlertUnir(true);
      }
    } catch (error) {
      console.log("Error al unirse a la sala:", error);
      alert(
        "Hubo un error al unirse a la sala. Por favor, inténtalo nuevamente."
      );
    }
  };
  const closeAlertUnir = () => {
    setShowAlertUnir(false);
  };
  const closeAlertCrear = () => {
    setShowAlertCrear(false);
  };
  if (loading) return <h1>Cargando..</h1>;
  return (
    <div className="contenedor-padre">
      <div className="card-container-crear">
        <div className="card">
          <div className="coil">
            <div className="fondo"></div>
            <span className="coils-texto">
              {puntos > 1000 ? puntos.toLocaleString() : puntos}
              <span className="icon-dolar">💲</span>
            </span>
          </div>

          <div className="modo">
            <div className="modo-text">
              <p className="texto-modo">Modo tranqui </p>
              <span className="texto-coils">
                {modoTranqui > 1000
                  ? modoTranqui.toLocaleString()
                  : modoTranqui}{" "}
                <span className="icon-dolar-coils">💲</span>
                coils
              </span>
            </div>

            <div className="btns-myd">
              <button
                className="more"
                onClick={() =>
                  aumentarCoils(modoTranqui, setModoTranqui, 9600, 250)
                }
              >
                <img src={btnSuma} alt="btn-suma" className="btn-icon" />
              </button>
              <button
                className="decrease"
                onClick={() =>
                  disminuirCoils(modoTranqui, setModoTranqui, 1200, 120)
                }
              >
                <img src={btnResta} alt="btn-resta" className="btn-icon" />
              </button>
            </div>

            <div className="btn-select3">
              <button
                className="seleccionar-button blanco-btn"
                onClick={() => crearRoom(modoTranqui)}
              >
                Crear
              </button>
            </div>
          </div>

          <div className="modo plomo">
            <div className="modo-text">
              <p className="texto-modo">Modo rebelde </p>
              <span className="texto-coils">
                {modoRebelde > 1000
                  ? modoRebelde.toLocaleString()
                  : modoRebelde}{" "}
                <span className="icon-dolar-coils">💲</span>
                coils
              </span>
            </div>
            <div className="btns-myd">
              <button
                className="more"
                onClick={() =>
                  aumentarCoils(modoRebelde, setModoRebelde, 68000, 1150)
                }
              >
                <img src={btnSuma} alt="btn-suma" className="btn-icon" />
              </button>
              <button
                className="decrease"
                onClick={() =>
                  disminuirCoils(modoRebelde, setModoRebelde, 9600, 800)
                }
              >
                <img src={btnResta} alt="btn-resta" className="btn-icon" />
              </button>
            </div>

            <div className="btn-select2">
              <button
                className="seleccionar-button plomo-btn"
                onClick={() => crearRoom(modoRebelde)}
              >
                Crear
              </button>
            </div>
          </div>
          {showAlertCrear && (
            <div className="alert-containerUnir">
              <div className="alert-boxUnir">
                <span className="close-btnUnir" onClick={closeAlertCrear}>
                  &times;
                </span>
                <p className="alert-textUnir">
                  No tienes suficientes Coils💲 Por favor recargue
                </p>
              </div>
            </div>
          )}
          <div className="modo rojo">
            <div className="modo-text">
              <p className="texto-modo">Modo enfermo </p>
              <span className="texto-coils">
                {modoEnfermo > 1000
                  ? modoEnfermo.toLocaleString()
                  : modoEnfermo}{" "}
                <span className="icon-dolar-coils">💲</span>
                coils
              </span>
            </div>
            <div className="btns-myd">
              <button
                className="more"
                onClick={() =>
                  aumentarCoils(modoEnfermo, setModoEnfermo, 200000, 1550)
                }
              >
                <img src={btnSuma} alt="btn-suma" className="btn-icon" />
              </button>
              <button
                className="decrease"
                onClick={() =>
                  disminuirCoils(modoEnfermo, setModoEnfermo, 68000, 800)
                }
              >
                <img src={btnResta} alt="btn-resta" className="btn-icon" />
              </button>
            </div>

            <div className="btn-select3">
              <button
                className="seleccionar-button rojo-btn"
                onClick={() => crearRoom(modoEnfermo)}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-container-salas">
        <div className="card">
          <h3>Salas disponibles</h3>
          {roomsDisponibles.length > 0 ? (
            <ul className="room-list">
              {roomsDisponibles.map((room) => (
                <li
                  key={room.id}
                  className={`room-item ${room.modo.toLowerCase()}`}
                >
                  <img
                    className="perfil-images"
                    src={room.creadorImagen} // Mostrar la imagen del creador
                    alt="User"
                  />
                  <div className="room-details">
                    <span className="room-creator">
                      {" "}
                      {room.name ? room.name : room.creador}{" "}
                    </span>

                    <span> |</span>
                    <span className="room-coils">
                      {" "}
                      Apuesta :{" "}
                      {room.coils > 1000
                        ? room.coils.toLocaleString()
                        : room.coils}
                    </span>
                    <span className="icon-dolar-coils">💲</span>
                  </div>
                  {room.creador === user.email ? (
                    <button
                      className="eliminar-button"
                      onClick={() =>
                        eliminarRoom(room.id, room.puntosRequeridos)
                      }
                    >
                      Eliminar
                    </button>
                  ) : (
                    <button
                      className="unirse-button"
                      onClick={() => unirseASala(room.id, user.email)}
                    >
                      Unirse
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay salas disponibles.</p>
          )}
          {showAlertUnir && (
            <div className="alert-containerUnir">
              <div className="alert-boxUnir">
                <span className="close-btnUnir" onClick={closeAlertUnir}>
                  &times;
                </span>
                <p className="alert-textUnir">
                  No tienes suficientes Coils💲 para unirse a esta sala
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jugar;
