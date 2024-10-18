"use client";

import { useState } from 'react';
import { CommentProps } from '@/lib/utils';
import './comment.css';
import { ThumbsUp } from 'lucide-react';  // Import the thumbs-up icon
import { BACKEND_URL } from '@/lib/utils';

export const Comment: React.FC<CommentProps> = ({ comments }) => {
  return (
    <div className="comments-section">
      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))
      )}
    </div>
  );
};

interface CommentCardProps {
  comment: CommentProps['comments'][0]; // Extract type for single comment
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const [likes, setLikes] = useState(comment.upvotedUsers.length); // Initialize with current like count
  console.log(likes);
  const [hasLiked, setHasLiked] = useState(false); // Track if the user has already liked the comment
  console.log(hasLiked);

  const handleUpvote = async () => {
    if (hasLiked) return; // Prevent multiple upvotes
  
    const token = "faf85f27-f0a3-4a2b-a117-dcacc25313eb"; // Static token for testing
    try {
      const response = await fetch(`${BACKEND_URL}/comments/${comment.id}/upvote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token, // Use 'token' header
        },
      });
  
      if (response.ok) {
        setLikes(likes + 1); // Increment the like count
        setHasLiked(true); // Mark the comment as liked
      } else {
        const errorData = await response.json();
        console.error('Error upvoting comment:', errorData);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  

  return (
    <div className="comment-card">
      <div className="comment-title">
        <b>{comment.title}</b>
      </div>
      <div className="comment-desc">{comment.desc}</div>
      <div className="comment-rating">Rating: {comment.rating}/5</div>
      
      {/* Thumbs up icon with like count */}
      <div className="comment-upvote" onClick={handleUpvote}>
        <ThumbsUp className={hasLiked ? 'thumbs-up-liked' : ''} /> {/* Add class if liked */}
        <div>{likes}</div> {/* Display the like count */}
      </div>
    </div>
  );
};
