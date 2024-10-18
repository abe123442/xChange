"use client";

import { CircleIcon, StarIcon } from "@radix-ui/react-icons";

import {
  Card as CardComponent,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Profile } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Card: React.FC<{ profile: Profile }> = ({ profile }) => {
  const router = useRouter();
  return (
    <CardComponent
      className="hover:cursor-pointer"
      onClick={() => router.push(`/profile/${profile.id}`)}
    >
      <CardHeader className="gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>{profile.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mt-auto space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {profile.degLevels}
          </div>
          <div className="flex items-center">
            <StarIcon className="mr-1 h-3 w-3" />
            {profile.rating}/10
          </div>
          <div>{profile.category}</div>
        </div>
      </CardContent>
    </CardComponent>
  );
};

export default Card;
