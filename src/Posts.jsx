import { useState, useEffect } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();
  // useEffect is used for performing side effects in functional components. It runs after the component renders.
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      // Prefetching means loading the data in the background before it is required by the user, so it can be displayed immediately when needed without a loading state
      //  This is the unique key for the query. React Query uses this key to identify and cache the data. The key is an array where the first element is 'posts' and the second element is the nextPage number.
      queryClient.prefetchQuery({ queryKey: ['posts', nextPage], queryFn: () => fetchPosts(nextPage) });
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000 //in milliseconds - 2seconds
  });
  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  // data is undefined
  if (isError) {
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => {
          setCurrentPage(previousValue => previousValue - 1);
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => {
          setCurrentPage((previousPage) => previousPage + 1);
        }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
