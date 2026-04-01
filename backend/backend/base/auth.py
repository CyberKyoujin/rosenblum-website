from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError

from django.middleware.csrf import CsrfViewMiddleware as CSRFCheck
from rest_framework import exceptions

import magic
from django.core.exceptions import ValidationError

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

class CookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get('access')
        
        if not raw_token:
            return None
        
        try:
            validated_token = self.get_validated_token(raw_token)
        except TokenError:
            return None
        
        user = self.get_user(validated_token)
        
        return (user, validated_token)
    
    def enforce_csrf(self, request):
        check = CSRFCheck(request)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')
        

def validate_magic_bytes(uploaded_files):
    
    for upload_file in uploaded_files:
        
        if upload_file.size > MAX_FILE_SIZE:
            raise ValidationError("File size exceeds the maximum limit of 50 MB.")
        
        file_content = upload_file.read(2048)
    
        mime = magic.from_buffer(file_content, mime=True)
    
        upload_file.seek(0)

        allowed_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
        ]
    
        if mime not in allowed_types:
            raise ValidationError(f"This extension is not allowed.")
    
    return uploaded_files