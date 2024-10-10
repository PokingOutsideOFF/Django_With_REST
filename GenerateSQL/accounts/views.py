from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.contrib.auth.hashers import check_password
from django.conf import settings
import random

from .serializers import *
from .models import User


class GetUserView(APIView):
    def get(self,requests):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

def send_otp_email(otp, email):
    subject = "Verify your Email - {}".format(email)
    message = "Your 4-digit OTP to verify your account is : " + str(otp) + ". Please don't share it with anyone else"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            otp = random.randint(1000, 9999)
            email = serializer.validated_data['email']
            
            send_otp_email(otp, email)

            return Response({"succcess": "OTP sent to your email.", "otp":otp}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        if request.data.get('reset') == "false":
            username = request.data.get('username')
            email = request.data.get('email')
            print("For account creation")

        mainotp = request.data.get('otp')

        if int(request.data.get('ogotp')) == int(mainotp):
            if request.data.get('reset') == "false":
                applicant = User.objects.create(
                    username=username,
                    email=email,
                    password=request.data.get('password')
                )
            else:
                return Response({"message": "Reset link activate"}, status=status.HTTP_201_CREATED)

            return Response({"message": "User created and verified successfully."}, status=status.HTTP_201_CREATED)

        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

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
                otp = random.randint(1000, 9999)
                
                send_otp_email(otp, email)
                return Response({"message": "OTP sent to email.","otp":otp}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def post(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = request.data.get('email')
            user = User.objects.filter(email = email).first()
            if user:
                user.set_password(serializer.validated_data['password'])
                user.save()
                return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
