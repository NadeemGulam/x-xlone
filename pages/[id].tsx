import TweeterLayout from "@/components/FeedCard/Layout/TweeterLayout";
import type { GetServerSideProps, NextPage } from "next";
import { BsArrowLeftShort } from "react-icons/bs";
import Image from 'next/image'
import { useCurrentUser } from "@/hooks/user";
import FeedCard from "@/components/FeedCard";
import { Tweet, User } from "@/gql/graphql";
import { useRouter } from "next/router";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { userInfo } from "os";
import { useCallback, useMemo } from "react";
import { followUserMutation, unfollowUserMutation } from "@/graphql/mutations/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface ServerProps {
    userInfo?: User
}

const UserProfile: NextPage<ServerProps> = (props) => {
    // console.log('Component props:', props.userInfo?.tweets);

    const router = useRouter();

    const { user: currentUser } = useCurrentUser();
    const queryClient = useQueryClient();

    const amIFollowing = useMemo(() => {
        if (!props.userInfo) return false;
        return (
            (currentUser?.following?.findIndex(
                (el) => el?.id === props.userInfo?.id) ?? -1) >= 0);
    }, [currentUser?.following, props.userInfo])

    const handleFollowUser = useCallback(async () => {
        if (!props.userInfo?.id) return;
        await graphqlClient.request(followUserMutation, { to: props.userInfo?.id });
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }, [props.userInfo?.id, queryClient]);

    const handleUnfollowUser = useCallback(async () => {
        if (!props.userInfo?.id) return;
        await graphqlClient.request(unfollowUserMutation, { to: props.userInfo?.id });
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }, [props.userInfo?.id, queryClient]);

    return (
        <div>
            <TweeterLayout>
                <div>
                    <nav className=" flex items-center gap-3 py-2 px-2">
                       <Link href={`/`}><BsArrowLeftShort className="text-4xl" /></Link> 
                        <div>
                            <h1 className="text-xl font-bold">
                                {props.userInfo?.firstName} {props.userInfo?.lastName}
                            </h1>
                            <h1 className="text-slate-500">
                                {props.userInfo?.tweets?.length} Tweets
                            </h1>
                        </div>
                    </nav>
                    <div className="p-4 border-b border-slate-800">
                        {props.userInfo?.profileImageURL && <Image className="rounded-full " src={props.userInfo?.profileImageURL} alt="profile-image" width={100} height={100} />}
                        <h1 className="text-xl font-bold mt-5">
                            {props.userInfo?.firstName} {props.userInfo?.lastName}
                        </h1>
                        <div className="flex justify-between item-center">
                            <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                <span>{props.userInfo?.followers?.length} Followers </span>
                                <span>{props.userInfo?.following?.length} Following </span>
                                <span></span>
                            </div>
                            {
                                currentUser?.id !== props.userInfo?.id &&
                                (<>
                                    {
                                        amIFollowing ?
                                            <button onClick={handleUnfollowUser} className="bg-white text-black px-3 py-1 rounded-full text-md">Unfollow</button> :
                                            <button onClick={handleFollowUser} className="bg-white text-black px-3 py-1 rounded-full text-md">Follow</button>
                                    }
                                </>)
                            }
                        </div>
                    </div>
                    <div>
                        {props.userInfo?.tweets?.map(tweet => <FeedCard data={tweet as Tweet} key={tweet?.id} />)}
                    </div>
                </div>
            </TweeterLayout>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
    const id = context.query.id as string | undefined

    if (!id) return { notFound: true, props: { userInfo: undefined } }


    const userInfo = await graphqlClient.request(getUserByIdQuery, { id })

    if (!userInfo?.getUserById) {
        return { notFound: true }
    }
    return {
        props: { userInfo: userInfo.getUserById as User }
    }
}

export default UserProfile;