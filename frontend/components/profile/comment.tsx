"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { BACKEND_URL } from "@/lib/utils";
import { CommentProps, Comment as CommentType } from "@/lib/utils";
import "./comment.css";
import { useLocalStorage } from "usehooks-ts";

export const Comment: React.FC<CommentProps> = ({ comments }) => {
  return (
    <div className="comments-section">
      {comments.length === 0 ? (
        <p className="align-right">No comments available.</p>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
};

interface CommentCardProps {
  comment: CommentType;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const [token, setToken, removeToken] = useLocalStorage('token', '');
  const [userid, setUserid] = useState(-1);

  // Get current user ID
  useEffect(() => {
    fetch(`${BACKEND_URL}/auth/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserid(data.id));
  }, []);

  const [likes, setLikes] = useState(comment.upvotedUsers.length);
  const [downvotes, setDownvotes] = useState(comment.downvotedUsers.length);
  const [hasLiked, setHasLiked] = useState(comment.upvotedUsers.includes(userid));
  const [hasDownvoted, setHasDownvoted] = useState(comment.downvotedUsers.includes(userid));

  const handleUpvote = async () => {
    if (!token) return;

    const response = await fetch(
      `${BACKEND_URL}/comment/${comment.id}/upvote`,
      {
        method: hasLiked ? "DELETE" : "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      },
    );

    if (response.ok) {
      setLikes(likes + (hasLiked ? -1 : 1));

      if (!hasLiked && hasDownvoted) {
        setDownvotes(downvotes - 1);
        setHasDownvoted(false);
      }
      setHasLiked(!hasLiked);
    } else {
      const responseData = await response.json();
      console.error("Error upvoting comment:", responseData);
    }
  };

  const handleDownvote = async () => {
    if (!token) return;

    const response = await fetch(
      `${BACKEND_URL}/comment/${comment.id}/downvote`,
      {
        method: hasDownvoted ? "DELETE" : "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      },
    );

    if (response.ok) {
      setDownvotes(downvotes + (hasDownvoted ? -1 : 1));

      if (hasLiked && !hasDownvoted) {
        setLikes(likes - 1);
        setHasLiked(false);
      }
      setHasDownvoted(!hasDownvoted);
    } else {
      const responseData = await response.json();
      console.error("Error downvoting comment:", responseData);
    }
  };
  
  return (
    <div className="comment-card">
      <div className="comment-title">
        <b>{comment.title}</b>
      </div>
      <div className="comment-desc">{comment.desc}</div>
      <div className="comment-rating">Rating: {comment.rating}/10</div>

      <div className="comment-votes">
        <div className="comment-upvote" onClick={handleUpvote}>
          <ThumbsUp className={hasLiked ? "thumbs-up-liked" : ""} />
          <div>{likes}</div>
        </div>

        <div className="comment-downvote" onClick={handleDownvote}>
          <ThumbsDown className={hasDownvoted ? "thumbs-down-disliked" : ""} />
          <div>{downvotes}</div>
        </div>
      </div>
    </div>
  );
};
