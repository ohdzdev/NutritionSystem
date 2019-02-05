import React from 'react';
import Header from '../components/Header';
import SignIn from '../components/SignIn';

const Home = () => (
  <div>
    <Header />
    <div className="signin">
      <SignIn className="signin" />
    </div>
    <style jsx>
      {`
      .signin {
        padding-top: 40px;
      }
    `}
    </style>
  </div>
);

export default Home;
