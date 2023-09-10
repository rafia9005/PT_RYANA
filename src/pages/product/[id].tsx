import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function DetailProduct() {
  const { query } = useRouter();
  return (
    <>
      <Head>
        <title>Product - {query.id}</title>
      </Head>
      <div>
        <h1>Detail Product</h1>
        <p>product : {query.id} </p>
      </div>
    </>
  );
}
