"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Lock, LogIn, MinusCircle, PlusCircle, Search } from "lucide-react";
import { Marathon } from "@/lib/types";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AdminMarathonTable from "@/components/admin/admin-marathon-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ADMIN_AUTH_STORAGE_KEY = "runzoa-admin-auth";
const ADMIN_AUTH_DURATION_MS = 5 * 60 * 60 * 1000; // 5시간

const createDefaultFormState = () => ({
  name: "",
  slug: "",
  description: "",
  eventDate: "",
  eventStartTime: "",
  registrationStatus: "접수대기",
  registrationStart: "",
  registrationEnd: "",
  registrationSite: "",
  registrationRestart: "",
  locationText: "",
  locationLatitude: "",
  locationLongitude: "",
  scale: "",
  priceItems: [
    {
      label: "",
      amount: "",
    },
  ],
  highlightsText: "",
  organizer: "",
  operator: "",
  sponsor: "",
  souvenir: "",
  contactHome: "",
  contactTel: "",
  contactEmail: "",
  contactInstagram: "",
  contactKakao: "",
  imageMain: "",
  imageSub: "",
});

const marathonToFormState = (marathon: Marathon) => {
  const priceEntries = marathon.price ? Object.entries(marathon.price) : [];

  return {
    name: marathon.name ?? "",
    slug: marathon.slug ?? "",
    description: marathon.description ?? "",
    eventDate: marathon.event?.date ?? "",
    eventStartTime: marathon.event?.start_time ?? "",
    registrationStatus: marathon.registration?.status ?? "접수대기",
    registrationStart: marathon.registration?.start ?? "",
    registrationEnd: marathon.registration?.end ?? "",
    registrationSite: marathon.registration?.site ?? "",
    registrationRestart: marathon.registration?.restart ?? "",
    locationText: marathon.location?.text ?? "",
    locationLatitude:
      marathon.location?.latitude !== undefined &&
      marathon.location?.latitude !== null
        ? String(marathon.location.latitude)
        : "",
    locationLongitude:
      marathon.location?.longitude !== undefined &&
      marathon.location?.longitude !== null
        ? String(marathon.location.longitude)
        : "",
    scale:
      marathon.scale !== undefined && marathon.scale !== null
        ? String(marathon.scale)
        : "",
    priceItems:
      priceEntries.length > 0
        ? priceEntries.map(([label, amount]) => ({
            label,
            amount: String(amount ?? ""),
          }))
        : [
            {
              label: "",
              amount: "",
            },
          ],
    highlightsText: marathon.highlights?.join(", ") ?? "",
    organizer: marathon.hosts?.organizer ?? "",
    operator: marathon.hosts?.operator ?? "",
    sponsor: Array.isArray(marathon.hosts?.sponsor)
      ? marathon.hosts?.sponsor.join(", ")
      : marathon.hosts?.sponsor ?? "",
    souvenir: Array.isArray(marathon.hosts?.souvenir)
      ? marathon.hosts?.souvenir.join(", ")
      : marathon.hosts?.souvenir ?? "",
    contactHome: marathon.contacts?.home ?? "",
    contactTel: marathon.contacts?.tel ?? "",
    contactEmail: marathon.contacts?.email ?? "",
    contactInstagram: marathon.contacts?.instagram ?? "",
    contactKakao: marathon.contacts?.kakao ?? "",
    imageMain: marathon.images?.main ?? "",
    imageSub: marathon.images?.sub?.join(", ") ?? "",
  };
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const [statusAlert, setStatusAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(createDefaultFormState);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(createDefaultFormState());
  const [editTarget, setEditTarget] = useState<Marathon | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchMarathonData = useCallback(async () => {
    setIsLoadingData(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("marathons")
      .select("*")
      .limit(500);

    if (error) {
      setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("AdminPage fetch error:", error);
      setIsAuthorized(false);
      setIsLoadingData(false);
      return;
    }

    if (data) {
      const sorted = [...data].sort((a: Marathon, b: Marathon) => {
        const dateA = new Date(a.event?.date ?? "").getTime();
        const dateB = new Date(b.event?.date ?? "").getTime();
        return dateA - dateB;
      });
      setMarathons(sorted as Marathon[]);
    }

    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    if (!statusAlert) return;
    const timer = window.setTimeout(() => {
      setStatusAlert(null);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [statusAlert]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!stored) return;

    try {
      const { timestamp } = JSON.parse(stored) as { timestamp: number };
      if (Date.now() - timestamp < ADMIN_AUTH_DURATION_MS) {
        setIsAuthorized(true);
        void fetchMarathonData();
      } else {
        window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Admin auth storage parse error:", error);
      window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
  }, [fetchMarathonData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!password.trim()) {
        setErrorMessage("비밀번호를 입력해주세요.");
        return;
      }

      if (password.trim() !== "3162") {
        setErrorMessage("비밀번호가 올바르지 않습니다.");
        return;
      }

      setIsAuthorized(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          ADMIN_AUTH_STORAGE_KEY,
          JSON.stringify({ timestamp: Date.now() })
        );
      }
      await fetchMarathonData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = useCallback(
    async (marathon: Marathon, nextStatus: string) => {
      if (!marathon?.id) {
        setStatusAlert({
          type: "error",
          message: "잘못된 대회 정보입니다.",
        });
        return;
      }

      if (marathon.registration.status === nextStatus) {
        return;
      }

      setStatusUpdatingId(marathon.id);
      setStatusAlert(null);

      const updatedRegistration = {
        ...marathon.registration,
        status: nextStatus,
      };

      const { error } = await supabase
        .from("marathons")
        .update({ registration: updatedRegistration })
        .eq("id", marathon.id);

      if (error) {
        console.error("Admin status update error:", error);
        setStatusAlert({
          type: "error",
          message: "상태 업데이트에 실패했습니다. 다시 시도해주세요.",
        });
        setStatusUpdatingId(null);
        return;
      }

      setMarathons((prev) =>
        prev.map((item) =>
          item.id === marathon.id
            ? { ...item, registration: updatedRegistration }
            : item
        )
      );

      setStatusAlert({
        type: "success",
        message: `${marathon.name}의 접수 상태가 "${nextStatus}"(으)로 변경되었습니다.`,
      });
      setStatusUpdatingId(null);
    },
    []
  );

  const handleCreateInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = event.target;
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleEditInputChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = event.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const addPriceItem = useCallback(
    (
      setter: React.Dispatch<
        React.SetStateAction<ReturnType<typeof createDefaultFormState>>
      >,
      index?: number
    ) => {
      setter((prev) => ({
        ...prev,
        priceItems: (() => {
          const next = [...prev.priceItems];
          const newItem = { label: "", amount: "" };
          if (typeof index === "number") {
            next.splice(index + 1, 0, newItem);
          } else {
            next.push(newItem);
          }
          return next;
        })(),
      }));
    },
    []
  );

  const updatePriceItem = useCallback(
    (
      setter: React.Dispatch<
        React.SetStateAction<ReturnType<typeof createDefaultFormState>>
      >,
      index: number,
      key: "label" | "amount",
      value: string
    ) => {
      setter((prev) => {
        const nextItems = [...prev.priceItems];
        nextItems[index] = { ...nextItems[index], [key]: value };
        return { ...prev, priceItems: nextItems };
      });
    },
    []
  );

  const removePriceItem = useCallback(
    (
      setter: React.Dispatch<
        React.SetStateAction<ReturnType<typeof createDefaultFormState>>
      >,
      index: number
    ) => {
      setter((prev) => ({
        ...prev,
        priceItems: prev.priceItems.filter((_, idx) => idx !== index),
      }));
    },
    []
  );

  const registrationOptions = useMemo(
    () => ["접수중", "접수대기", "접수마감"],
    []
  );

  const resetCreateForm = useCallback(() => {
    setCreateForm(createDefaultFormState());
    setCreateError(null);
  }, []);

  const handleCreateMarathon = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isCreating) return;

      if (!createForm.name.trim() || !createForm.slug.trim()) {
        setCreateError("대회명과 슬러그를 입력해주세요.");
        return;
      }
      if (!createForm.eventDate.trim()) {
        setCreateError("대회 날짜를 입력해주세요.");
        return;
      }

      setIsCreating(true);
      setCreateError(null);

      try {
        const price: Record<string, number> = {};

        createForm.priceItems.forEach(({ label, amount }) => {
          const key = label.trim();
          if (!key) return;
          const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
          if (Number.isFinite(numericAmount) && numericAmount > 0) {
            price[key] = numericAmount;
          }
        });

        const newMarathon: Marathon = {
          name: createForm.name.trim(),
          slug: createForm.slug.trim(),
          description: createForm.description.trim(),
          scale: Number(createForm.scale) || 0,
          highlights: createForm.highlightsText
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          registration: {
            start: createForm.registrationStart.trim(),
            end: createForm.registrationEnd.trim(),
            status: createForm.registrationStatus,
            site: createForm.registrationSite.trim(),
            restart: createForm.registrationRestart.trim(),
          },
          event: {
            date: createForm.eventDate.trim(),
            start_time: createForm.eventStartTime.trim(),
          },
          location: {
            text: createForm.locationText.trim(),
            latitude: Number(createForm.locationLatitude) || 0,
            longitude: Number(createForm.locationLongitude) || 0,
          },
          price,
          hosts: {
            organizer: createForm.organizer.trim(),
            operator: createForm.operator.trim(),
            sponsor: createForm.sponsor
              ? createForm.sponsor.split(",").map((item) => item.trim())
              : [],
            souvenir: createForm.souvenir
              ? createForm.souvenir.split(",").map((item) => item.trim())
              : [],
          },
          images: {
            main: createForm.imageMain.trim(),
            sub: createForm.imageSub
              ? createForm.imageSub
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : [],
          },
          contacts: {
            home: createForm.contactHome.trim(),
            tel: createForm.contactTel.trim(),
            email: createForm.contactEmail.trim(),
            instagram: createForm.contactInstagram.trim(),
            kakao: createForm.contactKakao.trim(),
          },
          view_count: 0,
          comment_count: 0,
        };

        const { error } = await supabase.from("marathons").insert(newMarathon);

        if (error) {
          console.error("Admin create marathon error:", error);
          setCreateError("대회 등록에 실패했습니다. 입력값을 확인해주세요.");
          return;
        }

        setStatusAlert({
          type: "success",
          message: `${newMarathon.name} 대회가 등록되었습니다.`,
        });

        setIsCreateOpen(false);
        resetCreateForm();
        await fetchMarathonData();
      } finally {
        setIsCreating(false);
      }
    },
    [createForm, fetchMarathonData, isCreating, resetCreateForm]
  );

  const handleOpenEdit = useCallback((marathon: Marathon) => {
    setEditTarget(marathon);
    setEditForm(marathonToFormState(marathon));
    setEditError(null);
    setIsEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditOpen(false);
    setEditTarget(null);
    setEditForm(createDefaultFormState());
    setEditError(null);
  }, []);

  const handleUpdateMarathon = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!editTarget || isUpdating) return;

      if (!editForm.name.trim() || !editForm.slug.trim()) {
        setEditError("대회명과 슬러그를 입력해주세요.");
        return;
      }
      if (!editForm.eventDate.trim()) {
        setEditError("대회 날짜를 입력해주세요.");
        return;
      }

      setIsUpdating(true);
      setEditError(null);

      try {
        const price: Record<string, number> = {};
        editForm.priceItems.forEach(({ label, amount }) => {
          const key = label.trim();
          if (!key) return;
          const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));
          if (Number.isFinite(numericAmount) && numericAmount > 0) {
            price[key] = numericAmount;
          }
        });

        const updatedRegistration = {
          ...editTarget.registration,
          start: editForm.registrationStart.trim(),
          end: editForm.registrationEnd.trim(),
          status: editForm.registrationStatus,
          site: editForm.registrationSite.trim(),
          restart: editForm.registrationRestart.trim(),
        };

        const updatedMarathon: Marathon = {
          ...editTarget,
          name: editForm.name.trim(),
          slug: editForm.slug.trim(),
          description: editForm.description.trim(),
          scale: Number(editForm.scale) || 0,
          highlights: editForm.highlightsText
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          registration: updatedRegistration,
          event: {
            date: editForm.eventDate.trim(),
            start_time: editForm.eventStartTime.trim(),
          },
          location: {
            text: editForm.locationText.trim(),
            latitude: Number(editForm.locationLatitude) || 0,
            longitude: Number(editForm.locationLongitude) || 0,
          },
          price,
          hosts: {
            organizer: editForm.organizer.trim(),
            operator: editForm.operator.trim(),
            sponsor: editForm.sponsor
              ? editForm.sponsor.split(",").map((item) => item.trim())
              : [],
            souvenir: editForm.souvenir
              ? editForm.souvenir.split(",").map((item) => item.trim())
              : [],
          },
          images: {
            main: editForm.imageMain.trim(),
            sub: editForm.imageSub
              ? editForm.imageSub
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : [],
          },
          contacts: {
            home: editForm.contactHome.trim(),
            tel: editForm.contactTel.trim(),
            email: editForm.contactEmail.trim(),
            instagram: editForm.contactInstagram.trim(),
            kakao: editForm.contactKakao.trim(),
          },
        };

        const { error } = await supabase
          .from("marathons")
          .update(updatedMarathon)
          .eq("id", editTarget.id);

        if (error) {
          console.error("Admin update marathon error:", error);
          setEditError("대회 수정에 실패했습니다. 입력값을 확인해주세요.");
          return;
        }

        setMarathons((prev) =>
          prev.map((item) =>
            item.id === editTarget.id ? updatedMarathon : item
          )
        );

        setStatusAlert({
          type: "success",
          message: `${updatedMarathon.name} 대회가 수정되었습니다.`,
        });

        handleCloseEdit();
      } finally {
        setIsUpdating(false);
      }
    },
    [editForm, editTarget, handleCloseEdit, isUpdating]
  );

  const filteredMarathons = useMemo(() => {
    if (!searchQuery.trim()) {
      return marathons;
    }

    const lower = searchQuery.trim().toLowerCase();
    return marathons.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const slug = item.slug?.toLowerCase() ?? "";
      const location = item.location?.text?.toLowerCase() ?? "";
      const description = item.description?.toLowerCase() ?? "";
      return (
        name.includes(lower) ||
        slug.includes(lower) ||
        location.includes(lower) ||
        description.includes(lower)
      );
    });
  }, [marathons, searchQuery]);

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSearchQuery(searchInput);
    },
    [searchInput]
  );

  const handleSearchReset = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
  }, []);

  if (isAuthorized) {
    return (
      <main className="amdin__container">
        <div className="mb-6 rounded border border-gray-200 bg-white p-6 font-nanumNeo">
          <h1 className="text-xl font-bold text-brand">관리자 모드</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            모든 마라톤 데이터를 텍스트 형태로 확인할 수 있습니다.
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
          >
            <div className="relative w-full sm:w-[300px]">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="대회명, 슬러그, 장소 등으로 검색"
                className="pl-9 w-full max-w-[300px]"
              />
            </div>
            <div className="flex gap-2 sm:w-auto">
              <Button
                type="submit"
                className="bg-brand text-white hover:bg-brand/90 font-nanumNeo"
                disabled={isLoadingData}
              >
                검색
              </Button>
              {searchQuery && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSearchReset}
                >
                  초기화
                </Button>
              )}
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => void fetchMarathonData()}
              className="font-nanumNeo"
              disabled={isLoadingData}
            >
              새로고침
            </Button>
            <Dialog
              open={isCreateOpen}
              onOpenChange={(open) => {
                setIsCreateOpen(open);
                if (!open) {
                  resetCreateForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-brand text-white hover:bg-brand/90 font-nanumNeo">
                  <PlusCircle className="h-4 w-4" />
                  대회 추가하기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>새 마라톤 등록</DialogTitle>
                  <DialogDescription>
                    필수 정보(대회명, 슬러그, 날짜)는 반드시 입력해주세요.
                    나머지 필드는 필요에 따라 채워 넣을 수 있습니다.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateMarathon} className="space-y-4">
                  <div className="grid gap-2">
                    <Input
                      name="name"
                      value={createForm.name}
                      onChange={handleCreateInputChange}
                      placeholder="대회명 *"
                    />
                    <Input
                      name="slug"
                      value={createForm.slug}
                      onChange={handleCreateInputChange}
                      placeholder="슬러그 (예: seoul-marathon-2025) *"
                    />
                    <Textarea
                      name="description"
                      value={createForm.description}
                      onChange={handleCreateInputChange}
                      placeholder="대회 설명"
                      rows={3}
                    />
                  </div>

                  <hr />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      name="eventDate"
                      value={createForm.eventDate}
                      onChange={handleCreateInputChange}
                      placeholder="대회 날짜 (예: 2025-10-05) *"
                    />
                    <Input
                      name="eventStartTime"
                      value={createForm.eventStartTime}
                      onChange={handleCreateInputChange}
                      placeholder="시작 시간 (예: 09:00)"
                    />
                  </div>

                  <hr />

                  <div className="grid gap-2">
                    <select
                      name="registrationStatus"
                      value={createForm.registrationStatus}
                      onChange={handleCreateInputChange}
                      className="w-full rounded border border-gray-200 px-3 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    >
                      {registrationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        name="registrationStart"
                        value={createForm.registrationStart}
                        onChange={handleCreateInputChange}
                        placeholder="접수 시작 (예: 2025-04-03 09:00)"
                      />
                      <Input
                        name="registrationEnd"
                        value={createForm.registrationEnd}
                        onChange={handleCreateInputChange}
                        placeholder="접수 마감 (예: 2025-05-01 18:00)"
                      />
                    </div>

                    <Input
                      name="registrationSite"
                      value={createForm.registrationSite}
                      onChange={handleCreateInputChange}
                      placeholder="접수 사이트 URL"
                    />
                    <Input
                      name="registrationRestart"
                      value={createForm.registrationRestart}
                      onChange={handleCreateInputChange}
                      placeholder={"추가 접수 일정(예: 2025-05-10 09:00)"}
                    />
                  </div>

                  <hr />

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      name="locationText"
                      value={createForm.locationText}
                      onChange={handleCreateInputChange}
                      placeholder="장소"
                    />
                    <Input
                      name="scale"
                      value={createForm.scale}
                      onChange={handleCreateInputChange}
                      placeholder="규모 (예: 5000)"
                    />
                    <Input
                      name="locationLatitude"
                      value={createForm.locationLatitude}
                      onChange={handleCreateInputChange}
                      placeholder="위도"
                    />
                    <Input
                      name="locationLongitude"
                      value={createForm.locationLongitude}
                      onChange={handleCreateInputChange}
                      placeholder="경도"
                    />
                  </div>

                  <hr />

                  <div className="space-y-2">
                    {createForm.priceItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 rounded border border-gray-200 p-3 sm:flex-row sm:items-center sm:gap-3"
                      >
                        <Input
                          value={item.label}
                          placeholder="종목명 (예: 하프)"
                          onChange={(event) =>
                            updatePriceItem(
                              setCreateForm,
                              index,
                              "label",
                              event.target.value
                            )
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.amount}
                            placeholder="금액 (예: 70000)"
                            inputMode="numeric"
                            onChange={(event) =>
                              updatePriceItem(
                                setCreateForm,
                                index,
                                "amount",
                                event.target.value
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-brand hover:text-brand/80"
                            onClick={() => addPriceItem(setCreateForm, index)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          {createForm.priceItems.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() =>
                                removePriceItem(setCreateForm, index)
                              }
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <Input
                    name="highlightsText"
                    value={createForm.highlightsText}
                    onChange={handleCreateInputChange}
                    placeholder="하이라이트 (쉼표 구분)"
                  />

                  <hr />

                  <div className="grid gap-2">
                    <Input
                      name="organizer"
                      value={createForm.organizer}
                      onChange={handleCreateInputChange}
                      placeholder="주최"
                    />
                    <Input
                      name="operator"
                      value={createForm.operator}
                      onChange={handleCreateInputChange}
                      placeholder="주관"
                    />
                    <Input
                      name="sponsor"
                      value={createForm.sponsor}
                      onChange={handleCreateInputChange}
                      placeholder="후원 (쉼표 구분)"
                    />
                    <Input
                      name="souvenir"
                      value={createForm.souvenir}
                      onChange={handleCreateInputChange}
                      placeholder="기념품 (쉼표 구분)"
                    />
                  </div>

                  <hr />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      name="contactHome"
                      value={createForm.contactHome}
                      onChange={handleCreateInputChange}
                      placeholder="홈페이지 URL"
                    />
                    <Input
                      name="contactTel"
                      value={createForm.contactTel}
                      onChange={handleCreateInputChange}
                      placeholder="전화번호"
                    />
                    <Input
                      name="contactEmail"
                      value={createForm.contactEmail}
                      onChange={handleCreateInputChange}
                      placeholder="이메일"
                    />
                    <Input
                      name="contactInstagram"
                      value={createForm.contactInstagram}
                      onChange={handleCreateInputChange}
                      placeholder="인스타그램 아이디"
                    />
                    <Input
                      name="contactKakao"
                      value={createForm.contactKakao}
                      onChange={handleCreateInputChange}
                      placeholder="카카오톡 채널 링크"
                    />
                  </div>

                  <hr />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      name="imageMain"
                      value={createForm.imageMain}
                      onChange={handleCreateInputChange}
                      placeholder="대표 이미지 파일명"
                    />
                    <Input
                      name="imageSub"
                      value={createForm.imageSub}
                      onChange={handleCreateInputChange}
                      placeholder="서브 이미지 파일명 (쉼표 구분)"
                    />
                  </div>

                  {createError && (
                    <p className="text-sm text-red-500">{createError}</p>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetCreateForm();
                        setIsCreateOpen(false);
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="bg-brand text-white hover:bg-brand/90"
                      disabled={isCreating}
                    >
                      {isCreating ? "등록 중..." : "등록하기"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isEditOpen}
              onOpenChange={(open) => !open && handleCloseEdit()}
            >
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>대회 정보 수정</DialogTitle>
                  <DialogDescription>
                    기존 정보를 수정한 뒤 저장하세요. 필요한 항목만 수정할 수
                    있습니다.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdateMarathon} className="space-y-4">
                  <div className="grid gap-2">
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleEditInputChange}
                      placeholder="대회명"
                    />
                    <Input
                      name="slug"
                      value={editForm.slug}
                      onChange={handleEditInputChange}
                      placeholder="슬러그 (예: seoul-marathon-2025)"
                    />
                    <Textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditInputChange}
                      placeholder="대회 설명"
                      rows={3}
                    />
                  </div>

                  <hr />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      name="eventDate"
                      value={editForm.eventDate}
                      onChange={handleEditInputChange}
                      placeholder="대회 날짜 (예: 2025-10-05)"
                    />
                    <Input
                      name="eventStartTime"
                      value={editForm.eventStartTime}
                      onChange={handleEditInputChange}
                      placeholder="시작 시간 (예: 09:00)"
                    />
                  </div>

                  <hr />

                  <div className="grid gap-2">
                    <select
                      name="registrationStatus"
                      value={editForm.registrationStatus}
                      onChange={handleEditInputChange}
                      className="w-full rounded border border-gray-200 px-3 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    >
                      {registrationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        name="registrationStart"
                        value={editForm.registrationStart}
                        onChange={handleEditInputChange}
                        placeholder="접수 시작 (예: 2025-04-03 09:00)"
                      />
                      <Input
                        name="registrationEnd"
                        value={editForm.registrationEnd}
                        onChange={handleEditInputChange}
                        placeholder="접수 마감 (예: 2025-05-01 18:00)"
                      />
                    </div>

                    <Input
                      name="registrationSite"
                      value={editForm.registrationSite}
                      onChange={handleEditInputChange}
                      placeholder="접수 사이트 URL"
                    />
                    <Input
                      name="registrationRestart"
                      value={editForm.registrationRestart}
                      onChange={handleEditInputChange}
                      placeholder={"추가 접수 일정 (예: 2025-05-10 09:00)"}
                    />
                  </div>

                  <hr />

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      name="locationText"
                      value={editForm.locationText}
                      onChange={handleEditInputChange}
                      placeholder="장소"
                    />
                    <Input
                      name="scale"
                      value={editForm.scale}
                      onChange={handleEditInputChange}
                      placeholder="규모 (예: 5000)"
                    />
                    <Input
                      name="locationLatitude"
                      value={editForm.locationLatitude}
                      onChange={handleEditInputChange}
                      placeholder="위도"
                    />
                    <Input
                      name="locationLongitude"
                      value={editForm.locationLongitude}
                      onChange={handleEditInputChange}
                      placeholder="경도"
                    />
                  </div>

                  <hr />

                  <div className="space-y-2">
                    {editForm.priceItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 rounded border border-gray-200 p-3 sm:flex-row sm:items-center sm:gap-3"
                      >
                        <Input
                          value={item.label}
                          placeholder="종목명 (예: 하프)"
                          onChange={(event) =>
                            updatePriceItem(
                              setEditForm,
                              index,
                              "label",
                              event.target.value
                            )
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            value={item.amount}
                            placeholder="금액 (예: 70000)"
                            inputMode="numeric"
                            onChange={(event) =>
                              updatePriceItem(
                                setEditForm,
                                index,
                                "amount",
                                event.target.value
                              )
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-brand hover:text-brand/80"
                            onClick={() => addPriceItem(setEditForm, index)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          {editForm.priceItems.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
                              onClick={() =>
                                removePriceItem(setEditForm, index)
                              }
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <Input
                    name="highlightsText"
                    value={editForm.highlightsText}
                    onChange={handleEditInputChange}
                    placeholder="하이라이트 (쉼표 구분)"
                  />

                  <hr />

                  <div className="grid gap-2">
                    <Input
                      name="organizer"
                      value={editForm.organizer}
                      onChange={handleEditInputChange}
                      placeholder="주최"
                    />
                    <Input
                      name="operator"
                      value={editForm.operator}
                      onChange={handleEditInputChange}
                      placeholder="주관"
                    />
                    <Input
                      name="sponsor"
                      value={editForm.sponsor}
                      onChange={handleEditInputChange}
                      placeholder="후원 (쉼표 구분)"
                    />
                    <Input
                      name="souvenir"
                      value={editForm.souvenir}
                      onChange={handleEditInputChange}
                      placeholder="기념품 (쉼표 구분)"
                    />
                  </div>

                  <hr />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      name="contactHome"
                      value={editForm.contactHome}
                      onChange={handleEditInputChange}
                      placeholder="홈페이지 URL"
                    />
                    <Input
                      name="contactTel"
                      value={editForm.contactTel}
                      onChange={handleEditInputChange}
                      placeholder="전화번호"
                    />
                    <Input
                      name="contactEmail"
                      value={editForm.contactEmail}
                      onChange={handleEditInputChange}
                      placeholder="이메일"
                    />
                    <Input
                      name="contactInstagram"
                      value={editForm.contactInstagram}
                      onChange={handleEditInputChange}
                      placeholder="인스타그램 아이디"
                    />
                    <Input
                      name="contactKakao"
                      value={editForm.contactKakao}
                      onChange={handleEditInputChange}
                      placeholder="카카오톡 채널 링크"
                    />
                  </div>

                  <hr />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      name="imageMain"
                      value={editForm.imageMain}
                      onChange={handleEditInputChange}
                      placeholder="대표 이미지 파일명"
                    />
                    <Input
                      name="imageSub"
                      value={editForm.imageSub}
                      onChange={handleEditInputChange}
                      placeholder="서브 이미지 파일명 (쉼표 구분)"
                    />
                  </div>

                  {editError && (
                    <p className="text-sm text-red-500">{editError}</p>
                  )}

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseEdit}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="bg-brand text-white hover:bg-brand/90"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "수정 중..." : "수정하기"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {statusAlert && (
          <div
            className={`mb-4 rounded border px-4 py-3 text-sm font-nanumNeo ${
              statusAlert.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-red-300 bg-red-50 text-red-600"
            }`}
          >
            {statusAlert.message}
          </div>
        )}

        {isLoadingData ? (
          <div className="flex min-h-[200px] items-center justify-center font-nanumNeo text-muted-foreground">
            데이터를 불러오는 중입니다...
          </div>
        ) : marathons.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center font-nanumNeo text-muted-foreground">
            불러온 데이터가 없습니다.
          </div>
        ) : (
          <AdminMarathonTable
            marathons={filteredMarathons}
            onStatusChange={handleStatusUpdate}
            updatingStatusId={statusUpdatingId}
            onEdit={handleOpenEdit}
          />
        )}
      </main>
    );
  }

  return (
    <main className="main__container flex flex-col items-center justify-center min-h-[calc(100vh-280px)]">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 font-nanumNeo">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="text-xl font-bold text-brand">관리자 로그인</h1>
          <p className="mt-2 text-sm font-nanumNeo text-muted-foreground">
            관리자 전용 페이지입니다. 비밀번호를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="block space-y-2">
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded border border-gray-200 px-4 py-2 text-sm font-nanumNeo focus:border-brand focus:ring-2 focus:ring-brand/20"
              placeholder="어드민 비밀번호를 입력하세요"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          {errorMessage && (
            <p className="text-sm font-nanumNeo text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-brand/50"
            disabled={isSubmitting}
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? "확인 중..." : "접속하기"}
          </button>
        </form>
      </div>
    </main>
  );
}
