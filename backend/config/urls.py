from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from incidencias.views import IncidenciaViewSet
from django.http import JsonResponse

router = DefaultRouter()
router.register(r'incidencias', IncidenciaViewSet)

def inicio(request):
    return JsonResponse({
        'mensaje': 'Bienvenido a LabDesk',
        'estado': 'API funcionando correctamente',
        'api': '/api/incidencias/'
    })

urlpatterns = [
    path('', inicio, name='inicio'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
