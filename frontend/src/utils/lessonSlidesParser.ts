interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'intro' | 'content' | 'conclusion' | 'video' | 'image';
  imageUrl?: string;
  videoUrl?: string;
  duration?: number;
  notes?: string;
}

export const parseContentIntoSlides = (content: string, lessonTitle: string): Slide[] => {
  const slides: Slide[] = [];
  
  // Split content by major headings (h2, h3)
  const sections = content.split(/(?=<h[23])/gi);
  
  // Add an introduction slide based on the lesson title
  slides.push({
    id: 'intro',
    title: 'Willkommen zum Thema',
    content: `<div class="text-center">
      <h3 class="text-2xl font-semibold mb-4">${lessonTitle}</h3>
      <p class="text-lg text-gray-600">Lass uns gemeinsam in dieses spannende Thema eintauchen!</p>
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800">📚 Klicke dich durch die einzelnen Folien und lerne in deinem eigenen Tempo.</p>
      </div>
    </div>`,
    type: 'intro'
  });

  sections.forEach((section, index) => {
    if (!section.trim()) return;
    
    // Extract title from heading tags
    const titleMatch = section.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i);
    const title = titleMatch ? titleMatch[1].trim() : `Abschnitt ${index + 1}`;
    
    // Remove the heading from content to avoid duplication
    let cleanContent = section.replace(/<h[23][^>]*>[^<]+<\/h[23]>/i, '').trim();
    
    // Check if content contains images
    const imageMatch = cleanContent.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    const hasImage = !!imageMatch;
    
    // Check if content contains video
    const videoMatch = cleanContent.match(/<iframe[^>]+src="([^"]+)"[^>]*>|<video[^>]+src="([^"]+)"[^>]*>/i);
    const hasVideo = !!videoMatch;
    
    // Determine slide type and extract media URLs
    let slideType: 'content' | 'image' | 'video' = 'content';
    let imageUrl: string | undefined;
    let videoUrl: string | undefined;
    
    if (hasVideo) {
      slideType = 'video';
      videoUrl = videoMatch[1] || videoMatch[2];
    } else if (hasImage) {
      slideType = 'image';
      imageUrl = imageMatch[1];
    }
    
    // Split long content into multiple slides if needed
    const paragraphs = cleanContent.split('</p>').filter(p => p.trim());
    
    if (paragraphs.length > 4) {
      // Split into multiple slides for better readability
      const chunkedParagraphs = chunkArray(paragraphs, 3);
      
      chunkedParagraphs.forEach((chunk, chunkIndex) => {
        const chunkContent = chunk.join('</p>') + '</p>';
        const slideTitle = chunkIndex === 0 ? title : `${title} (Teil ${chunkIndex + 1})`;
        
        slides.push({
          id: `slide-${index}-${chunkIndex}`,
          title: slideTitle,
          content: chunkContent,
          type: chunkIndex === 0 ? slideType : 'content',
          imageUrl: chunkIndex === 0 ? imageUrl : undefined,
          videoUrl: chunkIndex === 0 ? videoUrl : undefined,
        });
      });
    } else {
      slides.push({
        id: `slide-${index}`,
        title,
        content: cleanContent,
        type: slideType,
        imageUrl,
        videoUrl,
      });
    }
  });

  // Add a summary/conclusion slide
  slides.push({
    id: 'conclusion',
    title: 'Zusammenfassung',
    content: `<div class="text-center">
      <h3 class="text-2xl font-semibold mb-4">Großartig! Du hast die Lektion abgeschlossen!</h3>
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
        <div class="flex items-center justify-center mb-4">
          <div class="bg-green-500 rounded-full p-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <p class="text-green-800 font-medium">Du hast erfolgreich neues Wissen erworben!</p>
        <p class="text-green-600 mt-2">Vergiss nicht, das Gelernte zu wiederholen und zu üben.</p>
      </div>
      <div class="mt-6 text-sm text-gray-600">
        <p>💡 Tipp: Teste dein Wissen mit dem Quiz oder entdecke weitere spannende Lektionen!</p>
      </div>
    </div>`,
    type: 'conclusion'
  });

  return slides;
};

// Helper function to chunk array into smaller arrays
const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Enhanced parser for more sophisticated content splitting
export const parseContentIntoAdvancedSlides = (content: string, lessonTitle: string): Slide[] => {
  const slides: Slide[] = [];
  
  // Introduction slide
  slides.push({
    id: 'intro',
    title: 'Einführung',
    content: `<div class="text-center space-y-6">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 class="text-3xl font-bold mb-2">${lessonTitle}</h2>
        <p class="text-blue-100">Bereit für eine neue Lernerfahrung?</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="text-blue-600 font-semibold">📖 Interaktiv</div>
          <p class="text-sm text-gray-600">Klicke dich durch die Folien</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="text-green-600 font-semibold">⏱️ Flexibel</div>
          <p class="text-sm text-gray-600">Lerne in deinem Tempo</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="text-purple-600 font-semibold">🎯 Strukturiert</div>
          <p class="text-sm text-gray-600">Klare Lernziele</p>
        </div>
      </div>
    </div>`,
    type: 'intro'
  });

  // Parse content sections
  const sections = content.split(/(?=<h[23])/gi).filter(s => s.trim());
  
  sections.forEach((section, index) => {
    // Extract and clean title
    const titleMatch = section.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i);
    const title = titleMatch ? titleMatch[1].trim() : `Abschnitt ${index + 1}`;
    
    // Clean content
    let cleanContent = section.replace(/<h[23][^>]*>[^<]+<\/h[23]>/i, '').trim();
    
    // Enhanced content processing
    cleanContent = enhanceContentForSlides(cleanContent);
    
    // Detect media
    const imageMatch = cleanContent.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    const videoMatch = cleanContent.match(/<iframe[^>]+src="([^"]+)"|<video[^>]+src="([^"]+)"/i);
    
    slides.push({
      id: `slide-${index}`,
      title,
      content: cleanContent,
      type: videoMatch ? 'video' : imageMatch ? 'image' : 'content',
      imageUrl: imageMatch?.[1],
      videoUrl: videoMatch?.[1] || videoMatch?.[2],
    });
  });

  // Conclusion slide
  slides.push({
    id: 'conclusion',
    title: 'Lektion abgeschlossen!',
    content: `<div class="text-center space-y-6">
      <div class="bg-gradient-to-r from-green-400 to-blue-500 text-white p-8 rounded-lg">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold mb-2">Herzlichen Glückwunsch!</h2>
        <p class="text-green-100">Du hast die Lektion erfolgreich abgeschlossen</p>
      </div>
      
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-yellow-800 mb-2">📈 Dein Fortschritt</h3>
        <p class="text-yellow-700">Diese Lektion wurde zu deinem Lernfortschritt hinzugefügt!</p>
      </div>
      
      <div class="text-sm text-gray-600 space-y-2">
        <p>🧠 <strong>Nächste Schritte:</strong></p>
        <p>• Teste dein Wissen mit einem Quiz</p>
        <p>• Entdecke verwandte Lektionen</p>
        <p>• Teile dein neues Wissen mit anderen</p>
      </div>
    </div>`,
    type: 'conclusion'
  });

  return slides;
};

// Function to enhance content formatting for better slide presentation
const enhanceContentForSlides = (content: string): string => {
  // Add better spacing and formatting
  content = content.replace(/<p>/g, '<p class="mb-4 text-gray-700 leading-relaxed">');
  content = content.replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 mb-4">');
  content = content.replace(/<ol>/g, '<ol class="list-decimal list-inside space-y-2 mb-4">');
  content = content.replace(/<li>/g, '<li class="text-gray-700">');
  content = content.replace(/<strong>/g, '<strong class="font-semibold text-gray-900">');
  content = content.replace(/<em>/g, '<em class="italic text-gray-800">');
  
  // Add highlight boxes for important content
  content = content.replace(
    /(<p[^>]*>.*?(?:wichtig|important|note|hinweis).*?<\/p>)/gi,
    '<div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">$1</div>'
  );
  
  return content;
};

const slideParsers = { parseContentIntoSlides, parseContentIntoAdvancedSlides };
export default slideParsers; 