"use client";

interface Profile {
  id: number,
  name: string,
  desc: string,
  country: string,
  scope: string,
  category: string,
  minWam: number,
  degLevels: string[],
  load: string,
  link: string,
  img: string,
  rating: number,
  numRates: number,
  comments: number[]
}

interface ProfileProps {
  profile: Profile
};

export const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <>
    </>
  );
}