FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt update
RUN apt install gettext -y
RUN apt install libexpat1 -y

WORKDIR /aciksozluk

COPY . /aciksozluk/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

RUN chmod +x /aciksozluk/entrypoint.sh

ENTRYPOINT ["/aciksozluk/entrypoint.sh"]
