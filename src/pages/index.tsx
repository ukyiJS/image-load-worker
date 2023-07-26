import { Link, Outlet } from 'react-router-dom';

export default function App(): JSX.Element {
  return (
    <>
      <nav className="flex justify-center gap-4">
        <Link to="/image" className="p-4">
          image
        </Link>
        <Link to="/worker-image" className="p-4">
          worker-image
        </Link>
      </nav>
      <main className="flex justify-center items-center w-full h-screen">
        <Outlet />
      </main>
    </>
  );
}
