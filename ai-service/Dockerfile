# syntax=docker/dockerfile:1

FROM python:3.12-slim-bookworm

RUN apt-get update -y && apt-get install -y --no-install-recommends \
	libgl1 \
	libglib2.0-0 \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# По умолчанию — воркер агента. Для оркестратора RMQ в compose переопределите command (см. compose.service.example.yml).
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["main.py", "start"]
