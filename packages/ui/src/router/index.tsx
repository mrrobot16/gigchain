import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home, CreateOrganization } from "containers"

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/" element={<CreateOrganization/>} />
            <Route path="/create-organization" element={<CreateOrganization/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
