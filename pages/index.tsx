
import Image from "next/image";
import FeedCard from "@/components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import { useCallback, useState } from "react";
import {
  BiImageAlt
} from "react-icons/bi";
import { useCreateTweets, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";
import TweeterLayout from "@/components/FeedCard/Layout/TweeterLayout";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllTweetsQuery, getSignedURLForTweetQuery } from "@/graphql/query/tweet";
import axios from "axios";
import toast from "react-hot-toast";

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  const { mutateAsync } = useCreateTweets();
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const { tweets = props.tweets as Tweet[] } = useGetAllTweets();

  // console.log(user);

  const handleInputChangeFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | undefined | null = input.files?.item(0);

      if (!file) return;

      console.log('File Type:', file.type); // Log file type

      console.log(getSignedURLForTweetQuery);

      const { getSignedURLForTweet } = await graphqlClient.request(getSignedURLForTweetQuery, {
        imageName: file.name,
        imageType: file.type
      })
      console.log(getSignedURLForTweet);

      if (getSignedURLForTweet) {
        toast.loading("Uploading ...", { id: '2' });
        await axios.put(getSignedURLForTweet, file, {
          headers: {
            'Content-Type': file.type
          }
        })
        toast.success("Upload Completed Successfully !!", { id: '2' });
        const url = new URL(getSignedURLForTweet);

        const myFilePath = `${url.origin}${url.pathname}`
        setImageURL(myFilePath);
      }
    }
  }, [])

  // This function is for when we click on image to tweet
  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    const handlerFn = handleInputChangeFile(input)

    input.addEventListener('change', handlerFn);
    input.click();
  }, [handleInputChangeFile])

  const handleCreatePost = useCallback(async () => {
    await mutateAsync({
      content,
      imageURL
    })
    setContent("");
    setImageURL("");
  }, [content, mutateAsync, imageURL]);

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
                {
                  imageURL && <Image
                    src={imageURL}
                    height={300}
                    width={300}
                    alt="tweet-image" />
                }
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
          tweets?.map((tweet) => tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null)
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



