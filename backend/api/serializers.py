from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Category, Product, Order, OrderItem, Payment, ShoppingCart,Image

class UserinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email"]

from rest_framework import serializers
from .models import ShoppingCart

class CartinfoSerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = ShoppingCart
        fields = ["item_count", "product", "quantity"]  

    def get_item_count(self, obj):
        return ShoppingCart.objects.filter(user=obj.user).count()


class UserSerializer(serializers.ModelSerializer):

    confirmpassword = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["id","username","email","password","confirmpassword"]
        extra_kwarge = {"password": {"write_only":True}}

    def validate(self, data):
        password = data.get('password')
        confirmpassword = data.get('confirmpassword')

        if not password or not confirmpassword:
            raise serializers.ValidationError("Both password and confirm password are required.")
        

        if password != confirmpassword:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        return data
        
    def create(self, validated_data):
        validated_data.pop('confirmpassword')
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id","title","content","create_at","author"]
        extra_kwarge = {"author": {"write_only":True}}

# Serializer สำหรับหมวดหมู่สินค้า
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image_url','type']

# Serializer สำหรับสินค้า
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)  # แสดงข้อมูลหมวดหมู่ด้วย
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'category', 'image_url', 'created_at']

# Serializer สำหรับการสั่งซื้อสินค้า
class OrderSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # แสดง username แทนข้อมูลผู้ใช้ทั้งหมด
    items = serializers.StringRelatedField(many=True, read_only=True)  # แสดงรายการสินค้า
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'status', 'created_at', 'items']

# Serializer สำหรับรายการสินค้าที่สั่งซื้อในแต่ละคำสั่งซื้อ
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # แสดงข้อมูลสินค้าที่สั่งซื้อ

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price']

# Serializer สำหรับการชำระเงิน
class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.StringRelatedField(read_only=True)  # แสดงข้อมูล order แบบ string
    
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_date', 'amount', 'payment_method']



#ตะกร้า
class ShoppingCartSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1) 
    product = ProductSerializer(read_only=True) 
    user = serializers.StringRelatedField(read_only=True)  

    class Meta:
        model = ShoppingCart
        fields = ['user', 'product', 'quantity']

    def validate(self, data):
        print("data",data)
        try:
            Product.objects.get(id=data['product_id'])
        except Product.DoesNotExist:
            raise serializers.ValidationError({'product_id': 'Product not found.'})

        try:
            User.objects.get(id=data['user_id'])
        except User.DoesNotExist:
            raise serializers.ValidationError({'user_id': 'User not found.'})

        return data  

    def create(self, validated_data):
        product = Product.objects.get(id=validated_data['product_id'])
        user = User.objects.get(id=validated_data['user_id'])
        quantity = validated_data['quantity']

        return ShoppingCart.objects.create(product=product, user=user, quantity=quantity)
    

class ShoppingCartSerializerPostAPI(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1) 
    product_id = serializers.IntegerField(write_only=True)  
    user_id = serializers.IntegerField(write_only=True)    
    product = ProductSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)  

    class Meta:
        model = ShoppingCart
        fields = ['user', 'product', 'quantity', 'product_id', 'user_id']

    def validate(self, data):
        try:
            Product.objects.get(id=data['product_id'])
        except Product.DoesNotExist:
            raise serializers.ValidationError({'product_id': 'Product not found.'})
        try:
            User.objects.get(id=data['user_id'])
        except User.DoesNotExist:
            raise serializers.ValidationError({'user_id': 'User not found.'})

        return data 
    
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image  # Specify the model
        fields = ['id', 'product', 'image_path']  # List the fields to be serialized

    def validate_image_path(self, value):
        # Optional: Custom validation for the image path if needed
        # For example, checking file size, type, etc.
        return value