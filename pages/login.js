import { useMutation, useQuery } from '@apollo/client';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { LOGIN } from '../queries/mutations';
import { CURRENT_USER } from '../queries/queries';

function login({ authUser }) {
  console.log(authUser);
  const [state, setstate] = useState({
    email: '',
    password: '',
    errors: '',
  });
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER);

  const [logIn, { data }] = useMutation(LOGIN, {
    refetchQueries: [
      {
        query: CURRENT_USER,
      },
    ],
  });

  useEffect(() => {
    if (currentUser) {
      router.push(`/dashboard?name=${currentUser.name}`);
    }
  }, [currentUser]);

  const onChange = (e) => {
    setstate({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='container'>
      <h3>Login</h3>
      {state.errors && <h5 style={{ color: 'red' }}>{state.errors}</h5>}
      <div className='row'>
        <form
          className='col s6'
          onSubmit={(e) => {
            e.preventDefault();
            logIn({
              variables: { email: state.email, password: state.password },
            }).catch((err) => {
              setstate({
                ...state,
                errors: err.message,
              });
            });
            setstate({
              email: '',
              password: '',
            });
          }}>
          <div className='input-field'>
            <label>Email</label>
            <input
              type='text'
              name='email'
              onChange={onChange}
              value={state.email}
            />
          </div>
          <div className='input-field'>
            <label>Password</label>
            <input
              type='password'
              name='password'
              onChange={onChange}
              value={state.password}
            />
          </div>
          <button className='btn' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default login;
