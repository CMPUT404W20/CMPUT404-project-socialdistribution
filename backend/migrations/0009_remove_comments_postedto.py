# Generated by Django 3.0.2 on 2020-03-10 23:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0008_user_fullid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comments',
            name='postedTo',
        ),
    ]
