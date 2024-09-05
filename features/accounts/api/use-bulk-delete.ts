import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner"; 

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"],200>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"]


export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"].$post({json});
            if(!response.ok){
                throw new Error("删除账户失败");
            }
            return await response.json();
        },
        onSuccess: () => {
            toast.success("删除成功")
            queryClient.invalidateQueries({queryKey: ["accounts"]})
            //todo : invalidate summary
        },
        onError: () => {
            toast.error("删除失败")
        }
    })
    return mutation;
}

