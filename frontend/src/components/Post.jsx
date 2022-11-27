import React from "react";
import "./post.styles.scss";

const Post = ({ post: { _id, createdAt, content }, setRefresh, refresh }) => {
  const date = new Date(createdAt.split("T")[0]).toDateString();

  const handleDelete = async (postId) => {
    const response = await fetch(`http://localhost:8080/posts/${postId}`, {
      method: "DELETE",
      body: { _id: postId },
    });
    const responseJson = await response.json();
    const status = responseJson.status;
    console.log(status);
    if (status === 200) {
      setRefresh(!refresh);
    }
  };

  return (
    <div className="card text-white bg-dark my-3 text-start">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">{date}</h6>
        <p className="card-text">{content}</p>
        <button className="card-link" onClick={() => handleDelete(_id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Post;
