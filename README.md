[![Netlify Status](https://api.netlify.com/api/v1/badges/350b7ff2-7d18-43fb-a5d7-039af7a05232/deploy-status)](https://app.netlify.com/sites/glittery-kleicha-cdbf63/deploys)
[Staging](https://glittery-kleicha-cdbf63.netlify.app/login)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

# Design thought:

`Page/Component -> Store (Application Logic + State Management) -> Service (External Interactions)`

Dev notes:
create migration: npx supabase migration new create_get_games_by_user_id_function
append migration: npx supabase migration up
create initial db from UI: npx supabase db diff --use-migra initial_schema -f initial_schema
