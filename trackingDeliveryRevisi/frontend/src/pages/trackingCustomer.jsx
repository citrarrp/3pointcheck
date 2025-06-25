import { useNavigate, useParams } from "react-router";
import api from "../utils/api";
import { useCallback, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

export default function TrackingCustomerPage() {
  const { customerId } = useParams();
  const [dataCust, setDataCust] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(`/track/${customerId}`);
      setDataCust(response.data.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Apakah Anda yakin ingin menghapus user ini?"
    );
    if (!confirmation) return;

    try {
      setLoading(true);
      const data = await api.delete(`/data/${customerId}/${id}`);
      if (data.data.data.acknowledged) {

        // setNewSchemaLabel("");
        // await fetchSchemaFields();
        await fetchData();
        return { success: true, message: "Field berhasil dihapus!" };
      } else {
        return {
          success: false,
          message: data.message || "Gagal mengambil data!",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.response?.data?.message || "Gagal menghapus user",
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!dataCust)
    return <div className="p-4 text-center">Data tidak ditemukan</div>;
  // if (!dataCust || !dataCust.cycle)
  //   return <div className="p-4 text-center">Tidak ada cycle data</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Tracking Customer: {dataCust.nama}
      </h1>

      <div className="grid gap-4">
        {dataCust
          .sort((a, b) => a - b)
          .map((item) => (
            <div
              key={item}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-4 flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => navigate(`${item}`)}
                >
                  <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    Cycle {item}
                  </h3>
                </div>

                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.numberCycle);
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete Cycle"
                >
                  <MdDelete className="w-5 h-5" />
                </button> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
