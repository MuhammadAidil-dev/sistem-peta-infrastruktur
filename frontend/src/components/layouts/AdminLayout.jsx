import SideBar from '../fragments/navigation/SideBar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* sidebar */}
      <SideBar />
      {/* main content */}
      <main className="flex-1 ml-[300px]">{children}</main>
    </div>
  );
};

export default AdminLayout;
