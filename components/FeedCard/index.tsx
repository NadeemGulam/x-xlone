import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";
import toast from "react-hot-toast";

interface FeedCardProps {
  data: Tweet
}

const featureNotImplemented = () => {
  toast.error("This feature will be implemented soon. Stay tuned!");
  return;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  // console.log(props);
  const { data } = props
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-4 hover:bg-slate-900 transition-all cursor-pointer">
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
            <Link href={`/${data.author?.id}`} className="font-semibold">{data.author?.firstName} {data.author?.lastName}</Link>
          </h5>
          <p className="mb-3">
            {data.content}
          </p>
          {
            data.imageURL && <Image src={data.imageURL} alt="tweet-image" height={400} width={400} />
          }
          <div className="p-2 w-[90%] flex justify-between mt-5 text-xl items-center">
            <div>
              <BiMessageRounded onClick={featureNotImplemented}/>
            </div>
            <div>
              <FaRetweet onClick={featureNotImplemented}/>
            </div>
            <div>
              <AiOutlineHeart onClick={featureNotImplemented}/>
            </div>
            <div>
              <BiUpload onClick={featureNotImplemented}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedCard;
