import SwiftUI

/// Typography styles matching React components exactly
public enum FType {
    
    // MARK: - Typography Styles
    
    /// 16pt semibold for section headers
    public static func title() -> Font {
        .system(size: 16, weight: .semibold)
    }
    
    /// 13pt semibold for subsections
    public static func sectionTitle() -> Font {
        .system(size: 13, weight: .semibold)
    }
    
    /// 14pt regular for row titles
    public static func rowTitle() -> Font {
        .system(size: 14, weight: .regular)
    }
    
    /// 14pt regular for row values
    public static func rowValue() -> Font {
        .system(size: 14, weight: .regular)
    }
    
    /// 12pt regular for captions
    public static func caption() -> Font {
        .system(size: 12, weight: .regular)
    }
    
    /// 12pt regular for footnotes
    public static func footnote() -> Font {
        .system(size: 12, weight: .regular)
    }
    
    // MARK: - Tracking Constants
    
    /// Tracking for row text (-0.3)
    public static func trackingRow() -> CGFloat {
        -0.3
    }
    
    /// Tracking for caption text (-0.2)
    public static func trackingCaption() -> CGFloat {
        -0.2
    }
}