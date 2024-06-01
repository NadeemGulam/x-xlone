import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps {
  data: Tweet
}

const FeedCard: React.FC<FeedCardProps> = (props) => {

  const { data } = props
  return (

    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-4 hover:bg-slate-800 transition-all cursor-pointer">
      <div className="gap-3 grid grid-cols-12">
        <div className="col-span-1">
          {data.author?.profileImageURL && <Image
            className="rounded-full"
            width={50}
            height={50}
            src={data.author?.profileImageURL}
            alt="iser-image"
          />}
        </div>
        <div className="col-span-11">
          <h5>
            <Link href={`/${data.author?.id}`}>{data.author?.firstName} {data.author?.lastName}</Link>
          </h5>
          <p>
            {data.content}
          </p>
          <div className="p-2 w-[90%] flex justify-between mt-5 text-xl items-center">
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div>
              <AiOutlineHeart />
            </div>
            <div>
              <BiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedCard;
