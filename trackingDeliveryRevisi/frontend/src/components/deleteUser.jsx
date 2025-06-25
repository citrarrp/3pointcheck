"use client";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

export default function DeleteUser({ id, successDelete }) {
  const [loading, setLoading] = useState(false);
  //   const { showToast } = useToast();
  const handleDelete = async () => {
    setLoading(true);
    //   await api.delete(`/user/${id}`);
    //   console.log("apa");
    await successDelete();
    //     showToast("success", "Data berhasil dihapus!");
    //   } else {
    //     showToast("failed", `Terjadi kesalahan saat menghapus data: ${data.message}`);
    //   }
    // } catch (error) {
    //   showToast("failed", `${error}`);
    //   console.error("Gagal menghapus user", error);
    // } finally {
    setLoading(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 select-none cursor-pointer bg-[#2c64c7] shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none text-white rounded my-1 flex items-center gap-1.5"
      >
        <MdDelete />
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
