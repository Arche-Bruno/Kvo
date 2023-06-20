import { useEffect, useState } from "react";
import { UseAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "../Alert/Alert";
import { Link } from "react-router-dom";
import videoBackground from "../../img/video.mp4";

import "./Login.css";

import imgFb from "./../../img/img-fb.png";
import imgGoogle from "./../../img/img-google.png";

const Login = () => {
  const { login, loginWithGoogle, loginWithFacebook, resetPassword, signUp } =
    UseAuth();

  ////////// USUARIO
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  ////////// ERROR
  const [error, setError] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      // Add a new document in collection "cities"

      navigate("/");
    } catch (error) {
      // ERRORES DE FIREBASE PARA PODER CAMBIAR
      console.log(error.code);
      if (error.code === "auth/user-not-found") {
        setError("El usuario no existe");
      } else if (error.code === "auth/wrong-password") {
        setError("Contraseña incorrecta");
      } else if (error.code === "auth/email-already-in-use") {
        setError("El correo ya esta en uso ");
      }
    }
  };
  const handleGoogleSignin = async () => {
    try {
      //PARA GENERAR UN ERROR =   throw new Error("google error")

      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };
  const handleFacebookSignin = async () => {
    try {
      await loginWithFacebook();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!user.email) return setError("ingrese un email");
    try {
      await resetPassword(user.email);
      setError("le enviamos un mensaje a su correo");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [error]);

  return (
    <div className="login-container">
      <video muted autoPlay loop className="video-background">
        <source src={videoBackground} type="video/mp4" />
        Tu navegador no admite la reproducción de videos.
      </video>
      <div className="form-container">
        {error && <Alert message={error}></Alert>}
        <form onSubmit={handleSubmit} className="form-cont">
          <div className="input-container">
            <label htmlFor="email" className="label">
              Correo:
            </label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="Tu correo"
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="label">
              Contraseña:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="input"
              placeholder="********"
              onChange={handleChange}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button">
              Ingresar
            </button>
            <a href="#!" onClick={handleResetPassword} className="link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
        <div className="register">
          <span className="message">¿No tiene una cuenta? </span>
          <Link to="/register" className="register-link">
            Registrarse
          </Link>
        </div>
        <div className="btns">
          <button onClick={handleGoogleSignin} className="google-button">
            <img src={imgGoogle} alt="Google Icon" className="google-icon" />
          </button>
          <button onClick={handleFacebookSignin} className="facebook-button">
            <img src={imgFb} alt="Facebook Icon" className="facebook-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
