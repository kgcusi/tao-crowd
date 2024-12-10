import { useState, useEffect, useRef, useCallback } from "react";
import Spinner from "./components/Spinner";

export default function App() {
  const [allLaunches, setAllLaunches] = useState([]);
  const [launches, setLaunches] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [detailsVisible, setDetailsVisible] = useState({}); // Track visibility of details by _id

  const limit = 10;
  const observer = useRef();

  // Fetch all launches once, sorted latest first
  const fetchAllLaunches = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.spacexdata.com/v3/launches?sort=launch_date_utc&order=desc&id=true`
      );
      const data = await res.json();
      setAllLaunches(data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLaunches();
  }, [fetchAllLaunches]);

  // Whenever `allLaunches` or `query` changes, reset the displayed launches
  useEffect(() => {
    if (allLaunches.length === 0) return;
    const filtered = allLaunches.filter((launch) =>
      launch.mission_name.toLowerCase().includes(query.toLowerCase())
    );
    setLaunches(filtered.slice(0, limit));
    setOffset(limit);
    setHasMore(filtered.length > limit);
  }, [allLaunches, query, limit]);

  // Load more launches when intersecting the last element
  const loadMore = useCallback(() => {
    const filtered = allLaunches.filter((launch) =>
      launch.mission_name.toLowerCase().includes(query.toLowerCase())
    );
    const nextItems = filtered.slice(offset, offset + limit);
    setLaunches((prev) => [...prev, ...nextItems]);
    setOffset((prev) => prev + limit);
    if (offset + limit >= filtered.length) {
      setHasMore(false);
    }
  }, [offset, limit, allLaunches, query]);

  const lastLaunchRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore]
  );

  // Toggle visibility of details for a specific launch by _id
  const toggleDetails = (id) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SpaceX Launches</h1>

      <input
        type="text"
        placeholder="Search by mission name..."
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="overflow-auto border border-gray-200 rounded h-[70vh] p-4">
        {launches.map((launch, index) => {
          const isLastLaunch = index === launches.length - 1;
          return (
            <div
              key={launch._id}
              ref={isLastLaunch ? lastLaunchRef : null}
              onClick={launch.details ? () => toggleDetails(launch._id) : null}
              className="mb-2 p-2 border-b border-gray-200 "
            >
              <div
                className={`flex justify-between items-center transition-colors ${
                  launch.details ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                <div className="flex items-center">
                  {launch.links?.mission_patch_small && (
                    <img
                      src={launch.links.mission_patch_small}
                      alt={launch.mission_name}
                      className="w-12 h-12 object-contain mr-2"
                    />
                  )}
                  <div>
                    <div className="flex gap-1 flex-col md:flex-row">
                      <h2 className="font-semibold">{launch.mission_name}</h2>
                      <div>
                        {launch.upcoming ? (
                          <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">
                            Upcoming
                          </span>
                        ) : launch.launch_success ? (
                          <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded">
                            Success
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Launch Year: {launch.launch_year}
                    </p>
                    <p className="text-sm">
                      {launch.links?.article_link && (
                        <>
                          <a
                            href={launch.links.article_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Article
                          </a>
                          {" | "}
                        </>
                      )}
                      {launch.links?.video_link && (
                        <a
                          href={launch.links.video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Video
                        </a>
                      )}
                    </p>
                  </div>
                </div>
                {launch.details && (
                  <div className="ml-2">
                    {detailsVisible[launch._id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-up"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-down"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              <div
                className={`mt-2 text-sm text-gray-400 transition-all duration-500 ease-in-out overflow-hidden ${
                  detailsVisible[launch._id]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {launch.details}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="text-center mt-4">
            <Spinner />
          </div>
        )}

        {!hasMore && launches.length > 0 && (
          <div className="text-center mt-4 text-gray-500">
            No more launches to display
          </div>
        )}

        {launches.length === 0 && !isLoading && (
          <div className="text-center mt-4 text-gray-500">
            No launches found
          </div>
        )}
      </div>
    </div>
  );
}
