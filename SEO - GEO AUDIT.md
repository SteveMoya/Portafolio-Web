**📊 Resultado general — Score: 77/100 🟡Ámbar (6 ✓ Pass · 4 ⚠️ Warning · 1 ℹ️ Info)**  
  
****Title****  
• Estado: 🟢 Pass  
• Detalle: "Steve Moya - Personal Portafolio Web" (36 chars)  
• Recomendación: OK (10–60)  
  
****Meta Description****  
• Estado: 🟢 Pass  
• Detalle: 131 chars (50–160) ✓  
• Recomendación: Redacta mejor el copy: dice *"Personal Web Personal, Este es mi portafolio con mucho amor y dedic…"* — texto poco pulido  
  
****H1 Tag****  
• Estado: 🟠 Warn  
• Detalle: **3 H1s**: `SteveMoya`, *(vacío)*, `Sobre Mi`  
• Recomendación: Deja **1 solo H1** ("Steve Moya" o "Sobre Mí"); los demás → H2/H3  
  
****Heading Hierarchy****  
• Estado: 🟢 Pass  
• Detalle: Jerarquía correcta (excepto H1s duplicados)  
• Recomendación: —  
  
****Empty Headings****  
• Estado: 🟠 Warn  
• Detalle: **2 headings vacíos** (un `<h1>` y un `<h2>`)  
• Recomendación: Ponles contenido o elimínalos (el `<h1>` vacío del logo "SteveMoya")  
  
****Canonical****  
• Estado: 🟠 Warn*  
• Detalle: [`https://stevemoya.me/](https://stevemoya.me/)`  
• Recomendación: *Falso positivo*: el scanner compara string exacto y la URL pedida era sin `/` final; el canonical es correcto  
  
****Image Alt****  
• Estado: 🟢 Pass  
• Detalle: 6/6 imágenes con `alt`  
• Recomendación: OK  
  
****Schema Markup****  
• Estado: 🟢 Pass  
• Detalle: 1 bloque JSON-LD  
• Recomendación: OK (podrías añadir `Person`/`Project` con más campos)  
  
****Sitemap****  
• Estado: 🟠 Warn*  
• Detalle: "formato inválido"  
• Recomendación: *Probable falso positivo* por Cloudflare: `/sitemap.xml` devuelve el challenge (403) al scanner, no XML real — verifícalo en navegador  
  
****Robots.txt****  
• Estado: 🟢 Pass  
• Detalle: Válido, con User-agent y directivas  
• Recomendación: OK  
  
****LLMs.txt (GEO)****  
• Estado: ℹ️ Info  
• Detalle: No encontrado  
• Recomendación: Opcional; créalo para aparecer como fuente citable en IA  
  
**⚠️ Hallazgo importante — Cloudflare Challenge**  
`curl` directo a [`stevemoya.me`](http://stevemoya.me) recibe **"Just a moment…" (403, managed challenge)**. El scanner pasó con User-Agent de Node/axios, pero esto es un **riesgo real de indexación**: si el challenge se activa ante bots de Google/Bing/IA, tus páginas podrían no indexarse o no citarse. Revisa la regla de firewall/bot-managed de Cloudflare para permitir a los motores de búsqueda.  
  
**🎯 Resumen de acciones (prioridad)**  
1. **H1 duplicados + headings vacíos** → único H1, rellenar/eliminar los vacíos (impacto SEO directo).  
2. **Verificar sitemap.xml** en navegador (confirmar que existe y es XML válido; el 403 es por el challenge).  
3. **Config de Cloudflare**: asegurar que Googlebot/IA no reciban challenge.  
4. **Meta description**: pulir el copy.  
5. **Opcional GEO**: añadir `llms.txt` y enriquecer el JSON-LD.