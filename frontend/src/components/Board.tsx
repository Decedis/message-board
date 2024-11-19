import { User } from "../utls/types";
import { Post } from "./Post";

export const Board = () => {
  const testData = [
    { id: 1, author: "Jane", content: "this is test content" },
    { id: 2, author: "Marcus", content: "this is test content" },
    { id: 3, author: "Malcolm", content: "this is test content" },
  ];
  return (
    <div className="mx-auto w-5/12 border-2 border-red-600 rounded-md p-4 ">
      <h1>Board</h1>
      <div className="flex flex-col gap-4">
        {testData.map((post) => (
          <Post key={post.id} author={post.author} content={post.content} />
        ))}
      </div>
    </div>
  );
};
