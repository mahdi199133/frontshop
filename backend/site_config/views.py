from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SiteConfiguration
from .serializers import SiteConfigurationSerializer

class SiteConfigurationView(APIView):
    """
    An API view to retrieve the site configuration.
    It fetches the first (and only) SiteConfiguration object.
    """
    def get(self, request, *args, **kwargs):
        # Get the first config object, or create a default one if it doesn't exist.
        config, created = SiteConfiguration.objects.get_or_create(id=1)
        serializer = SiteConfigurationSerializer(config)
        return Response(serializer.data)
