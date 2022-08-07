import type { NextPage } from "next";
import Head from "next/head";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [list, setList] = useState([]);
  const [currentPage, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getMyPlaylists = async (offset: number) => {
    setPage(offset/20);
    const res = await fetch("/api/playlists?offset=" + offset);
    let { items, total } = await res.json();
    console.log(items[0])
    
    setTotalPages(Math.ceil(total/20))
    setList(items);
  };

  if (session) {
    return (
      <>
        <main className="m-2">
          <p>
            Signed in as <span className="font-bold">{session.user?.name}</span>
          </p>
          <button className="btn btn-error" onClick={() => signOut()}>
            Sign out
          </button>
          <button className="btn btn-info" onClick={() => getMyPlaylists(0)}>
            Get all my playlists!
          </button>
          <hr />
          <div className="flex flex-col">
            {list.map((item: any) => PlayListItem({ item }))}
          </div>
          {Pagination()}
        </main>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button className="btn" onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );

  function Pagination() {
    return (
      <div className="btn-group">
       {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i ? "btn-primary" : "btn-secondary"}`}
            onClick={() => getMyPlaylists(i * 20)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }
};

function PlayListItem({ item }: { item: any }) {
  return (
    <div key={item.id} className="p-2 flex flex-row">
      <Image
        src={item.images[0].url}
        alt={item.name + " Playlist image"}
        width="96"
        height="96"
        className="w-24 h-24"
      />
      <div className="my-auto ml-2">
        <h1 className="font-bold">{item.name}</h1>
        <p>{item.description}</p>
      </div>
    </div>
  );
}



export default Home;