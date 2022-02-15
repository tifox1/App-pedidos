FROM python:3.9

WORKDIR /code 

COPY requirements.txt ./ 

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python3", "run.py", "runserver", "-h" , "0.0.0.0", "-p", "8000", "-d"]

EXPOSE 8000


