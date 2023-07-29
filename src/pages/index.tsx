import NewTweetForm from "~/components/home/NewTweetForm";
import { InfiniteTweetList } from "~/components/shared/InfiniteTweetList";
import { api } from "~/utils/api";

export default function Home() {
  const recentTweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
      </header>
      <NewTweetForm />
      <InfiniteTweetList
        tweets={recentTweets.data?.pages.flatMap((page) => page.tweets)}
      />
    </>
  );
}
