import { redirect } from "next/navigation";

export default function Home() {
  redirect("/pagination");
  return <></>;
}
