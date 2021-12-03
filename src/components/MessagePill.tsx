import React from "react";
import isValidUrl from "../functions/isValidUrl";
import { MessageObj } from "../type";

const MessagePill: React.FC<{
  messageObj: MessageObj;
  fromSelf: (authorId: string) => boolean;
}> = ({ messageObj, fromSelf }) => {
  const imageTypes = /(gif|jpe?g|tiff?|png|webp)$/i;
  // const otherTypes = [/pptx/, /doc/, /docx/];

  if (imageTypes.test(messageObj.type)) {
    // if userData is an image
    return (
      <div className="inline-block max-w-xl my-1">
        {!fromSelf(messageObj.id) && (
          <p className="font-nunito text-sm text-gray-500">{messageObj.user}</p>
        )}
        <img
          src={messageObj.userData}
          alt="users resource"
          className="object-cover max-h-48 rounded-xl max-w-md"
        />
      </div>
    );
  } else if (isValidUrl(messageObj.userData)) {
    // if userData is a file
    return (
      <div
        className={`inline-block max-w-xl shadow rounded-2xl my-1 p-3 ${
          fromSelf(messageObj.id) ? "bg-blue-400 text-white" : "bg-white"
        }`}
      >
        {!fromSelf(messageObj.id) && (
          <p className="font-nunito text-sm text-gray-500">{messageObj.user}</p>
        )}
        <a
          href={messageObj.userData}
          className="inline-flex font-montserrat underline font-medium text-sm break-words"
        >
          {messageObj.fileName}
        </a>
      </div>
    );
  }
  return (
    <div
      className={`inline-block max-w-xl shadow rounded-2xl my-1 p-3 ${
        fromSelf(messageObj.id) ? "bg-blue-400 text-white" : "bg-white"
      }`}
    >
      {!fromSelf(messageObj.id) && (
        <p className="font-nunito text-sm text-gray-500">{messageObj.user}</p>
      )}
      <p className="font-montserrat font-medium text-sm break-words">
        {messageObj.userData}
      </p>
    </div>
  );
};

export default MessagePill;
