// ─── CLIENTE DE SUPABASE ──────────────────────────────────────
// Inicializa y exporta el cliente usando las variables de entorno.
// IMPORTANTE: en el .env NO uses comillas alrededor de los valores.
// Ejemplo correcto:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGci...

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);