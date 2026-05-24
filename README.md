```bash
git clone git@github.com:khlkarim/nobody.git .
cd nobody

docker compose up -d # there are two services: mysql & adminer

cd backend
cp .env.example .env
pnpm install 
pnpm run start:dev

cd frontend
pnpm install 
pnpm run dev
```
