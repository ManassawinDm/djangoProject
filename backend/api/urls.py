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

    path("notes/",views.NoteListCreate.as_view(),name="note-List"),
    path("notes/delete/<int:pk>",views.NoteDelecte.as_view(),name="delete-note"),
]

