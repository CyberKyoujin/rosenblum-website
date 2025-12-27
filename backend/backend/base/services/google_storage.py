from google.cloud import storage
from django.conf import settings
import datetime

def get_gcs_client():
    client = storage.Client(credentials=settings.GS_CREDENTIALS, project=settings.GS_CREDENTIALS.project_id)
    return client

def get_gcs_bucket():
    client = get_gcs_client()
    bucket_name = settings.GS_BUCKET_NAME
    return client.bucket(bucket_name)

def get_file_url(file_name):
    bucket = get_gcs_bucket()
    blob = bucket.blob(file_name)
    return blob.generate_signed_url(version='v4', expiration=datetime.timedelta(hours=1), method='GET')