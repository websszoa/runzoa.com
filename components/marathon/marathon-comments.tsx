"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareText } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

interface Comment {
  id: number;
  marathon_id: number;
  name: string;
  content: string;
  created_at: string;
}

interface MarathonCommentsProps {
  marathonId: number;
}

export default function MarathonComments({
  marathonId,
}: MarathonCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 댓글 불러오기
  useEffect(() => {
    fetchComments();
  }, [marathonId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("marathon_id", marathonId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data);
    }
  };

  // 댓글 등록
  const handleSubmit = async () => {
    if (!content.trim() || content.length > 100) {
      alert("댓글은 1자 이상 100자 이하로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    // 랜덤 이름 생성
    const randomNames = [
      "러너",
      "마라토너",
      "완주왕",
      "달리기매니아",
      "런런",
      "풀코스러너",
      "하프마라토너",
      "페이스메이커",
      "서브3달성",
      "42.195K",
      "달리기사랑",
      "마라톤고수",
      "첫완주",
      "주말러너",
      "새벽러닝",
    ];
    const randomName =
      randomNames[Math.floor(Math.random() * randomNames.length)];

    const { error } = await supabase.from("comments").insert({
      marathon_id: marathonId,
      name: randomName,
      content: content.trim(),
    });

    if (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    } else {
      setContent("");
      fetchComments(); // 댓글 목록 새로고침

      // marathons 테이블의 comment_count 증가
      const { data: currentMarathon } = await supabase
        .from("marathons")
        .select("comment_count")
        .eq("id", marathonId)
        .single();

      if (currentMarathon) {
        await supabase
          .from("marathons")
          .update({ comment_count: (currentMarathon.comment_count || 0) + 1 })
          .eq("id", marathonId);
      }
    }

    setIsSubmitting(false);
  };

  // 랜덤 얼굴 이미지 생성 (1-10)
  const getRandomFaceImage = (id: number) => {
    // id를 기반으로 1-10 사이의 숫자 생성 (같은 댓글은 항상 같은 이미지)
    const faceNum = (id % 10) + 1;
    return `/face/face${String(faceNum).padStart(2, "0")}.png`;
  };

  return (
    <div className="page__block mt-4">
      <h3>
        <MessageSquareText className="w-5 h-5 text-brand" /> 댓글(
        {comments.length})
      </h3>
      <div className="space-y-4">
        {/* 댓글 목록 */}
        <div className="space-y-4 mb-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 border-b pb-4 last:border-b-0"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-red-50 p-1">
                  <Image
                    src={getRandomFaceImage(comment.id)}
                    alt={comment.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm font-nanumNeo">
                      {comment.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-nanumNeo">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm font-nanumNeo">
              아직 댓글이 없습니다. <br />첫 번째 리뷰를 남겨주세요! 💬
            </div>
          )}
        </div>

        {/* 댓글 입력 */}
        <div className="relative">
          <Textarea
            placeholder="사진과 이름은 랜덤으로 설정됩니다. 간단한 리뷰 및 정보를 공유해주세요! 😀"
            rows={3}
            maxLength={100}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="resize-none font-nanumNeo h-20"
          />
          <div className="flex items-end justify-between mt-2">
            <div className="text-xs text-gray-500 font-nanumNeo">
              {content.length}/100
            </div>
            <Button
              size="sm"
              className="bg-brand hover:bg-brand/90 font-nanumNeo"
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "등록중..." : "등록"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
