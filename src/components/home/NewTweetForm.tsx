import { useSession } from "next-auth/react";
import { Button } from "../shared/Button";
import ProfileImage from "../shared/ProfileImage";
import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

function NewTweetForm() {
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const session = useSession();
  const trpcUtils = api.useContext();

  useLayoutEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) return;
    textArea.style.height = "inherit";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }, [inputValue]);

  const { isSuccess, data, isError, error, mutate } =
    api.tweet.createTweet.useMutation({
      onSuccess: (newTweet) => {
        setInputValue("");
        toast.success("Tweeted successfully");
        trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
          if (
            oldData == null ||
            oldData.pages[0] == null ||
            session.status !== "authenticated"
          )
            return;

          const newCacheTweet = {
            ...newTweet,
            likeCount: 0,
            likedByMe: false,
            user: {
              id: session.data.user.id,
              name: session.data.user.name || null,
              image: session.data.user.image || null,
            },
          };

          return {
            ...oldData,
            pages: [
              {
                ...oldData.pages[0],
                tweets: [newCacheTweet, ...oldData.pages[0].tweets],
              },
              ...oldData.pages.slice(1),
            ],
          };
        });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  console.log({ isSuccess, data, isError, error });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!inputValue || inputValue.trim().length <= 0) return;

    mutate({ content: inputValue });
  }

  if (session.status !== "authenticated") return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={textAreaRef}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="whats happening?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
}

export default NewTweetForm;
