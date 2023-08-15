FROM node:18.16.0

RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

# 앱 디렉토리
WORKDIR /app

# 의존성 설치
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000