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
    // check if song is already in the list
    if (newList.find((s) => s.track.id === song.track.id)) {
      return;
    }
    setNewList([...newList, song]);
  };

  const removeSong = (id: string) => {
    setNewList(newList.filter((s) => s.track.id !== id));
  };

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
            <SongList
              id={currentPlaylistId}
              name={currentPlaylistName}
              addSong={addSong}
            />
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
              <table className="table-fixed bg-primary-content">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Album</th>
                    <th>Duration</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {newList.map((item: any) => (
                    <tr key={item.track.id}>
                      <td>
                        <p className="font-bold">{item.track.name}</p>
                        <p>
                          {item.track.artists
                            .map((artist: { name: any; }) => artist.name)
                            .join(", ")}
                        </p>
                      </td>
                      <td>{item.track.album.name}</td>
                      <td>{msToMS(item.track.duration_ms)}</td>
                      <td>
                        <button
                          onClick={() => removeSong(item.track.id)}
                          className="btn btn-warning"
                        >
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

const msToMS = (ms: number) => {
  const minutes: number = Math.floor(ms / 60000);
  const seconds: number = parseInt(((ms % 60000) / 1000).toFixed(0));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};
