import Image from "next/image";
import { MouseEventHandler } from "react";

type PlayListItemProps = {
  item: any; //TODO: type this
  onPress: (id: string) => Promise<void>;
};

export const PlayListItem = ({ item, onPress }: PlayListItemProps) => {
  return (
    <div key={item.id} className="p-2 flex flex-row">
      {/* <Image
        src={item.images[0].url}
        alt={item.name + " Playlist image"}
        width="96"
        height="96"
        className="w-24 h-24"
      /> */}
      <div className="my-auto ml-2" onClick={() => onPress(item.id)}>
        <p className="font-bold">{item.name}</p>
        {/* <p>{item.description}</p> */}
      </div>
    </div>
  );
};
