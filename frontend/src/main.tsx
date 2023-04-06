import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./styles/transitions.css";

import ReactDOM from "react-dom/client";
//import { createRoot } from "react-dom";
import App from "./App";
import ProfileInfo from "./components/ProfileInfo";
import RegistrationForm from "./components/SignUp";
import LoginForm from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import HomePageNav from "./components/HomeNav";
import Recommendations from "./components/Recommendations";

//import "./index.css";
//import "../dist/index.css";

import client from "./apollo-client";
import { BrowserRouter, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import {
  BrowserRouter as Router,
  Route,
  Outlet,
  useNavigate,
} from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  /*trying out different navbar views*/
  <BrowserRouter>
    <ApolloProvider client={client as ApolloClient<any>}>
      <React.StrictMode>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Layout>
                  <Outlet />
                </Layout>
              </>
            }
          >
            <Route index element={<App />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<RegistrationForm />} />
            <Route path="/profile-setup" element={<ProfileInfo />} />
          </Route>
          <Route
            path="/home/*"
            element={
              <>
                <HomePageNav>
                  <Outlet />
                </HomePageNav>
              </>
            }
          >
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>
);
