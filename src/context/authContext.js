//El authProvider sirve para obtener un valor del contexto y que todos
//sus hijos(components o pages) puedan utilizarlo en este caso
//se validara si el usuario esta registrado o no

import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth"; // signUp
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth"; // login
import { auth, database, get, onValue, ref, set } from "../firebase";
import { useNavigate } from "react-router-dom";

//prueba

//EL CONTEXTO CONTIENE LA INFORMACION DE TODO EL <context.Provider/>
const authContext = createContext();

//Emos creado un hook personaliza que nos ayuda a no estar importanto el authContext en cada componente que necesite el valor
export const UseAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("there is not auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [puntos, setPuntos] = useState(0);
  const [nuevaRoomId, setNuevaRoomId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const puntosRef = ref(database, `users/${user.uid}/coils`);

      const unsubscribe = onValue(puntosRef, (snapshot) => {
        const userPuntos = snapshot.val();
        setPuntos(userPuntos || 0);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const updatePuntos = async (newPuntos) => {
    try {
      const userRef = ref(database, `users/${user.uid}/coils`);
      await set(userRef, newPuntos);
      console.log("Puntos actualizados:", newPuntos);
    } catch (error) {
      console.error("Error al actualizar los puntos", error);
    }
  };
  ///para logear con facebook  GoogleAuthProvider,signInWithPopup,FacebookAuthProvider,fetchSignInMethodsForEmail /////////

  /**/
  ////////  PASO 1 /////////////// -- PARA LOGEAR USUARIO
  const signUp = (email, password) => {
    fetchSignInMethodsForEmail(auth, email)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          // El correo electrónico ya está registrado, mostrar error al usuario
          console.error("El usuario ya esta registrado");
        } else {
          // El correo electrónico no está registrado, crear nueva cuenta
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const userId = userCredential.user.uid;
              const userData = {
                email: email,
                coils: 0,
              };
              set(ref(database, `users/${userId}`), userData);
              navigate("/");
            })
            .catch((error) => {
              console.error("Error al registrar el usuario", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al verificar el correo electrónico", error);
      });
  };
  ////////  PASO 2 /////////////// -- PARA CREAR REGISTRAR USUARIO
  const login = async (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  ////////  PASO 3 ///////////////  -- PARA logear con GOOGLE
  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        const email = userCredential.user.email;
        const displayName = userCredential.user.displayName;
        const userRef = ref(database, `users/${userId}`);

        // Verificar si el usuario ya existe en la base de datos
        get(userRef)
          .then((snapshot) => {
            if (!snapshot.exists()) {
              // El usuario no existe, guardar los datos
              const userData = {
                email: email,
                coils: 0,
                name: displayName,
              };
              set(userRef, userData);
            }
            // Actualizar el estado del usuario en el contexto
            setUser(userCredential.user);
            navigate("/");
          })
          .catch((error) => {
            console.error(
              "Error al verificar el usuario en la base de datos",
              error
            );
          });
      })
      .catch((error) => {
        console.error("Error al iniciar sesión con Google", error);
      });
  };

  const loginWithFacebook = () => {
    const facebookProvider = new FacebookAuthProvider();
    signInWithPopup(auth, facebookProvider)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        const email = userCredential.user.email;
        const displayName = userCredential.user.displayName;
        const userRef = ref(database, `users/${userId}`);

        // Verificar si el usuario ya existe en la base de datos
        get(userRef)
          .then((snapshot) => {
            if (!snapshot.exists()) {
              // El usuario no existe, guardar los datos
              const userData = {
                email: email,
                coils: 0,
                name: displayName,
              };
              set(userRef, userData);
            }
            // Actualizar el estado del usuario en el contexto
            setUser(userCredential.user);
            navigate("/");
          })
          .catch((error) => {
            console.error(
              "Error al verificar el usuario en la base de datos",
              error
            );
          });
      })
      .catch((error) => {
        console.error("Error al iniciar sesión con Facebook", error);
      });
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  ////////  PASO 4 ///////////////  -- PARA CERRAR SESION
  const logoUt = () => signOut(auth);

  useEffect(() => {
    // SI EL USUARIO ESTA LOGEADO NOS DEVUELVE EL OBJECTO ENTERO(SUS NOMBRE FOTO INFORMACION GENERAL DEL CORREO)
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  return (
    // NOS PERMITE UTILIZAR LOS VALOR EN ESTE CASO EL USER COMO ESTA EN SU ATRIBUTO
    <authContext.Provider
      value={{
        updatePuntos,
        signUp,
        login,
        user,
        logoUt,
        loading,
        loginWithGoogle,
        loginWithFacebook,
        resetPassword,
        puntos,
        setPuntos,
        nuevaRoomId,
        setNuevaRoomId,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
