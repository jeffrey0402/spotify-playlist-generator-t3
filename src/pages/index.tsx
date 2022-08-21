import type { NextPage } from "next";
import Head from "next/head";

import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useState } from "react";
import { PlayListItem } from "../components/PlayListItem";
import { PagesWidget } from "../components/PagesWidget";
import { SongList } from "../components/SongList";
import { Playlists } from "../components/Playlists";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [list, setList] = useState([]);
  const [currentPage, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPlaylistId, setCurrentPlaylistId] = useState("");
  const [currentPlaylistName, setCurrentPlaylistName] = useState("");

  const getMyPlaylists = async (offset: number) => {
    setPage(offset / 20);
    const res = await fetch("/api/playlists?offset=" + offset);
    let { items, total } = await res.json();

    setTotalPages(Math.ceil(total / 20));
    setList(items);
  };

  const setPlaylist = (id: string, name: string) => {
    setCurrentPlaylistId(id);
    setCurrentPlaylistName(name);
  };

  if (session) {
    return (
      <>
        <main className="m-2">
          {/* Grid layout containing 3 equally sized columns. */}
          <div className="grid grid-cols-3">
            {/* Playlists */}
            <div className="flex flex-col">
              {/* {list.map((item: any) => (
                <PlayListItem key={item.id} item={item} onPress={setPlaylist} />
              ))} */}
              <Playlists onPress={setPlaylist} />
            </div>
            {/* Songs */}
            <SongList id={currentPlaylistId} name={currentPlaylistName} />
            {/* Nieuwe lijst */}
            <div className="flex flex-col">
              <div className="flex flex-row-reverse">
                <button className="btn btn-error" onClick={() => signOut()}>
                  Sign out
                </button>
                <p className="my-auto m-2">
                  Signed in as{" "}
                  <span className="font-bold">{session.user?.name}</span>
                </p>
              </div>
              Nieuwe lijst!
              <button className="btn btn-primary m-2">Add list to spotify!</button>
            </div>
          </div>
        </main>
      </>
    );
  }
  return (
    // Overkill div centering? yes.
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col">
        <p>Not signed in </p>
        <button className="btn btn-primary" onClick={() => signIn()}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Home;
