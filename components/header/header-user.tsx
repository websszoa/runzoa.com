import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeaderUser() {
  return (
    <div className="p-4 border-b border-brand/5 bg-brand/5 -mt-4">
      <div className="text-center py-2 relative">
        <div className="flex justify-center mb-2">
          <Avatar className="w-16 h-16 border-2 border-brand/10">
            <AvatarImage
              src="/face/face01.webp"
              alt="프로필 이미지"
              className="bg-brand/10"
            />
            <AvatarFallback className="bg-brand/10 text-brand text-3xl font-paperlogy pt-1">
              R
            </AvatarFallback>
          </Avatar>
        </div>
        <p className="mb-1 font-paperlogy text-lg font-normal text-gray-900">
          환영합니다!
        </p>
        <p className="truncate font-anyvid text-sm text-muted-foreground">
          런조아의 다양한 대회 정보를 확인해보세요.
        </p>
      </div>
    </div>
  );
}
