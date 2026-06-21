"use client";

import { useState } from "react";

import { AddBeanDialog } from "@/components/add-bean-dialog";
import { BeansList } from "@/components/beans-list";

export function BeansSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <BeansList refreshKey={refreshKey} />
      <AddBeanDialog onSuccess={() => setRefreshKey((key) => key + 1)} />
    </>
  );
}
