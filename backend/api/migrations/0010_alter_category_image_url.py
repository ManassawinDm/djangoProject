# Generated by Django 5.0.7 on 2024-11-05 03:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_product_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='image_url',
            field=models.ImageField(blank=True, null=True, upload_to='products/'),
        ),
    ]
