import useSWRInfinite from "swr/infinite";
import useInfiniteScroll from "react-infinite-scroll-hook";

type PlaylistsProps = {
  onPress: (id: string, name: string) => void;
};

type Data = {
  href: string;
  items: Playlist[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

type Playlist = {
  collaborative: boolean;
  description: string;
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
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};

const LIMIT = 50;
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const Playlists = ({ onPress }: PlaylistsProps) => {
  const getKey = (pageIndex: number, previousPageData: any) => {
      if (previousPageData && previousPageData.next === null) {
          return null;
        }

    if (pageIndex === 0) {
      return `/api/playlists?limit=${LIMIT}`;
    }
    return `/api/playlists?limit=${LIMIT}&offset=${pageIndex * LIMIT}`;
  };

  
  const { data, error, mutate, size, setSize, isValidating } =
  useSWRInfinite<Data>(getKey, fetcher);

  console.log(size)

  if (!data) return <p>loading...</p>;
  if (error) return <p>failed to load</p>;
  let allPlaylists: Playlist[] = [];
  data.forEach((item) => {
    allPlaylists = allPlaylists.concat(item.items);
  });

  const isReachingEnd = data[data.length - 1]?.next === null;

  const Playlists = (): JSX.Element => {
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
        {allPlaylists.map((item, index) => (
          <li key={item.id} className="p-2 flex flex-row">
            <div
              className="my-auto ml-2"
              onClick={() => onPress(item.id, item.name)}
            >
              <p className="font-bold">{item.name}</p>
              {/* <p>{item.description}</p> */}
            </div>
          </li>
        ))}
        {!isReachingEnd && <li className="font-bold" ref={infiniteRef}>Loading More playlists...</li>}
      </ul>
    );
  };

  return (
    <div>
      <Playlists />
    </div>
  );
};
