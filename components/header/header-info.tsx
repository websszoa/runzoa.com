import { APP_NAME, APP_COPYRIGHT } from "@/lib/constants";

export default function HeaderInfo() {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="text-center py-3 bg-gray-50">
        <p className="font-nanumNeo text-xs text-gray-500 mb-1">
          {APP_NAME} v1.00
        </p>
        <p className="font-nanumNeo text-xs text-gray-400">{APP_COPYRIGHT}</p>
      </div>
    </div>
  );
}
