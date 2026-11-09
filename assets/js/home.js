document.addEventListener('DOMContentLoaded',async()=>{
 const [artists,bl,gl,news,settings]=await Promise.all([TRP.list('artists',{limit:4}),TRP.list('series',{category:'BL',limit:3}),TRP.list('series',{category:'GL',limit:3}),TRP.list('news',{limit:3}),TRP.settings()]);
 const put=(id,items,render,label)=>{const el=document.getElementById(id);if(el)el.innerHTML=items.length?items.map(render).join(''):TRP.empty(label);};
 put('homeArtists',artists,TRP.artistCard,'artis');put('homeBL',bl,TRP.seriesCard,'serial BL');put('homeGL',gl,TRP.seriesCard,'serial GL');put('homeNews',news,TRP.newsCard,'berita');
 const eyebrow=document.getElementById('heroEyebrow');if(eyebrow)eyebrow.textContent=settings.hero_eyebrow;
 const title=document.getElementById('heroTitle');if(title)title.innerHTML=`${TRP.esc(settings.hero_title)} <span>${TRP.esc(settings.hero_highlight)}</span> ${TRP.esc(settings.hero_suffix)}`;
 const desc=document.getElementById('heroDescription');if(desc)desc.textContent=settings.hero_description;
 const hero=document.getElementById('homeHero');if(hero&&settings.hero_image)hero.style.backgroundImage=`linear-gradient(90deg, rgba(12,11,9,.98) 0%, rgba(12,11,9,.8) 45%, rgba(12,11,9,.12) 100%),url("${settings.hero_image.replace(/"/g,'')}")`;
 const footer=document.getElementById('footerDescription');if(footer)footer.textContent=settings.footer_description;
});