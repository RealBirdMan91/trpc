import InfiniteScroll from "react-infinite-scroll-component";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { VscHeart as HeartIcon } from "react-icons/vsc";
import clsx from "clsx";
import { api } from "~/utils/api";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type Props = {
  tweets?: Tweet[];
  hasMore: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
};

export function InfiniteTweetList({
  tweets,
  fetchNextPage,
  hasMore,
  isLoading,
}: Props) {
  if (!tweets || tweets.length <= 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        No tweets found
      </h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        loader={
          <h2 className="my-4 text-center text-2xl text-gray-500">
            Loading...
          </h2>
        }
        dataLength={tweets.length}
        next={fetchNextPage}
        hasMore={hasMore}
      >
        {tweets.map((tweet) => (
          <div key={tweet.id}>
            <TweetCard {...tweet} />
          </div>
        ))}
      </InfiniteScroll>
    </ul>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

function TweetCard({
  content,
  createdAt,
  id,
  likeCount,
  likedByMe,
  user,
}: Tweet) {
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-bold outline-none hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton likeCount={likeCount} likedByMe={likedByMe} id={id} />
      </div>
    </li>
  );
}

function HeartButton({
  likedByMe,
  likeCount,
  id,
}: Pick<Tweet, "likedByMe" | "likeCount" | "id">) {
  const session = useSession();
  const trpcUtils = api.useContext();
  const { mutate } = api.tweet.toggleLike.useMutation({
    onSuccess: async () => {
      await trpcUtils.tweet.infiniteFeed.invalidate();
    },
  });

  if (session.status !== "authenticated") return null;
  return (
    <button
      className={clsx(
        "group flex items-center gap-1 self-start transition-colors duration-200",
        likedByMe ? "text-red-500" : "text-gray-500"
      )}
      onClick={() => mutate({ id })}
    >
      <HeartIcon
        className={clsx(
          "transition-colors duration-200",
          likedByMe ? "fill-red-500" : "fill-gray-500"
        )}
      />
      <span>{likeCount}</span>
    </button>
  );
}
