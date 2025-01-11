import React, { useEffect, useRef } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function MessageForm({
  toggleEmojiPicker,
  setToggleEmojiPicker,
  createNewMessage,
  msgInputValue,
  setMsgInputValue,
}) {
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const pickerBtnRef = useRef(null);

  //   Handles the sending of a new message when the form is submitted.
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msgInputValue.trim()) {
      createNewMessage();
      setMsgInputValue("");
      setToggleEmojiPicker(false);
    }
  };

  // Function to close emoji picker when clicked outside.
  const handleClickOutside = (e) => {
    if (
      pickerRef.current &&
      pickerBtnRef.current &&
      !pickerRef.current.contains(e.target) &&
      !pickerBtnRef.current.contains(e.target)
    ) {
      setToggleEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <form
      className="flex gap-2 w-full relative"
      onSubmit={handleSendMessage}
      ref={pickerBtnRef}
    >
      {toggleEmojiPicker && (
        <span className="absolute bottom-[50px]" ref={pickerRef}>
          <Picker
            data={data}
            previewPosition="none"
            emojiSize={20}
            maxFrequentRows={1}
            autoFocus={true}
            perLine={8}
            skinTonePosition="none"
            searchPosition="none"
            onEmojiSelect={(e) => {
              setMsgInputValue((prevMessage) => prevMessage + e.native);
              inputRef.current.focus();
            }}
          />
        </span>
      )}
      <span
        className="h-full flex items-center bg-white px-4 rounded cursor-pointer"
        onClick={() => setToggleEmojiPicker(!toggleEmojiPicker)}
      >
        <BsEmojiSmile className="size-4" />
      </span>
      <input
        type="text"
        className="w-full text-sm border border-slate-400 p-2 outline-none rounded"
        value={msgInputValue}
        onChange={(e) => setMsgInputValue(e.target.value)}
        placeholder="Type your message"
        ref={inputRef}
      />
      <button className="bg-cyan-400 px-5 rounded" type="submit">
        <MdSend />
      </button>
    </form>
  );
}

export default MessageForm;
