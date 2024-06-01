
import Image from "next/image";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  BiImageAlt
} from "react-icons/bi";
import { useCreateTweets, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TweeterLayout from "@/components/FeedCard/Layout/TweeterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery } from "@/graphql/query/tweet";

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  const { mutate } = useCreateTweets();
  const [content, setContent] = useState('');

  console.log(user);

  // This function is for when we click on image to tweet
  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, [])

  const handleCreatePost = useCallback(() => [
    mutate({
      content,
    })
  ], [content, mutate]);

  return (
    <div>
      <TweeterLayout>
        <div>
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-4 hover:bg-slate-800 transition-all cursor-pointer">
            <div className="gap-3 grid grid-cols-12">
              <div className="col-span-1">
                {user?.profileImageURL && (<Image
                  className="rounded-full"
                  width={50}
                  height={50}
                  src={user?.profileImageURL}
                  alt="iser-image"
                />)}
              </div>
              <div className="col-span-11">
                <textarea value={content} onChange={e => setContent(e.target.value)} className="bg-transparent w-full text-xl px-3 border-b border-slate-700" placeholder="What's happening??" rows={3}></textarea>
                <div className="mt-2 flex justify-between items-center">
                  <BiImageAlt onClick={handleSelectImage} className="text-xl" />
                  <button onClick={handleCreatePost} className="bg-[#1d9bf0] font-semibold py-2 px-4 rounded-full   text-sm">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          props.tweets?.map((tweet) => tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null)
        }
      </TweeterLayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const allTweets = await graphqlClient.request(getAllTweetsQuery);
  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    }
  }
}



