from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Task
from .serializers import TaskSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.views import APIView

# Create your views here.


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class RegisterViewSet(ModelViewSet):
    permission_classes = []  # Allow anyone
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
