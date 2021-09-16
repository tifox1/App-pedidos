Comandos:
    Inicializar base de datos:
        sudo docker-compose run web  python3 run.py db init
    Crear base de datos:
        sudo docker-compose run web python3 run.py create_db
    Migrar base de datos:
        sudo docker-compose run web  python3 run.py db migrate  
    Hacer un upgrade despues de migrar la base de datos:
        sudo docker-compose run web  python3 run.py db upgrade
