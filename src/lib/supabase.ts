import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://blypjxzbtdpczrhikawg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJseXBqeHpidGRwY3pyaGlrYXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNTA5MjMsImV4cCI6MjA4NjYyNjkyM30.BD_QX2bNi005eo0uxa0-YsPSIF-7WRp5aSi5VFk5Eao";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
