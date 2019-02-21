import React from 'react';
import Home from './home';


const index = (props) => (
  <Home
    {...props}
  />
);

index.allowedRoles = ['authenticated', 'kitchen', 'admin'];

export default index;
