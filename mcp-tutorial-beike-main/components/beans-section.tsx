"use client";

import { useEffect, useState } from "react";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

import { AddBeanDialog } from "@/components/add-bean-dialog";
import { BeansList } from "@/components/beans-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SaveStatus = "success" | "error" | null;

export function BeansSection() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);

  useEffect(() => {
    if (!saveStatus) {
      return;
    }

    const timer = window.setTimeout(() => setSaveStatus(null), 4000);
    return () => window.clearTimeout(timer);
  }, [saveStatus]);

  return (
    <div className="flex flex-col gap-6">
      {saveStatus === "success" ? (
        <Alert className="border-[#C8E6C9] bg-[#F1FAF1] text-[#2E7D32]">
          <CheckCircle2Icon />
          <AlertTitle>更改已完成</AlertTitle>
          <AlertDescription>咖啡豆信息已成功保存。</AlertDescription>
        </Alert>
      ) : null}

      {saveStatus === "error" ? (
        <Alert variant="destructive">
          <XCircleIcon />
          <AlertTitle>保存失败</AlertTitle>
          <AlertDescription>请检查填写内容后重试。</AlertDescription>
        </Alert>
      ) : null}

      <BeansList refreshKey={refreshKey} />
      <AddBeanDialog
        onSuccess={() => {
          setRefreshKey((key) => key + 1);
          setSaveStatus("success");
        }}
        onError={() => setSaveStatus("error")}
      />
    </div>
  );
}
