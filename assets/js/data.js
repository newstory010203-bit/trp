window.TRP = (function(){
 const FALLBACK={
 artists:[
  {id:'demo-a1',name:'Artist Name 01',role:'ACTOR',slug:'artist-name-01',image_url:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700',bio:'Profil talent akan ditampilkan di sini.',status:'published'},
  {id:'demo-a2',name:'Artist Name 02',role:'ACTRESS',slug:'artist-name-02',image_url:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700',bio:'Profil talent akan ditampilkan di sini.',status:'published'},
  {id:'demo-a3',name:'Artist Name 03',role:'ACTOR',slug:'artist-name-03',image_url:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700',bio:'Profil talent akan ditampilkan di sini.',status:'published'},
  {id:'demo-a4',name:'Artist Name 04',role:'ACTRESS',slug:'artist-name-04',image_url:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700',bio:'Profil talent akan ditampilkan di sini.',status:'published'}
 ],
 series:[
  {id:'demo-s1',title:'Beyond The Summer',slug:'beyond-the-summer',category:'BL',poster_url:'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700',genre:'Romance · Drama',release_year:2026,synopsis:'Sinopsis serial akan ditampilkan di sini.',status:'published'},
  {id:'demo-s2',title:'Our Secret Chapter',slug:'our-secret-chapter',category:'BL',poster_url:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700',genre:'Romance · Youth',release_year:2026,synopsis:'Sinopsis serial akan ditampilkan di sini.',status:'published'},
  {id:'demo-s3',title:'Midnight Promise',slug:'midnight-promise',category:'BL',poster_url:'https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=700',genre:'Romance · Mystery',release_year:2026,synopsis:'Sinopsis serial akan ditampilkan di sini.',status:'published'},
  {id:'demo-s4',title:'When We Meet Again',slug:'when-we-meet-again',category:'GL',poster_url:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700',genre:'Romance · Drama',release_year:2026,synopsis:'Sinopsis serial akan ditampilkan di sini.',status:'published'},
  {id:'demo-s5',title:'Her Favorite Color',slug:'her-favorite-color',category:'GL',poster_url:'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700',genre:'Romance · Youth',release_year:2026,synopsis:'Sinopsis serial akan ditampilkan di sini.',status:'published'},
  {id:'demo-s6',title:'Love in Bloom',slug:'love-in-bloom',category:'GL',poster_url:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700',genre:'Romance · Slice of Life',release_year:2026,synopsis:'Sinopsis serial akan ditampilkan di sini.',status:'published'}
 ],
 news:[
  {id:'demo-n1',title:'New Projects Coming Soon!',slug:'new-projects-coming-soon',category:'ANNOUNCEMENT',image_url:'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=700',excerpt:'Stay tuned for the latest projects from our entertainment team.',content:'Stay tuned for the latest projects from our entertainment team.',status:'published'},
  {id:'demo-n2',title:'Meet Our Artists',slug:'meet-our-artists',category:'EVENT',image_url:'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700',excerpt:'Discover upcoming activities and special moments with our talents.',content:'Discover upcoming activities and special moments with our talents.',status:'published'},
  {id:'demo-n3',title:'Behind Every Great Story',slug:'behind-every-great-story',category:'BEHIND THE SCENES',image_url:'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700',excerpt:'Take a look at the creative process behind our productions.',content:'Take a look at the creative process behind our productions.',status:'published'}
 ]
 };
 const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const paragraphs=(s='')=>String(s).split(/\n\s*\n/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
 async function list(table,opts={}){
  if(!window.sb){let data=[...(FALLBACK[table]||[])]; if(opts.category)data=data.filter(x=>x.category===opts.category); if(opts.limit)data=data.slice(0,opts.limit); return data;}
  let q=window.sb.from(table).select('*').eq('status','published');
  if(opts.category)q=q.eq('category',opts.category);
  if(table==='news')q=q.order('published_at',{ascending:false,nullsFirst:false}); else q=q.order('sort_order',{ascending:true}).order('created_at',{ascending:false});
  if(opts.limit)q=q.limit(opts.limit);
  const {data,error}=await q; if(error){console.error(error);return [];} return data||[];
 }
 async function one(table,slug){
  if(!window.sb){return (FALLBACK[table]||[]).find(x=>x.slug===slug)||null;}
  const {data,error}=await window.sb.from(table).select('*').eq('slug',slug).eq('status','published').maybeSingle(); if(error){console.error(error);return null;} return data;
 }
 async function settings(){
  const defaults={hero_eyebrow:'THAI ENTERTAINMENT COMPANY',hero_title:'Stories That',hero_highlight:'Connect',hero_suffix:'Hearts.',hero_description:'Discover new talents, unforgettable stories, and exciting entertainment from THAI RONG PLENG PALEMBANG. A home for artists and extraordinary stories.',hero_image:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1800',footer_description:'A home for talents, stories, and entertainment. Creating memorable experiences through film, television, music, and live events.',about_content:'THAI RONG PLENG PALEMBANG adalah rumah bagi talenta, cerita, dan hiburan. Kami menghadirkan pengalaman melalui film, televisi, musik, dan acara langsung.',contact_email:'',contact_phone:'',contact_address:'Palembang, Indonesia',contact_instagram:''};
  if(!window.sb)return defaults;
  const {data,error}=await window.sb.from('site_settings').select('key,value'); if(error){console.error(error);return defaults;} const out={...defaults}; (data||[]).forEach(x=>out[x.key]=x.value); return out;
 }
 function artistCard(x){return `<a class="content-card" href="artist.html?slug=${encodeURIComponent(x.slug)}"><img src="${esc(x.image_url||'')}" alt="${esc(x.name)}" loading="lazy"><div class="content-card-body"><small>${esc(x.role||'ARTIST')}</small><h3>${esc(x.name)}</h3><span class="card-link">VIEW PROFILE →</span></div></a>`;}
 function seriesCard(x){return `<a class="content-card series-card" href="series.html?slug=${encodeURIComponent(x.slug)}"><img src="${esc(x.poster_url||'')}" alt="${esc(x.title)}" loading="lazy"><div class="content-card-body"><small>${esc(x.category||'SERIES')} · ${esc(x.release_year||'')}</small><h3>${esc(x.title)}</h3><p>${esc(x.genre||'')}</p><span class="card-link">VIEW DETAILS →</span></div></a>`;}
 function newsCard(x){return `<a class="content-card news-card" href="article.html?slug=${encodeURIComponent(x.slug)}"><img src="${esc(x.image_url||'')}" alt="${esc(x.title)}" loading="lazy"><div class="content-card-body"><small>${esc(x.category||'NEWS')}</small><h3>${esc(x.title)}</h3><p>${esc(x.excerpt||'')}</p><span class="card-link">READ MORE →</span></div></a>`;}
 const empty=(what)=>`<div class="empty-state"><h3>Belum ada ${esc(what)}</h3><p>Konten yang dipublikasikan melalui dashboard admin akan muncul di sini.</p></div>`;
 return {esc,paragraphs,list,one,settings,artistCard,seriesCard,newsCard,empty};
})();