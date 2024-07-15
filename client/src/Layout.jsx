import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";
import UserContextProvider from "./contexts/UserContextProvider";

function Layout() {
    return (
        <UserContextProvider>
            <Header />
            <Outlet />
            <Footer />
        </UserContextProvider>
    );
}

export default Layout;
