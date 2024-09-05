import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner"; 

type ResponseType = InferResponseType<typeof client.api.accounts.$post,200>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"]


export const useCreateAccount = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({json});
            if(!response.ok){
                throw new Error("创建账户失败");
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success("账户创建成功")
            queryClient.invalidateQueries({queryKey: ["accounts"]})
        },
        onError: () => {
            toast.error("账户创建失败")
        }
    })
    return mutation;
}

