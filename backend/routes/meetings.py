import os
import json
from datetime import datetime, timezone
from typing import Optional

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

load_dotenv()

router = APIRouter(prefix="/meetings", tags=["meetings"])

DATABASE_URL = os.getenv("DATABASE_URL")

# ── In-memory peer registry ───────────────────────────────────────────────────
# { room_name: peer_id }  — simple 2-person signaling store
_peers: dict[str, str] = {}


# ── DB helper ─────────────────────────────────────────────────────────────────

def get_conn():
    return psycopg2.connect(DATABASE_URL)


# ── Schemas ───────────────────────────────────────────────────────────────────

class CreateMeetingRequest(BaseModel):
    room_name: str


class UpdateMeetingRequest(BaseModel):
    ended_at: Optional[str] = None
    duration_seconds: Optional[int] = None
    participant_count: Optional[int] = None
    transcript: Optional[dict] = None
    summary: Optional[str] = None
    action_items: Optional[list] = None


class RegisterPeerRequest(BaseModel):
    peer_id: str


# ── Peer signaling routes ─────────────────────────────────────────────────────
# Must be defined BEFORE /{meeting_id} to avoid route shadowing

@router.get("/peers/{room_name}")
def get_peer(room_name: str):
    """Return the peer ID of whoever is already in this room, or null."""
    return {"peer_id": _peers.get(room_name)}


@router.post("/peers/{room_name}")
def register_peer(room_name: str, body: RegisterPeerRequest):
    """Register a peer ID for this room (overwrites previous)."""
    _peers[room_name] = body.peer_id
    return {"registered": True, "peer_id": body.peer_id}


@router.delete("/peers/{room_name}")
def delete_peer(room_name: str):
    """Remove peer ID when user leaves."""
    _peers.pop(room_name, None)
    return {"deleted": True}


# ── Meeting CRUD routes ───────────────────────────────────────────────────────

@router.post("/create")
async def create_meeting(body: CreateMeetingRequest):
    """Create a meeting record in the DB."""
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO meetings (room_name) VALUES (%s) RETURNING id",
                    (body.room_name,),
                )
                meeting_id = cur.fetchone()[0]
    finally:
        conn.close()
    return {"meeting_id": str(meeting_id), "room_name": body.room_name}


@router.get("/")
def list_meetings():
    """Return all meetings, most recent first."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM meetings ORDER BY started_at DESC LIMIT 100")
            rows = cur.fetchall()
    finally:
        conn.close()
    return [dict(r) for r in rows]


@router.get("/{meeting_id}")
def get_meeting(meeting_id: str):
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM meetings WHERE id = %s", (meeting_id,))
            row = cur.fetchone()
    finally:
        conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return dict(row)


@router.patch("/{meeting_id}")
def update_meeting(meeting_id: str, body: UpdateMeetingRequest):
    updates = body.dict(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    for key in ("transcript", "action_items"):
        if key in updates and updates[key] is not None:
            updates[key] = json.dumps(updates[key])
    set_clause = ", ".join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [meeting_id]
    conn = get_conn()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE meetings SET {set_clause} WHERE id = %s", values
                )
                if cur.rowcount == 0:
                    raise HTTPException(status_code=404, detail="Meeting not found")
    finally:
        conn.close()
    return {"status": "updated", "meeting_id": meeting_id}
