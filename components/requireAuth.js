import { useQuery } from '@apollo/client';
import router from 'next/router';
import React, { useEffect } from 'react';
import { CURRENT_USER } from '../queries/queries';

export function requireAuth(Wrapper) {
  return (props) => {
    const {
      data: { currentUser },
    } = useQuery(CURRENT_USER);

    useEffect(() => {
      if (!currentUser) {
        router.push('/login');
      }
    }, [currentUser]);

    return <Wrapper {...props} />;
  };
}
