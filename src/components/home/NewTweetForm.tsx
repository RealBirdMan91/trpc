import { useSession } from "next-auth/react";
import { Button } from "../shared/Button";
import ProfileImage from "../shared/ProfileImage";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

function updateTextAreaSize(textArea: HTMLTextAreaElement) {
  if (!textArea) return;
  textArea.style.height = "inherit";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function NewTweetForm() {
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const session = useSession();

  useLayoutEffect(() => {
    if (!textAreaRef.current) return;
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  if (session.status !== "authenticated") return null;

  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
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
