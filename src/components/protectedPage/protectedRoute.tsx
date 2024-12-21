import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context";
import { useLocation } from "react-router-dom";


interface TProps {
    children: React.ReactNode
}
const ProtectedRoute = (props: TProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    console.log(location.pathname);
    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
            />
        )
    }
    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        if (user?.role === "USER") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page"
                    extra={<Button type="primary">Back Home</Button>}
                />
            )
        }
    }
    return (
        <>
            {props.children}
        </>
    )

}

export default ProtectedRoute;


