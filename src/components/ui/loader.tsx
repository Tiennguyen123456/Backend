"use client";

import { ClipLoader } from "react-spinners";

interface LoaderProps {
    size: number;
}

export const Loader = ({ size = 50 }: LoaderProps) => {
    return (
        <ClipLoader
            color="#3498db"
            size={size}
        />
    );
};
