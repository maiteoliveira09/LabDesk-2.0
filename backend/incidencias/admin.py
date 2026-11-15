from django.contrib import admin
from .models import Incidencia

@admin.register(Incidencia)
class IncidenciaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'prioridad', 'estado', 'creado_en')
    list_filter = ('categoria', 'prioridad', 'estado')
    search_fields = ('titulo', 'descripcion')
