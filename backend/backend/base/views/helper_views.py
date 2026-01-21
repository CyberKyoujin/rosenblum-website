from rest_framework.views import APIView
from base.models import CustomUser, EmailVerification
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

class UserVerificationCode(APIView):
        def get(self, request):
            
            if not settings.DEBUG:
                return Response({"detail": "This action is only accessible for testing"}, status=status.HTTP_403_FORBIDDEN)
            
            user_email = request.query_params.get("user_email")
            
            try:
                user = CustomUser.objects.get(email=user_email)
            except CustomUser.DoesNotExist:
                return Response({"detail": "user doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
            
            try:
                # Get the active (unused) verification code
                verification_obj = EmailVerification.objects.get(user=user, used=False)
            except EmailVerification.DoesNotExist:
                return Response({"detail": "No code found"}, status=status.HTTP_404_NOT_FOUND)
            
            print(verification_obj.code)
            
            if verification_obj.is_expired():
                return Response({"detail": "Code expired"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({"code": verification_obj.code}, status=status.HTTP_200_OK)
        
        