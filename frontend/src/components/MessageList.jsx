import React, { useState } from "react";
import { MdOutlineAddReaction, MdOutlineAutoDelete } from "react-icons/md";
import {
  extractDate,
  extractTime,
  getToken,
  getUserDetails,
} from "../Utils/Utils";

function MessageList({
  userMessageArray,
  handleClickEmoji,
  handleClickToDelete,
}) {
  const token = getToken();
  const { userId } = getUserDetails(token);
  const [reactionMessageId, setReactionMessageId] = useState(null);
  const reactionArray = ["👍", "❤", "😂", "😭", "🙏🏻", "😡"];

  // Function to toggle the emoji reaction based on provided message ID.
  const toggleReactionPicker = (messageId) => {
    setReactionMessageId(messageId === reactionMessageId ? null : messageId);
  };

  return (
    <ul className="flex flex-col-reverse gap-3 py-2 overflow-auto scrollbar-hide">
      {userMessageArray.map((item, index) => (
        <li key={index} className="flex flex-col space-y-6">
          <span className="text-xs text-gray-500 bg-gray-100/70 px-3 py-1 rounded-full mx-auto font-medium shadow shadow-gray-300">
            {item.date && extractDate(item.date)}
          </span>
          <ul className="flex flex-col-reverse gap-3">
            {item.messages.map((message) =>
              message.senderId !== userId ? (
                <li
                  key={message.messageId}
                  className="flex flex-col self-start text-sm min-w-16 lg:min-w-20 max-w-[45%] group"
                  onMouseLeave={() => setReactionMessageId(null)}
                >
                  <div className="relative bg-white p-2 rounded-lg rounded-tl-none">
                    <p className="message-text">{message.content}</p>
                    <div className="absolute flex items-end gap-1 -bottom-3 left-[85%]">
                      {message.reacted ? (
                        <span
                          className="bg-slate-300/40 text-base cursor-pointer rounded-full"
                          onClick={() => {
                            handleClickEmoji(message.messageId);
                          }}
                        >
                          {message.reacted}
                        </span>
                      ) : (
                        <MdOutlineAddReaction
                          className="text-gray-500 cursor-pointer size-4 hidden group-hover:block"
                          onClick={() =>
                            toggleReactionPicker(message.messageId)
                          }
                        />
                      )}
                      {reactionMessageId === message.messageId && (
                        <ul className="flex items-center rounded-full bg-white px-1">
                          {reactionArray.map((emoji, index) => (
                            <li
                              key={index}
                              className="cursor-pointer"
                              onClick={() => {
                                handleClickEmoji(message.messageId, emoji);
                                setReactionMessageId(null);
                              }}
                            >
                              <span className="text-base">{emoji}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    {extractTime(message.createdAt)}
                  </span>
                </li>
              ) : (
                <li
                  key={message.messageId}
                  className="flex justify-between gap-1 self-end max-w-[45%] group"
                >
                  <div className="flex flex-col min-w-16 lg:min-w-20 w-full">
                    <div className="bg-cyan-400 relative p-2 rounded-lg rounded-tr-none">
                      {message.reacted && (
                        <span className="absolute -bottom-3 -left-1 bg-slate-300/50 rounded-full">
                          {message.reacted}
                        </span>
                      )}
                      <p className="message-text text-sm">{message.content}</p>
                    </div>
                    <span className="text-[10px] font-medium self-end text-slate-400">
                      {extractTime(message.createdAt)}
                    </span>
                  </div>
                  {!message.isOlderThanTwoMin && (
                    <MdOutlineAutoDelete
                      className="hidden cursor-pointer group-hover:block size-6 mt-2"
                      onClick={() => handleClickToDelete(message.messageId)}
                    />
                  )}
                </li>
              )
            )}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default MessageList;
