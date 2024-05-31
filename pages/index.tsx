import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import {
  BiHash,
  BiHomeCircle,
  BiMobile,
  BiMoney,
  BiUser,
} from "react-icons/bi";
import { SlOptions } from "react-icons/sl";

const inter = Inter({ subsets: ["latin"] });

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notification",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "Options",
    icon: <SlOptions />,
  },
];

export default function Home() {
  const { user, refetch } = useCurrentUser();
  const queryClient = useQueryClient();

  console.log(user);

  // useEffect(() => {
  //   // Function to run when the storage event is fired
  //   const handleStorageChange = (e: StorageEvent) => {
  //     if (e.key === "__Twitter_token" && refetch) {
  //       refetch();
  //     }
  //   };

  //   // Add event listener
  //   window.addEventListener("storage", handleStorageChange);

  //   // Remove event listener on cleanup
  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [refetch]);

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) {
        return toast.error(`Google Token not found`);
      }

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        { token: googleToken }
      );
      toast.success("verify Success");
      console.log("Token Below");
      console.log(verifyGoogleToken);

      if (verifyGoogleToken) {
        console.log("Inside if ");
        window.localStorage.setItem("__Twitter_token", verifyGoogleToken);
      }
      console.log("about to run await ");
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      console.log("Finished invalidating queries");
    },
    [queryClient]
  );
  return (
    <div className={inter.className}>
      <div className=" grid grid-cols-12 h-screen w-screen px-32">
        <div className=" col-span-3 pt-2 relative">
          <div className="text-3xl w-fit hover:bg-gray-800 p-3  rounded-full h-fit cursor-pointer transition-all">
            <BsTwitter />
          </div>

          <div className="mt-2 font-semibold text-lg pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="mt-1 flex w-fit  justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-3 cursor-pointer"
                  key={item.title}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button className="bg-[#1d9bf0] font-semibold p-3 rounded-full  w-[80%] text-lg">
                Post
              </button>
            </div>
          </div>
          {user && (<div className="absolute bottom-5 flex gap-2 items-center rounded-full bg-slate-800 px-2 py-3">
            {user && user.profileImageURL && (<Image className='rounded-full' src={user?.profileImageURL} alt='ProfileImage' width={50} height={50} />)}
            <div>
              <h3 className="text-xl">{user.firstName} {user.lastName}</h3>
            </div>
          </div>)}
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3 p-5">
          {!user && (
            <div className="p-5 bg-slate-700 rounded-lg">
              <h1 className="my-2 text-xl">New To Twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
