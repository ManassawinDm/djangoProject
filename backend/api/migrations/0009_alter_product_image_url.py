# Generated by Django 5.0.7 on 2024-11-04 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_rename_street_address_address_addressdetail_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image_url',
            field=models.ImageField(blank=True, null=True, upload_to='products/'),
        ),
    ]
