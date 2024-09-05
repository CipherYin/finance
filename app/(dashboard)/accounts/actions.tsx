"use client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useConfirm } from "@/hook/use-confirm"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

type Props = {
    id: string
}
const Actions = ({
    id
 }:Props
) => {
    const [ConfirmationDialog,confirm] = useConfirm(
        "你确定要删除当前所选账户吗？",
        ""
      )
    const deleteMutation = useDeleteAccount(id);
    const { onOpen } = useOpenAccount();
    const handleDelete = async () => {
        const ok = await confirm();
    
        if (ok) {
          deleteMutation.mutate();
        }
      };
    
    return (
        <>
          <ConfirmationDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={deleteMutation.isPending}
                onClick={() => onOpen(id)}
              >
                <Edit className="size-4 mr-2" />
                修改
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={deleteMutation.isPending}
                onClick={handleDelete}
              >
                <Trash className="size-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
  }
   
  export default Actions;