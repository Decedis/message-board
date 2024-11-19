//import { User } from "../utls/types";

export const Post = ({
  author,
  content,
}: {
  author: string;
  content: string;
}) => {
  return (
    <div className="border-x-red-500 border-2 rounded-md p-4">
      <h2 className="border-b-2 border-red-500 ">{author}</h2>
      <div>{content}</div>
    </div>
  );
};
