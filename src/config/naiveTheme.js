/**
 * Naive UI Theme Configuration
 * Thème dark personnalisé pour GL Digital Lab
 */
import { darkTheme } from 'naive-ui'

export const glThemeOverrides = {
  common: {
    primaryColor: '#06B6D4',
    primaryColorHover: '#22D3EE',
    primaryColorPressed: '#0891B2',
    primaryColorSuppl: '#06B6D4',
    
    infoColor: '#3B82F6',
    successColor: '#10B981',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    
    textColorBase: '#F5F5F5',
    textColor1: '#F5F5F5',
    textColor2: '#A3A3A3',
    textColor3: '#737373',
    
    bodyColor: '#0A0A0A',
    cardColor: '#111111',
    modalColor: '#111111',
    popoverColor: '#1A1A1A',
    tableColor: '#111111',
    inputColor: 'rgba(0,0,0,0.3)',
    
    borderColor: 'rgba(255,255,255,0.1)',
    dividerColor: 'rgba(255,255,255,0.08)',
    
    borderRadius: '8px',
    borderRadiusSmall: '4px',
    
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Fira Code', monospace",
    
    fontSize: '14px',
    fontSizeMini: '12px',
    fontSizeTiny: '12px',
    fontSizeSmall: '13px',
    fontSizeMedium: '14px',
    fontSizeLarge: '15px',
    fontSizeHuge: '16px',
    
    heightMini: '28px',
    heightTiny: '32px',
    heightSmall: '36px',
    heightMedium: '40px',
    heightLarge: '44px',
    heightHuge: '48px',
    
    boxShadow1: '0 1px 2px rgba(0, 0, 0, 0.3)',
    boxShadow2: '0 4px 6px rgba(0, 0, 0, 0.4)',
    boxShadow3: '0 10px 25px rgba(0, 0, 0, 0.5)',
  },
  
  Button: {
    textColorPrimary: '#0A0A0A',
    colorPrimary: '#06B6D4',
    colorHoverPrimary: '#22D3EE',
    colorPressedPrimary: '#0891B2',
    borderRadiusMedium: '8px',
    fontWeightStrong: '600',
  },
  
  Card: {
    color: 'rgba(255,255,255,0.02)',
    colorModal: '#111111',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    paddingMedium: '20px',
    paddingLarge: '24px',
  },
  
  Collapse: {
    titleTextColor: '#F5F5F5',
    textColor: '#A3A3A3',
    dividerColor: 'rgba(255,255,255,0.08)',
    arrowColor: '#737373',
    itemMargin: '8px 0 0 0',
  },
  
  Tag: {
    borderRadius: '16px',
    colorBordered: 'transparent',
    textColorPrimary: '#06B6D4',
    borderPrimary: '1px solid rgba(6, 182, 212, 0.4)',
  },
  
  Badge: {
    color: '#EF4444',
    fontSize: '12px',
  },
  
  Modal: {
    color: '#111111',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
  },
  
  Form: {
    labelTextColor: '#A3A3A3',
    feedbackTextColorError: '#EF4444',
    feedbackTextColorWarning: '#F59E0B',
  },
  
  Input: {
    color: 'rgba(0,0,0,0.3)',
    colorFocus: 'rgba(0,0,0,0.4)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderColorFocus: '#06B6D4',
    placeholderColor: '#737373',
    textColor: '#F5F5F5',
    borderRadius: '8px',
  },
  
  Select: {
    peers: {
      InternalSelection: {
        color: 'rgba(0,0,0,0.3)',
        borderColor: 'rgba(255,255,255,0.1)',
        textColor: '#F5F5F5',
      }
    }
  },
  
  Tabs: {
    tabTextColorLine: '#A3A3A3',
    tabTextColorActiveLine: '#06B6D4',
    tabTextColorHoverLine: '#22D3EE',
    barColor: '#06B6D4',
    tabBorderColor: 'rgba(255,255,255,0.08)',
  },
  
  Rate: {
    itemColor: '#737373',
    itemColorActive: '#FBBF24',
  },
  
  Progress: {
    fillColor: '#06B6D4',
    railColor: 'rgba(255,255,255,0.1)',
  },
  
  Timeline: {
    circleBorder: '2px solid #06B6D4',
    lineColor: 'rgba(255,255,255,0.1)',
    titleTextColor: '#F5F5F5',
    contentTextColor: '#A3A3A3',
  },
  
  Statistic: {
    labelTextColor: '#737373',
    valueTextColor: '#F5F5F5',
  },
  
  Tooltip: {
    color: '#1A1A1A',
    textColor: '#F5F5F5',
  },
  
  Message: {
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    colorWarning: '#F59E0B',
    colorInfo: '#3B82F6',
  },
}

export { darkTheme }
export default glThemeOverrides
