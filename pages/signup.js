import { useMutation, useQuery } from '@apollo/client';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { SIGNUP } from '../queries/mutations';
import { CURRENT_USER } from '../queries/queries';

function SignUp() {
  const [state, setstate] = useState({
    name: '',
    email: '',
    password: '',
    errors: '',
  });

  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER);

  const [signUp, { data }] = useMutation(SIGNUP, {
    refetchQueries: [
      {
        query: CURRENT_USER,
      },
    ],
  });

  const onChange = (e) => {
    setstate({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (currentUser) {
      Router.push(`/dashboard?name=${currentUser.name}`);
    }
  }, [currentUser]);

  return (
    <div className='container'>
      <h3>SignUp</h3>
      {state.errors && <h5 style={{ color: 'red' }}>{state.errors}</h5>}
      <div className='row'>
        <form
          className='col s6'
          onSubmit={(e) => {
            e.preventDefault();
            signUp({
              variables: {
                name: state.name,
                email: state.email,
                password: state.password,
              },
            }).catch((err) => {
              console.error(err.message);
              setstate({
                ...state,
                errors: err.message,
              });
            });
            setstate({
              name: '',
              email: '',
              password: '',
            });
          }}>
          <div className='input-field'>
            <label>Name</label>
            <input
              type='text'
              name='name'
              onChange={onChange}
              value={state.name}
            />
          </div>
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

export default SignUp;
