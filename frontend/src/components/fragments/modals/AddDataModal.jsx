import { useState } from 'react';

const AddDataModal = ({ onAddData, onClose }) => {
  const [payload, setPayload] = useState({
    infrastrukturName: '',
    infrastrukturType: '',
    infrastrukturStatus: '',
    description: '',
    lat: '',
    lng: '',
    address: '',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-[50%] rounded-md flex flex-col p-4">
        <h3>Tambah data</h3>
        <form
          onSubmit={(e) => onAddData(e, { payload })}
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nama" className="text-sm text-black font-semibold">
              Nama Infrastruktur
            </label>
            <input
              type="text"
              id="nama"
              className="focus:outline-0 border border-slate-300 p-2 text-sm"
              value={payload.infrastrukturName}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  infrastrukturName: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tipe" className="text-sm text-black font-semibold">
              Tipe Infrastruktur
            </label>
            <input
              type="text"
              id="tipe"
              className="focus:outline-0 border border-slate-300 p-2 text-sm"
              value={payload.infrastrukturType}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  infrastrukturType: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="text-sm text-black font-semibold"
            >
              Status Infrastruktur
            </label>
            <input
              type="text"
              id="status"
              className="focus:outline-0 border border-slate-300 p-2 text-sm"
              value={payload.infrastrukturStatus}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  infrastrukturStatus: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="desc" className="text-sm text-black font-semibold">
              Deskripsi
            </label>
            <input
              type="text"
              id="desc"
              className="focus:outline-0 border border-slate-300 p-2 text-sm"
              value={payload.description}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-sm text-black font-semibold"
            >
              Alamat
            </label>
            <input
              type="text"
              id="address"
              className="focus:outline-0 border border-slate-300 p-2 text-sm"
              value={payload.address}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="lat" className="text-sm text-black font-semibold">
              Latitude
            </label>
            <input
              type="text"
              id="lat"
              className="focus:outline-0 border border-slate-300 p-2 text-sm"
              value={payload.lat}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  lat: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="longitude"
              className="text-sm text-black font-semibold"
            >
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              className="focus:outline-0 border border-slate-300 p-2 text-sm"
              value={payload.lng}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  lng: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white font-semibold text-sm w-32 py-2 rounded-sm cursor-pointer"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              type="button"
              className="bg-red-500 text-white font-semibold text-sm w-32 py-2 rounded-sm cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDataModal;
