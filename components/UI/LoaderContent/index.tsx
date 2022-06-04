import React from 'react';
import {LinearProgress} from "@mui/material";

interface LoaderContentProps {
    isLoading: boolean,
    children?: React.ReactNode;
}

const LoaderContent = (props: LoaderContentProps) => {
    return (
       <>
           {
               props.isLoading ?
                   <LinearProgress/>
                   :
                   props.children
           }
       </>
    );
};

export default LoaderContent;