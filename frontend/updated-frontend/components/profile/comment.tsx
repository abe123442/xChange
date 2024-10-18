"use client";


import { useEffect, useState } from "react";
import { CommentProps } from "@/lib/utils";


export const Comment: React.FC<CommentProps> = ({ comments }) => {
 return (
   <div className="comments-section">
     <h2>Comments</h2>
     {comments.length === 0 ? (
       <p>No comments available.</p>
     ) : (
       comments.map((comment) => (
         <div key={comment.id} className="comment-card">
           <div className="comment-title">
             <b>{comment.title}</b>
           </div>
           <div className="comment-desc">{comment.desc}</div>
           <div className="comment-rating">
             Rating: {comment.rating}/5
           </div>
           <div className="comment-user">
             User ID: {comment.userid}
           </div>
         </div>
       ))
     )}
   </div>
 );
};
