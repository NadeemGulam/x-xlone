import { graphqlClient } from "@/clients/api"
import { CreateTweetData } from "@/gql/graphql"
import { createTweetMutation } from "@/graphql/mutations/tweet"
import { getAllTweetsQuery } from "@/graphql/query/tweet"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCreateTweets = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) => graphqlClient.request(createTweetMutation, { payload }),
        onMutate: (payload) => toast.loading("Creating your Tweet ", { id: '1'}),
        onSuccess: (payload) => async () => {
            await queryClient.invalidateQueries(["all-tweet"]);
            toast.success("Tweeted Successfully", { id: '1' })
        },
    });
    return mutation;
}

export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ["all-tweet"],
        queryFn: () => graphqlClient.request(getAllTweetsQuery)
    });
    return { ...query, tweets: query.data?.getAllTweets }
}