# Design thoughts:

`Page/Component -> Store (Application Logic + State Management) -> Service (External Interactions)`

# Staging

- [![Staging Status](https://api.netlify.com/api/v1/badges/350b7ff2-7d18-43fb-a5d7-039af7a05232/deploy-status)](https://app.netlify.com/sites/glittery-kleicha-cdbf63/deploys)
- [Staging](https://glittery-kleicha-cdbf63.netlify.app/login)

# Dev

## Supabase

- Create a `.env` file (see keys from `example.env`).
- `npx supabase start`
- `npm run db:reset`

## Client

```
npm i
```

```
npm run dev
```

### notes

create migration: npx supabase migration new create_get_games_by_user_id_function
append migration: npx supabase migration up
create initial db from UI: npx supabase db diff --use-migra initial_schema -f initial_schema
