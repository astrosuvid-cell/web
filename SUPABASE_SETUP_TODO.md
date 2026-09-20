# Astro Suvid - Supabase Manual Setup (No CLI)

## Manual Steps (Dashboard + Copy-Paste)

### 1. [ ] **Login Admin User**
```
URL: http://localhost:3000/admin/login
Email: admin@astrosuvid.com
Password: admin123
```
*Note: This assumes admin_users table exists - skip if 500 error*

### 2. [ ] **Supabase Dashboard Tables**
```
1. Go: https://supabase.com/dashboard/project/ocacrhjksyqkzyqtawmt
2. SQL Editor → New Query
3. Copy ALL content from scripts/01-create-tables.sql
4. Paste & Run → Creates admin_users, astro_products, etc.
5. Table Editor → Verify 'astro_products' table exists
```

### 3. [ ] **Create Default Admin (if needed)**
```
SQL Editor → Copy scripts/setup-admin.sql → Run
OR
curl -X POST http://localhost:3000/api/admin/setup -H "Content-Type: application/json" -d "{}"
```

### 4. [ ] **Test Astro Mall**
```
1. Login: /admin/login → /admin/astromall
2. Add Product:
   - Name: "Blue Sapphire"
   - Price: 25000
   - Price Type: per_unit
   - Unit: ratti
   - Description: "10 ratti premium quality"
3. Homepage: / → Astro Mall section shows card
```

### 5. [ ] **Verify**
```
- Admin CRUD works (add/edit/delete)
- Homepage displays products
- No 500 errors in console/network
```

**Manual = No CLI hassle! Dashboard SQL Editor is easiest.**

**Dashboard Links:**
```
Project: https://supabase.com/dashboard/project/ocacrhjksyqkzyqtawmt
SQL Editor: https://supabase.com/dashboard/project/ocacrhjksyqkzyqtawmt/database/sql
```

