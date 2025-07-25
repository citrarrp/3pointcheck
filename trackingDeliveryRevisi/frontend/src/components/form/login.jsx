import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.js";

const LoginForm = () => {
  const [fullname, setfullname] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(fullname, password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen w-full bg-cover bg-center"
      // style={{ backgroundImage: "url('/bg-mtm.jpg')" }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-gray-50/75 p-6 rounded shadow-lg max-w-3xl "
      >
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          type="text"
          placeholder="fullname"
          className="mb-2 p-2 w-full border"
          value={fullname}
          onChange={(e) => setfullname(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 p-2 w-full border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="cursor-pointer w-full bg-[#2c64c7] text-white p-2"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
