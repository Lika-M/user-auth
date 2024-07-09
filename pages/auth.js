import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import AuthForm from '../components/auth/auth-form';

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession()
      .then(session => {
        if (session) {
          router.replace('/');
        } else {
          setIsLoading(false);
        }
      });

  }, [router]);

  if(isLoading){
    return <p style={{textAlign:"center", paddingTop: "200px"}}>Loading...</p>
  }

  return <AuthForm />;
}

export default AuthPage;
