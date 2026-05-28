from __future__ import absolute_import, unicode_literals

from celery import shared_task
from .models import Paragraph


@shared_task(bind=True)
def analyze_paragraph_text(self, paragraph_id):
    try:
        paragraph = Paragraph.objects.get(id=paragraph_id)
    except Paragraph.DoesNotExist:
        return {
            'status': 'not_found',
            'paragraph_id': paragraph_id,
        }

    paragraph.update_analysis()
    return {
        'status': 'completed',
        'paragraph_id': paragraph.id,
        'analysis_results': paragraph.analysis_results,
    }
