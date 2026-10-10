import 'package:flutter/material.dart';

class AppColors {
  static const Color bgPrimary    = Color(0xFF0D0D0D);  // Main background
  static const Color bgSecondary  = Color(0xFF1A1A1A);  // Tile background
  static const Color bgTertiary   = Color(0xFF252525);  // Cards, sheets, drawers
  static const Color accent       = Color(0xFF4A9EFF);  // Blue accent
  static const Color accentGreen  = Color(0xFF22C55E);  // Connected indicator
  static const Color accentRed    = Color(0xFFEF4444);  // Disconnected indicator
  static const Color textPrimary  = Color(0xFFFFFFFF);  // Main text
  static const Color textMuted    = Color(0xFF888888);  // Secondary/muted text
  static const Color border       = Color(0xFF333333);  // Tile borders
  static const Color tileTap      = Color(0xFF2A2A2A);  // Tile tap flash target
}

ThemeData buildAppTheme() {
  return ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.bgPrimary,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.accent,
      surface: AppColors.bgSecondary,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.bgPrimary,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary
      ),
    ),
    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: AppColors.bgTertiary,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20))
      ),
    ),
  );
}
