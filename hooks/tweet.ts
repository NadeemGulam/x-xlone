import { graphqlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutations/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// useGetAllTweets hook
export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ["all-tweet"],
        queryFn: async () => {
            try {
                const data = await graphqlClient.request(getAllTweetsQuery);
                console.log("Fetched tweets data:", data);
                if (!data || !data.getAllTweets) {
                    throw new Error("No tweets found");
                }
                return data;
            } catch (error) {
                console.error("Error fetching tweets:", error);
                return { getAllTweets: [] }; // Return an empty array in case of error
            }
        },
        onError: (error) => {
            console.error("Error in fetching tweets:", error);
        }
    });

    return { ...query, tweets: query.data?.getAllTweets };
}

// useCreateTweets hook
export const useCreateTweets = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) => graphqlClient.request(createTweetMutation, { payload }),
        onMutate: (payload) => { 
            toast.loading("Creating your Tweet ", { id: '1' }); 
            console.log("In mutate"); 
        },
        onSuccess: async (payload) => {
            console.log("Inside OnSuccess");
            try {
                await queryClient.invalidateQueries(["all-tweet"]);
                console.log("Queries invalidated");
                await queryClient.refetchQueries(["all-tweet"]); // Manually refetch to ensure fresh data
            } catch (error) {
                console.error("Error invalidating queries:", error);
            }
            toast.success("Tweeted Successfully", { id: '1' });
        },
        onError: (error) => {
            console.error("Error creating tweet:", error);
            toast.error("Error creating tweet");
        }
    });
    return mutation;
}
