# Generated by Django 3.0.2 on 2020-02-08 03:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='isPublic',
        ),
        migrations.AddField(
            model_name='post',
            name='visibility',
            field=models.CharField(default='PUBLIC', max_length=20),
        ),
    ]