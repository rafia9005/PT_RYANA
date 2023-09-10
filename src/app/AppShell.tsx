import React from "react";
import NavbarLayout from "@/components/Layouts/NavbarLayout";
import { useRouter } from "next/router";

const disableNavbar = [
  "/auth/login",
  "/login",
  "/auth/register",
  "/register",
  "/logout",
  "/auth/logout",
  "404",
  "/dashboard",
];

export default function AppShell(props: any) {
  const { children } = props;
  const { pathname } = useRouter();
  return <>{children}</>;
}
