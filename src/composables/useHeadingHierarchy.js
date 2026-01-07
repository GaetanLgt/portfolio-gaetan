/**
 * useHeadingHierarchy - Composable pour gérer la hiérarchie des titres
 * Assure une structure H1 > H2 > H3 conforme aux guidelines A11Y
 */

import { ref, onMounted } from 'vue';

export function useHeadingHierarchy() {
  const headingErrors = ref([]);
  
  const checkHeadingHierarchy = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const errors = [];
    let currentLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      // Règles WCAG :
      // 1. Un seul H1 par page
      if (level === 1 && currentLevel === 1) {
        errors.push({
          element: heading,
          issue: 'Multiple H1 found',
          recommendation: 'Use only one H1 per page'
        });
      }
      
      // 2. Pas de saut de niveau (H1 > H3 interdit)
      if (currentLevel > 0 && level > currentLevel + 1) {
        errors.push({
          element: heading,
          issue: `Heading level jumps from H${currentLevel} to H${level}`,
          recommendation: `Use H${currentLevel + 1} instead of H${level}`
        });
      }
      
      // 3. Premier titre doit être H1
      if (index === 0 && level !== 1) {
        errors.push({
          element: heading,
          issue: `First heading is H${level}, not H1`,
          recommendation: 'First heading should be H1'
        });
      }
      
      currentLevel = level;
    });
    
    return errors;
  };
  
  const fixHeadingHierarchy = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let expectedLevel = 1;
    
    headings.forEach((heading) => {
      const currentLevel = parseInt(heading.tagName.substring(1));
      
      if (currentLevel !== expectedLevel) {
        // Créer un nouveau élément avec le bon niveau
        const newHeading = document.createElement(`h${expectedLevel}`);
        newHeading.innerHTML = heading.innerHTML;
        newHeading.className = heading.className;
        
        // Copier les attributs
        Array.from(heading.attributes).forEach(attr => {
          if (attr.name !== 'class') {
            newHeading.setAttribute(attr.name, attr.value);
          }
        });
        
        // Remplacer l'ancien
        heading.parentNode.replaceChild(newHeading, heading);
        
        console.log(`Fixed heading: H${currentLevel} → H${expectedLevel}`);
      }
      
      expectedLevel = Math.min(expectedLevel + 1, 6);
    });
  };
  
  const auditHeadings = () => {
    const errors = checkHeadingHierarchy();
    headingErrors.value = errors;
    
    if (errors.length > 0) {
      console.group('🔍 Heading Hierarchy Audit');
      errors.forEach(error => {
        console.warn(error.issue, error.element);
        console.log('💡 Recommendation:', error.recommendation);
      });
      console.groupEnd();
      
      return false;
    } else {
      console.log('✅ Heading hierarchy is correct');
      return true;
    }
  };
  
  onMounted(() => {
    // Audit automatique en dev
    if (import.meta.env.MODE === 'development') {\n      setTimeout(auditHeadings, 1000);\n    }\n  });\n  \n  return {\n    headingErrors,\n    checkHeadingHierarchy,\n    fixHeadingHierarchy,\n    auditHeadings\n  };\n}\n\n/**\n * Directive v-heading pour forcer une hiérarchie correcte\n * Usage: <h3 v-heading=\"2\">Title</h3> → Devient automatiquement H2\n */\nexport const headingDirective = {\n  mounted(el, binding) {\n    const targetLevel = binding.value;\n    const currentLevel = parseInt(el.tagName.substring(1));\n    \n    if (targetLevel && targetLevel !== currentLevel && targetLevel >= 1 && targetLevel <= 6) {\n      const newHeading = document.createElement(`h${targetLevel}`);\n      newHeading.innerHTML = el.innerHTML;\n      newHeading.className = el.className;\n      \n      // Copier les attributs\n      Array.from(el.attributes).forEach(attr => {\n        if (attr.name !== 'class') {\n          newHeading.setAttribute(attr.name, attr.value);\n        }\n      });\n      \n      el.parentNode.replaceChild(newHeading, el);\n    }\n  }\n};