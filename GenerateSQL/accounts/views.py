from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.contrib.auth.hashers import check_password
from django.conf import settings
import random

from .serializers import *
from .models import User

def send_otp_email(otp, email):
    subject = "Verify your Email - {}".format(email)
    print(otp)
    message = "Your 4-digit OTP to verify your account is : " + str(otp) + ". Please don't share it with anyone else"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)

class GetUserView(APIView):
    def get(self,requests):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # email = request.POST['email'].lower()
            # request.session['otp'] = random.randint(1000, 9999)
            # send_otp_email(request.session['otp'], email)
            return Response({"succcess": "User created successfully. Check email for OTP."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = request.data.get('otp')
            try:
                user = User.objects.get(email=email)
                if user.profile.otp == otp:
                    user.is_active = True
                    user.save()
                    return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = User.objects.filter(username=username).first()
            if user:
                if check_password(password, user.password):
                    request.session['id'] = user.id
                    request.session['username'] = user.username
                    return Response({"message": "Login successful."}, status=status.HTTP_200_OK)
                else:
                    
                    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                
                return Response({"error": "User does not exist"}, status=status.HTTP_401_UNAUTHORIZED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                otp = random.randint(1000, 9999)
                user.profile.otp = otp
                user.profile.save()
                send_mail(
                    'Password Reset OTP',
                    f'Your OTP is {otp}',
                    'from@example.com',
                    [user.email],
                    fail_silently=False,
                )
                return Response({"message": "OTP sent to email."}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = request.data.get('email')
            otp = request.data.get('otp')
            try:
                user = User.objects.get(email=email)
                if user.profile.otp == otp:
                    user.set_password(serializer.validated_data['password'])
                    user.save()
                    return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
