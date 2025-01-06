import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"
import AppFooter from "./components/layout/app.footer"
import { useState } from "react";

function Layout() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <>
      <AppHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <AppFooter />
    </>
  )
}

export default Layout
