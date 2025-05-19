from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.api_login, name='api_login'),  # Changed from 'login/' to 'api/login/'
    path('agenerate-report/', views.generate_report, name='generate_report'),
    path('get-configurations/', views.get_configurations, name='get_configurations'),
    path('update-configurations/', views.update_configurations, name='update_configurations'),
]