from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer , NoteSerializer, CategorySerializer, OrderItemSerializer, PaymentSerializer, ProductSerializer, OrderSerializer, ShoppingCartSerializer, UserinfoSerializer, CartinfoSerializer, ShoppingCartSerializerPostAPI,ProductSerializeradd
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, ShoppingCart, Payment, Category, Order, OrderItem, Product ,Category,Address
from rest_framework import status
from decouple import config
from Crypto.Cipher import AES
import base64
import urllib.parse
from rest_framework.parsers import MultiPartParser
import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import transaction
import stripe
from django.shortcuts import redirect
from django.views import View
from django.http import JsonResponse
import json

SECRET_KEY = config('SECRET_KEY').ljust(32).encode('utf-8')

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_payment_intent(request):
    if request.method == "POST":
        try:
            # Receive the order details from frontend
            data = json.loads(request.body)
            amount = data.get("amount")  # Amount in cents

            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency="thb",
                payment_method_types=["promptpay"],  # For PromptPay integration
            )

            return JsonResponse({
                "clientSecret": intent["client_secret"]
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


class CreateStripeCheckoutSessionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        items = request.data.get("item", {}).get("items", [])  # Extract items
        order = request.data.get("order")

        try:
            checkout_session = stripe.checkout.Session.create(
    line_items=[
        {
            'price_data': {
                'currency': 'thb',
                'unit_amount': int(float(item['price']) * 100),
                'product_data': {
                    'name': item['product_name'],
                    'images': ["https://example.com/path/to/image.jpg"],  # Example hardcoded image URL
                },
            },
            'quantity': item.get('quantity', 1),
        }
        for item in items
    ],
    payment_method_types=['card'],
    mode='payment',
    success_url=f"http://localhost:5173/checkout/{order}/?success=true",  # Example hardcoded success URL
    cancel_url="http://localhost:5173/cartlist/?canceled=true",  # Example hardcoded cancel URL
)

            return Response({"url": checkout_session.url}, status=200)
        except Exception as e:
            print("Stripe error:", e)  # Log error for debugging
            return Response(
                {'error': 'Something went wrong with creating the Stripe checkout session!', 'details': str(e)},
                status=500
            )

        


def decode_query_param(encrypted_param): 
    # Decode the URL-encoded parameter
    encrypted_param = urllib.parse.unquote(encrypted_param)
    
    # Decrypt the parameter
    cipher = AES.new(SECRET_KEY, AES.MODE_ECB)
    decrypted_bytes = cipher.decrypt(base64.b64decode(encrypted_param))
    
    # Remove padding
    padding_length = decrypted_bytes[-1]
    decrypted_text = decrypted_bytes[:-padding_length].decode('utf-8')
    
    return decrypted_text


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
        encoded_user_id = request.data.get('user_id')
        decoded_user_id = decode_query_param(encoded_user_id)
        data = {
            "user_id": decoded_user_id,
            "product_id": request.data.get('product_id'),
            "quantity": request.data.get('quantity')
        }
        serializer = ShoppingCartSerializerPostAPI(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Added to cart successfully.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        encoded_user_id = request.GET.get('user_id')
        user_id = decode_query_param(encoded_user_id)

        cart_items = ShoppingCart.objects.filter(user_id=user_id)

        serializer = ShoppingCartSerializer(cart_items, many=True)
        return Response(
            {'cart_items': serializer.data},
            status=status.HTTP_200_OK
        )

    def put(self, request, *args, **kwargs):
        encoded_user_id = request.data.get('user_id')
        user_id = decode_query_param(encoded_user_id)

        product_id = request.data.get('product_id')
        new_quantity = request.data.get('quantity')

        if not product_id or new_quantity is None:
            return Response(
                {'message': 'Product ID and quantity are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = ShoppingCart.objects.get(user_id=user_id, product_id=product_id)
        except ShoppingCart.DoesNotExist:
            return Response(
                {'message': 'Cart item not found for the provided user and product.'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.quantity = new_quantity
        cart_item.save()

        serializer = ShoppingCartSerializer(cart_item)
        return Response(
            {'message': 'Quantity updated successfully.', 'data': serializer.data},
            status=status.HTTP_200_OK
        )
    
    def delete(self, request, *args, **kwargs):
        encoded_user_id = request.data.get('user_id')
        user_id = decode_query_param(encoded_user_id)

        product_id = request.data.get('product_id')

        if product_id is None:
            return Response(
                {'message': 'Product ID is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = ShoppingCart.objects.get(user_id=user_id, product_id=product_id)
            serializer = ShoppingCartSerializerPostAPI(cart_item)
            cart_item.delete() 
            
            return Response(
                {
                    'message': 'Item removed from cart successfully.',
                },
                status=status.HTTP_200_OK
            )
        except ShoppingCart.DoesNotExist:
            return Response(
                {'message': 'Cart item not found for the provided user and product.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
class CartList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        encoded_user_id = request.GET.get('user_id')
        user_id = decode_query_param(encoded_user_id)

        cart_items = ShoppingCart.objects.filter(user_id=user_id)
        
        if not cart_items.exists():
            return Response(
                {'message': 'ไม่มีสินค้าในตะกร้า'},
                status=status.HTTP_200_OK
            )
        
        serializer = ShoppingCartSerializer(cart_items, many=True)
        return Response(
            {'cart_items': serializer.data},
            status=status.HTTP_200_OK
        )




class ProductListCategory(APIView):
    permission_classes = [AllowAny]  # Allow access without authentication

    def get(self, request, *args, **kwargs):
        category = Category.objects.all()
        serializer = CategorySerializer(category, many=True)
        return Response(serializer.data)  # ส่งข้อมูลสินค้าเป็น JSON
    
    def post(self, request, *args, **kwargs):
        category = request.data.get('categoryId')  # Get productId from request data
        print(category)
        if category:  # If productId is provided, filter by it
            try:
                product = Category.objects.get(id=category)  # Fetch the specific product
                serializer = CategorySerializer(product)
                return Response(serializer.data)  # Return the specific product
            except Category.DoesNotExist:
                return Response({"error": "Product not found"}, status=404)  # Handle product not found

        # If no productId is provided, return all products
        products = Category.objects.all()
        serializer = CategorySerializer(products, many=True)
        return Response(serializer.data)  # Return all products as JSON

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
                return Response(serializer.data)  # Return the specific products
            except Exception as e:
                print(f"Error fetching products: {e}")
                return Response({"error": "An error occurred while fetching products."}, status=500)

        # If no typeId is provided, return all products
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)  # Return all products as JSON
    
class UploadView(APIView):
    def post(self, request, *args, **kwargs):
        images = request.FILES.getlist('images')
        image_paths = []
        fs = FileSystemStorage()

        for image in images:
            filename = fs.save(image.name, image)
            image_paths.append(fs.url(filename))

        return Response({'paths': image_paths}, status=status.HTTP_201_CREATED)


class CreateOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        encoded_user_id = request.data.get('user_id')
        decoded_user_id = decode_query_param(encoded_user_id)
        data = {
            "user_id": decoded_user_id,
            "total_price": request.data.get('total_price'),
        }
        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Added to cart successfully.', 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CreateOrderItem(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        order_id = request.data.get('order_id')
        items = request.data.get('item', [])

        if not order_id or not items:
            return Response({"error": "order_id and item are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order_id = int(order_id)
        except ValueError:
            return Response({"error": "Invalid order_id. It must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():  # Start a transaction
                for item_data in items:
                    product_data = item_data.get('product')
                    if not product_data or 'id' not in product_data:
                        return Response({"error": "Product ID is required."}, status=status.HTTP_400_BAD_REQUEST)

                    quantity = item_data.get('quantity', 1)  # Default to 1 if not provided
                    
                    if quantity < 1:
                        return Response({"error": "Quantity must be at least 1."}, status=status.HTTP_400_BAD_REQUEST)

                    product = Product.objects.get(id=product_data['id'])  # Fetch the product to check stock
                    
                    # Check if the stock is sufficient
                    if product.stock < quantity:
                        return Response({"error": "Insufficient stock for product."}, status=status.HTTP_400_BAD_REQUEST)

                    # Create and save OrderItem
                    order_item = OrderItem(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price=product.price
                    )
                    order_item.save()

                    # Update the stock in Product
                    product.stock -= quantity
                    product.save()  # Save the updated product

                    # Delete the item from ShoppingCart based on product_id
                    ShoppingCart.objects.filter(product_id=product.id).delete()

        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Order items created and cart items removed successfully."}, status=status.HTTP_201_CREATED)



class GetCheckout(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, orderId, *args, **kwargs):  
        try:
            order = Order.objects.get(id=orderId)  
            user = order.user  

            order_data = {
                'id': order.id,
                'customer_name': user.username,  # Get the username instead of user_id
                'total_price': order.total_price,
                'status': order.status,
            }
            return Response({"order":order_data}, status=200)  
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
class GetCheckoutItem(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, orderId, *args, **kwargs):  
        try:
            order_items = OrderItem.objects.filter(order_id=orderId)  
            if not order_items.exists():
                return Response({"error": "Order items not found."}, status=404)

            order_items_data = []
            for order_item in order_items:
                try:
                    product = Product.objects.get(id=order_item.product_id)
                    item_data = {
                        'product_id': order_item.product_id,
                        'product_name': product.name,
                        'product_image':product.image_url,
                        'price': str(order_item.price), 
                        'quantity': order_item.quantity,
                    }
                    order_items_data.append(item_data)
                except Product.DoesNotExist:
                    continue  

            return Response({"items": order_items_data}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CreateAddress(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        address_detail = request.data.get('addressDetail')
        province = request.data.get('province')
        district = request.data.get('district')
        subdistrict = request.data.get('subDistrict')
        postal_code = request.data.get('postcode')
        phone_number = request.data.get('phone')

        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            print(user)

            address, created = Address.objects.update_or_create(
                user=user,
                defaults={
                    'addressDetail': address_detail,
                    'province': province,
                    'district': district,
                    'subdistrict': subdistrict,
                    'postal_code': postal_code,
                    'phone_number': phone_number,
                }
            )

            message = "Address created successfully." if created else "Address updated successfully."
            return Response({'message': message}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GetAddress(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        encoded_user_id = request.query_params.get('user_id')
        decoded_user_id = decode_query_param(encoded_user_id)

        decoded_user_id = decode_query_param(encoded_user_id)

        try:
            address = Address.objects.get(user_id=decoded_user_id)

            address_data = {
                'detail': address.addressDetail, 
                'province': address.province, 
                'district': address.district, 
                'subdistrict': address.subdistrict,  
                'postal_code': address.postal_code, 
                'phone_number': address.phone_number, 
            }

            return Response({'message': 'Address retrieved successfully.', 'address': address_data}, status=status.HTTP_200_OK)

        except Address.DoesNotExist:
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class AddProduct(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = ProductSerializeradd(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Product added successfully.', 'product': serializer.data},
                status=status.HTTP_201_CREATED
            )
        
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializeradd(product, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Product updated successfully.', 'product': serializer.data},
                status=status.HTTP_200_OK
            )

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({'message': 'Product deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)



class AddCategory(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = CategorySerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Product added successfully.', 'product': serializer.data},
                status=status.HTTP_201_CREATED
            )
        
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk, *args, **kwargs):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(category, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Category updated successfully.', 'category': serializer.data},
                status=status.HTTP_200_OK
            )

        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)

        category.delete()
        return Response({'message': 'Category deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    

class FetchOrder(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        encoded_user_id = request.GET.get('user_id')
        user_id = decode_query_param(encoded_user_id)  # ถอดรหัส user_id

        try:
            orders = Order.objects.filter(user_id=user_id)

            serialized_orders = OrderSerializer(orders, many=True).data

            return Response({'orders': serialized_orders}, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class CancelOrder(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        order_id = request.data.get("order")

        try:
            order = Order.objects.get(id=order_id)

            order.status = Order.CANCELLED
            order.save()  

            return Response({'message': 'Update Status successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get(self, request, *args, **kwargs):
            print("ok")
            return Response({'message': 'Update Status successfully.'}, status=status.HTTP_200_OK)


class UpdateStatus(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        order_id = request.data.get("order_id")

        try:
            # ดึง Order ตาม ID
            order = Order.objects.get(id=order_id)

            # อัปเดตสถานะเป็น SHIPPED
            order.status = Order.SHIPPED
            order.save()  # บันทึกการเปลี่ยนแปลงในฐานข้อมูล

            return Response({'message': 'Update Status successfully.'}, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
