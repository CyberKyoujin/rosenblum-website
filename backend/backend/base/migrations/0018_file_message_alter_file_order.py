# Generated by Django 5.0.2 on 2024-04-29 17:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0017_message_sender'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='message',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='base.message'),
        ),
        migrations.AlterField(
            model_name='file',
            name='order',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='files', to='base.order'),
        ),
    ]
