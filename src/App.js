import './App.css';
import React from "react";
import {useRoutes} from 'react-router-dom';
import Login from "./Login";
import CertificateUpload from "./CertificateUpload";

const App = () => {
    const element = <CertificateUpload/>;
    const routes = [
        {
            path: '/',
            element: <Login/>,
        },
        {
            path: '/upload',
            element: element,
        },
    ];
    const routesElement = useRoutes(routes);
    return <>{routesElement}</>;
};

export default App;
