
from django.utils import timezone
from datetime import timedelta

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Incidencia, Comentario
from .serializers import (
    IncidenciaSerializer,
    ComentarioSerializer
)


class IncidenciaViewSet(viewsets.ModelViewSet):
    queryset = Incidencia.objects.all().order_by('-creado_en')
    serializer_class = IncidenciaSerializer

    @action(detail=True, methods=['get', 'post'])
    def comentarios(self, request, pk=None):
        incidencia = self.get_object()

        if request.method == 'GET':
            comentarios = incidencia.comentarios.all().order_by(
                '-creado_en'
            )
            serializer = ComentarioSerializer(
                comentarios,
                many=True
            )
            return Response(serializer.data)

        serializer = ComentarioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(incidencia=incidencia)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        incidencias = Incidencia.objects.all()
        total = incidencias.count()

        pendientes = incidencias.filter(
            estado='pendiente'
        ).count()

        en_proceso = incidencias.filter(
            estado='en_proceso'
        ).count()

        resueltas = incidencias.filter(
            estado='resuelto'
        ).count()

        ahora = timezone.now()
        limite_24h = ahora + timedelta(hours=24)

        activas = incidencias.exclude(estado='resuelto')

        vencidas = activas.filter(
            fecha_limite__lt=ahora
        ).count()

        proximas_a_vencer = activas.filter(
            fecha_limite__gte=ahora,
            fecha_limite__lte=limite_24h
        ).count()

        porcentaje = (
            round((resueltas / total) * 100, 2)
            if total > 0 else 0
        )

        return Response({
            'total': total,
            'pendientes': pendientes,
            'en_proceso': en_proceso,
            'resueltas': resueltas,
            'vencidas': vencidas,
            'proximas_a_vencer': proximas_a_vencer,
            'porcentaje_resolucion': porcentaje,
            'prioridades': {
                'baja': incidencias.filter(
                    prioridad='baja'
                ).count(),
                'media': incidencias.filter(
                    prioridad='media'
                ).count(),
                'alta': incidencias.filter(
                    prioridad='alta'
                ).count(),
            }
        })
