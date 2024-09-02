import React, {useContext} from "react";

import { UserContext } from "./UserContext";
import { UserService } from "./services/UserService";
import { config } from "./config";


const Profile: React.FC = () => {
    //const { user } = useContext(UserContext);

    return (
        <div style={{marginTop: '5rem'}}>
            <h1>Profile</h1>
        </div>
    );
};

export default Profile; 