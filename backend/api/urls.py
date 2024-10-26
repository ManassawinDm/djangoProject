from django.urls import path
from . import views

urlpatterns = [
    path("",views.ProductListPublic.as_view(),name="product-List-Public"),
    path("category/",views.ProductListCategory.as_view(),name="category-List-Public"),
    path("notes/",views.NoteListCreate.as_view(),name="note-List"),
    path("notes/delete/<int:pk>",views.NoteDelecte.as_view(),name="delete-note"),
]
