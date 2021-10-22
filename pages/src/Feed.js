import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Feed.css";
import NewPost from "./NewPost";

const urlMatch = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

function Feed({ filter, user }) {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    fetch("https://workers.uncleshelby.workers.dev/posts")
      .then((response) => response.json())
      .then((posts) => {
        posts = posts.map((post) => ({
          ...post,
          postedAt: new Date(post.postedAt),
        }));
        if (typeof filter === "function") {
          posts = posts.filter(filter);
        }
        posts.sort((a, b) => {
          return b.postedAt - a.postedAt;
        });
        setPosts(posts);
      });
  }, [filter]);

  return posts ? (
    <>
      <NewPost
        addPost={(post) => setPosts([post, ...posts])}
        className="post"
        username={user}
      />
      {posts.map((post, i) => {
        let content = post.content;
        if ((post.type || "text") === "text") {
          const matches = Array.from(post.content.matchAll(urlMatch));
          let j = 0;
          if (matches.length > 0) {
            let first = matches[matches.length - 1];
            content = [
              ...matches.map((match) => {
                const result = (
                  <>
                    {post.content.substring(j, match.index)}
                    <a
                      href={post.content.substring(
                        match.index,
                        match.index + match[0].length
                      )}
                    >
                      {post.content.substring(
                        match.index,
                        match.index + match[0].length
                      )}
                    </a>
                  </>
                );
                j = match.index + match[0].length;
                return result;
              }),
              post.content.substring(first.index + first[0].length),
            ];
          }
        } else if (post.type === "image") {
          content = (
            <img src={post.content} alt={`uploaded by ${post.username}`} />
          );
        } else if (post.type === "video") {
          const match = content.match(/v=([A-Za-z0-9]+)/);
          if (match && match[1]) {
            content = (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${match[1]}`}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            );
          } else {
            content = "Youtube link is not well-formed";
          }
        }
        return (
          <div className="post" key={i}>
            <h3>
              <Link to={`/post/${post.username}`}>{post.title}</Link>
            </h3>
            <p>
              Posted by{" "}
              <Link to={`/user?name=${post.username}`}>{post.username}</Link>,{" "}
              {post.postedAt.toDateString()} at{" "}
              {post.postedAt.toTimeString().replace(/ \(.*\)$/, "")}
            </p>
            <p>{content}</p>
          </div>
        );
      })}
    </>
  ) : (
    "Loading..."
  );
}

export default Feed;
