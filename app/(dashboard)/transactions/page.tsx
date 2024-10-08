"use client";
import { useState } from "react";
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
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { ImportCard } from "./import-card";
import { transactions as transactionSchema } from "@/db/schema";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { UploadButton } from "./upload-button";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
};
const INITIAL_IMPORT_RESULTS = { 
  data: [],
  errors: [],
  meta: {},
};
const TransactionsPage = () => {

    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const transcationsQuery = useGetTransactions();
    const newTransaction = useNewTransaction();
    const deleteTransactions = useBulkDeleteTransactions()
    const transations = transcationsQuery.data || [];
    const createTransactions = useBulkCreateTransactions();

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
      console.log({ results });
      setImportResults(results);
      setVariant(VARIANTS.IMPORT);
    };
    const onCancelImport = () => {
      setImportResults(INITIAL_IMPORT_RESULTS);
      setVariant(VARIANTS.LIST);
    };
    const onSubmitImport = async (
      values: typeof transactionSchema.$inferInsert[],
    ) => {
      const accountId = await confirm();
  
      if (!accountId) {
        return toast.error("请选择一个账户再进行下一步");
      }
  
      const data = values.map((value) => ({
        ...value,
        accountId: accountId as string,
      }));
  
      createTransactions.mutate(data, {
        onSuccess: () => {
          onCancelImport();
        },
      });
    };
    const isDisable = transcationsQuery.isLoading || deleteTransactions.isPending
    if (transcationsQuery.isLoading) {
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
    if (variant === VARIANTS.IMPORT) {
      return (
        <>
          <AccountDialog />
          <ImportCard
            data={importResults.data}
            onCancel={onCancelImport}
            onSubmit={onSubmitImport}
          />
        </>
      );
    }
    return ( 
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        交易历史记录
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                      <Button  onClick={newTransaction.onOpen} size="sm">
                          <Plus className="size-4 mr-2" />
                          新建
                      </Button>
                      <UploadButton onUpload={onUpload} />
                    </div>
                    
                </CardHeader>
                <CardContent>
                <DataTable 
                      disabled={isDisable}
                      onDelete={(row)=>{
                          const ids = row.map((r)=>r.original.id);
                          deleteTransactions.mutate({ids})
                      }}
                      filterKey="payee" 
                      columns={columns} 
                      data={transations} 
                  />
                </CardContent>
            </Card>
    </div>
     );
}
 
export default TransactionsPage;