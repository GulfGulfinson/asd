interface Slide {
  id: string;
  title: string;
  content: any; // Will be React components instead of HTML strings
  type: 'intro' | 'content' | 'conclusion' | 'video' | 'image';
  imageUrl?: string;
  videoUrl?: string;
  duration?: number;
  notes?: string;
}

// Function to detect different content types in markdown
const detectContentType = (content: string): 'markdown' | 'html' => {
  // Check for markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headers (# ## ### etc)
    /\*\*.*?\*\*/,          // Bold (**text**)
    /\*(?!\*)[^*]+\*/,      // Italic (*text*) but not bold
    /^\s*[-*+]\s/m,         // Unordered list (- * +)
    /^\s*\d+\.\s/m,         // Ordered list (1. 2. etc)
    /^\s*>\s/m,             // Blockquotes (>)
    /\[.*?\]\(.*?\)/,       // Links [text](url)
  ];
  
  // If content has clear markdown patterns, it's markdown
  if (markdownPatterns.some(pattern => pattern.test(content))) {
    return 'markdown';
  }
  
  // Check for HTML tags
  if (/<[^>]+>/.test(content)) {
    return 'html';
  }
  
  // Default to markdown for plain text
  return 'markdown';
};

// Parse markdown content into structured data
const parseMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  const elements: any[] = [];
  let currentElement: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      // Finish current element if exists
      if (currentElement) {
        elements.push(currentElement);
        currentElement = null;
      }
      continue;
    }

    // Handle headers
    if (trimmedLine.startsWith('#')) {
      // Finish current element
      if (currentElement) {
        elements.push(currentElement);
      }
      
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        currentElement = {
          type: 'header',
          level,
          content: text
        };
      }
      continue;
    }

    // Handle unordered lists
    if (trimmedLine.match(/^[-*+]\s+/)) {
      const listItemText = trimmedLine.replace(/^[-*+]\s+/, '');
      
      if (currentElement?.type !== 'unordered_list') {
        // Finish current element and start new list
        if (currentElement) elements.push(currentElement);
        currentElement = {
          type: 'unordered_list',
          items: [listItemText]
        };
      } else {
        // Add to existing list
        currentElement.items.push(listItemText);
      }
      continue;
    }

    // Handle ordered lists
    if (trimmedLine.match(/^\d+\.\s+/)) {
      const listItemText = trimmedLine.replace(/^\d+\.\s+/, '');
      
      if (currentElement?.type !== 'ordered_list') {
        // Finish current element and start new list
        if (currentElement) elements.push(currentElement);
        currentElement = {
          type: 'ordered_list',
          items: [listItemText]
        };
      } else {
        // Add to existing list
        currentElement.items.push(listItemText);
      }
      continue;
    }

    // Handle blockquotes
    if (trimmedLine.startsWith('>')) {
      const quoteText = trimmedLine.replace(/^>\s*/, '');
      
      if (currentElement?.type !== 'blockquote') {
        if (currentElement) elements.push(currentElement);
        currentElement = {
          type: 'blockquote',
          content: quoteText
        };
      } else {
        currentElement.content += ' ' + quoteText;
      }
      continue;
    }

    // Handle regular paragraphs
    if (trimmedLine) {
      if (currentElement?.type !== 'paragraph') {
        if (currentElement) elements.push(currentElement);
        currentElement = {
          type: 'paragraph',
          content: trimmedLine
        };
    } else {
        currentElement.content += ' ' + trimmedLine;
      }
    }
  }

  // Add final element
  if (currentElement) {
    elements.push(currentElement);
  }

  return elements;
};

// Format inline markdown within text (bold, italic, links)
const formatInlineMarkdown = (text: string): any => {
  if (!text) return text;

  const parts: any[] = [];
  let currentIndex = 0;
  
  // Patterns for inline formatting (removed code pattern)
  const patterns = [
    { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
    { regex: /\*(.*?)\*/g, type: 'italic' },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' }
  ];

  let matches: any[] = [];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      matches.push({
        type: pattern.type,
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        url: match[2] || null, // For links
        fullMatch: match[0]
      });
    }
  });

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep first one)
  matches = matches.filter((match, index) => {
    if (index === 0) return true;
    const prevMatch = matches[index - 1];
    return match.start >= prevMatch.end;
  });

  if (matches.length === 0) {
    return text;
  }

  matches.forEach((match, index) => {
    // Add text before this match
    if (match.start > currentIndex) {
      parts.push(text.slice(currentIndex, match.start));
    }

    // Add the formatted match
    parts.push({
      type: match.type,
      content: match.content,
      url: match.url
    });

    currentIndex = match.end;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  return parts;
};

// Create React components for each element type
const createSlideContent = (elements: any[]) => {
  return elements.map((element, index) => {
    const key = `element-${index}`;
    
    switch (element.type) {
      case 'header':
        return {
          type: 'header',
          level: element.level,
          content: element.content,
          key
        };

      case 'paragraph':
        return {
          type: 'paragraph',
          content: formatInlineMarkdown(element.content),
          key
        };

      case 'unordered_list':
        return {
          type: 'unordered_list',
          items: element.items.map(formatInlineMarkdown),
          key
        };

      case 'ordered_list':
        return {
          type: 'ordered_list',
          items: element.items.map(formatInlineMarkdown),
          key
        };

      case 'blockquote':
        return {
          type: 'blockquote',
          content: formatInlineMarkdown(element.content),
          key
        };

      default:
        return {
          type: 'paragraph',
          content: element.content || '',
          key
        };
    }
  });
};

// Split content into sections based on headers
const splitIntoSections = (content: string) => {
  const contentType = detectContentType(content);
  
  if (contentType === 'html') {
    // Handle legacy HTML content
    return content.split(/(?=<h[23])/gi).filter(s => s.trim());
  }

  // Handle markdown content - split on horizontal rules (---) which separate slides
  const sections = content.split(/\n---\n/).filter(s => s.trim());
  
  // If no horizontal rules found, fall back to header-based splitting
  if (sections.length <= 1) {
    const lines = content.split('\n');
    const headerSections: string[] = [];
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if this is a major header (h1 or h2)
      if (trimmedLine.match(/^#{1,2}\s+/)) {
        // Save current section if it has content
        if (currentSection.trim()) {
          headerSections.push(currentSection.trim());
        }
        // Start new section
        currentSection = line + '\n';
      } else {
        // Add to current section
        currentSection += line + '\n';
      }
    }

    // Add the last section
    if (currentSection.trim()) {
      headerSections.push(currentSection.trim());
    }

    return headerSections.filter(s => s.trim());
  }

  return sections;
};

export const parseContentIntoAdvancedSlides = (content: string, lessonTitle: string): Slide[] => {
  const slides: Slide[] = [];
  const timestamp = Date.now(); // Use for unique IDs
  
  // Add dedicated animated intro slide
  slides.push({
    id: `intro-slide-${timestamp}`,
    title: lessonTitle,
    content: {
      type: 'intro-slide',
      title: lessonTitle
    },
    type: 'intro'
  });

  // Split content into sections
  const sections = splitIntoSections(content);
  
  sections.forEach((section, index) => {
    const contentType = detectContentType(section);
    
    if (contentType === 'html') {
      // Handle legacy HTML content
    const titleMatch = section.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i);
    const title = titleMatch ? titleMatch[1].trim() : `Abschnitt ${index + 1}`;
      const cleanContent = section.replace(/<h[23][^>]*>[^<]+<\/h[23]>/i, '').trim();
      
      slides.push({
        id: `slide-${index}-${timestamp}`,
        title,
        content: cleanContent, // Keep as HTML for legacy content
        type: 'content'
      });
    } else {
      // Handle markdown content for subsequent slides with new design
      const elements = parseMarkdownContent(section);
      
      if (elements.length === 0) return;

      // Extract title from first header or create default
      const titleElement = elements.find(el => el.type === 'header');
      const title = titleElement ? titleElement.content : `Abschnitt ${index + 1}`;
      
      // Remove title from content elements
      const contentElements = elements.filter(el => el !== titleElement);
      const slideContent = createSlideContent(contentElements);
    
    slides.push({
      id: `slide-${index}-${timestamp}`,
      title,
        content: {
          type: 'markdown',
          elements: slideContent
        },
        type: 'content'
      });
    }
  });

  // Add conclusion slide with new design
  slides.push({
    id: `conclusion-${timestamp}`,
    title: 'Gratulation!',
    content: {
      type: 'conclusion',
    title: 'Lektion abgeschlossen!',
      message: 'Du hast erfolgreich neue Kenntnisse erworben.'
    },
    type: 'conclusion'
  });

  return slides;
};

// Helper function to convert markdown elements to HTML
const convertMarkdownElementsToHTML = (elements: any[]): string => {
  return elements.map(element => {
    switch (element.type) {
      case 'header':
        const level = Math.min(element.level + 1, 6);
        return `<h${level}>${element.content}</h${level}>`;
      
      case 'paragraph':
        return `<p>${element.content}</p>`;
      
      case 'unordered_list':
        const listItems = element.items.map((item: string) => `<li>${item}</li>`).join('');
        return `<ul>${listItems}</ul>`;
      
      case 'ordered_list':
        const orderedItems = element.items.map((item: string) => `<li>${item}</li>`).join('');
        return `<ol>${orderedItems}</ol>`;
      
      case 'blockquote':
        return `<blockquote>${element.content}</blockquote>`;
      
      default:
        return `<p>${element.content || ''}</p>`;
    }
  }).join('\n');
};

// Keep the old function for backward compatibility
export const parseContentIntoSlides = parseContentIntoAdvancedSlides;

const slideParsers = { parseContentIntoSlides, parseContentIntoAdvancedSlides };
export default slideParsers; 