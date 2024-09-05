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
import { useNewAccount } from "../hooks/use-new-account";
import AccountForm from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";

const formSchema = insertAccountSchema.pick({
    name: true
}) 
type FormValues = z.input<typeof formSchema> 

const NewAccountSheet = () => {
    const {isOpen,onClose}  = useNewAccount()
    const mutation = useCreateAccount()
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values,{
            onSuccess: ()  => {
                onClose()
            }
        });
    }
    return ( 
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>新建账户</SheetTitle>
                    <SheetDescription>
                        创建一个新账户记录交易
                    </SheetDescription>
                </SheetHeader>
                <AccountForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{
                        name: "",
                    }}
                />
            </SheetContent>
        </Sheet>
     );
}
 
export default NewAccountSheet;