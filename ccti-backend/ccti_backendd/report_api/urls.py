from django.urls import path
from . import views

urlpatterns = [
    path('generate-report/', views.generate_report, name='generate-report'),  # Correct endpoint
]