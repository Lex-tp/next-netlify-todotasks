import React from 'react';
import Layout from "../../components/UI/Layout";
import Dashboard from "../../components/UI/Dashboard";

const DashboardPage = () => {
    return (
        <Layout
            title='Рабочая область'
            footerOff={true}>
                <Dashboard/>
        </Layout>
    );
};

export default DashboardPage;