# Generated by Django 5.2.1 on 2025-07-09 01:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Grupo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('grado', models.PositiveSmallIntegerField()),
                ('turno', models.CharField(choices=[('matutino', 'Matutino'), ('vespertino', 'Vespertino')], max_length=20)),
            ],
        ),
    ]
