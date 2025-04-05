from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.api_login, name='api_login'),  # Now the full path will be /api/login/
    path('generate-report/', views.generate_report, name='generate_report'),
]