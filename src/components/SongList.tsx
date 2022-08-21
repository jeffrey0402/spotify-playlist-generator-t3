import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import useInfiniteScroll from "react-infinite-scroll-hook";

type SongListProps = {
  id: string;
  name: string;
};

type Data = {
  href: string;
  items: Song[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

type Song = {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: any;
  track: {
    album: {
      album_type: string;
      artists: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: {
      isrc: string;
    }[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
  video_thumbnail: {
    url: string | null;
  };
};

const LIMIT = 50; //default

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// https://swr.vercel.app/docs/pagination

// https://swr.vercel.app/examples/infinite-loading
// https://github.dev/onderonur/tmdb-explorer

export const SongList = ({ id, name }: SongListProps) => {
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

    return (
      <ul ref={rootRef}>
        {allSongs.map((song) => (
          <li key={song.track.id}>
            <p>{song.track.name}</p>
          </li>
        ))}
        {!isReachingEnd && <li className="font-bold" ref={infiniteRef}>Loading More songs...</li>}
      </ul>
    );
  };

  return (
    <div>
      <p className="font-bold">{name}</p>
      <SongList />
    </div>
  );
};
