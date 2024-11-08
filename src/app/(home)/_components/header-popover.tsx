import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

type Props = {
  avatarUrl: string;
  nickname: string;
  credit: number;
};

export default function HeaderPopover({ avatarUrl, nickname, credit }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarImage src={avatarUrl} alt="Profile Image" />
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar>
            <AvatarImage src={avatarUrl} alt="Profile Image" />
          </Avatar>
          <p className="text-lg font-semibold">{nickname}</p>
          <p className="text-sm text-muted-foreground">Credit: {credit}</p>
          <Link className="underline text-gray-500" href={"/me"}>
            내 정보 수정
          </Link>
          <Button
            variant="outline"
            className="w-full mt-2 bg-red-500 text-white"
            onClick={() => {
              // mutate();
              // console.log("로그아웃");
            }}
          >
            로그아웃
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
