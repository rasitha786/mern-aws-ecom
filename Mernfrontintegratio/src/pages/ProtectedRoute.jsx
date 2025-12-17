
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const isLoggedIn = localStorage.getItem("user");
  return (
    <div>{isLoggedIn ? children : <Navigate to="/login"/>}
    </div>
  )
}
