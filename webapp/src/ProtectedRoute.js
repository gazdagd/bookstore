import React from 'react';
import { Route } from 'react-router-dom';

import { useKeycloak } from '@react-keycloak/web';

export default function ProtectedRoute({ component: Component, role, ...rest }) {
    const { keycloak } = useKeycloak();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (keycloak.authenticated && !Boolean(role)) {
                    return <Component {...rest} {...props} />;
                } else if (keycloak.authenticated && keycloak.hasRealmRole(role)) {
                    return <Component {...rest} {...props} />;
                } else {
                    return <div><h3>404 - Not found</h3></div>;
                }
            }
            }
        />
    )
}