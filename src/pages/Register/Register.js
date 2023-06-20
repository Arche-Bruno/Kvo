import { useState } from "react";
import { UseAuth } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../Alert/Alert";
import videoBackground from "../../img/video.mp4";
import "./Register.css";
const Register = () => {
  const { signUp } = UseAuth();
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
      await signUp(user.email, user.password);
      navigate("/login");
    } catch (error) {
      // Manejo de errores
      console.error("Error al registrar el usuario", error);
    }
  };

  return (
    <div className="login-container">
      <video muted autoPlay loop className="video-background">
        <source src={videoBackground} type="video/mp4" />
      </video>
      <div className="form-container">
        {error && <Alert message={error}></Alert>}

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="email">Correo: </label>
            <input
              type="email"
              name="email"
              placeholder="tu correo"
              onChange={handleChange}
            />
          </div>

          <div className="input-container">
            <label htmlFor="password">Contraseña: </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="********"
              onChange={handleChange}
            />
          </div>

          <button className="btn" type="submit">
            Registrarse
          </button>
        </form>
        <div className="login">
          <span>Ya tiene una cuenta? </span>
          <Link to="/login">Iniciar Sesión</Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
