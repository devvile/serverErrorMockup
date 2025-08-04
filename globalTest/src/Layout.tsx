import { Outlet } from 'react-router-dom';
import { useGlobalErrorHandler } from './hooks/useGlobalErrorRedirection';

const RootLayout = () => {
    useGlobalErrorHandler();
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4 w-100vw">
                <h1 className="text-xl font-bold">Error Gen</h1>
            </header>

            <main className="flex-1 p-6">
                <Outlet />
            </main>

            <footer className="bg-gray-200 text-center p-4 text-sm">
                &copy; {new Date().getFullYear()} My Blog
            </footer>
        </div>
    );
};

export default RootLayout;
