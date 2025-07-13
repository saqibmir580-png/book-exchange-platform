import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => (
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);
export default DashboardLayout;