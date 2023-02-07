import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import ApplyTable from "../pages/ApplyTable/ApplyTable";
import ChangePassword from "../pages/ChangePassword/ChangePassword";
import AdminHome from "../pages/Admin/Home";
import ApplyResult from "../pages/ApplyResult/ApplyResult";
import PassResult from "../pages/PassResult/PassResult";
import ErrorPage from "../pages/ErrorPage/404"
import {RouteObject} from "./route";
export const rootRouter: RouteObject[] = [
    {
        path: "/",
        element: <Login />,
        meta: {
            requiresAuth: false,
            title: "登录",
            key: "login"
        }
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
        path: "/apply_result",
        element: <ApplyResult />,
        meta: {
            requiresAuth: false,
            title: "提交结果",
            key: "applyresult"
        }
    },
    {
        path: "/pass_result",
        element: <PassResult />,
        meta: {
            requiresAuth: false,
            title: "最终结果",
            key: "applyresult"
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
    {
        path: "/admin_home",
        element: <AdminHome />,
        meta: {
            requiresAuth: false,
            title: "管理员后台",
            key: "adminhome"
        }
    },
    {
        path: "/404",
        element: <ErrorPage />,
        meta: {
            requiresAuth: false,
            title: "404页面",
            key: "errorpage"
        }
    },
    {
        path:"*",
        element:<Navigate to="/404"/>
    }
];
const Router = () => {
    // @ts-ignore
    const routes = useRoutes(rootRouter);
    return routes;
};

export default Router;
