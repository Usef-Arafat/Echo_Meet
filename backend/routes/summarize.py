from fastapi import APIRouter

router = APIRouter(prefix="/summarize", tags=["summarize"])


@router.post("/{meeting_id}")
def summarize_meeting(meeting_id: str):
    """Stub: real summarization pipeline to be implemented."""
    return {"status": "pending", "meeting_id": meeting_id}
