import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Organization, CreateOrganization } from "containers";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/organization/:address" element={<Organization />} />
        <Route path="/" element={<CreateOrganization />} />
        <Route path="/create-organization" element={<CreateOrganization />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
