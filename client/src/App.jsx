import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./components/home/HomePage";
import GamePage from "./components/game/GamePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import { Toss } from "./components/Toss/Toss";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/jwt/Login";
import Signup from "./pages/jwt/Signup";
import Logout from "./pages/LogOut";
import "./index.css"
import { GameMode } from "./components/Mode/GameMode";
import CreateRoom from "./components/home/CreateRoom";
import JoinRoom from "./components/home/JoinRoom";
import RoomToss from "./components/Toss/roomToss";
import SocketIO from "./components/home/SocketIO";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "game",
        element: <GamePage />,
      },
      {
        path: "socket",
        element:<SocketIO />
      },
      {
        path: "/create-room",
        element: <CreateRoom />,
      },
      {
        path: "/join-room",
        element: <JoinRoom />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "toss",
        element: <Toss />,
      },
      {
        path: "roomToss",
        element: <RoomToss/>
      },
      {
        path: "gameMode",
        element: <GameMode />,
      },
      
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
