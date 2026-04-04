export type ThemeMode = "dark" | "light";

export const darkTheme = {
  // Page
  bg: "#0F0F0F",
  headerBg: "rgba(15,15,15,0.85)",
  headerBorder: "rgba(255,255,255,0.06)",
  footerText: "#334155",

  // Card
  cardBg: "#111111",
  cardBorder: "rgba(255,255,255,0.07)",
  cardShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
  cardHeaderBorder: "rgba(255,255,255,0.05)",

  // Surfaces
  surfaceCard: "#161616",
  surfaceElevated: "#1C1C1C",

  // Input
  inputBg: "#111111",
  inputBorder: "rgba(255,255,255,0.1)",
  inputColor: "#FFFFFF",
  inputPlaceholder: "#475569",
  labelColor: "#94A3B8",

  // Text
  textPrimary: "#FFFFFF",
  textBody: "#E2E8F0",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textDimmed: "#475569",
  textFaint: "#334155",

  // Borders
  borderSubtle: "rgba(255,255,255,0.07)",
  borderDefault: "rgba(255,255,255,0.1)",
  borderFaint: "rgba(255,255,255,0.05)",
  borderVeryFaint: "rgba(255,255,255,0.03)",

  // Step indicator
  stepInactiveBg: "rgba(255,255,255,0.04)",
  stepInactiveBorder: "rgba(255,255,255,0.1)",
  stepActiveText: "#2563EB",
  stepInactiveText: "rgba(255,255,255,0.25)",
  stepLabelActive: "#FFFFFF",
  stepLabelCompleted: "#64748B",
  stepLabelInactive: "rgba(255,255,255,0.2)",
  connectorBg: "rgba(255,255,255,0.07)",

  // Calendar
  calendarBg: "#161616",
  calendarBorder: "rgba(255,255,255,0.07)",
  calendarNavBorder: "rgba(255,255,255,0.06)",
  calendarNavBg: "rgba(255,255,255,0.04)",
  calendarNavArrow: "#94A3B8",
  calendarHeaderBg: "rgba(255,255,255,0.02)",
  calendarHeaderBorder: "rgba(255,255,255,0.05)",
  calendarHeaderText: "#334155",
  calendarCellBorder: "rgba(255,255,255,0.03)",
  calendarMonthText: "#FFFFFF",
  calendarLegendBg: "rgba(255,255,255,0.01)",
  calendarLegendBorder: "rgba(255,255,255,0.05)",
  calendarLegendText: "#475569",
  calendarFullDot: "rgba(255,255,255,0.15)",
  calendarPastText: "rgba(255,255,255,0.12)",
  calendarFullText: "rgba(255,255,255,0.2)",
  calendarAvailText: "#E2E8F0",
  calendarHoverBg: "rgba(37,99,235,0.12)",
  calendarShimmerBg: "rgba(255,255,255,0.04)",

  // Time slots
  slotAvailBg: "rgba(37,99,235,0.1)",
  slotAvailColor: "#60A5FA",
  slotAvailBorder: "rgba(37,99,235,0.25)",
  slotUnavailBg: "rgba(255,255,255,0.02)",
  slotUnavailColor: "rgba(255,255,255,0.15)",
  slotUnavailBorder: "rgba(255,255,255,0.05)",

  // Location cards
  locationCardBg: "#161616",
  locationCardBorder: "rgba(255,255,255,0.07)",
  locationIllustrationBg: "rgba(255,255,255,0.03)",
  locationIllustrationBorder: "rgba(255,255,255,0.05)",
  locationArrow: "rgba(255,255,255,0.2)",

  // Doctor cards
  specialtyBg: "rgba(255,255,255,0.06)",
  specialtyColor: "#64748B",
  specialtyBorder: "rgba(255,255,255,0.08)",
  selectedSpecialtyBg: "rgba(37,99,235,0.25)",
  selectedSpecialtyColor: "#93C5FD",
  selectedSpecialtyBorder: "rgba(37,99,235,0.4)",
  selectedDivider: "rgba(37,99,235,0.2)",
  starEmpty: "rgba(255,255,255,0.15)",

  // Patient summary
  summaryBg: "rgba(37,99,235,0.08)",
  summaryBorder: "rgba(37,99,235,0.2)",
  summaryLabelColor: "#60A5FA",
  summaryValueColor: "#E2E8F0",
  summaryTimeColor: "#60A5FA",

  // Back button
  backColor: "#475569",
  backHover: "#94A3B8",

  // Toggle
  toggleBg: "rgba(255,255,255,0.07)",
  toggleBorder: "rgba(255,255,255,0.1)",
  toggleIconColor: "#94A3B8",
};

export type ThemeTokens = typeof darkTheme;

export const lightTheme: ThemeTokens = {
  // Page
  bg: "#F8FAFC",
  headerBg: "rgba(248,250,252,0.9)",
  headerBorder: "rgba(0,0,0,0.08)",
  footerText: "#94A3B8",

  // Card
  cardBg: "#FFFFFF",
  cardBorder: "rgba(0,0,0,0.08)",
  cardShadow: "0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
  cardHeaderBorder: "rgba(0,0,0,0.06)",

  // Surfaces
  surfaceCard: "#F1F5F9",
  surfaceElevated: "#E2E8F0",

  // Input
  inputBg: "#F8FAFC",
  inputBorder: "rgba(0,0,0,0.12)",
  inputColor: "#0F172A",
  inputPlaceholder: "#94A3B8",
  labelColor: "#475569",

  // Text
  textPrimary: "#0F172A",
  textBody: "#1E293B",
  textSecondary: "#475569",
  textMuted: "#64748B",
  textDimmed: "#94A3B8",
  textFaint: "#CBD5E1",

  // Borders
  borderSubtle: "rgba(0,0,0,0.08)",
  borderDefault: "rgba(0,0,0,0.12)",
  borderFaint: "rgba(0,0,0,0.06)",
  borderVeryFaint: "rgba(0,0,0,0.04)",

  // Step indicator
  stepInactiveBg: "rgba(0,0,0,0.04)",
  stepInactiveBorder: "rgba(0,0,0,0.12)",
  stepActiveText: "#2563EB",
  stepInactiveText: "rgba(0,0,0,0.3)",
  stepLabelActive: "#0F172A",
  stepLabelCompleted: "#94A3B8",
  stepLabelInactive: "rgba(0,0,0,0.3)",
  connectorBg: "rgba(0,0,0,0.08)",

  // Calendar
  calendarBg: "#F8FAFC",
  calendarBorder: "rgba(0,0,0,0.08)",
  calendarNavBorder: "rgba(0,0,0,0.06)",
  calendarNavBg: "rgba(0,0,0,0.04)",
  calendarNavArrow: "#64748B",
  calendarHeaderBg: "rgba(0,0,0,0.02)",
  calendarHeaderBorder: "rgba(0,0,0,0.06)",
  calendarHeaderText: "#94A3B8",
  calendarCellBorder: "rgba(0,0,0,0.04)",
  calendarMonthText: "#0F172A",
  calendarLegendBg: "rgba(0,0,0,0.01)",
  calendarLegendBorder: "rgba(0,0,0,0.06)",
  calendarLegendText: "#64748B",
  calendarFullDot: "rgba(0,0,0,0.15)",
  calendarPastText: "rgba(0,0,0,0.2)",
  calendarFullText: "rgba(0,0,0,0.25)",
  calendarAvailText: "#1E293B",
  calendarHoverBg: "rgba(37,99,235,0.08)",
  calendarShimmerBg: "rgba(0,0,0,0.05)",

  // Time slots
  slotAvailBg: "rgba(37,99,235,0.08)",
  slotAvailColor: "#2563EB",
  slotAvailBorder: "rgba(37,99,235,0.3)",
  slotUnavailBg: "rgba(0,0,0,0.03)",
  slotUnavailColor: "rgba(0,0,0,0.2)",
  slotUnavailBorder: "rgba(0,0,0,0.06)",

  // Location cards
  locationCardBg: "#F8FAFC",
  locationCardBorder: "rgba(0,0,0,0.08)",
  locationIllustrationBg: "rgba(37,99,235,0.04)",
  locationIllustrationBorder: "rgba(0,0,0,0.06)",
  locationArrow: "rgba(0,0,0,0.25)",

  // Doctor cards
  specialtyBg: "rgba(0,0,0,0.05)",
  specialtyColor: "#64748B",
  specialtyBorder: "rgba(0,0,0,0.08)",
  selectedSpecialtyBg: "rgba(37,99,235,0.1)",
  selectedSpecialtyColor: "#2563EB",
  selectedSpecialtyBorder: "rgba(37,99,235,0.3)",
  selectedDivider: "rgba(37,99,235,0.15)",
  starEmpty: "rgba(0,0,0,0.12)",

  // Patient summary
  summaryBg: "rgba(37,99,235,0.06)",
  summaryBorder: "rgba(37,99,235,0.2)",
  summaryLabelColor: "#2563EB",
  summaryValueColor: "#1E293B",
  summaryTimeColor: "#2563EB",

  // Back button
  backColor: "#94A3B8",
  backHover: "#64748B",

  // Toggle
  toggleBg: "rgba(0,0,0,0.05)",
  toggleBorder: "rgba(0,0,0,0.1)",
  toggleIconColor: "#64748B",
};
