import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import ApplyTable from "../pages/ApplyTable/ApplyTable";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import {RouteObject} from "../type/route";
export const rootRouter: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to="/login" />
    },
    {
        path: "/login",
        element: <Login />,
        meta: {
            requiresAuth: false,
            title: "登录",
            key: "login"
        }
    },
    {
        path: "/register",
        element: <Register />,
        meta: {
            requiresAuth: false,
            title: "注册",
            key: "register"
        }
    },
    {
        path: "/apply",
        element: <ApplyTable />,
        meta: {
            requiresAuth: false,
            title: "报名",
            key: "applytable"
        }
    },
    {
        path: "/forget",
        element: <ChangePassword />,
        meta: {
            requiresAuth: false,
            title: "修改密码",
            key: "changepasswird"
        }
    },
];
const Router = () => {
    // @ts-ignore
    const routes = useRoutes(rootRouter);
    return routes;
};

export default Router;
