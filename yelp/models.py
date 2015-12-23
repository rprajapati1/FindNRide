from django.db import models

# Create your models here.
class Website(models.Model):
    short_url = models.URLField(max_length=255)
    long_url = models.URLField(max_length=255)
