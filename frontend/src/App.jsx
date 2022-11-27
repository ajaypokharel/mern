import React, { useState, useEffect } from "react";
import "./App.css";

// import components
import Post from "./components/Post";

function App() {
  const [refresh, setRefresh] = useState(true);
  const [currentPost, setCurrentPost] = useState({ content: "" });
  const [posts, setPosts] = useState([]);

  // Event handlers
  const handleSubmit = async (e) => {
    if (currentPost.content) {
      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        body: JSON.stringify(currentPost),
        headers: { "Content-Type": "application/json" },
      });

      const responseJson = await response.json();
      const status = responseJson.status;

      if (status === 200) {
        setRefresh(!refresh);
      }
      setCurrentPost({ content: "" });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCurrentPost({
      content: value,
    });
  };

  useEffect(() => {
    async function fetchApi() {
      const response = await fetch("http://localhost:8080/posts");
      const dbData = await response.json();
      setPosts(dbData.data);
      console.log(dbData.data);
    }

    fetchApi();
  }, [refresh]);

  return (
    <div className="react-app-component text-center">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Enter your post</label>
                  <textarea
                    className="form-control"
                    id="post-content"
                    rows="3"
                    onChange={handleChange}
                    value={currentPost.content}
                  ></textarea>
                  <div className="d-grid gap-2">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="btn btn-primary mt-2"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {posts
              ?.slice(0)
              .reverse()
              .map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
