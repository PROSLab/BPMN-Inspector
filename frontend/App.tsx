import router from 'Frontend/routes.js';
import {BrowserRouter, Route, RouterProvider, Routes} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React, {ReactDOM} from "react";
import {DefaultSpinner, LoaderContainer} from "react-global-loader";
import Loader from "Frontend/components/loader/Loader";
import LineChart from "Frontend/components/charts/LineChart";

export default function App() {
    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                limit={1}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <LoaderContainer
                opacity={0.74}
                backgroundColor={'white'}
                justify={'center'}
                align={'center'}
            >
                <Loader ></Loader>

            </LoaderContainer>

        </>
    );
}