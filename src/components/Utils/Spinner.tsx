import React, {CSSProperties, useState} from "react";
import {ClipLoader} from "react-spinners";

export default function Spinner() {
    let [loading, setLoading] = useState(true);

    const override: CSSProperties = {
        display: "block",
        margin: "200px auto",
    };

    return (
        <div className="sweet-loading">
            <ClipLoader
                color="#36d7b7"
                loading={loading}
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}