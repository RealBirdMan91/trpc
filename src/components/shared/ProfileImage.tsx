import clsx from "clsx";
import Image from "next/image";
import React from "react";

type ProfileImageProps = {
  className?: string;
  src: string | null | undefined;
};

function ProfileImage({ className, src }: ProfileImageProps) {
  return (
    <div
      className={clsx(
        "relative h-12 w-12 overflow-hidden rounded-full",
        className
      )}
    >
      <Image
        src={src || "/images/profile.jpeg"}
        layout="fill"
        objectFit="cover"
        quality={100}
        alt="profile Image"
      />
    </div>
  );
}

export default ProfileImage;
