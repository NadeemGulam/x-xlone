import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";

const FeedCard: React.FC = () => (
  <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-4 hover:bg-slate-800 transition-all cursor-pointer">
    <div className="gap-3 grid grid-cols-12">
      <div className="col-span-1">
        <Image
          width={50}
          height={50}
          src="https://avatars.githubusercontent.com/u/68492875?v=4"
          alt="iser-image"
        />
      </div>
      <div className="col-span-11">
        <h5>Nadeem Gulam</h5>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero culpa
          fugiat totam pariatur nulla dolores, quia quasi amet mollitia, dolor
          perferendis enim nam architecto temporibus ad sequi blanditiis
          repellat deleniti.
        </p>
        <div className="p-2 w-[90%] flex justify-between mt-5 text-xl items-center">
          <div>
            <BiMessageRounded />
          </div>
          <div>
            <FaRetweet/>
          </div>
          <div>
            <AiOutlineHeart/>
          </div>
          <div>
            <BiUpload/>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FeedCard;
