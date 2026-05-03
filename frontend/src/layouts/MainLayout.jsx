import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Container from '../components/Container';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-[#1e293b]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6">
          <Container>
            <Outlet />
          </Container>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
