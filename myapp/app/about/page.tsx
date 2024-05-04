"use client";

import { Index } from "../components/Index";
import NavBar from "../components/NavBar";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

export default function Page() {
  return (
    <>
      <Router>
        <NavBar />
        <div className="appContent">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/about"
              element={
                <>
                  <div>TESTING ABOUT ME</div>
                </>
              }
            />
            <Route
              path="/dsa"
              element={
                <>
                  <div>TESTING DSA</div>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}
