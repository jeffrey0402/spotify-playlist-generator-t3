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
import { Data, Song } from "../types/types";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [currentPlaylistId, setCurrentPlaylistId] = useState("");
  const [currentPlaylistName, setCurrentPlaylistName] = useState("");
  const [newList, setNewList] = useState<Song[]>([]);

  const setPlaylist = (id: string, name: string) => {
    setCurrentPlaylistId(id);
    setCurrentPlaylistName(name);
  };

  const addSong = (song: Song) => {
    setNewList([...newList, song]);
  }

  const removeSong = (id: string) => {
    setNewList(newList.filter(s => s.track.id !== id));
  }

  if (session) {
    return (
      <>
        <Head>
          <title>Spotify Playlist generator</title>
        </Head>
        <main className="m-2">
          {/* Grid layout containing 3 equally sized columns. */}
          <div className="grid grid-cols-3">
            {/* Playlists */}
            <div className="flex flex-col">
              <Playlists onPress={setPlaylist} />
            </div>
            {/* Songs */}
            <SongList id={currentPlaylistId} name={currentPlaylistName} addSong={addSong} />
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
              {/* Items */}
              {newList.map((item: any) => (
                <div className="flex" key={item.track.id}>
                  <p >{item.track.name}</p>
                  <button onClick={() => removeSong(item.track.id)} className="btn btn-warning">-</button>
                </div>
              ))}
              <button className="btn btn-primary m-2">
                Add list to spotify!
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }
  return (
    <>
    <Head>
      <title>Please sign in | Spotify playlist generator</title>
    </Head>
    {/* Overkill div centering? yes. */}
    <main className="grid h-screen place-items-center">
      <div className="flex flex-col">
        <p>Not signed in </p>
        <button className="btn btn-primary" onClick={() => signIn()}>
          Sign in
        </button>
      </div>
    </main>
    </>
  );
};

export default Home;
