import type { NextPage } from "next";
import Head from "next/head";

import {useSession, signIn, signOut} from 'next-auth/react';

const Home: NextPage = () => {
  const {data: session} = useSession();

  if (session) {
    
    console.log(session);
    return (
      <>
        Signed in as {session.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export default Home;
