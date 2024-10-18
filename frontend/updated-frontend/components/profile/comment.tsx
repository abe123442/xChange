"use client";

import { useEffect, useState } from "react";
import { CommentProps } from "@/lib/utils";

export const Comment: React.FC<CommentProps> = ({ comments }) => {
  const [s, setComments] = useState<Comment[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/comments/${comments.id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load comments:", err);
      });
  }, [comments.id]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      desc,
      rating,
    };

    const response = await fetch(`/api/comments/${comments.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedComments = await response.json();
      setComments(updatedComments);
      setTitle("");
      setDesc("");
      setRating(0);
    } else {
      console.error("Failed to submit comment");
    }
  };

  if (isLoading) return <p>Loading comments...</p>;

  return (
    <section>
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="border p-4 mb-2">
            <h4>{comment.title}</h4>
            <p>{comment.desc}</p>
            <p>Rating: {comment.rating}</p>
          </div>
        ))
      ) : (
        <p>No comments yet</p>
      )}
      <form onSubmit={submitComment}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <button type="submit">Submit Comment</button>
      </form>
    </section>
  );
};
