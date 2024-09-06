"use client";

import EditAccountSheet from "@/features/accounts/components/edit-account-sheet";
import NewAccountSheet from "@/features/accounts/components/new-account-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
import { useEffect, useState } from "react";
// import { useMountedState } from "react-use";
export const SheetProvider = () => {
    const [isMounted,setIsMounted] = useState(false);
    //生命周期；在服务器挂载好了，才会在客户端呈现
    useEffect(()=>{
        setIsMounted(true)
    },[])
    if(!isMounted){
        return null;
    }
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>
            <NewCategorySheet/>
            <EditCategorySheet/>
            <NewTransactionSheet/>
            <EditTransactionSheet/>
        </>
    )
}


