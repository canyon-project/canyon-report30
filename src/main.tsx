import "./index.css";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import loader from '@monaco-editor/loader';

// you can change the source of the monaco files
loader.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.43.0/min/vs' } });

loader.init().then(monaco => {
    createRoot(document.getElementById("root") as never).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );

});

