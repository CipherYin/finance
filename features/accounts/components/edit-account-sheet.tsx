import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import AccountForm from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { useConfirm } from "@/hook/use-confirm";
import { useDeleteAccount } from "../api/use-delete-account";
import { useEditAccount } from "../api/use-edit-account";
import { Loader2 } from "lucide-react";

const formSchema = insertAccountSchema.pick({
    name: true
}) 
type FormValues = z.input<typeof formSchema> 

const EditAccountSheet = () => {
    const {isOpen,onClose,id}  = useOpenAccount()
    const accountQuery = useGetAccount(id);
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);

    const isPending = editMutation.isPending ||
                      deleteMutation.isPending;
    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values,{
            onSuccess: ()  => {
                onClose()
            }
        });
    }
    const onDelete = async () => {
        const ok = await confirm();
    
        if (ok) {
          deleteMutation.mutate(undefined, {
            onSuccess: () => {
              onClose();
            }
          });
        }
      };
    const [ConfirmationDialog,confirm] = useConfirm(
        "你确定要删除当前所选账户吗？",
        ""
      )
    
    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    }: {
        name: ""
    }
    
    return ( 
        <>
            <ConfirmationDialog/>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>修改账户信息</SheetTitle>
                        <SheetDescription>
                            修改已存在的账户信息
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading?(
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                        ) :<AccountForm
                            id={id}
                            onSubmit={onSubmit} 
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}
                         />
                    }
                    
                </SheetContent>
            </Sheet>
        </>
       
     );
}
 
export default EditAccountSheet;