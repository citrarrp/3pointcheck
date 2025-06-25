import DeleteUser from "./deleteUser";

export default function TableUser({ users, onDeleteUser, loading, error }) {
  //   const [users, setUsers] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await api.get("/user");
  //       setUsers(res.data.data || []);
  //     } catch (err) {
  //       console.error("Gagal menghapus user", err);
  //     } finally {b
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchUsers();
  //   }, []);

  const handleDelete = async (userId) => {
    const confirmation = window.confirm(
      "Apakah Anda yakin ingin menghapus user ini?"
    );
    if (!confirmation) return;

    const result = await onDeleteUser(userId);

    alert(result.message);
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // <div className="w-full my-20">
    //   <div>
    //     <div className="flex flex-col rounded-xl bg-gray-100 bg-clip-border text-gray-700 shadow-md mx-30 my-10">
    //       <div className="py-4">
    //         <table className=" table-auto w-full">
    //           <thead>
    //             <tr className="border border-slate-200">
    //               <th className="px-15 py-3 text-left w-1/2">
    //                 <span className="font-semibold text-slate-700">
    //                   Username
    //                 </span>
    //               </th>
    //               <th className="px-15 py-3 text-center w-1/2">
    //                 <span className="font-semibold text-slate-700">Roles</span>
    //               </th>
    //               <th className="px-15 py-3 text-center w-1/2">
    //                 <span className="font-semibold text-slate-700">Action</span>
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {users.map((item) => (
    //               <tr
    //                 key={item._id}
    //                 className="border-b border-slate-200 bg-white"
    //               >
    //                 <td className="px-15 py-5 text-left">
    //                   <p className="font-sans text-md font-medium text-slate-500">
    //                     {item.username}
    //                   </p>
    //                 </td>
    //                 <td className="px-15 py-5 text-left">
    //                   <p className="font-sans text-md font-medium text-slate-500">
    //                     {item.roles}
    //                   </p>
    //                 </td>
    //                 <td className="px-6 py-5 items-center flex justify-center">
    //                   <DeleteUser
    //                     id={item._id}
    //                     successDelete={() => handleDelete(item._id)}
    //                   />
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="w-full my-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg overflow-hidden mx-auto max-w-3xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar User</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Roles
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left w-3xs">
                      <span
                        className={`ml-3 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg 
                            ${
                              item.roles.includes("admin")
                                ? "bg-purple-300 text-purple-800"
                                : item.roles.includes("production")
                                ? "bg-blue-300 text-blue-800"
                                : "bg-green-300 text-green-800"
                            }`}
                      >
                        {item.roles}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium place-items-center">
                      {/* <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button> */}
                      <DeleteUser
                        id={item._id}
                        successDelete={() => handleDelete(item._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
