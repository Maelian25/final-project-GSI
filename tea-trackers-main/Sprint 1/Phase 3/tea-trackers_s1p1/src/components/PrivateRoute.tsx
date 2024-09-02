import React, { useContext, useEffect, useState } from 'react';
import Login from '../Login';
import { UserContext } from '../UserContext';


interface PrivateRouteProps {
  children: any
  handleLogin: (email: string, password: string) => Promise<string>
}

export function PrivateRoute(props:PrivateRouteProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const context = useContext(UserContext)

  useEffect(() => {
    setIsLoggedIn(context.user !== null)
  }, [context.user])

  
  const login  = (<Login handleLogin={props.handleLogin}></Login>);
  return isLoggedIn ? props.children : login;
}

export default PrivateRoute;
