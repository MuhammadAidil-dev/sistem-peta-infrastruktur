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

  // handle ekspor data
  const exportJSONToCSV = (data, filename = 'data.csv') => {
    if (!data || !data.length) {
      console.error('Data kosong atau tidak valid.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  // handle upload geojson
  const handleGeoJSONUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        alert('Tidak ada file yang dipilih.');
        return;
      }

      const formData = new FormData();
      formData.append('fileData', file);

      // Proses upload ke backend
      const { status, message } = await fetchData(`${CONFIG.API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (status !== 'success') {
        alert(`Gagal upload file: ${message || 'Unknown error'}`);
        return;
      }

      // Baca file secara lokal
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const geojsonText = e.target.result;
          const geojsonData = JSON.parse(geojsonText);
          console.log('GeoJSON Object:', geojsonData);

          // Contoh: ambil semua fitur
          const features = geojsonData.features || [];
          console.log('Features:', features);

          localStorage.setItem('geojsonData', JSON.stringify(geojsonData));
          alert('Berhasil upload dan parsing GeoJSON');
        } catch (error) {
          console.error('Error parsing GeoJSON:', error);
          alert('File bukan GeoJSON yang valid.');
        } finally {
          // Clear file input
          event.target.value = '';
        }
      };

      reader.onerror = () => {
        console.error('Error membaca file lokal.');
        alert('Gagal membaca file.');
        event.target.value = '';
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error upload file:', error);
      alert('Terjadi error saat upload file.');
      // Pastikan file input dikosongkan jika terjadi error
      event.target.value = '';
    }
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
            <div className="flex gap-2 items-center">
              <div>
                <label
                  htmlFor="geojsonInput"
                  className="bg-yellow-500 text-white text-sm font-semibold p-2 rounded-sm cursor-pointer inline-block"
                >
                  Upload GeoJSON
                </label>
                <input
                  type="file"
                  id="geojsonInput"
                  accept=".geojson,application/json"
                  className="hidden"
                  onChange={handleGeoJSONUpload}
                />
              </div>

              <button
                onClick={() => exportJSONToCSV(infrastrukturData, 'data.csv')}
                className="bg-blue-500 text-white text-sm font-semibold p-2 rounded-sm cursor-pointer"
              >
                Ekspor data ke CSV
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="bg-green-500 text-white text-sm font-semibold p-2 rounded-sm cursor-pointer"
              >
                Tambah data
              </button>
            </div>
          </div>

          {infrastrukturData.length > 0 ? (
            <table className="table-auto w-full border-collapse mt-4">
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
                {infrastrukturData.map((data, index) => (
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
                        rel="noreferrer"
                      >
                        Lokasi
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-4">Tidak ada data</p>
          )}
        </div>

        {isOpen && (
          <AddDataModal onAddData={handleAddData} onClose={handleCloseModal} />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
