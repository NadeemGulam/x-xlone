import { Tweet } from '@/gql/graphql';
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { ReactNode, useCallback, useMemo } from 'react'
import { BiHomeCircle, BiHash, BiMoney, BiUser, BiImageAlt } from 'react-icons/bi';
import { BsBell, BsEnvelope, BsBookmark, BsTwitter } from 'react-icons/bs';
import { SlOptions } from 'react-icons/sl';
import FeedCard from '..';
import { useCurrentUser } from '@/hooks/user';
import { Inter } from 'next/font/google';
import Image from "next/image";
import { graphqlClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';


const inter = Inter({ subsets: ["latin"] });

interface TweeterLayoutProps {
    children: React.ReactNode
}

interface TwitterSidebarButton {
    title: string;
    icon: React.ReactNode;
    link: string
}


const TweeterLayout: React.FC<TweeterLayoutProps> = (props) => {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

    const sidebarMenuItems: TwitterSidebarButton[] = useMemo(() => [
        {
            title: "Home",
            icon: <BiHomeCircle />,
            link: '/',
        },
        {
            title: "Explore",
            icon: <BiHash />,
            link: '/',
        },
        {
            title: "Notification",
            icon: <BsBell />,
            link: '/',
        },
        {
            title: "Messages",
            icon: <BsEnvelope />,
            link: '/',
        },
        {
            title: "Bookmarks",
            icon: <BsBookmark />,
            link: '/',
        },
        {
            title: "Twitter Blue",
            icon: <BiMoney />,
            link: '/',
        },
        {
            title: "Profile",
            icon: <BiUser />,
            link: `/${user?.id}`,
        },
        {
            title: "Options",
            icon: <SlOptions />,
            link: '/',
        },
    ], [user?.id])

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
        <div>
            <div className={inter.className}>
                <div className=" grid grid-cols-12 h-screen w-screen sm:px-32">
                    <div className=" col-span-2 sm:col-span-3 pt-2 relative flex sm:justify-end pr-6">
                        <div>
                            <div className="text-3xl w-fit hover:bg-gray-800 p-3  rounded-full h-fit cursor-pointer transition-all">
                                <BsTwitter />
                            </div>

                            <div className="mt-2 font-semibold text-lg pr-4">
                                <ul>
                                    {sidebarMenuItems.map((item) => (
                                        <li
                                            key={item.title}
                                        >
                                            <Link href={item.link}
                                                className="mt-1 flex w-fit  justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-3 cursor-pointer"
                                            >
                                                <span className="text-2xl">{item.icon}</span>
                                                <span className='hidden sm:inline'>{item.title}</span></Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-5 px-3">
                                    <button className="hidden sm:block bg-[#1d9bf0] font-semibold p-3 rounded-full  w-[80%] text-lg">
                                        Post
                                    </button>
                                    <button className="block mr-10 sm:hidden bg-[#1d9bf0] font-semibold p-3 rounded-full  w-[80%] text-lg">
                                        <BsTwitter />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {user && (<div className=" absolute bottom-5 flex gap-2 items-center rounded-full bg-slate-800 px-2 py-3">
                            {user && user.profileImageURL && (<Image className='text-sm rounded-full' src={user?.profileImageURL} alt='ProfileImage' width={50} height={50} />)}
                            <div className='hidden sm:block'>
                                <h3 className="text-l">{user.firstName} {user.lastName}</h3>
                            </div>
                        </div>)}
                    </div>
                    <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
                        {props.children}
                    </div>
                    <div className="col-span-0 sm:col-span-3 p-5">
                        {!user ? (
                            <div className="p-5 bg-slate-700 rounded-lg">
                                <h1 className="my-2 text-xl">New To Twitter?</h1>
                                <GoogleLogin onSuccess={handleLoginWithGoogle} />
                            </div>
                        ) :
                            <div className="py-3 px-4 bg-slate-800 rounded-lg">
                                <h1 className="my-2 text-xl mb-3">Users you may know</h1>
                                {
                                    user?.recommendedUsers?.map(el =>
                                        <div key={el?.id} className='flex items-center gap-3 mt-2'>{el?.profileImageURL && (
                                            <Image
                                                src={el.profileImageURL}
                                                alt='profile-image'
                                                className='rounded-full'
                                                height={60}
                                                width={60}
                                            />
                                        )}
                                            <div className='text-lg'>
                                                <div>{el?.firstName} {el?.lastName}</div>
                                                <Link href={`/${el?.id}`} className='bg-white text-black text-sm px-5 py-1 w-full  rounded-lg'>View</Link>
                                            </div>
                                        </div>)
                                }
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TweeterLayout
