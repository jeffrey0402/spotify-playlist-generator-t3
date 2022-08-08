import Image from "next/image";

type PlayListItemProps = {
  item: any; //TODO: type this
};

export const PlayListItem = ({ item }: PlayListItemProps) => {
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
};
