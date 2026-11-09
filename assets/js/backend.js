(function(){
  const url = window.SUPABASE_URL || "";
  const key = window.SUPABASE_ANON_KEY || "";
  const ready = window.supabase && url.startsWith("https://") && !url.includes("YOUR_PROJECT_ID") && key && !key.includes("YOUR_SUPABASE_ANON_KEY");
  window.sb = ready ? window.supabase.createClient(url, key) : null;
  window.backendReady = Boolean(window.sb);
})();
