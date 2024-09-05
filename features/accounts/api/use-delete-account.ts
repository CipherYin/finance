import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation<
      ResponseType,
      Error
    >({
      mutationFn: async () => {
        const response = await client.api.accounts[":id"]["$delete"]({ 
          param: { id },
        });
        if(!response.ok){
            throw new Error("删除失败!")
        }
        return await response.json();
      },
      onSuccess: () => {
        toast.success("删除成功");
        queryClient.invalidateQueries({ queryKey: ["account", { id }] });
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      },
      onError: () => {
        toast.error("删除失败");
      },
    });
  
    return mutation;
  };

  