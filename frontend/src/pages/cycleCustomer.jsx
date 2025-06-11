import { useParams } from "react-router";

import api from "../utils/api";
import CycleUpdateForm from "../components/form/updateCycle";
// import { useState } from "react";

export default function UpdateCyclePage() {
  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState(null);

  //   const fetchUsers = async () => {
  //     setError("");
  //     try {
  //       setLoading(true);
  //       const res = await api.get("/user");
  //       setUsers(res.data.data);
  //     } catch (err) {
  //       setError("Gagal memuat data user", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const { customerId } = useParams();

  const handleSubmitCycles = async (cycles) => {
    try {
      // setLoading(true)
      const response = await api.patch(`/data/cycle/${customerId}`, { cycles });
      alert("Berhasil update cycle!", response.data.message);
    } catch (err) {
      console.error("Gagal update:", err.message);
      alert(err.response.data.message || "Gagal melakukan update");
    } finally {
      // setLoading(false)
    }
  };

  return (
    <div>
      <CycleUpdateForm onSubmit={handleSubmitCycles} />
    </div>
  );
}
