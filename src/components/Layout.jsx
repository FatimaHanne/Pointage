import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
     
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
