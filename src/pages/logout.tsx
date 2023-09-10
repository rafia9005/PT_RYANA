import Head from "next/head";
export default function logout() {
  return (
    <Head>
      <meta http-equiv="refresh" content="0; url=/auth/logout" />
    </Head>
  );
}
