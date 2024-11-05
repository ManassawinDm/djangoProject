from django.urls import path
from . import views

urlpatterns = [
    path("",views.ProductListPublic.as_view(),name="product-List-Public"),
    path("userinfo/",views.UserInformation.as_view(),name="user-Info"),

    path("category/",views.ProductListCategory.as_view(),name="category-List-Public"),
    path("product/",views.ProductListView.as_view(),name="category-List-Public"),
    path("type/",views.TypeListView.as_view(),name="category-List-Public"),

    path("cartinfo/", views.CartInformation.as_view(), name="cart-Info"),
    path("cart/", views.AddToCart.as_view(), name="cart"),
    path("cartlist/", views.CartList.as_view(), name="cart-List"),
    path("upload/",views.UploadView.as_view(),name="upload-image"),

    path('fetch-order/', views.FetchOrder.as_view(), name='update-status'),
    path("cancel-order/", views.CancelOrder.as_view(), name='cancel-order'),
    path("order/", views.CreateOrder.as_view(), name="create-order"),
    path("orderitem/", views.CreateOrderItem.as_view(), name="create-orderitem"),
    
    path("checkout/order/<int:orderId>/", views.GetCheckout.as_view(), name="checkout-order"),
    path("checkout/orderitem/<int:orderId>/", views.GetCheckoutItem.as_view(), name="checkout-order"),
    

    path("notes/",views.NoteListCreate.as_view(),name="note-List"),
    path("notes/delete/<int:pk>",views.NoteDelecte.as_view(),name="delete-note"),
    

    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),

    path('create-checkout-session/',views.CreateStripeCheckoutSessionView.as_view(),name="create-checkout-session",
    ),

    path('status/', views.UpdateStatus.as_view(), name='update-status'),

    path('address/', views.CreateAddress.as_view(), name='create-address'),
    path('addressInfo/', views.GetAddress.as_view(), name='create-address'),


    path("addproducts/", views.AddProduct.as_view(), name="add-product"),
    path('addproducts/<int:pk>/', views.AddProduct.as_view(), name='update-delete-product'),  # PUT and DELETE

    path("addcategory/", views.AddCategory.as_view(), name="add-product"),
    path('addcategory/<int:pk>/', views.AddCategory.as_view(), name='update-delete-product'),  # PUT and DELETE


]

