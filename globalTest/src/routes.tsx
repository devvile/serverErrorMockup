import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";
import PermissionErrorPage from "./pages/500Error";
import App from "./App";
import GeneratorPage from "./pages/GeneratorPage";
import ErrorPage400 from "./pages/400Error";
import ErrorPage501 from "./pages/501Error";
import ErrorPage401 from "./pages/401Error";

export const router = createBrowserRouter([
   { path:"/", element: <App/>, children:[
      {index:true, element:<HomePage/>},
      {path:"/generator",element:<GeneratorPage/>},
      {path:"/500", element:<PermissionErrorPage/>},
      {path:"/401", element:<ErrorPage401/>},
      {path:"/400", element:<ErrorPage400/>},
      {path:"/501", element:<ErrorPage501/>}
   ]}
])