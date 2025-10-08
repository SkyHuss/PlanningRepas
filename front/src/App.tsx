import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import "./constant/style/colors.css";
import "./constant/style/fonts.css";
import MealPlan from "./pages/mealPlan/MealPlan";
import Recipes from "./pages/recipes/Recipes";
import Ingredients from "./pages/ingredients/Ingredients";
import Sidebar from "./components/navigation/sidebar/Sidebar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <MealPlan />,
      },
      {
        path: "/recipes",
        element: <Recipes />,
      },
      {
        path: "/ingredients",
        element: <Ingredients />,
      },
    ],
  },
]);

function AppLayout() {
  return (
    <div className="app-container" id="app-container">
      <div className="sidebar-and-content-container">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
