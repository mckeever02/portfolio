"use client";

import Image from "next/image";

interface TeamMember {
  name: string;
  avatar: string;
}

interface TeamAvatarsProps {
  team: TeamMember[];
}

export function TeamAvatars({ team }: TeamAvatarsProps) {
  // Extract filename from path for alt text
  const getFilename = (path: string) => {
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace(/\.[^/.]+$/, ''); // Remove extension
  };

  return (
    <div className="flex items-start pl-0 pr-[3px]">
      {team.map((member, index) => (
        <div
          key={member.name}
          className="relative w-[25px] h-[25px] rounded-full border border-white bg-[rgba(0,0,0,0.1)] overflow-hidden -mr-[5px] cursor-pointer"
          style={{ zIndex: team.length - index }}
          title={member.name}
        >
          <Image
            src={member.avatar}
            alt={getFilename(member.avatar)}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
