"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mails } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (res.ok) {
      setForm({ name: "", email: "", message: "" });
    }

    setLoading(false);
  }

  return (
    <main className="contact__container">
      <h2>문의하기</h2>
      <p>궁금하신 사항이 있으시면 편하게 문의해주세요!</p>

      <div className="border p-4 md:p-6 rounded-lg">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2 font-nanumNeo"
            >
              이름 <span className="text-brand">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="이름을 입력해주세요"
              className="font-nanumNeo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 font-nanumNeo"
            >
              이메일 <span className="text-brand">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="example@email.com"
              className="font-nanumNeo"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-2 font-nanumNeo"
            >
              메시지 <span className="text-brand">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="문의 내용을 입력해주세요"
              rows={6}
              className="w-full px-3 py-2 border border-input bg-background rounded text-sm focus:outline-none focus:ring-2 focus:ring-ring font-nanumNeo resize-none"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full font-nanumNeo"
            disabled={loading}
          >
            <Mails aria-hidden="true" /> {loading ? "전송 중..." : "문의하기"}
          </Button>
        </form>
      </div>
    </main>
  );
}
