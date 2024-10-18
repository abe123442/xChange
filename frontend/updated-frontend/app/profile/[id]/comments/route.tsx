import { promises as fs } from 'fs';
import path from 'path';

// Path to the JSON file
const filePath = path.join(process.cwd(), 'lib', 'data', 'profile.json');

export async function GET(request: Request, { params }: { params: { profileId: number } }) {
  try {
    // Read the JSON file
    const fileData = await fs.readFile(filePath, 'utf-8');
    const profiles = JSON.parse(fileData).profiles;

    // Find the profile by ID and return comments
    const profile = profiles.find((profile: any) => profile.id === Number(params.profileId));

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(profile.comments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error reading profile data' }), { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { profileId: number } }) {
  try {
    const { title, desc, rating } = await request.json();

    // Read the JSON file
    const fileData = await fs.readFile(filePath, 'utf-8');
    const profiles = JSON.parse(fileData).profiles;

    // Find the profile by ID
    const profileIndex = profiles.findIndex((profile: any) => profile.id === Number(params.profileId));
    if (profileIndex === -1) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    const newComment = {
      id: Date.now(),  // Unique ID for comment
      userid: 61021,  // This would ideally come from an authenticated user session
      title,
      desc,
      rating,
      upvotedUsers: [],
      downvotedUsers: []
    };

    // Add new comment to the profile
    profiles[profileIndex].comments.push(newComment);

    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify({ profiles }), 'utf-8');

    return new Response(JSON.stringify({ message: 'Comment added successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error saving comment' }), { status: 500 });
  }
}
