import { useRouter } from 'next/router';
import React from 'react';
import { requireAuth } from '../components/requireAuth';

function dashboard() {
  const {
    query: { name },
  } = useRouter();

  console.log(name);
  return <div>welcome to dashboard {name} </div>;
}

export default requireAuth(dashboard);
