import { getData, setData } from './dataStore';
import { getProfile } from './profile';
import { Comment } from './typedef';
import HTTPError from 'http-errors';

/**
 * Get comments held on a specific profile page
 * @param profileid 
 * @returns array of comments pertaining to the requested profile
 */
export function getProfileComments(profileid: number): Comment[] {
  const data = getData();

  const profile = getProfile(profileid);
  const commentids = profile.comments;
  const comments = data.comments;
  
  let foundComments: Comment[] = [];

  for (const id of commentids) {
    const found = comments.filter((x) => x.id === id);
    if (found) {
      const comment = found[0];
      foundComments.push(comment);
    }
  }

  return foundComments;
}

/**
 * Create a new comment and assign it to the profile it was created for
 * @param userid
 * @param profileid 
 * @param title
 * @param desc
 * @param rating
 * @returns nothing
 */
export function createComment(userid: number, profileid: number, title: string, desc: string, rating: number) {
  const data = getData();

  if (!title || title.length > 50) {
    throw HTTPError(400, 'Invalid title provided');
  }

  if (!desc || desc.length > 500) {
    throw HTTPError(400, 'Invalid contents provided');
  }

  if (!rating || rating < 0 || rating > 10) {
    throw HTTPError(400, 'Invalid rating provided');
  }

  const profile = getProfile(profileid, data);

  const user = data.users.find(user => user.id === userid);

  if (!user) {
    throw HTTPError(400, "Invalid user id");
  }

  let commentid = data.comments.length + data.deletedComments;

  const newComment: Comment = {
    id: commentid,
    username: user.username,
    userid: userid,
    title: title,
    desc: desc,
    rating: rating,
    upvotedUsers: [],
    downvotedUsers: []
  }

  // recalculate rating
  const newRating = (profile.rating * profile.comments.length) + rating;
  profile.rating = newRating;
  profile.numRates += 1;

  profile.comments.push(commentid);
  data.comments.push(newComment);
  setData(data);

  return {};
}

/**
 * Applies an upvote to a comment
 * @param userid
 * @param profileid
 * @returns nothing
 */
export function upvoteComment(commentid: number, userid: number) {
  const data = getData();
  const comments = data.comments;


  const foundComment = comments.find((x) => x.id === commentid);

  if (!foundComment) {
    throw HTTPError(400, 'Comment does not exist');
  }

  const hasUpvoted = foundComment.upvotedUsers.find((x) => x === userid);

  if (hasUpvoted) {
    // user has already upvoted
    throw HTTPError(400, 'User has already upvoted');
  }

  // remove old downvote
  const hasDownvoted = foundComment.downvotedUsers.find((x) => x === userid);
  if (hasDownvoted) {
    const index = foundComment.downvotedUsers.indexOf(userid);
    foundComment.downvotedUsers.splice(index, 1);
  }

  foundComment.upvotedUsers.push(userid);

  setData(data);
  return {};
}

/**
 * Applies an downvote to a comment
 * @param userid
 * @param profileid
 * @returns nothing
 */
export function downvoteComment(commentid: number, userid: number) {
  const data = getData();
  const comments = data.comments;

  const foundComment = comments.find((x) => x.id === commentid);

  if (!foundComment) {
    throw HTTPError(400, 'Comment does not exist');
  }

  const hasDownvoted = foundComment.downvotedUsers.find((x) => x === userid);
  if (hasDownvoted) {
    // user has already downvoted
    throw HTTPError(400, 'User has already downvoted');
  }

  // remove old upvote
  const hasUpvoted = foundComment.upvotedUsers.find((x) => x === userid);
  if (hasUpvoted) {
    const index = foundComment.upvotedUsers.indexOf(userid);
    foundComment.upvotedUsers.splice(index, 1);
  }

  foundComment.downvotedUsers.push(userid);

  setData(data);
  return {};
}

/**
 * Removes a downvote to a comment
 * @param userid
 * @param profileid
 * @returns nothing
 */
export function removeDownvote(commentid: number, userid: number) {
  const data = getData();
  const comments = data.comments;

  const foundComment = comments.find((x) => x.id === commentid);

  if (!foundComment) {
    throw HTTPError(400, 'Comment does not exist');
  }

  const hasDownvoted = foundComment.downvotedUsers.find((x) => x === userid);
  if (!hasDownvoted) {
    // user has not already downvoted
    throw HTTPError(400, 'User not has already downvoted');
  }

  // remove old downvote
  const index = foundComment.downvotedUsers.indexOf(userid);
  foundComment.downvotedUsers.splice(index, 1);

  setData(data);
  return {};
}

/**
 * Removes an upvote to a comment
 * @param userid
 * @param profileid
 * @returns nothing
 */
export function removeUpvote(commentid: number, userid: number) {
  const data = getData();
  const comments = data.comments;

  const foundComment = comments.find((x) => x.id === commentid);

  if (!foundComment) {
    throw HTTPError(400, 'Comment does not exist');
  }

  const hasUpvoted = foundComment.upvotedUsers.find((x) => x === userid);
  if (!hasUpvoted) {
    // user has not already upvoted
    throw HTTPError(400, 'User not has already upvoted');
  }

  // remove old upvote
  const index = foundComment.upvotedUsers.indexOf(userid);
  foundComment.upvotedUsers.splice(index, 1);

  setData(data);
  return {};
}

/**
 * Deletes an existing comment and removes it from the respective profile.
 * @param commentid
 * @param userid
 * @returns nothing
 */
export function deleteComment(commentid: number, userid: number) {
  const data = getData();

  const comment = data.comments.find((x) => x.id === commentid);

  if (!comment) {
    throw HTTPError(400, 'Comment not found');
  }

  if (comment.userid !== userid) {
    throw HTTPError(401, "User is not authorised to delete this comment");
  }

  data.comments.splice(data.comments.indexOf(comment), 1);
  data.deletedComments += 1;

  for (const profile of data.profiles) {
    if (profile.comments.splice(profile.comments.indexOf(commentid), 1)) {
      profile.numRates =- 1;
    };
  }

  setData(data);
  return {};
}