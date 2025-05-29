const SideBar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 bg-white w-[300px] shadow-md">
      <div className="flex flex-col p-8">
        <h2 className="text-3xl font-semibold text-black">ADMIN</h2>
        <ul className="mt-8 flex flex-col gap-4">
          <li className="bg-slate-100 p-2 rounded-sm">
            <a
              href="#"
              className="text-base text-slate-900 flex cursor-pointer"
            >
              Dashboard
            </a>
          </li>
          <li className="bg-slate-100 p-2 rounded-sm">
            <a
              href="/"
              className="text-base text-slate-900 flex cursor-pointer"
              target="_blank"
            >
              Peta
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
