import EPub from 'epub2';
import { detect } from 'chardet';
import iconv from 'iconv-lite';

const EPUB_PATH = process.argv[2];
if (!EPUB_PATH) {
  console.error('用法: node debug_epub.mjs <epub文件路径>');
  process.exit(1);
}

const epub = new EPub(EPUB_PATH);

epub.on('error', (err) => { console.error('错误:', err); });
epub.on('end', async () => {
  console.log('书名:', epub.metadata.title);
  
  const chapters = epub.flow.slice(0, 2);
  for (const chapterRef of chapters) {
    if (!chapterRef.id) continue;
    
    console.log('\n===============');
    console.log('章节ID:', chapterRef.id);
    console.log('章节标题:', chapterRef.title);

    // 先用 getChapterRaw 拿到 epub2 强制 utf-8 的结果，提取编码声明
    await new Promise((resolve) => {
      epub.getChapterRaw(chapterRef.id, (err, text) => {
        if (err) { console.log('getChapterRaw 失败:', err.message); resolve(); return; }
        const xmlDecl = text.match(/<\?xml[^>]*encoding=["']([^"']+)["']/i);
        const metaCharset = text.match(/<meta[^>]+charset=["']?([^"'\s;>]+)/i);
        console.log('XML声明编码:', xmlDecl?.[1] || '未找到');
        console.log('Meta charset:', metaCharset?.[1] || '未找到');
        console.log('\n[getChapterRaw 前300字符]:', text.substring(0, 300));
        resolve();
      });
    });

    // 再用 getFile 拿原始 Buffer
    await new Promise((resolve) => {
      epub.getFile(chapterRef.id, (err, data) => {
        if (err) { console.log('getFile 失败:', err.message); resolve(); return; }
        console.log('\n[原始Buffer大小]:', data.length, '字节');
        console.log('[chardet探测编码]:', detect(data));
        console.log('\n[GBK解码前300字符]:', iconv.decode(data.slice(0, 300), 'GBK'));
        console.log('\n[UTF-8解码前300字符]:', data.slice(0, 300).toString('utf-8'));
        resolve();
      });
    });
  }
});
epub.parse();
