import SwiftUI

/// Identifiers for bundled ChatGPT icons.
public enum ChatGPTIcon: String, CaseIterable, Identifiable, Hashable {
    case agent = "agent"
    case alertCircle = "alertCircle"
    case alertCircleFilled = "alertCircleFilled"
    case apiKey = "apiKey"
    case apiKeyAdmin = "apiKeyAdmin"
    case apiKeyPlus = "apiKeyPlus"
    case apiKeyServiceAccount = "apiKeyServiceAccount"
    case apiKeys = "apiKeys"
    case apple = "apple"
    case archive = "archive"
    case arrowBottomLeftSm = "arrowBottomLeftSm"
    case arrowBottomRightSm = "arrowBottomRightSm"
    case arrowCurvedLeft = "arrowCurvedLeft"
    case arrowCurvedRight = "arrowCurvedRight"
    case arrowCurvedRightXs = "arrowCurvedRightXs"
    case arrowDownLg = "arrowDownLg"
    case arrowDownSm = "arrowDownSm"
    case arrowLeftLg = "arrowLeftLg"
    case arrowLeftSm = "arrowLeftSm"
    case arrowRightLg = "arrowRightLg"
    case arrowRightSm = "arrowRightSm"
    case arrowRotateCcw = "arrowRotateCcw"
    case arrowRotateCw = "arrowRotateCw"
    case arrowTopLeftSm = "arrowTopLeftSm"
    case arrowTopRightSm = "arrowTopRightSm"
    case arrowUpLg = "arrowUpLg"
    case arrowUpSm = "arrowUpSm"
    case avatar = "avatar"
    case avatarFilled = "avatarFilled"
    case badge = "badge"
    case badgeFilled = "badgeFilled"
    case barChart = "barChart"
    case batches = "batches"
    case batteryFull = "batteryFull"
    case batteryHalf = "batteryHalf"
    case batteryLow = "batteryLow"
    case bluetooth = "bluetooth"
    case book = "book"
    case building = "building"
    case calendar = "calendar"
    case camera = "camera"
    case cameraFilled = "cameraFilled"
    case category = "category"
    case chat = "chat"
    case checkCircle = "checkCircle"
    case checkbox = "checkbox"
    case checkboxChecked = "checkboxChecked"
    case checkboxIndeterminate = "checkboxIndeterminate"
    case checkmark = "checkmark"
    case chevronDownLg = "chevronDownLg"
    case chevronDownMd = "chevronDownMd"
    case chevronDownUp = "chevronDownUp"
    case chevronLeftLg = "chevronLeftLg"
    case chevronLeftMd = "chevronLeftMd"
    case chevronRightLg = "chevronRightLg"
    case chevronRightMd = "chevronRightMd"
    case chevronUpDown = "chevronUpDown"
    case chevronUpLg = "chevronUpLg"
    case chevronUpMd = "chevronUpMd"
    case clock = "clock"
    case closeBold = "closeBold"
    case collapseLg = "collapseLg"
    case collapseSm = "collapseSm"
    case comment = "comment"
    case compass = "compass"
    case compose = "compose"
    case copy = "copy"
    case creditCard = "creditCard"
    case dotsHorizontal = "dotsHorizontal"
    case dotsVertical = "dotsVertical"
    case download = "download"
    case edit = "edit"
    case email = "email"
    case error = "error"
    case expandLg = "expandLg"
    case expandMd = "expandMd"
    case expandSm = "expandSm"
    case flag = "flag"
    case flask = "flask"
    case folder = "folder"
    case folderOpen = "folderOpen"
    case function = "function"
    case globe = "globe"
    case go = "go"
    case goFilled = "goFilled"
    case gptPlaceholder = "gptPlaceholder"
    case group = "group"
    case groupFilled = "groupFilled"
    case headphones = "headphones"
    case history = "history"
    case image = "image"
    case info = "info"
    case keyAmpersand = "keyAmpersand"
    case keyArrowDown = "keyArrowDown"
    case keyArrowLeft = "keyArrowLeft"
    case keyArrowRight = "keyArrowRight"
    case keyArrowUp = "keyArrowUp"
    case keyAsterisk = "keyAsterisk"
    case keyAt = "keyAt"
    case keyBackslash = "keyBackslash"
    case keyBackspace = "keyBackspace"
    case keyBacktick = "keyBacktick"
    case keyBraceLeft = "keyBraceLeft"
    case keyBraceRight = "keyBraceRight"
    case keyBracketLeft = "keyBracketLeft"
    case keyBracketRight = "keyBracketRight"
    case keyCapsLock = "keyCapsLock"
    case keyCaret = "keyCaret"
    case keyColon = "keyColon"
    case keyComma = "keyComma"
    case keyCommand = "keyCommand"
    case keyControl = "keyControl"
    case keyDelete = "keyDelete"
    case keyDollar = "keyDollar"
    case keyDoubleQuote = "keyDoubleQuote"
    case keyDown = "keyDown"
    case keyEnd = "keyEnd"
    case keyEnter = "keyEnter"
    case keyEquals = "keyEquals"
    case keyEscape = "keyEscape"
    case keyExclamation = "keyExclamation"
    case keyFn = "keyFn"
    case keyHash = "keyHash"
    case keyHome = "keyHome"
    case keyLeft = "keyLeft"
    case keyLeftAlt = "keyLeftAlt"
    case keyLeftMeta = "keyLeftMeta"
    case keyLeftWindows = "keyLeftWindows"
    case keyMinus = "keyMinus"
    case keyOption = "keyOption"
    case keyPageDown = "keyPageDown"
    case keyPageUp = "keyPageUp"
    case keyParenLeft = "keyParenLeft"
    case keyParenRight = "keyParenRight"
    case keyPercent = "keyPercent"
    case keyPeriod = "keyPeriod"
    case keyPipe = "keyPipe"
    case keyPlus = "keyPlus"
    case keyQuestion = "keyQuestion"
    case keyQuote = "keyQuote"
    case keyReturn = "keyReturn"
    case keyRight = "keyRight"
    case keyRightAlt = "keyRightAlt"
    case keyRightMeta = "keyRightMeta"
    case keyRightWindows = "keyRightWindows"
    case keySemicolon = "keySemicolon"
    case keyShift = "keyShift"
    case keySlash = "keySlash"
    case keySpace = "keySpace"
    case keyTab = "keyTab"
    case keyUnderscore = "keyUnderscore"
    case keyUp = "keyUp"
    case lightBulb = "lightBulb"
    case lightbulbFilled = "lightbulbFilled"
    case link = "link"
    case magnifyingGlassSm = "magnifyingGlassSm"
    case mapPin = "mapPin"
    case members = "members"
    case membersFilled = "membersFilled"
    case menuSidebar = "menuSidebar"
    case messaging = "messaging"
    case mic = "mic"
    case micFilled = "micFilled"
    case micOff = "micOff"
    case moon = "moon"
    case notebook = "notebook"
    case notification = "notification"
    case notificationFilled = "notificationFilled"
    case openAILogo = "openAILogo"
    case `operator` = "operator"
    case paperclip = "paperclip"
    case pause = "pause"
    case pauseCircleFilled = "pauseCircleFilled"
    case phone = "phone"
    case pin = "pin"
    case pinFilled = "pinFilled"
    case play = "play"
    case playCircleFilled = "playCircleFilled"
    case playground = "playground"
    case plus = "plus"
    case plusComposer = "plusComposer"
    case plusFilled = "plusFilled"
    case plusLg = "plusLg"
    case plusSm = "plusSm"
    case pro = "pro"
    case proFilled = "proFilled"
    case profile = "profile"
    case `public` = "public"
    case question = "question"
    case radio = "radio"
    case radioChecked = "radioChecked"
    case redo = "redo"
    case refreshCcw = "refreshCcw"
    case refreshCw = "refreshCw"
    case regenerate = "regenerate"
    case regenerateOff = "regenerateOff"
    case regenerateStar = "regenerateStar"
    case relax = "relax"
    case reply = "reply"
    case robotHead = "robotHead"
    case robotHeadSad = "robotHeadSad"
    case sad = "sad"
    case search = "search"
    case settings = "settings"
    case share = "share"
    case shield = "shield"
    case shieldChecked = "shieldChecked"
    case shieldError = "shieldError"
    case shieldWarning = "shieldWarning"
    case shuffle = "shuffle"
    case sidebar = "sidebar"
    case sidebarMenuMobile = "sidebarMenuMobile"
    case sleep = "sleep"
    case smile = "smile"
    case snorkle = "snorkle"
    case soundOff = "soundOff"
    case soundOn = "soundOn"
    case speechToText = "speechToText"
    case stack = "stack"
    case star = "star"
    case starFilled = "starFilled"
    case status = "status"
    case stopCircleFilled = "stopCircleFilled"
    case storage = "storage"
    case stuffTools = "stuffTools"
    case suitcase = "suitcase"
    case suitcaseFilled = "suitcaseFilled"
    case sun = "sun"
    case telescope = "telescope"
    case terminal = "terminal"
    case terminalLg = "terminalLg"
    case textToSpeech = "textToSpeech"
    case thumbDown = "thumbDown"
    case thumbDownFilled = "thumbDownFilled"
    case thumbUp = "thumbUp"
    case thumbUpFilled = "thumbUpFilled"
    case toggleOff = "toggleOff"
    case toggleOn = "toggleOn"
    case trash = "trash"
    case unarchive = "unarchive"
    case undo = "undo"
    case unpin = "unpin"
    case upgrade = "upgrade"
    case upload = "upload"
    case uploadTray = "uploadTray"
    case user = "user"
    case userAdd = "userAdd"
    case userLock = "userLock"
    case video = "video"
    case videoFilled = "videoFilled"
    case warning = "warning"
    case wifi = "wifi"
    case writing = "writing"
    case x = "x"
    case xXs = "xXs"

    /// Stable identifier for use in lists.
    public var id: String { rawValue }
}

/// SVG path data for a ChatGPT icon.
public struct ChatGPTIconData {
    /// SVG path strings for the icon.
    public let paths: [String]
    /// Whether the paths use even-odd fill rules.
    public let usesEvenOddFill: Bool

    /// Creates icon path data.
    /// - Parameters:
    ///   - paths: SVG path strings for the icon.
    ///   - usesEvenOddFill: Whether to use even-odd fill.
    public init(paths: [String], usesEvenOddFill: Bool) {
        self.paths = paths
        self.usesEvenOddFill = usesEvenOddFill
    }
}

/// Renders a ChatGPT icon using vector or path assets.
public struct ChatGPTIconView: View {
    /// Icon to render.
    public let icon: ChatGPTIcon
    /// Render size.
    public let size: CGSize
    /// Icon color.
    public let color: Color

    /// Creates an icon view with a square size.
    /// - Parameters:
    ///   - icon: Icon to render.
    ///   - size: Square size in points.
    ///   - color: Icon color.
    public init(_ icon: ChatGPTIcon, size: CGFloat = 24, color: Color = FColor.iconSecondary) {
        self.icon = icon
        self.size = CGSize(width: size, height: size)
        self.color = color
    }

    /// Creates an icon view with an explicit size.
    /// - Parameters:
    ///   - icon: Icon to render.
    ///   - size: Size in points.
    ///   - color: Icon color.
    public init(_ icon: ChatGPTIcon, size: CGSize, color: Color = FColor.iconSecondary) {
        self.icon = icon
        self.size = size
        self.color = color
    }

    /// The content and behavior of this view.
    public var body: some View {
        let vector = ChatGPTIconVectorAssets.data[icon]
        let data = ChatGPTIconAssets.data[icon]
        ZStack {
            if let vector {
                ChatGPTIconVectorView(vector: vector, size: size, color: color)
            } else if let data, !data.paths.isEmpty {
                ForEach(Array(data.paths.enumerated()), id: \.offset) { _, pathString in
                    SVGPathShape(pathString: pathString)
                        .fill(color, style: FillStyle(eoFill: data.usesEvenOddFill, antialiased: true))
                }
            } else {
                Image(systemName: "questionmark")
                    .font(.system(size: min(size.width, size.height) * 0.6, weight: .semibold))
                    .foregroundStyle(color)
            }
        }
        .frame(width: size.width, height: size.height)
        .accessibilityLabel(Text(icon.rawValue))
    }
}

/// Standard size tokens for ChatGPT icons.
public enum ChatGPTIconSize {
    public static let xs: CGFloat = 12
    public static let sm: CGFloat = 16
    public static let md: CGFloat = 20
    public static let lg: CGFloat = 24
    public static let key: CGFloat = 32
    public static let toggle: CGSize = CGSize(width: 44, height: 24)
}

struct SVGPathShape: Shape {
    let pathString: String

    func path(in rect: CGRect) -> Path {
        let path = SVGPathParser.parse(pathString)
        let scaleX = rect.width / 24.0
        let scaleY = rect.height / 24.0
        let scaled = path.applying(CGAffineTransform(scaleX: scaleX, y: scaleY))
        return scaled.applying(CGAffineTransform(translationX: rect.minX, y: rect.minY))
    }
}

enum SVGPathParser {
    static func parse(_ d: String) -> Path {
        var path = Path()
        let tokens = SVGPathTokenizer.tokenize(d)
        var index = 0
        var currentCommand: Character = " "
        var currentPoint = CGPoint.zero
        var startPoint = CGPoint.zero

        func nextNumber() -> CGFloat? {
            guard index < tokens.count else { return nil }
            if case let .number(value) = tokens[index] {
                index += 1
                return value
            }
            return nil
        }

        while index < tokens.count {
            switch tokens[index] {
            case let .command(cmd):
                currentCommand = cmd
                index += 1
                if currentCommand == "Z" {
                    path.closeSubpath()
                    currentPoint = startPoint
                }
            case .number:
                break
            }

            switch currentCommand {
            case "M":
                guard let x = nextNumber(), let y = nextNumber() else { break }
                currentPoint = CGPoint(x: x, y: y)
                startPoint = currentPoint
                path.move(to: currentPoint)
                currentCommand = "L"
            case "L":
                guard let x = nextNumber(), let y = nextNumber() else { break }
                currentPoint = CGPoint(x: x, y: y)
                path.addLine(to: currentPoint)
            case "H":
                guard let x = nextNumber() else { break }
                currentPoint = CGPoint(x: x, y: currentPoint.y)
                path.addLine(to: currentPoint)
            case "V":
                guard let y = nextNumber() else { break }
                currentPoint = CGPoint(x: currentPoint.x, y: y)
                path.addLine(to: currentPoint)
            case "C":
                guard
                    let x1 = nextNumber(), let y1 = nextNumber(),
                    let x2 = nextNumber(), let y2 = nextNumber(),
                    let x = nextNumber(), let y = nextNumber()
                else { break }
                let control1 = CGPoint(x: x1, y: y1)
                let control2 = CGPoint(x: x2, y: y2)
                let end = CGPoint(x: x, y: y)
                path.addCurve(to: end, control1: control1, control2: control2)
                currentPoint = end
            case "Z":
                path.closeSubpath()
                currentPoint = startPoint
            default:
                index += 1
            }
        }

        return path
    }
}

enum SVGPathTokenizer {
    enum Token {
        case command(Character)
        case number(CGFloat)
    }

    static func tokenize(_ d: String) -> [Token] {
        var tokens: [Token] = []
        var numberBuffer = ""
        var lastChar: Character? = nil

        func flushNumber() {
            guard !numberBuffer.isEmpty, let value = Double(numberBuffer) else {
                numberBuffer = ""
                return
            }
            tokens.append(.number(CGFloat(value)))
            numberBuffer = ""
        }

        for ch in d {
            if ch.isLetter {
                flushNumber()
                tokens.append(.command(ch))
            } else if ch == "-" || ch == "+" {
                if numberBuffer.isEmpty || lastChar == "e" || lastChar == "E" {
                    numberBuffer.append(ch)
                } else {
                    flushNumber()
                    numberBuffer.append(ch)
                }
            } else if ch.isNumber || ch == "." || ch == "e" || ch == "E" {
                numberBuffer.append(ch)
            } else {
                flushNumber()
            }
            lastChar = ch
        }

        flushNumber()
        return tokens
    }
}
