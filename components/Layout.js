import { useMutation, useQuery } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
// import Router from 'next/router';
import React from 'react';
import { LOGOUT } from '../queries/mutations';
import { CURRENT_USER } from '../queries/queries';

function Layout({ children }) {
  const { data, loading, error } = useQuery(CURRENT_USER);
  const [logout] = useMutation(LOGOUT, {
    refetchQueries: [
      {
        query: CURRENT_USER,
      },
    ],
  });

  if (loading) return <h4>loading....</h4>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Head>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css'
        />
        <link
          href='http://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'
        />
      </Head>
      <nav className='container'>
        <div className='nav-wrapper'>
          <Link href='/'>
            <a
              className='brand-logo left'
              style={{
                marginLeft: '10px',
              }}>
              Home
            </a>
          </Link>
          <ul className='right'>
            {data.currentUser ? (
              <div>
                <li>
                  <a
                    onClick={() => {
                      logout();
                      // Router.push('/login');
                    }}>
                    Logout
                  </a>
                </li>
              </div>
            ) : (
              <div>
                <li>
                  <Link href='/signup'>
                    <a>Signup</a>
                  </Link>
                </li>
                <li>
                  <Link href='/login'>
                    <a>Login</a>
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>
      <div className='container'>{children}</div>
    </div>
  );
}

export default Layout;
