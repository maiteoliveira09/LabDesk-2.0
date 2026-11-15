
from django.db import models


class Incidencia(models.Model):
    CATEGORIAS = [
        ('hardware', 'Hardware'),
        ('software', 'Software'),
        ('red', 'Red / Internet'),
    ]

    PRIORIDADES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
    ]

    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En proceso'),
        ('resuelto', 'Resuelto'),
    ]

    titulo = models.CharField(max_length=120)
    descripcion = models.TextField()

    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIAS,
        default='hardware'
    )

    prioridad = models.CharField(
        max_length=10,
        choices=PRIORIDADES,
        default='media'
    )

    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='pendiente'
    )

    # Nuevos campos de LabDesk 2.0
    responsable = models.CharField(
        max_length=100,
        blank=True,
        default=''
    )

    ubicacion = models.CharField(
        max_length=150,
        blank=True,
        default=''
    )

    fecha_limite = models.DateTimeField(
        null=True,
        blank=True
    )

    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Comentario(models.Model):
    incidencia = models.ForeignKey(
        Incidencia,
        on_delete=models.CASCADE,
        related_name='comentarios'
    )

    texto = models.TextField()

    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comentario de {self.incidencia.titulo}'
