# nobody
a distributed n-body simulation using nestjs, websockets, sse and graphql.

> [!WARNING]
> the branch named final is actually the main branch 

# contributions
## chourou houssem:
- graphql 
- front-end rooms page
- sse rooms
## ben hazem ahmed omar
- simulation frontend visualization
- front-end user profile and modification
- sse notifications
## skhiri ahmed
- rest api for rooms
- graqhql layer on existant rest api
## khili karim 
- authentification flow
- simulation backend service

# usage
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

