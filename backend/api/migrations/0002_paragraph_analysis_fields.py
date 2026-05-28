from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='paragraph',
            name='analysis_results',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='paragraph',
            name='processed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
