# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='country',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='address1',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='address2',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='city',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='name',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='state',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='zip5',
            field=models.CharField(max_length=5, null=True),
        ),
    ]
