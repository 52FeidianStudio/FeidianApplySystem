import './App.css'
import {Route, Routes} from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import React from "react";
import Router from "./router";
function App() {

  return (
    <div className="App">
        {/*<Routes>*/}
        {/*    <Route path="/" element={<Login />}></Route>*/}
        {/*    <Route path="/register" element={<Register />}></Route>*/}
        {/*</Routes>*/}
        <Router/>
    </div>
  )
}

export default App
