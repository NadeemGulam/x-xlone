import { graphqlClient } from "@/clients/api";
import { CreateTweetData } from "@/gql/graphql";
import { createTweetMutation } from "@/graphql/mutations/tweet";
import { getAllTweetsQuery } from "@/graphql/query/tweet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// useGetAllTweets hook
export const useGetAllTweets = () => {
    const queryClient = useQueryClient();

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
        onSuccess: async () => {
            console.log("Inside OnSuccess");
            try {
                await queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
                console.log("Queries invalidated");
                await queryClient.refetchQueries({ queryKey: ["all-tweet"] }); // Manually refetch to ensure fresh data
            } catch (error) {
                console.error("Error in invalidating queries:", error);
            }
        }
    });

    // Extract error from the query result
    const { data, isError, error, isLoading } = query;

    // Handle error state in your component
    if (isError) {
        console.error("Error in fetching tweets:", error);
    }

    return { tweets: data?.getAllTweets, isError, error, isLoading };
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
