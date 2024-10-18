"use client";

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { BACKEND_URL } from '@/lib/utils';
import { CommentProps, Comment as CommentType } from '@/lib/utils';
import './comment.css';

export const Comment: React.FC<CommentProps> = ({ comments, currentUserId }) => {
  return (
    <div className="comments-section">
      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} currentUserId={currentUserId} />
        ))
      )}
    </div>
  );
};

interface CommentCardProps {
  comment: CommentType;
  currentUserId: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment, currentUserId }) => {
  const [likes, setLikes] = useState(comment.upvotedUsers.length);
  const [downvotes, setDownvotes] = useState(comment.downvotedUsers.length);
  const [hasLiked, setHasLiked] = useState(() =>
    comment.upvotedUsers.includes(currentUserId)
  );
  const [hasDownvoted, setHasDownvoted] = useState(() =>
    comment.downvotedUsers.includes(currentUserId)
  );

  const token = "faf85f27-f0a3-4a2b-a117-dcacc25313eb";

  const handleUpvote = async () => {
    if (hasLiked) return;

    const response = await fetch(`${BACKEND_URL}/comments/${comment.id}/upvote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      const responseData = await response.json();
      console.error('Error upvoting comment:', responseData);
    }
  };

  const handleDownvote = async () => {
    if (hasDownvoted) return;

    const response = await fetch(`${BACKEND_URL}/comments/${comment.id}/downvote`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setDownvotes(downvotes + 1);
      setHasDownvoted(true);
    } else {
      const responseData = await response.json();
      console.error('Error downvoting comment:', responseData);
    }
  };

  return (
    <div className="comment-card">
      <div className="comment-title">
        <b>{comment.title}</b>
      </div>
      <div className="comment-desc">{comment.desc}</div>
      <div className="comment-rating">Rating: {comment.rating}/5</div>
      
      <div className="comment-votes">
        <div className="comment-upvote" onClick={handleUpvote}>
          <ThumbsUp className={hasLiked ? 'thumbs-up-liked' : ''} />
          <div>{likes}</div>
        </div>

        <div className="comment-downvote" onClick={handleDownvote}>
          <ThumbsDown className={hasDownvoted ? 'thumbs-down-disliked' : ''} />
          <div>{downvotes}</div>
        </div>
      </div>
    </div>
  );
};
