import React from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'
import SignIn from '../components/SignIn'

const Home = () => (
  <div>
    <Head title="Home" />
    <Nav />
    <div className="signin">
      <SignIn className="signin" />
    </div>
    <style jsx>{`
      .signin {
        padding-top: 40px;
      }
    `}</style>
  </div>
)

export default Home
