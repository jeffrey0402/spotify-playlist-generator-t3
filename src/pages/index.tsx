import type { NextPage } from "next";
import Head from "next/head";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [list, setList] = useState([]);

  const getMyPlaylists = async () => {
    const res = await fetch("/api/playlists");
    const { items } = await res.json();
    setList(items);
  };

  if (session) {
    console.log(session);
    return (
      <>
        Signed in as {session.user?.name} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <hr />
        <button onClick={() => getMyPlaylists()}>Get all my playlists!</button>
        <div className="flex flex-row">
          {list.map((item: any) => PlayListItem({ item }))}
        </div>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

function PlayListItem({ item }: { item: any }) {
  return (
    <div className="p-2">
      <p>{item.name}</p>
      <Image
        src={item.images[0].url}
        alt={item.name + " Playlist image"}
        width="100"
        height="100"
      />
    </div>
  );
}

export default Home;
