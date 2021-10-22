import "./NewPost.css";
import { useState } from "react";

function NewPost({ addPost, username, ...props }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState("text");

  return (
    <div className="post new-post">
      <h3 className="wide">New post</h3>
      <input
        className="wide"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title"
        type="text"
        value={title}
      />
      <textarea
        className="wide"
        placeholder={
          type === "text" ? "What's on your mind?" : `Link to ${type}`
        }
        onChange={(event) => setText(event.target.value)}
        value={text}
      ></textarea>
      <select onChange={(event) => setType(event.target.value)}>
        <option value="text">Text post</option>
        <option value="image">Image</option>
        <option value="video">YouTube video</option>
      </select>
      <button
        onClick={() => {
          const post = {
            username,
            title,
            content: text,
            type,
          };
          fetch("https://workers.uncleshelby.workers.dev/posts", {
            method: "POST",
            body: JSON.stringify(post),
          })
            .then((response) => response.text())
            .then((message) => {
              if (message === "success") {
                addPost({ ...post, postedAt: new Date() });
                setTitle("");
                setText("");
              }
            });
        }}
      >
        Post
      </button>
    </div>
  );
}

export default NewPost;
