import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaLock, FaUser, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
// import { useToast } from "../toast";
// import { IoArrowBackCircle } from "react-icons/io5";

const userSchema = z.object({
  username: z.string().min(5, { message: "Username minimal 5 karakter" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  roles: z.string().default("user"),
});

const Register = ({ onRegister }) => {
  // const [username, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  //   roles: "user",
  // });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      roles: "user",
    },
  });

  const onSubmit = async (data) => {
    const result = await onRegister(data);
    // console.log(result, data);
    alert(result.message);
    onRegister();

    if (result.success) reset();
    // try {
    //   await api.post("/user/auth/register", {
    //     username,
    //     password,
    //     roles: role,
    //   });
    //   alert("Registrasi sukses");
    // } catch (error) {
    //   alert(error.response?.data?.message || "Registration failed!");
    // }
  };

  return (
    <div className="flex justify-center items-center h-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-lg w-3xl"
      >
        <h2 className="text-2xl font-bold mb-4">Tambah User</h2>

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaUser />
          </span>
          <input
            type="text"
            placeholder="Username"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 rounded-lg outline-none"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaKey />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-400 rounded-lg outline-none"
            {...register("password")}
          />
          <div>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>
        {/* <input
          type="username"
          placeholder="Username"
          className="mb-2 p-2 w-full border"
          value={formData.username}
          {...register("username", { required: "Username wajib diisi" })}
          onChange={(e) => setFo(e.target.value)}
        /> */}
        {/* <input
          type="password"
          placeholder="Password"
          className="mb-2 p-2 w-full border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> */}
        <select
          className="mb-4 p-2 w-full border border-gray-300 rounded"
          {...register("roles")}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="production-admin">Production-Admin</option>
          <option value="production-user">Production-User</option>
        </select>
        <button
          type="submit"
          className="w-full hover:bg-[#105bdf] bg-[#2c64c7] rounded text-white p-2 cursor-pointer"
        >
          Tambah
        </button>
      </form>
    </div>
  );
};

export default Register;
