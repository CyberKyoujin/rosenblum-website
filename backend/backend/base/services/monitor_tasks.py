import logging
from django.utils import timezone
from datetime import timedelta

logger = logging.getLogger(__name__)


def report_failed_tasks():
    """
    Check for django-q tasks that failed in the last 24 hours and log them as
    errors so Sentry captures and alerts on them.

    Scheduled daily via setup_tasks management command.
    """
    from django_q.models import Failure

    since = timezone.now() - timedelta(hours=24)
    failures = Failure.objects.filter(started__gte=since)

    if not failures.exists():
        logger.info("[TaskMonitor]: No failed tasks in the last 24 hours.")
        return

    count = failures.count()
    for failure in failures:
        logger.error(
            "[TaskMonitor]: django-q task failed — name=%s | func=%s | started=%s | error=%s",
            failure.name,
            failure.func,
            failure.started,
            failure.result,
        )

    logger.error(
        "[TaskMonitor]: %d failed django-q task(s) detected in the last 24 hours. "
        "Check Sentry for details.",
        count,
    )
