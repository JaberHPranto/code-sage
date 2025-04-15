"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

const DashboardPage = () => {
  const { user } = useUser();
  return <div>Hello, {user?.firstName}</div>;
};
export default DashboardPage;
