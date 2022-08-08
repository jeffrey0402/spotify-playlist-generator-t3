type PagesWidgetProps = {
  getPlaylists: (page: number) => void;
  currentPage: number;
  totalPages: number;
};

export const PagesWidget = ({
  getPlaylists,
  currentPage,
  totalPages,
}: PagesWidgetProps) => {
  return (
    <div className="btn-group">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`btn ${
            currentPage === i ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => getPlaylists(i * 20)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};
