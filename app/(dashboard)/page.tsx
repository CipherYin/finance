"use client";
import { DataGrid } from "@/components/data-grid";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { DataCharts } from "@/components/data-charts";

export default function Home() {
    const {onOpen} = useNewAccount()
    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <DataGrid />
        <DataCharts />
    </div>
  );
}
