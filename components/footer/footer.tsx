"use client";

import Link from "next/link";
import { Heart, Hamburger } from "lucide-react";
import {
  APP_COPYRIGHT,
  APP_DESCRIPTION,
  APP_ENG_NAME,
  APP_SLOGAN,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="footer__container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black uppercase font-paperlogy text-brand mb-4">
              {APP_ENG_NAME}
            </h3>
          </div>
          <p className="font-nanumNeo text-sm text-muted-foreground leading-5 mb-2">
            <strong className="block mb-1">{APP_SLOGAN}</strong>
            {APP_DESCRIPTION}
          </p>
          {/* 알림설정 및 문의사항 */}
          <div className="flex gap-2">
            <Link
              href="#"
              className="flex items-center gap-1 text-sm mt-1 text-muted-foreground hover:text-brand transition-colors font-nanumNeo"
              onClick={(e) => {
                e.preventDefault();
                // TODO: 문의사항 dialog 열기
              }}
            >
              <Hamburger className="w-4 h-4" />
              문의사항
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t mt-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-muted-foreground font-nanumNeo">
          <div className="text-xs">{APP_COPYRIGHT}</div>
          <div className="flex items-center gap-2 text-xs">
            <span>Made with</span>
            <Heart className="h-4 w-4 hover:text-blue-500" />
            <span>for runners</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
