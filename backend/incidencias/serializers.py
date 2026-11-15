
from rest_framework import serializers
from .models import Incidencia, Comentario


class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id', 'texto', 'creado_en']
        read_only_fields = ['id', 'creado_en']

    def validate_texto(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                'El comentario no puede estar vacío.'
            )
        return value.strip()


class IncidenciaSerializer(serializers.ModelSerializer):
    comentarios = ComentarioSerializer(many=True, read_only=True)

    class Meta:
        model = Incidencia
        fields = '__all__'
        read_only_fields = ['id', 'creado_en', 'comentarios']

    def validate_titulo(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                'El título es obligatorio.'
            )
        return value.strip()

    def validate_descripcion(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                'La descripción es obligatoria.'
            )
        return value.strip()
