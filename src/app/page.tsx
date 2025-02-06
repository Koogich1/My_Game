import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
      <div className="flex gap-2">
        <Link href={"/devPage"}>
          <Button>
            Начать
          </Button>
        </Link>
      </div>
    </div>
  );
}
