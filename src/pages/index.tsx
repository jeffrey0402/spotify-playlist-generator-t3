import type { NextPage } from "next";
import Head from "next/head";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { PlayListItem } from "../components/PlayListItem";
import { PagesWidget } from "../components/PagesWidget";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [list, setList] = useState([]);
  const [currentPage, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedList, setSelectedList] = useState([
    { id: "none", track: { name: "Select a playlist to get started!" } },
  ]);
  const [selectedName, setSelectedName] = useState("");

  const getMyPlaylists = async (offset: number) => {
    setPage(offset / 20);
    const res = await fetch("/api/playlists?offset=" + offset);
    let { items, total } = await res.json();

    setTotalPages(Math.ceil(total / 20));
    setList(items);
  };

  const setPlaylist = async (id: string) => {
    const res = await fetch("/api/playlist/songs/" + id);
    const { items } = await res.json();
    setSelectedList(items);
    setSelectedName(items[0].name);
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
          <hr className="my-2" />
          {/* Grid layout containing 3 equally sized columns. */}
          <div className="grid grid-cols-3">
            {/* Playlists */}
            <div className="flex flex-col">
              <PagesWidget
                getPlaylists={getMyPlaylists}
                currentPage={currentPage}
                totalPages={totalPages}
              />
              {list.map((item: any) => (
                <PlayListItem key={item.id} item={item} onPress={setPlaylist} />
              ))}
            </div>
            <div>
              <p>{selectedName}</p>
              {selectedList.map((item: any) => (
                <p key={item.track.id}>{item.track.name}</p>
              ))}
            </div>
            <div>Nieuwe lijst!</div>
          </div>
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
};

export default Home;
