import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Button from "@material-ui/core/Button";

const PrivateButton = ({ role, ...props }) => {
    const { keycloak } = useKeycloak();
    if (keycloak.authenticated && !Boolean(role)) {
        return <Button {...props} />;
    } else if (keycloak.authenticated && keycloak.hasRealmRole(role)) {
        return <Button {...props} />;
    } else {
        return null;
    }
}

export default PrivateButton;