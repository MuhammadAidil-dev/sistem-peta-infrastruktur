import { useEffect, useState } from 'react';
import Card from '../../components/fragments/card/Card';
import AdminLayout from '../../components/layouts/AdminLayout';
import CONFIG from '../../config/config';
import { fetchData } from '../../utils/utils';
import AddDataModal from '../../components/fragments/modals/AddDataModal';

const AdminDashboard = () => {
  const [infrastrukturData, setInfrastrukturData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { status, data, message } = await fetchData(
        `${CONFIG.API_URL}/infrastrukturs`
      );
      if (status !== 'success') {
        throw new Error(message);
      }
      setInfrastrukturData(data);
    } catch (error) {
      console.log('fetch infrastruktur', error.message);
    }
  };

  const handleAddData = async (e, { payload }) => {
    e.preventDefault();
    try {
      const response = await fetchData(`${CONFIG.API_URL}/infrastrukturs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.status !== 'success') {
        throw new Error(response.message);
      }

      getData();
      handleCloseModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-8 flex flex-col">
        <h2 className="text-4xl font-semibold text-black">Dashboard</h2>
        <div className="grid grid-cols-3 mt-8">
          <Card data={infrastrukturData} />
        </div>
        <div className="mt-8">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Data Infrastruktur</h3>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-green-500 text-white text-sm font-semibold p-2 rounded-sm cursor-pointer"
            >
              Tambah data
            </button>
          </div>
          {infrastrukturData.length > 0 ? (
            <table className="table-auto w-full border-collapse ">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-gray-300 p-2">No</th>
                  <th className="border border-gray-300 p-2">
                    Nama Infrastruktur
                  </th>
                  <th className="border border-gray-300 p-2">
                    Tipe Infrastruktur
                  </th>
                  <th className="border border-gray-300 p-2">
                    Status Infrastruktur
                  </th>
                  <th className="border border-gray-300 p-2">Deskripsi</th>
                  <th className="border border-gray-300 p-2">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {infrastrukturData?.map((data, index) => (
                  <tr key={data.id}>
                    <td className="border border-gray-300 p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {data.infrastrukturName}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {data.infrastrukturType}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {data.infrastrukturStatus}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {data.description}
                    </td>
                    <td className="border border-gray-300 p-4">
                      <a
                        href={`https://www.google.com/maps?q=${data.lat},${data.lng}`}
                        className="bg-blue-500 text-white font-semibold text-xs p-2 rounded-sm flex justify-center items-center"
                        target="_blank"
                      >
                        Lokasi
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Tidak ada data</p>
          )}
        </div>

        {/* modal untuk tambah data */}
        {isOpen && (
          <AddDataModal onAddData={handleAddData} onClose={handleCloseModal} />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
