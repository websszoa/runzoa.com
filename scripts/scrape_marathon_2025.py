#!/usr/bin/env python3
"""마라톤 온라인 달력의 2025년 공개 대회 목록을 JSON으로 저장한다."""

from __future__ import annotations

import argparse
import html
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path


LIST_URL = "http://www.roadrun.co.kr/schedule/list.php"
USER_AGENT = "Mozilla/5.0 (compatible; RunzoaCalendarCollector/1.0)"


def fetch_calendar(year: int) -> str:
    payload = urllib.parse.urlencode(
        {"syear_key": str(year), "search": "submit"}
    ).encode("ascii")
    request = urllib.request.Request(
        LIST_URL,
        data=payload,
        headers={
            "User-Agent": USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read().decode("euc-kr", errors="replace")


def clean_text(fragment: str) -> str:
    fragment = re.sub(r"<(?:br|/p|/div)\b[^>]*>", " ", fragment, flags=re.I)
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(fragment)).strip()


def first_match(pattern: str, value: str) -> str | None:
    match = re.search(pattern, value, flags=re.I | re.S)
    return clean_text(match.group(1)) if match else None


def parse_races(document: str, year: int) -> list[dict[str, object]]:
    races: list[dict[str, object]] = []
    seen_source_ids: set[str] = set()

    for row in re.findall(r"<tr[^>]*>(.*?)</tr>", document, flags=re.I | re.S):
        if not re.search(rf">\s*{year}\s*<br", row, flags=re.I):
            continue

        source_match = re.search(r"view\.php\?no=(\d+)", row, flags=re.I)
        if not source_match:
            continue

        source_id = source_match.group(1)
        if source_id in seen_source_ids:
            continue

        cells = re.findall(r"<td[^>]*>(.*?)</td>", row, flags=re.I | re.S)
        if len(cells) < 4:
            continue

        date_match = re.search(r"(\d{1,2})/(\d{1,2})", clean_text(cells[0]))
        name = first_match(
            rf"<a[^>]+view\.php\?no={source_id}[^>]*>(.*?)</a>", cells[1]
        )
        if not date_match or not name:
            continue

        month, day = (int(part) for part in date_match.groups())
        event_date = f"{year:04d}-{month:02d}-{day:02d}"
        course = first_match(
            r"<font[^>]+color=[\"']?#990000[\"']?[^>]*>(.*?)</font>",
            cells[1],
        )
        venue = clean_text(cells[2]) or None

        host_text = clean_text(cells[3])
        phone_match = re.search(r"☎\s*([^\s]+(?:\s*/\s*[^\s]+)*)", host_text)
        phone = phone_match.group(1).strip() if phone_match else None
        organizer = re.sub(r"\s*☎.*$", "", host_text).strip() or None

        website_match = re.search(
            r"<a\s+href=[\"']([^\"']+)[\"'][^>]*>\s*<img[^>]+src=[\"']?image/home\.gif",
            cells[3],
            flags=re.I | re.S,
        )
        website = html.unescape(website_match.group(1)).strip() if website_match else None
        if website == "":
            website = None

        email_match = re.search(r"form_mail\.htm\?mail_url=([^'\"&,)]+)", cells[3], flags=re.I)
        email_address = urllib.parse.unquote(email_match.group(1)).strip() if email_match else None
        if email_address and not re.fullmatch(
            r"[^\s@]+@[^\s@]+\.[^\s@]+", email_address
        ):
            email_address = None

        item_id = f"marathon-pe-{source_id}"
        races.append(
            {
                "id": item_id,
                "slug": item_id,
                "name": name,
                "description": None,
                "info": {
                    "type": "마라톤",
                    "scale": None,
                    "park": None,
                    "souvenir": None,
                    "program": course,
                    "memo": None,
                },
                "event": {
                    "startDate": event_date,
                    "endDate": event_date,
                    "startTime": None,
                    "endTime": None,
                    "site": website,
                    "schedule": None,
                },
                "registration": {
                    "startDate": None,
                    "endDate": None,
                    "startTime": None,
                    "endTime": None,
                    "site": website,
                    "status": "",
                    "price": {},
                },
                "location": {
                    "country": "KR",
                    "region": None,
                    "venue": venue,
                    "address": None,
                    "latitude": None,
                    "longitude": None,
                },
                "hosts": {
                    "organizer": organizer,
                    "manager": None,
                    "sponsor": None,
                    "phone": phone,
                    "email": email_address,
                    "instagram": None,
                    "blog": [],
                },
            }
        )
        seen_source_ids.add(source_id)

    return sorted(races, key=lambda race: (race["event"]["startDate"], race["id"]))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--year", type=int, default=2025)
    parser.add_argument("--output", type=Path, default=Path("data/marathons/mara_2025.json"))
    args = parser.parse_args()

    races = parse_races(fetch_calendar(args.year), args.year)
    if not races:
        raise SystemExit(f"{args.year}년 대회 정보를 찾지 못했습니다.")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(races, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"{args.output}: {len(races)}개 대회 저장 완료")


if __name__ == "__main__":
    main()
