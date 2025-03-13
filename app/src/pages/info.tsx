import { useEffect } from "react";
import { useRouter } from "next/router";

export default function InfoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/site-info");
  }, [router]);

  return null;
}
