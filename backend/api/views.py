from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer , NoteSerializer, CategorySerializer, OrderItemSerializer, PaymentSerializer, ProductSerializer, OrderSerializer, ShoppingCartSerializer, UserinfoSerializer, CartinfoSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, ShoppingCart, Payment, Category, Order, OrderItem, Product ,Category
from rest_framework import status
from decouple import config
from Crypto.Cipher import AES
import base64
import urllib.parse

SECRET_KEY = config('SECRET_KEY').ljust(32).encode('utf-8')
def decode_query_param(encrypted_param):
    encrypted_param = urllib.parse.unquote(encrypted_param)
    
    cipher = AES.new(SECRET_KEY, AES.MODE_ECB)
    decrypted_bytes = cipher.decrypt(base64.b64decode(encrypted_param))
    
    return decrypted_bytes.decode('utf-8').strip()


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



class UserInformation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)  
            serializer = UserinfoSerializer(user)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartInformation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = ShoppingCart.objects.filter(user_id=user_id)  
            serializer = CartinfoSerializer(cart, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
        

class AddToCart(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        try:
            print(user_id,product_id,quantity)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request, *args, **kwargs):
        encoded_user_id = request.GET.get('user_id')
        user_id = decode_query_param(encoded_user_id)
        
        print("user_id:", user_id)
        return Response({'user_id': user_id, 'message': 'Decoded user_id successfully.'})




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

        if product_id:  # If productId is provided, filter by it
            try:
                product = Product.objects.get(id=product_id)  # Fetch the specific product
                serializer = ProductSerializer(product)
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
