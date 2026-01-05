"use client"
import React from 'react';
import GeneralError from './components/ui/GeneralError';

const Error = ({error, reset}) => {
    return <GeneralError error={error} onRetry={reset}  />;
};

export default Error;