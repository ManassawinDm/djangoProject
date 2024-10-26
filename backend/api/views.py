from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer , NoteSerializer, CategorySerializer, OrderItemSerializer, PaymentSerializer, ProductSerializer, OrderSerializer, ShoppingCartSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, ShoppingCart, Payment, Category, Order, OrderItem, Product ,Category

class CreatUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ProductListPublic(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)  # ส่งข้อมูลสินค้าเป็น JSON
    
class ProductListCategory(APIView):
    permission_classes = [AllowAny]  

    def get(self, request, *args, **kwargs):
        category = Category.objects.all()
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data)  # ส่งข้อมูลสินค้าเป็น JSON
    
class ProductListView(APIView):
    permission_classes = [IsAuthenticated]  # บังคับให้ต้องล็อกอินก่อนถึงจะเข้าถึงข้อมูลได้

    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)  # ส่งข้อมูลสินค้าเป็น JSON


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)
            
class NoteDelecte(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

# Create your views here.
