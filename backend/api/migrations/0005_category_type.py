# Generated by Django 5.0.7 on 2024-10-26 18:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_category_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='type',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
