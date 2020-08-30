import { useRouter } from 'next/router';
import React from 'react';
import { requireAuth } from '../components/requireAuth';

function dashboard() {
  const {
    query: { name },
  } = useRouter();

  console.log(name);
  return <h4>welcome to dashboard {name} </h4>;
}

export default requireAuth(dashboard);
