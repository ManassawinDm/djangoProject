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
    permission_classes = [AllowAny]  # Allow access without authentication

    def post(self, request, *args, **kwargs):
        product_id = request.data.get('productId')  # Get productId from request data
        print("Received productId:", product_id)

        if product_id:  # If productId is provided, filter by it
            try:
                product = Product.objects.get(id=product_id)  # Fetch the specific product
                serializer = ProductSerializer(product)
                print("data is:",serializer)
                return Response(serializer.data)  # Return the specific product
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=404)  # Handle product not found

        # If no productId is provided, return all products
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)  # Return all products as JSON


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

class TypeListView(APIView):
    permission_classes = [AllowAny]  # Allow access without authentication

    def post(self, request, *args, **kwargs):
        typeid = request.data.get('typeId')  # Get typeId from request data
        print("Received typeId:", typeid)

        if typeid:  # If typeId is provided, filter by it
            try:
                products = Product.objects.filter(category_id=typeid)  # Fetch products by category
                serializer = ProductSerializer(products, many=True)
                print("Data is:", serializer.data)
                return Response(serializer.data)  # Return the specific products
            except Exception as e:
                print(f"Error fetching products: {e}")
                return Response({"error": "An error occurred while fetching products."}, status=500)

        # If no typeId is provided, return all products
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)  # Return all products as JSON
