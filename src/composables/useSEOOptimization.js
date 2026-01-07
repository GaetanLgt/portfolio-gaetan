/**
 * useSEOOptimization - Composable pour optimiser le SEO
 * Vérifie que tous les liens sont crawlables et optimise la structure
 */

import { onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

export function useSEOOptimization() {
  const router = useRouter();
  
  const auditLinks = () => {
    const issues = [];
    
    // Vérifier tous les liens
    const allLinks = document.querySelectorAll('a[href]');
    
    allLinks.forEach((link, index) => {
      const href = link.getAttribute('href');
      
      // Liens vides ou invalides
      if (!href || href === '#' || href === 'javascript:void(0)') {
        issues.push({
          type: 'empty-href',
          element: link,
          issue: 'Link has empty or invalid href',
          recommendation: 'Provide a valid URL or use button element'
        });
      }
      
      // Liens relatifs sans texte
      if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
        issues.push({
          type: 'no-text',
          element: link,
          issue: 'Link has no accessible text',
          recommendation: 'Add text content or aria-label'
        });
      }
      
      // Liens externes sans rel="noopener"
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        if (!link.getAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
          issues.push({
            type: 'external-no-rel',
            element: link,
            issue: 'External link without rel="noopener noreferrer"',
            recommendation: 'Add rel="noopener noreferrer" for security'
          });
        }
      }
      
      // Liens vers des routes Vue Router qui ne sont pas dans le sitemap
      if (href.startsWith('/') && !href.includes('.')) {
        const route = router.resolve(href);
        if (route.matched.length === 0) {
          issues.push({
            type: 'broken-route',
            element: link,
            issue: `Route ${href} does not exist`,
            recommendation: 'Fix the route or remove the link'
          });
        }
      }
    });
    
    return issues;
  };
  
  const fixCrawlableLinks = () => {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Fixer les liens externes
      if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
        if (!link.getAttribute('rel')) {
          link.setAttribute('rel', 'noopener noreferrer');
        }
        
        if (!link.getAttribute('target')) {
          link.setAttribute('target', '_blank');
        }
      }
      
      // Ajouter aria-label si manquant et pas de texte
      if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
        const title = link.getAttribute('title');
        if (title) {
          link.setAttribute('aria-label', title);
        }
      }
    });
  };
  
  const generateBreadcrumbs = () => {
    const currentRoute = router.currentRoute.value;
    const pathSegments = currentRoute.path.split('/').filter(Boolean);
    
    const breadcrumbs = [
      { name: 'Accueil', path: '/', current: pathSegments.length === 0 }
    ];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += '/' + segment;
      const isLast = index === pathSegments.length - 1;
      
      // Mapper les segments vers des noms lisibles
      const segmentNames = {
        'services': 'Services',
        'contact': 'Contact',
        'parcours': 'Parcours',
        'conseil': 'Conseil des Agents',
        'stack-ia': 'Stack IA Locale',
        'arkadia': 'ARKADIA',
        'mentions-legales': 'Mentions légales',
        'confidentialite': 'Confidentialité',
        'cgv': 'CGV',
        'projets': 'Projets',
        'cv': 'CV',
        'tv': 'MyTV Database',
        'zombunny': 'Zombunny',
        'arcade': 'Arcade',
        'cards': 'GL Cards',
        'memory': 'Memory',
        'terminal': 'Terminal',
        'slots': 'Stack Slots'
      };
      
      breadcrumbs.push({
        name: segmentNames[segment] || segment,
        path: currentPath,
        current: isLast
      });
    });
    
    return breadcrumbs;
  };
  
  const auditSEO = () => {
    const issues = auditLinks();
    
    if (issues.length > 0) {
      console.group('🔍 SEO Link Audit');
      issues.forEach(issue => {
        console.warn(`[${issue.type}]`, issue.issue, issue.element);
        console.log('💡', issue.recommendation);
      });
      console.groupEnd();
      
      return false;
    } else {
      console.log('✅ All links are SEO-friendly');
      return true;
    }
  };
  
  // Meta tags dynamiques
  const updateMetaTags = (config) => {
    const { title, description, keywords, canonical, ogImage } = config;
    
    // Title
    if (title) {
      document.title = title;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
    }
    
    // Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }
    
    // Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }
    
    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }
    
    // Open Graph Image
    if (ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', ogImage);
    }
  };
  
  onMounted(() => {
    nextTick(() => {
      fixCrawlableLinks();
      
      // Audit en développement
      if (import.meta.env.MODE === 'development') {
        setTimeout(auditSEO, 2000);
      }
    });
  });
  
  return {
    auditLinks,
    fixCrawlableLinks,
    generateBreadcrumbs,
    auditSEO,
    updateMetaTags
  };
}
