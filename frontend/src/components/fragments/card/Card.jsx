const Card = ({ data }) => {
  return (
    <div className="bg-white min-w-[200px] shadow-md rounded-sm px-2 py-4 flex flex-col justify-center items-center">
      <h3 className="text-3xl font-bold text-black">{data?.length || 0}</h3>
      <p>Jumlah koordinat</p>
    </div>
  );
};

export default Card;
