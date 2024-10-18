"use client";

import { useState } from 'react';
import { CommentFormProps } from '@/lib/utils';
import './commentForm.css';
import { BACKEND_URL } from '@/lib/utils'; 
import { Input } from '../ui/input';
import { Button } from "@/components/ui/button";  // Import your custom button component

export const CommentForm: React.FC<CommentFormProps> = ({ profileId }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setSuccess(false); 

    // Basic validation
    if (!title || !desc || !rating) {
      setError('All fields are required.');
      return;
    }

    const token = "faf85f27-f0a3-4a2b-a117-dcacc25313eb"; // Static token for testing
    // const [token, setToken, removeToken] = useLocalStorage('token', '');
    const response = await fetch(`${BACKEND_URL}/profile/${profileId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token,
      },
      body: JSON.stringify({
        title,
        desc,
        rating,
      }),
    });

    if (response.ok) {
      setSuccess(true);
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
      <h2 className="title">Post a Comment</h2>

      <div className="form-group">
        <label>Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter comment title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <Input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter comment description"
        ></Input>
      </div>

      <div className="form-group">
        <label>Rating</label>
        <Input
          type="number"
          value={rating || ''}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="10"
          placeholder="Rate from 1 to 10"
        />
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">Comment posted successfully!</p>}

      <Button className="button" type="submit">
        Submit Comment
      </Button>
    </form>
  );
};
