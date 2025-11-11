import { useAuth } from "@/context";
import { Link, NavLink } from "react-router";
import { toast } from "react-toastify";

const Navbar = () => {
  const { handleSignOut, signedIn, user } = useAuth();

  const handleLogout = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error logging out");
      }
    }
  };
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold bg-clip-text ">
          Travel journal
          <span role="img" aria-labelledby="airplane">
            🛫
          </span>
          <span role="img" aria-labelledby="heart">
            🖤💛
          </span>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user && (
            <li>
              <div className="font-bold bg-clip-text text-transparent bg-linear-to-r from-amber-200 via-amber-600 to-amber-300">
                Welcome back, {user?.firstName}
              </div>
            </li>
          )}
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {signedIn ? (
            <>
              <li>
                <NavLink to="/create">Create post</NavLink>
              </li>
              <li>
                <button
                  className="hover:bg-amber-800 text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/register">Register</NavLink>
              </li>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
