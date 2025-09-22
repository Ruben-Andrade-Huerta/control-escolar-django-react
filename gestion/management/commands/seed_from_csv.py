# gestion/management/commands/seed_from_csv.py
import csv
import os
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.conf import settings

from gestion.models import Grupo, Alumno, Docente, Especialidad, Materia, GrupoMateria

User = get_user_model()

# Defaults
DEFAULT_USERS_CSV = os.path.join('data', 'usuarios.csv')
DEFAULT_GRUPOS_CSV = os.path.join('data', 'grupos.csv')
DEFAULT_MATERIAS_CSV = os.path.join('data', 'materias.csv')
DEFAULT_ESPECIALIDADES_CSV = os.path.join('data', 'especialidades.csv')
DEFAULT_DOCENTES_CSV = os.path.join('data', 'docentes.csv')
DEFAULT_ALUMNOS_CSV = os.path.join('data', 'alumnos.csv')
DEFAULT_GRUPOMATERIA_CSV = os.path.join('data', 'grupomateria.csv')

def str_to_bool(v):
    if v is None:
        return False
    s = str(v).strip().lower()
    return s in ('1','true','t','yes','y','si','sí')

class Command(BaseCommand):
    help = "Importa/crea Usuario, Grupo, Materia, Especialidad, Docente, Alumno y GrupoMateria desde CSVs en data/ (vea --help para opciones)."

    def add_arguments(self, parser):
        parser.add_argument('--dir', default='data', help='Directorio donde están los CSVs (por defecto data/)')
        parser.add_argument('--create-users', action='store_true', help='Crear usuarios que no existan (contraseña por defecto).')
        parser.add_argument('--default-password', default='password123', help='Contraseña por defecto para usuarios creados.')
        parser.add_argument('--delimiter', default=',', help='Delimitador CSV (por defecto ",").')
        parser.add_argument('--encoding', default='utf-8', help='Encoding archivos CSV.')

    def handle(self, *args, **opts):
        base_dir = opts['dir']
        create_users = opts['create_users']
        default_pwd = opts['default_password']
        delimiter = opts['delimiter']
        encoding = opts['encoding']

        # Resolve full paths
        users_csv = os.path.join(base_dir, 'users.csv')
        grupos_csv = os.path.join(base_dir, 'grupos.csv')
        materias_csv = os.path.join(base_dir, 'materias.csv')
        especialidades_csv = os.path.join(base_dir, 'especialidades.csv')
        docentes_csv = os.path.join(base_dir, 'docentes.csv')
        alumnos_csv = os.path.join(base_dir, 'alumnos.csv')
        grupomateria_csv = os.path.join(base_dir, 'grupomateria.csv')

        summary = {
            'users_created':0, 'users_skipped':0,
            'grupos_created':0, 'materias_created':0, 'especialidades_created':0,
            'docentes_created':0, 'docentes_skipped':0,
            'alumnos_created':0, 'alumnos_skipped':0,
            'grupomateria_created':0, 'errors':0
        }

        @transaction.atomic
        def run_import():
            # 1) Usuarios
            if os.path.exists(users_csv):
                self.stdout.write(f"Importando usuarios desde {users_csv} ...")
                with open(users_csv, newline='', encoding=encoding) as f:
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for i, row in enumerate(reader, start=1):
                        #print(row)  # <-- Agrega esta línea aquí
                        try:
                            email = (row.get('email') or row.get('user_email') or '').strip()
                            if not email:
                                self.stderr.write(f"L{ i }: usuario sin email. Saltando.")
                                summary['users_skipped'] += 1
                                continue
                            first_name = (row.get('first_name') or row.get('nombre') or '').strip()
                            last_name = (row.get('last_name') or row.get('apellido') or '').strip()
                            rol = (row.get('rol') or '').strip() or 'alumno'
                            is_active = str_to_bool(row.get('is_active', 'True'))

                            # si ya existe
                            try:
                                user = User.objects.get(email=email)
                                # opcionalmente actualizar nombre/rol/is_active si quieres (aquí no lo hacemos)
                                summary['users_skipped'] += 1
                                continue
                            except User.DoesNotExist:
                                if create_users:
                                    try:
                                        user = User.objects.create_user(email=email, password=default_pwd, first_name=first_name, last_name=last_name, rol=rol, is_active=is_active)
                                    except TypeError:
                                        # fallback si create_user tiene otra firma
                                        user = User.objects.create(email=email, first_name=first_name, last_name=last_name, rol=rol, is_active=is_active)
                                        user.set_password(default_pwd)
                                        user.save()
                                    summary['users_created'] += 1
                                else:
                                    # No creamos usuarios por defecto; se asume que ya existen
                                    summary['users_skipped'] += 1
                                    continue
                        except Exception as e:
                            self.stderr.write(f"L{ i }: Error creando usuario {email}: {e}")
                            summary['errors'] += 1
                            continue
            else:
                self.stdout.write(f"No existe {users_csv} — saltando import de usuarios. (usa --create-users si quieres crear desde docentes/alumnos).")

            # 2) Grupos
            if os.path.exists(grupos_csv):
                self.stdout.write(f"Importando grupos desde {grupos_csv} ...")
                with open(grupos_csv, newline='', encoding=encoding) as f:
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for i,row in enumerate(reader, start=1):
                        try:
                            nombre = (row.get('nombre') or '').strip()
                            if not nombre:
                                continue
                            grado = row.get('grado') or 1
                            turno = (row.get('turno') or 'matutino').strip()
                            is_active = str_to_bool(row.get('is_active', True))
                            g, created = Grupo.objects.get_or_create(nombre=nombre, defaults={'grado':int(grado), 'turno':turno, 'is_active': is_active})
                            if created:
                                summary['grupos_created'] += 1
                        except Exception as e:
                            self.stderr.write(f"L{ i }: Error creando grupo {row}: {e}")
                            summary['errors'] += 1
            else:
                self.stdout.write(f"No existe {grupos_csv} — puedes crear grupos manualmente o crear un CSV con columnas: nombre,grado,turno,is_active")

            # 3) Materias
            if os.path.exists(materias_csv):
                self.stdout.write(f"Importando materias desde {materias_csv} ...")
                with open(materias_csv, newline='', encoding=encoding) as f:
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for i,row in enumerate(reader, start=1):
                        try:
                            nombre = (row.get('nombre') or '').strip()
                            clave = (row.get('clave') or '').strip() or None
                            is_active = str_to_bool(row.get('is_active', True))
                            if not nombre:
                                continue
                            m, created = Materia.objects.get_or_create(clave=clave or nombre[:20], defaults={'nombre':nombre, 'is_active': is_active})
                            if created:
                                # si clave no se pasó, aseguramos la clave única
                                if not clave:
                                    m.clave = f"{m.nombre[:10].upper()}{m.id}"
                                    m.save(update_fields=['clave'])
                                summary['materias_created'] += 1
                        except Exception as e:
                            self.stderr.write(f"L{ i }: Error creando materia {row}: {e}")
                            summary['errors'] += 1
            else:
                self.stdout.write(f"No existe {materias_csv} — puedes crear materias con columnas: nombre,clave,is_active")

            # 4) Especialidades (lista simple de nombres)
            if os.path.exists(especialidades_csv):
                self.stdout.write(f"Importando especialidades desde {especialidades_csv} ...")
                with open(especialidades_csv, newline='', encoding=encoding) as f:
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for i,row in enumerate(reader, start=1):
                        try:
                            materia_texto = (row.get('materia') or row.get('nombre') or '').strip()
                            if not materia_texto:
                                continue
                            e, created = Especialidad.objects.get_or_create(materia=materia_texto)
                            if created:
                                summary['especialidades_created'] += 1
                        except Exception as e:
                            self.stderr.write(f"L{ i }: Error creando especialidad {row}: {e}")
                            summary['errors'] += 1
            else:
                self.stdout.write(f"No existe {especialidades_csv} — puedes crear especialidades con columna: materia")

            # 5) Docentes
            if os.path.exists(docentes_csv):
                self.stdout.write(f"Importando docentes desde {docentes_csv} ...")
                with open(docentes_csv, newline='', encoding=encoding) as f:
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for i,row in enumerate(reader, start=1):
                        try:
                            email = (row.get('user_email') or row.get('email') or '').strip()
                            if not email:
                                self.stderr.write(f"L{ i }: Docente sin user_email. Saltando.")
                                summary['docentes_skipped'] += 1
                                continue
                            try:
                                usuario = User.objects.get(email=email)
                            except User.DoesNotExist:
                                if create_users:
                                    try:
                                        usuario = User.objects.create_user(email=email, password=default_pwd, first_name=row.get('first_name','') or '', last_name=row.get('last_name','') or '', rol='docente', is_active=True)
                                        summary['users_created'] += 1
                                    except TypeError:
                                        usuario = User.objects.create(email=email, first_name=row.get('first_name','') or '', last_name=row.get('last_name','') or '', rol='docente', is_active=True)
                                        usuario.set_password(default_pwd); usuario.save()
                                        summary['users_created'] += 1
                                else:
                                    self.stderr.write(f"L{ i }: Usuario {email} no existe. Use --create-users para crearlos. Saltando.")
                                    summary['docentes_skipped'] += 1
                                    continue

                            # evitar duplicado
                            if Docente.objects.filter(usuario=usuario).exists():
                                self.stderr.write(f"L{ i }: Docente ya existe para usuario {email}. Saltando.")
                                summary['docentes_skipped'] += 1
                                continue

                            cedula = (row.get('cedula') or '').strip()
                            docente = Docente(usuario=usuario, cedula=cedula)
                            try:
                                docente.full_clean()
                                docente.save()
                            except ValidationError as ve:
                                self.stderr.write(f"L{ i }: Error validación Docente {email}: {ve}. Saltando.")
                                summary['errors'] += 1
                                continue

                            # especialidades: campo 'especialidades' separado por ';'
                            raw = row.get('especialidades') or ''
                            parts = [p.strip() for p in raw.split(';') if p.strip()]
                            for part in parts:
                                # intentar vincular con Materia (por nombre), si existe crear Especialidad con nombre de Materia
                                materia_obj = None
                                try:
                                    materia_obj = Materia.objects.get(nombre__iexact=part)
                                except Materia.DoesNotExist:
                                    materia_obj = None

                                if materia_obj:
                                    esp, _ = Especialidad.objects.get_or_create(materia=materia_obj.nombre)
                                else:
                                    esp, _ = Especialidad.objects.get_or_create(materia=part)
                                docente.especialidades.add(esp)

                            summary['docentes_created'] += 1

                        except Exception as e:
                            self.stderr.write(f"L{ i }: Error procesando docente {row}: {e}")
                            summary['errors'] += 1
                            continue
            else:
                self.stdout.write(f"No existe {docentes_csv} — saltando import de docentes.")

            # 6) Alumnos
            if os.path.exists(alumnos_csv):
                self.stdout.write(f"Importando alumnos desde {alumnos_csv} ...")
                with open(alumnos_csv, newline='', encoding=encoding) as f:
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for i,row in enumerate(reader, start=1):
                        try:
                            email = (row.get('user_email') or row.get('email') or '').strip()
                            if not email:
                                self.stderr.write(f"L{ i }: Alumno sin user_email. Saltando.")
                                summary['alumnos_skipped'] += 1
                                continue
                            try:
                                usuario = User.objects.get(email=email)
                            except User.DoesNotExist:
                                if create_users:
                                    try:
                                        usuario = User.objects.create_user(email=email, password=default_pwd, first_name=row.get('first_name','') or '', last_name=row.get('last_name','') or '', rol='alumno', is_active=True)
                                        summary['users_created'] += 1
                                    except TypeError:
                                        usuario = User.objects.create(email=email, first_name=row.get('first_name','') or '', last_name=row.get('last_name','') or '', rol='alumno', is_active=True)
                                        usuario.set_password(default_pwd); usuario.save()
                                        summary['users_created'] += 1
                                else:
                                    self.stderr.write(f"L{ i }: Usuario {email} no existe. Use --create-users para crearlos. Saltando.")
                                    summary['alumnos_skipped'] += 1
                                    continue

                            # evitar duplicado
                            if Alumno.objects.filter(usuario=usuario).exists():
                                self.stderr.write(f"L{ i }: Alumno ya existe para usuario {email}. Saltando.")
                                summary['alumnos_skipped'] += 1
                                continue

                            matricula = (row.get('matricula') or '').strip()
                            grupo = None
                            if row.get('grupo_id'):
                                try:
                                    grupo = Grupo.objects.get(pk=int(row.get('grupo_id')))
                                except:
                                    grupo = None
                            elif row.get('grupo_nombre'):
                                try:
                                    grupo = Grupo.objects.get(nombre=row.get('grupo_nombre').strip())
                                except Grupo.DoesNotExist:
                                    self.stderr.write(f"L{ i }: Grupo {row.get('grupo_nombre')} no existe. Se crea Alumno sin grupo.")
                                    grupo = None

                            alumno = Alumno(usuario=usuario, grupo=grupo, matricula=matricula)
                            try:
                                alumno.full_clean()
                                alumno.save()
                                summary['alumnos_created'] += 1
                            except ValidationError as ve:
                                self.stderr.write(f"L{ i }: Error validación Alumno {email}: {ve}. Saltando.")
                                summary['errors'] += 1
                                continue

                        except Exception as e:
                            self.stderr.write(f"L{ i }: Error procesando alumno {row}: {e}")
                            summary['errors'] += 1
                            continue
            else:
                self.stdout.write(f"No existe {alumnos_csv} — saltando import de alumnos.")

            # 7) GrupoMateria
            if os.path.exists(grupomateria_csv):
                self.stdout.write(f"Importando GrupoMateria desde {grupomateria_csv} ...")
                with open(grupomateria_csv, newline='', encoding=encoding) as f:
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for i,row in enumerate(reader, start=1):
                        try:
                            grupo = None
                            materia = None
                            docente = None
                            is_active = str_to_bool(row.get('is_active', True))

                            """ # resolver grupo
                            if row.get('grupo_id'):
                                try:
                                    grupo = Grupo.objects.get(pk=int(row.get('grupo_id')))
                                except:
                                    grupo = None
                            elif row.get('grupo_nombre'):
                                try:
                                    grupo = Grupo.objects.get(nombre=row.get('grupo_nombre').strip())
                                except Grupo.DoesNotExist:
                                    self.stderr.write(f"L{ i }: Grupo {row.get('grupo_nombre')} no existe. Saltando.")
                                    continue

                            # resolver materia por clave o nombre
                            if row.get('materia_clave'):
                                try:
                                    materia = Materia.objects.get(clave=row.get('materia_clave').strip())
                                except Materia.DoesNotExist:
                                    materia = None
                            elif row.get('materia_nombre'):
                                try:
                                    materia = Materia.objects.get(nombre=row.get('materia_nombre').strip())
                                except Materia.DoesNotExist:
                                    materia = None

                            # resolver docente por cedula o email
                            if row.get('docente_cedula'):
                                try:
                                    docente = Docente.objects.get(cedula=str(row.get('docente_cedula')).strip())
                                except Docente.DoesNotExist:
                                    docente = None
                            elif row.get('docente_email'):
                                try:
                                    u = User.objects.get(email=row.get('docente_email').strip())
                                    docente = Docente.objects.get(usuario=u)
                                except:
                                    docente = None """
                            # resolver grupo por nombre
                            if row.get('grupo'):
                                try:
                                    grupo = Grupo.objects.get(nombre=row.get('grupo').strip())
                                except Grupo.DoesNotExist:
                                    grupo = None

                            # resolver materia por nombre
                            if row.get('materia'):
                                try:
                                    materia = Materia.objects.get(nombre=row.get('materia').strip())
                                except Materia.DoesNotExist:
                                    materia = None

                            # resolver docente por email
                            if row.get('docente'):
                                try:
                                    u = User.objects.get(email=row.get('docente').strip())
                                    docente = Docente.objects.get(usuario=u)
                                except:
                                    docente = None

                            if not (grupo and materia and docente):
                                self.stderr.write(f"L{ i }: faltan referencias para GrupoMateria: grupo={grupo}, materia={materia}, docente={docente}. Saltando.")
                                continue

                            gm, created = GrupoMateria.objects.get_or_create(grupo=grupo, materia=materia, defaults={'docente':docente, 'is_active': is_active})
                            if created:
                                summary['grupomateria_created'] += 1

                        except Exception as e:
                            self.stderr.write(f"L{ i }: Error procesando GrupoMateria {row}: {e}")
                            summary['errors'] += 1
                            continue
            else:
                self.stdout.write(f"No existe {grupomateria_csv} — saltando import de GrupoMateria.")

        # ejecutar import
        run_import()

        # resumen
        self.stdout.write(self.style.SUCCESS("Import finalizado. Resumen:"))
        for k,v in summary.items():
            self.stdout.write(f"  {k}: {v}")
