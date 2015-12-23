# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0008_auto_20151124_0908'),
    ]

    operations = [
        migrations.DeleteModel(
            name='LazySpot',
        ),
        migrations.RemoveField(
            model_name='menuitems',
            name='restaurant',
        ),
        migrations.DeleteModel(
            name='MenuItems',
        ),
        migrations.DeleteModel(
            name='Restaurant',
        ),
    ]
