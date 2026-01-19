import SwiftUI

/// Paint styles used by vector icon shapes.
public enum ChatGPTIconPaint: Sendable {
    case current
    case white
    case none

    func color(using current: Color) -> Color? {
        switch self {
        case .current:
            return current
        case .white:
            return .white
        case .none:
            return nil
        }
    }
}

/// Stroke attributes for vector icon paths.
public struct ChatGPTIconStroke: Sendable {
    let width: CGFloat
    let paint: ChatGPTIconPaint
    let lineCap: CGLineCap?
    let lineJoin: CGLineJoin?
}

/// Text alignment anchor for vector icon text shapes.
public enum ChatGPTIconTextAnchor: Sendable {
    case start
    case middle
    case end
}

/// Vector shapes used to compose icons.
public enum ChatGPTIconShape: Sendable {
    case path(d: String, fill: ChatGPTIconPaint, stroke: ChatGPTIconStroke?)
    case rect(x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, rx: CGFloat?, ry: CGFloat?, fill: ChatGPTIconPaint, stroke: ChatGPTIconStroke?)
    case circle(cx: CGFloat, cy: CGFloat, r: CGFloat, fill: ChatGPTIconPaint, stroke: ChatGPTIconStroke?)
    case text(value: String, x: CGFloat, y: CGFloat, size: CGFloat, weight: Font.Weight, anchor: ChatGPTIconTextAnchor, fill: ChatGPTIconPaint)
}

/// Vector icon definition with viewBox and shapes.
public struct ChatGPTIconVector: Sendable {
    let viewBox: CGSize
    let shapes: [ChatGPTIconShape]
}

/// Vector assets for ChatGPT icons.
public enum ChatGPTIconVectorAssets {
    public static let data: [ChatGPTIcon: ChatGPTIconVector] = [
        .alertCircle: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .circle(cx: 12.0, cy: 12.0, r: 9.0, fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M12 8V12M12 15V16", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .alertCircleFilled: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .circle(cx: 12.0, cy: 12.0, r: 9.0, fill: .current, stroke: nil),
            .path(d: "M12 8V12M12 15V16", fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .white, lineCap: .round, lineJoin: nil)),
        ]),
        .apple: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M15.5 13.5C15.5 13.5 15.8 15.7 17.5 16C17.5 16 15.8 21 13.5 21C12.5 21 12 20.5 11.2 20.5C10.3 20.5 9.5 21 8.8 21C6.2 21 3.5 16.2 3.5 12.5C3.5 9.5 5.3 8 7 8C8 8 9 8.5 9.7 8.5C10.3 8.5 11.5 8 12.8 8C13.7 8 16.3 8.2 17.5 11C17.5 11 15.5 11.8 15.5 13.5ZM12.8 5.8C12.8 5.8 13.3 4.3 14.5 3.5C15.5 2.8 16.8 3 17 3C17 3 17 4.3 16 5.5C15 6.7 13.8 6.5 13.5 6.5C13.3 6.5 12.8 6.2 12.8 5.8Z", fill: .current, stroke: nil),
        ]),
        .badge: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: .round)),
        ]),
        .badgeFilled: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z", fill: .current, stroke: nil),
        ]),
        .batteryFull: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 2.0, y: 7.0, width: 18.0, height: 10.0, rx: 2.0, ry: nil, fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .rect(x: 22.0, y: 10.0, width: 2.0, height: 4.0, rx: 1.0, ry: nil, fill: .current, stroke: nil),
        ]),
        .batteryHalf: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 2.0, y: 7.0, width: 18.0, height: 10.0, rx: 2.0, ry: nil, fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .rect(x: 4.0, y: 9.0, width: 8.0, height: 6.0, rx: 1.0, ry: nil, fill: .current, stroke: nil),
            .rect(x: 22.0, y: 10.0, width: 2.0, height: 4.0, rx: 1.0, ry: nil, fill: .current, stroke: nil),
        ]),
        .batteryLow: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 2.0, y: 7.0, width: 18.0, height: 10.0, rx: 2.0, ry: nil, fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .rect(x: 4.0, y: 9.0, width: 3.0, height: 6.0, rx: 1.0, ry: nil, fill: .current, stroke: nil),
            .rect(x: 22.0, y: 10.0, width: 2.0, height: 4.0, rx: 1.0, ry: nil, fill: .current, stroke: nil),
        ]),
        .bluetooth: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2L7 7V10L12 5L17 10V7L12 2ZM7 14V17L12 22L17 17V14L12 19L7 14ZM12 5L7 10V14L12 19L17 14V10L12 5Z", fill: .current, stroke: nil),
            .path(d: "M7 10L17 14M17 10L7 14", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .white, lineCap: .round, lineJoin: nil)),
        ]),
        .checkbox: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 3.0, y: 3.0, width: 18.0, height: 18.0, rx: 4.0, ry: nil, fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
        ]),
        .checkboxChecked: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 3.0, y: 3.0, width: 18.0, height: 18.0, rx: 4.0, ry: nil, fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 12L11 15L16 9", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .white, lineCap: .round, lineJoin: .round)),
        ]),
        .checkboxIndeterminate: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 3.0, y: 3.0, width: 18.0, height: 18.0, rx: 4.0, ry: nil, fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .rect(x: 7.0, y: 11.0, width: 10.0, height: 2.0, rx: nil, ry: nil, fill: .white, stroke: nil),
        ]),
        .keyAmpersand: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M10 16C8 16 7 14 7 13C7 11 9 9 10 9L14 15L16 16", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: .round)),
            .circle(cx: 10.0, cy: 10.0, r: 2.0, fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 14.0, cy: 15.0, r: 2.0, fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: nil, lineJoin: nil)),
        ]),
        .keyArrowDown: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M8 13L12 9H10V4H6V9H4L8 13Z", fill: .current, stroke: nil),
        ]),
        .keyArrowLeft: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M3 8L7 4V6H12V10H7V12L3 8Z", fill: .current, stroke: nil),
        ]),
        .keyArrowRight: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M13 8L9 12V10H4V6H9V4L13 8Z", fill: .current, stroke: nil),
        ]),
        .keyArrowUp: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M8 3L4 7H6V12H10V7H12L8 3Z", fill: .current, stroke: nil),
        ]),
        .keyAsterisk: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M12 7V17M8 9L16 15M16 9L8 15", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyAt: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 10.0, cy: 13.0, r: 3.0, fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M16 10V13C16 14 16.5 15 17.5 15C18.5 15 19 14 19 13V10", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: nil)),
            .path(d: "M13 10V16", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyBackslash: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M15 7L9 17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyBackspace: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M22 10H14L10 14L7 16L10 18L14 18H22V10ZM9 16L11 14.5L9 13V16Z", fill: .current, stroke: nil),
        ]),
        .keyBacktick: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 9L6 12L8 15", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
            .path(d: "M12 9L10 12L12 15", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyBraceLeft: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M10 7V10C10 11 10 12 12 12C10 12 10 13 10 14V17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyBraceRight: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M14 7V10C14 11 14 12 12 12C14 12 14 13 14 14V17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyBracketLeft: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M9 7V17M9 7H14M9 17H14", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyBracketRight: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M15 7V17M15 7H10M15 17H10", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyCapsLock: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 18V14H10V12H12V10H14V8H18V10H20V12H22V14H24V18H22V16H20V14H18V12H14V14H12V16H10V18H8ZM10 20H22V22H10V20Z", fill: .current, stroke: nil),
        ]),
        .keyCaret: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 10L12 15L17 10", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
            .path(d: "M7 14L12 19L17 14", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyColon: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 12.0, cy: 10.0, r: 1.5, fill: .current, stroke: nil),
            .circle(cx: 12.0, cy: 14.0, r: 1.5, fill: .current, stroke: nil),
        ]),
        .keyComma: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M10 10L12 10L10 14V16", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyCommand: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 13C7 11.3431 8.34315 10 10 10H12C13.6569 10 15 11.3431 15 13V15H17V13C17 11.3431 18.3431 10 20 10H22C23.6569 10 25 11.3431 25 13V15C25 16.6569 23.6569 18 22 18H20V20C20 21.6569 18.6569 23 17 23H15C13.3431 23 12 21.6569 12 20V18H10C8.34315 18 7 16.6569 7 15V13ZM10 12C9.44772 12 9 12.4477 9 13V15C9 15.5523 9.44772 16 10 16H12V13C12 12.4477 11.5523 12 11 12H10ZM20 13V16H22C22.5523 16 23 15.5523 23 15V13C23 12.4477 22.5523 12 22 12H20C19.4477 12 19 12.4477 19 13H20V16H19V18H17V16H18V13H19V13C19 12.4477 19.4477 12 20 12ZM14 20C14 20.5523 14.4477 21 15 21H17C17.5523 21 18 20.5523 18 20V18H14V20Z", fill: .current, stroke: nil),
        ]),
        .keyControl: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 12H24V14H18V16H24V18H18V20H24V22H8V20H14V18H8V16H14V14H8V12Z", fill: .current, stroke: nil),
        ]),
        .keyDelete: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M10 10V22H22V10H10ZM12 12H20V20H12V12ZM8 8H24V10H8V8Z", fill: .current, stroke: nil),
        ]),
        .keyDollar: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M12 6V18M9 9C9 9 9 7 12 7C15 7 15 9 15 9C15 11 9 11 9 13C9 15 15 15 15 13C15 13 15 17 12 17C9 17 9 15 9 15", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyDoubleQuote: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 10V14L9 13M13 10V14L14 13", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyDown: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M8 12L12 8H10V4H6V8H4L8 12Z", fill: .current, stroke: nil),
        ]),
        .keyEnd: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M8 12L12 8H10V4H6V8H4L8 12Z", fill: .current, stroke: nil),
        ]),
        .keyEnter: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M5 16H13L16 13M13 16L16 13M16 13V9", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyEquals: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 9H17M7 15H17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyEscape: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M10.5 14V12H13.5L15.5 15.5L17.5 12H20.5V14H18.5V15.5H20.5V17.5H18.5V19H17V17H15.5V19H14V17H12V19H10.5V17H12.5V15.5H10.5V14H12.5V12L10.5 14Z", fill: .current, stroke: nil),
        ]),
        .keyExclamation: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M12 7V14M12 16V17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyFn: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .text(value: "fn", x: 12.0, y: 17.0, size: 12.0, weight: .bold, anchor: .middle, fill: .current),
        ]),
        .keyHash: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 8H17M7 12H17M7 16H17M9 7V17M15 7V17", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyHome: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M8 4L4 8H6V12H10V8H12L8 4Z", fill: .current, stroke: nil),
        ]),
        .keyLeft: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M4 8L8 4V6H12V10H8V12L4 8Z", fill: .current, stroke: nil),
        ]),
        .keyLeftAlt: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .text(value: "Alt", x: 12.0, y: 16.0, size: 9.0, weight: .semibold, anchor: .middle, fill: .current),
        ]),
        .keyLeftMeta: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 8H9V10H7V8ZM7 11H9V13H7V11ZM7 14H9V16H7V14ZM10 8H14V10H10V8ZM10 11H14V13H10V11ZM10 14H14V16H10V14ZM15 8H17V10H15V8ZM15 11H17V13H15V11ZM15 14H17V16H15V14Z", fill: .current, stroke: nil),
        ]),
        .keyLeftWindows: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M5 9L9 8V12L5 13V9ZM10 8L14 7V12L10 13V8ZM15 7L19 6V12L15 13V7ZM5 14L9 13V17L5 18V14ZM10 13L14 12V17L10 18V13ZM15 12L19 11V17L15 18V12Z", fill: .current, stroke: nil),
        ]),
        .keyMinus: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 12H17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyOption: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M16 8C16 8 12 12 12 16C12 20 16 24 16 24C16 24 20 20 20 16C20 12 16 8 16 8ZM16 10C16 10 14 13 14 16C14 19 16 22 16 22C16 22 18 19 18 16C18 13 16 10 16 10Z", fill: .current, stroke: nil),
        ]),
        .keyPageDown: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M4 6V10H6V8H10V10H12V6H4ZM4 4H12V5H4V4Z", fill: .current, stroke: nil),
        ]),
        .keyPageUp: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M4 10V6H6V8H10V6H12V10H4ZM4 11H12V12H4V11Z", fill: .current, stroke: nil),
        ]),
        .keyParenLeft: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M9 7C9 7 14 8 14 12C14 16 9 17 9 17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyParenRight: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M15 7C15 7 10 8 10 12C10 16 15 17 15 17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyPercent: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 9.0, cy: 9.0, r: 1.5, fill: .current, stroke: nil),
            .circle(cx: 15.0, cy: 15.0, r: 1.5, fill: .current, stroke: nil),
            .path(d: "M15 9L9 15", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyPeriod: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 12.0, cy: 13.0, r: 2.0, fill: .current, stroke: nil),
        ]),
        .keyPipe: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M12 8V16", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyPlus: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 12H17M12 7V17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyQuestion: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M9 10C9 8 10 7 12 7C14 7 15 8 15 10C15 11 14 12 12 13V14M12 16V17", fill: .none, stroke: ChatGPTIconStroke(width: 1.5, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyQuote: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 10V14L9 13M15 10V14L16 13", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .keyReturn: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 10V16C8 18.2091 9.79086 20 12 20H22V18H12C10.8954 18 10 17.1046 10 16V10H8ZM22 10V14H24V10H22ZM19 12L22 10L19 8V12Z", fill: .current, stroke: nil),
        ]),
        .keyRight: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M12 8L8 12V10H4V6H8V4L12 8Z", fill: .current, stroke: nil),
        ]),
        .keyRightAlt: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .text(value: "Alt", x: 12.0, y: 16.0, size: 9.0, weight: .semibold, anchor: .middle, fill: .current),
        ]),
        .keyRightMeta: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 8H9V10H7V8ZM7 11H9V13H7V11ZM7 14H9V16H7V14ZM10 8H14V10H10V8ZM10 11H14V13H10V11ZM10 14H14V16H10V14ZM15 8H17V10H15V8ZM15 11H17V13H15V11ZM15 14H17V16H15V14Z", fill: .current, stroke: nil),
        ]),
        .keyRightWindows: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M5 9L9 8V12L5 13V9ZM10 8L14 7V12L10 13V8ZM15 7L19 6V12L15 13V7ZM5 14L9 13V17L5 18V14ZM10 13L14 12V17L10 18V13ZM15 12L19 11V17L15 18V12Z", fill: .current, stroke: nil),
        ]),
        .keySemicolon: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 11.0, cy: 14.0, r: 1.5, fill: .current, stroke: nil),
            .path(d: "M11 9V10", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyShift: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M9 20V12L16 6L23 12V20H20V15H12V20H9Z", fill: .current, stroke: nil),
        ]),
        .keySlash: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M9 17L15 7", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keySpace: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .rect(x: 4.0, y: 12.0, width: 24.0, height: 8.0, rx: 2.0, ry: nil, fill: .current, stroke: nil),
        ]),
        .keyTab: ChatGPTIconVector(viewBox: CGSize(width: 32, height: 32), shapes: [
            .rect(x: 0, y: 0, width: 32.0, height: 32.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M9 10L15 16L9 22H11.5L16.5 17H23V15H16.5L11.5 10H9Z", fill: .current, stroke: nil),
        ]),
        .keyUnderscore: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .rect(x: 0, y: 0, width: 24.0, height: 24.0, rx: 4.0, ry: nil, fill: .white, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M7 16H17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .keyUp: ChatGPTIconVector(viewBox: CGSize(width: 16, height: 16), shapes: [
            .path(d: "M8 4L4 8H6V12H10V8H12L8 4Z", fill: .current, stroke: nil),
        ]),
        .notification: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2C10.9 2 10 2.9 10 4V4.3C8.5 4.9 7.5 6.3 7.1 8L6.5 11C6.2 12.5 5 13.7 3.5 14V16H20.5V14C19 13.7 17.8 12.5 17.5 11L16.9 8C16.5 6.3 15.5 4.9 14 4.3V4C14 2.9 13.1 2 12 2Z", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: .round)),
            .path(d: "M9 16C9 17.7 10.3 19 12 19C13.7 19 15 17.7 15 16", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
        ]),
        .notificationFilled: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2C10.9 2 10 2.9 10 4V4.3C8.5 4.9 7.5 6.3 7.1 8L6.5 11C6.2 12.5 5 13.7 3.5 14V16H20.5V14C19 13.7 17.8 12.5 17.5 11L16.9 8C16.5 6.3 15.5 4.9 14 4.3V4C14 2.9 13.1 2 12 2Z", fill: .current, stroke: nil),
            .path(d: "M9 16C9 17.7 10.3 19 12 19C13.7 19 15 17.7 15 16", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
        ]),
        .radio: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .circle(cx: 12.0, cy: 12.0, r: 9.0, fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
        ]),
        .radioChecked: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .circle(cx: 12.0, cy: 12.0, r: 9.0, fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 12.0, cy: 12.0, r: 4.0, fill: .white, stroke: nil),
        ]),
        .refreshCcw: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C10.3431 16 8.93125 15.1372 8.14325 13.8289", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
            .path(d: "M8 17V14H11", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .refreshCw: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .path(d: "M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C13.6569 8 15.0688 8.86276 15.8568 10.1711", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
            .path(d: "M16 7V10H13", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: .round)),
        ]),
        .shield: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2L3 5V11C3 16.5 6.8 21.5 12 23C17.2 21.5 21 16.5 21 11V5L12 2Z", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: .round)),
        ]),
        .shieldChecked: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2L3 5V11C3 16.5 6.8 21.5 12 23C17.2 21.5 21 16.5 21 11V5L12 2Z", fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: .round)),
            .path(d: "M8 12L11 15L16 9", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .white, lineCap: .round, lineJoin: .round)),
        ]),
        .shieldError: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2L3 5V11C3 16.5 6.8 21.5 12 23C17.2 21.5 21 16.5 21 11V5L12 2Z", fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: .round)),
            .path(d: "M9 9L15 15M15 9L9 15", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .white, lineCap: .round, lineJoin: nil)),
        ]),
        .shieldWarning: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 2L3 5V11C3 16.5 6.8 21.5 12 23C17.2 21.5 21 16.5 21 11V5L12 2Z", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: .round)),
            .path(d: "M12 8V13M12 16V17", fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: .round, lineJoin: nil)),
        ]),
        .toggleOff: ChatGPTIconVector(viewBox: CGSize(width: 44, height: 24), shapes: [
            .rect(x: 2.0, y: 2.0, width: 40.0, height: 20.0, rx: 10.0, ry: nil, fill: .none, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 12.0, cy: 12.0, r: 8.0, fill: .current, stroke: nil),
        ]),
        .toggleOn: ChatGPTIconVector(viewBox: CGSize(width: 44, height: 24), shapes: [
            .rect(x: 2.0, y: 2.0, width: 40.0, height: 20.0, rx: 10.0, ry: nil, fill: .current, stroke: ChatGPTIconStroke(width: 2.0, paint: .current, lineCap: nil, lineJoin: nil)),
            .circle(cx: 32.0, cy: 12.0, r: 8.0, fill: .white, stroke: nil),
        ]),
        .wifi: ChatGPTIconVector(viewBox: CGSize(width: 24, height: 24), shapes: [
            .path(d: "M12 18C13.1 18 14 18.9 14 20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20C10 18.9 10.9 18 12 18ZM12 14C14.8 14 17.3 15.2 19.1 17.1L17.7 18.5C16.3 17.1 14.3 16.2 12 16.2C9.7 16.2 7.7 17.1 6.3 18.5L4.9 17.1C6.7 15.2 9.2 14 12 14ZM12 10C15.7 10 19.1 11.3 21.8 13.6L20.4 15C18.1 13 15.2 11.9 12 11.9C8.8 11.9 5.9 13 3.6 15L2.2 13.6C4.9 11.3 8.3 10 12 10ZM12 6C16.6 6 20.9 7.5 24.5 10.1L23.1 11.5C19.9 9.2 16.1 7.9 12 7.9C7.9 7.9 4.1 9.2 0.9 11.5L-0.5 10.1C3.1 7.5 7.4 6 12 6Z", fill: .current, stroke: nil),
        ]),    ]
}

struct ChatGPTIconVectorView: View {
    let vector: ChatGPTIconVector
    let size: CGSize
    let color: Color

    var body: some View {
        GeometryReader { geo in
            let scale = min(geo.size.width / vector.viewBox.width, geo.size.height / vector.viewBox.height)
            let xOffset = (geo.size.width - vector.viewBox.width * scale) / 2
            let yOffset = (geo.size.height - vector.viewBox.height * scale) / 2
            ZStack(alignment: .topLeading) {
                ForEach(vector.shapes.indices, id: \.self) { index in
                    shapeView(vector.shapes[index], scale: scale)
                        .offset(x: xOffset, y: yOffset)
                }
            }
        }
        .frame(width: size.width, height: size.height)
    }

    @ViewBuilder
    private func shapeView(_ shape: ChatGPTIconShape, scale: CGFloat) -> some View {
        switch shape {
        case let .path(d, fill, stroke):
            let path = SVGPathParser.parse(d).applying(CGAffineTransform(scaleX: scale, y: scale))
            ZStack {
                if let fillColor = fill.color(using: color) {
                    path.fill(fillColor)
                }
                if let stroke, let strokeColor = stroke.paint.color(using: color) {
                    path.stroke(
                        strokeColor,
                        style: StrokeStyle(
                            lineWidth: stroke.width * scale,
                            lineCap: stroke.lineCap ?? .butt,
                            lineJoin: stroke.lineJoin ?? .miter
                        )
                    )
                }
            }
        case let .rect(x, y, width, height, rx, ry, fill, stroke):
            let rect = CGRect(x: x, y: y, width: width, height: height)
            let path = Path(roundedRect: rect, cornerSize: CGSize(width: rx ?? 0, height: ry ?? rx ?? 0))
                .applying(CGAffineTransform(scaleX: scale, y: scale))
            ZStack {
                if let fillColor = fill.color(using: color) {
                    path.fill(fillColor)
                }
                if let stroke, let strokeColor = stroke.paint.color(using: color) {
                    path.stroke(
                        strokeColor,
                        style: StrokeStyle(
                            lineWidth: stroke.width * scale,
                            lineCap: stroke.lineCap ?? .butt,
                            lineJoin: stroke.lineJoin ?? .miter
                        )
                    )
                }
            }
        case let .circle(cx, cy, r, fill, stroke):
            let rect = CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2)
            let path = Path(ellipseIn: rect).applying(CGAffineTransform(scaleX: scale, y: scale))
            ZStack {
                if let fillColor = fill.color(using: color) {
                    path.fill(fillColor)
                }
                if let stroke, let strokeColor = stroke.paint.color(using: color) {
                    path.stroke(
                        strokeColor,
                        style: StrokeStyle(
                            lineWidth: stroke.width * scale,
                            lineCap: stroke.lineCap ?? .butt,
                            lineJoin: stroke.lineJoin ?? .miter
                        )
                    )
                }
            }
        case let .text(value, x, y, size, weight, anchor, fill):
            if let fillColor = fill.color(using: color) {
                Text(value)
                    .font(.system(size: size * scale, weight: weight))
                    .foregroundStyle(fillColor)
                    .position(x: x * scale, y: y * scale)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: alignment(for: anchor))
            }
        }
    }

    private func alignment(for anchor: ChatGPTIconTextAnchor) -> Alignment {
        switch anchor {
        case .start:
            return .leading
        case .middle:
            return .center
        case .end:
            return .trailing
        }
    }
}
