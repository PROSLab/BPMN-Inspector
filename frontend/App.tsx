import router from 'Frontend/routes.js';
import { RouterProvider } from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import KeepAlive, {AliveScope} from 'react-activation'
import {CheckboxGroup} from "@hilla/react-components/CheckboxGroup.js";
import PostProcessingView from "Frontend/views/postProcessing/PostProcessingView";

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

            <CheckboxGroup

            />


        </>
    );
}