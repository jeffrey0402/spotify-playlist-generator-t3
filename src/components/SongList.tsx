import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { Data, Song } from "../types/types";

type SongListProps = {
  id: string;
  name: string;
  addSong: (song: Song) => void;
};

const LIMIT = 50; //default

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// https://swr.vercel.app/docs/pagination

// https://swr.vercel.app/examples/infinite-loading
// https://github.dev/onderonur/tmdb-explorer

export const SongList = ({ id, name, addSong }: SongListProps) => {
  const getKey = (pageIndex: number, previousPageData: Data) => {
    // no ID selected
    if (!id) {
      return null;
    }

    // reached the end
    if (previousPageData && previousPageData.next === null) return null;

    // first page
    if (pageIndex === 0) return `/api/playlist/songs/${id}?limit=${LIMIT}`;

    // get data from previous page
    if (previousPageData.next) {
      let next: string = previousPageData.next.replace(
        "https://api.spotify.com/v1/playlists",
        "/api/playlist/songs"
      );
      next = next.replace("/tracks", "");
      return next;
    }
  };

  const { data, error, mutate, size, setSize, isValidating } =
    useSWRInfinite<Data>(getKey, fetcher);

  if (!id) return <p>Please select a playlist</p>;
  if (!data) return <p>Loading...</p>;
  if (error) return <p>error: {error}</p>;
  let allSongs: Song[] = [];
  data.forEach((item) => {
    allSongs = allSongs.concat(item.items);
  });

  const isReachingEnd = data[data.length - 1]?.next === null;

  const SongList = (): JSX.Element => {
    const [infiniteRef, { rootRef }] = useInfiniteScroll({
      loading: isValidating,
      hasNextPage: !isReachingEnd,
      onLoadMore: () => {
        setSize(size + 1);
      },
      rootMargin: "0px",
      disabled: !!error,
    });

    const msToMS = (ms: number) => {
      const minutes: number = Math.floor(ms / 60000);
      const seconds: number = parseInt(((ms % 60000) / 1000).toFixed(0));
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    };

    return (
      <table className="table-fixed bg-primary-content" ref={rootRef}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Album</th>
            <th>Date Added</th>
            <th>Duration</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {allSongs.map((song) => (
            <tr key={song.track.id}>
              <td className="flex flex-col">
                <p className="font-bold">{song.track.name}</p>
                <p>
                  {song.track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </td>
              <td>{song.track.album.name}</td>
              <td>{song.added_at}</td>
              <td>{msToMS(song.track.duration_ms)}</td>
              <td>
                <button
                  onClick={() => addSong(song)}
                  className="btn btn-primary"
                >
                  +
                </button>
              </td>
            </tr>
          ))}
          {!isReachingEnd && (
            <tr className="font-bold" ref={infiniteRef}>
              <td>Loading More songs...</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <p className="font-bold">{name}</p>
      <SongList />
    </div>
  );
};
