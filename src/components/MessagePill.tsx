import React from "react";
import isValidUrl from "../functions/isValidUrl";
import { MessageObj } from "../type";

const MessagePill: React.FC<{
  messageObj: MessageObj;
  fromSelf: (authorId: string) => boolean;
}> = ({ messageObj, fromSelf }) => {
  const imageTypes = /(gif|jpe?g|tiff?|png|webp)$/i;
  const videoTypes = /(mp4|mov|flv|3gp)$/i;
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
          className="object-cover max-h-36 md:max-h-44 lg:max-h-48 rounded-xl"
        />
      </div>
    );
  } else if (videoTypes.test(messageObj.type)) {
    // if userData is a video
    return (
      <div className="inline-block max-w-xl my-1">
        {!fromSelf(messageObj.id) && (
          <p className="font-nunito text-sm text-gray-500">{messageObj.user}</p>
        )}
        <video
          className="video-js max-h-36 md:max-h-44 lg:max-h-48 rounded-md"
          preload="metadata"
          controls
        >
          <source src={messageObj.userData} type="video/mp4" />
          <p>
            To view this video please enable JavaScript, and consider upgrading
            to a web browser that
            <a
              href="https://videojs.com/html5-video-support/"
              target="_blank"
              rel="noreferrer"
            >
              supports HTML5 video
            </a>
          </p>
        </video>
      </div>
    );
  } else if (isValidUrl(messageObj.userData)) {
    // if userData is a file
    return (
      <div
        className={`inline-block max-w-xs md:max-w-sm lg:max-w-md shadow rounded-2xl my-1 p-3 ${
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
      className={`inline-block max-w-xs md:max-w-sm lg:max-w-md shadow rounded-2xl my-1 p-3 ${
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
