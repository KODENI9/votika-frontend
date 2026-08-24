export default async function handler(req, res) {
  const { id } = req.query;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  
  try {
    // 1. Fetch creator data from your Fly.io backend
    const apiRes = await fetch(`https://votika-backend.fly.dev/api/creators/${id}`);
    const creatorResp = await apiRes.json();
    const creator = creatorResp.data;

    // 2. Fetch the original index.html from Vercel
    const htmlRes = await fetch(`${protocol}://${host}/index.html`);
    let html = await htmlRes.text();

    // 3. Inject Open Graph tags if creator exists
    if (creator) {
      const title = `Votez pour ${creator.displayName} sur Votika !`;
      const description = creator.bio || `Soutenez ${creator.displayName} dans la compétition avec Votika.`;
      const image = creator.avatarUrl || 'https://ui-avatars.com/api/?background=e85d04&color=fff&size=512&name=' + encodeURIComponent(creator.displayName);

      // Replace generic title
      html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
      
      // Inject OG and Twitter tags
      const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="profile" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
`;
      
      html = html.replace('<head>', `<head>\n${ogTags}`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Cache at edge to keep it fast
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error generating OG tags:', error);
    // Fallback: just redirect to index.html
    return res.redirect('/');
  }
}
