# Generated by Django 5.0.7 on 2024-10-26 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_product_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='image_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
