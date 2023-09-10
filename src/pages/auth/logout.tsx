import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import app from "@/lib/firebase";

const LogoutPage = () => {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.replace("/auth/login");
      } catch (error) {
        console.error("error logout");
      }
    };

    handleLogout();
  }, []);

  return <></>;
};

export default LogoutPage;