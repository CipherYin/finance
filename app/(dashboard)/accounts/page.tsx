"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";


const AccountsPage = () => {
    const accountsQuery = useGetAccounts();
    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDeleteAccounts()
    const accounts = accountsQuery.data || []

    const isDisable = accountsQuery.isLoading || deleteAccounts.isPending
    if (accountsQuery.isLoading) {
      return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    return ( 
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        账户页面
                    </CardTitle>
                    <Button  onClick={newAccount.onOpen} size="sm">
                        <Plus className="size-4 mr-2" />
                        新建
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        disabled={isDisable}
                        onDelete={(row)=>{
                            const ids = row.map((r)=>r.original.id);
                            deleteAccounts.mutate({ids})
                        }}
                        filterKey="email"
                        columns={columns} 
                        data={accounts} />
                </CardContent>
            </Card>
    </div>
     );
}
 
export default AccountsPage;