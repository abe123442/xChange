// src/components/profile/CommentForm.tsx
"use client";

import { useState } from 'react';
import { CommentFormProps } from '@/lib/utils';
import './commentForm.css';

export const CommentForm: React.FC<CommentFormProps> = ({ profileId }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');  // Clear previous errors

    if (!title || !desc || !rating) {
      setError('All fields are required.');
      return;
    }

    const token = "your-auth-token"; // Replace with actual token
    const response = await fetch(`http://localhost:5001/profile/${profileId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include token in the headers
      },
      body: JSON.stringify({
        title,
        desc,
        rating,
      }),
    });

    if (response.ok) {
      alert('Comment posted successfully!');
      setTitle('');
      setDesc('');
      setRating(undefined);
    } else {
      const responseData = await response.json();
      setError(responseData.error || 'Error posting the comment.');
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h2>Post a Comment</h2>
      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter comment title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter comment description"
        ></textarea>
      </div>

      <div className="form-group">
        <label>Rating</label>
        <input
          type="number"
          value={rating || ''}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
          placeholder="Rate from 1 to 5"
        />
      </div>

      <button type="submit">Submit Comment</button>
    </form>
  );
};
