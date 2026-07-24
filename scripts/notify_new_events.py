#!/usr/bin/env python3
"""Posts a Discord webhook recap of calendar events added between two git
refs. Run from a GitHub Actions push event as:
    notify_new_events.py <before-sha> <after-sha>
"""
import json
import os
import subprocess
import sys
import urllib.request
from collections import defaultdict
from datetime import datetime

CALENDAR_URL = "https://phsrambots.org/calendar"


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True, check=False)


def changed_calendar_files(before, after):
    res = git("diff", "--name-only", before, after, "--", "data/calendar")
    return [f for f in res.stdout.splitlines() if f.endswith("events.json")]


def load_json_at(ref, path):
    res = git("show", f"{ref}:{path}")
    if res.returncode != 0:
        return []
    try:
        return json.loads(res.stdout)
    except json.JSONDecodeError:
        return []


def fmt_time(hm):
    # Avoid the non-portable %-I strftime flag; strip a leading zero manually instead.
    try:
        return datetime.strptime(hm.strip(), "%H:%M").strftime("%I:%M %p").lstrip("0")
    except Exception:
        return hm or ""


def fmt_date(ymd):
    # Avoid the non-portable %-d strftime flag; strip a leading zero manually instead.
    try:
        d = datetime.strptime(ymd, "%Y-%m-%d")
        return d.strftime("%a, %b ") + str(d.day) + d.strftime(", %Y")
    except Exception:
        return ymd


def main():
    before, after = sys.argv[1], sys.argv[2]

    webhook_url = os.environ.get("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        print("DISCORD_WEBHOOK_URL secret not set; skipping notification.")
        return

    new_events_by_date = defaultdict(list)
    for path in changed_calendar_files(before, after):
        old_ids = {e.get("id") for e in load_json_at(before, path)}
        for ev in load_json_at(after, path):
            if ev.get("id") not in old_ids:
                new_events_by_date[ev.get("date", "")].append(ev)

    if not new_events_by_date:
        print("No new calendar events found; skipping notification.")
        return

    lines = []
    for date in sorted(new_events_by_date):
        lines.append(f"**{fmt_date(date)}**")
        for ev in sorted(new_events_by_date[date], key=lambda e: e.get("start", "")):
            start = fmt_time(ev.get("start", ""))
            end = fmt_time(ev.get("end", ""))
            time_range = f"{start}-{end}" if end and end != start else start
            lines.append(f"- {time_range}: {ev.get('title', 'Untitled Event')}")
        lines.append("")

    lines.append(f"[Full Calendar]({CALENDAR_URL})")
    description = "\n".join(lines).strip()
    if len(description) > 4096:
        description = description[:4090] + "\n..."

    payload = {
        "embeds": [
            {
                "title": "New Events",
                "description": description,
                "color": 16711680,
                "author": {
                    "name": "frc6548",
                    "icon_url": "https://github.com/frc6548.png",
                },
            }
        ]
    }

    req = urllib.request.Request(
        webhook_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        print(f"Webhook responded with status {resp.status}")


if __name__ == "__main__":
    main()
