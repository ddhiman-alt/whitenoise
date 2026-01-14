FROM node:22.21.1-bookworm

RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    bash \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /testbed

RUN git clone https://nova.teachx.ai/ddhiman/whitenoise.git .

RUN npm ci

RUN chmod -R 777 /testbed
