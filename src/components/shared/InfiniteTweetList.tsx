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
};

export function InfiniteTweetList({ tweets }: Props) {
  console.log(tweets);
  return "määh!!!!";
}
