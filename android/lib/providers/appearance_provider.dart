import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppearancePreset {
  final String id;
  final String label;
  final Color accent;
  final Color background;

  const AppearancePreset(this.id, this.label, this.accent, this.background);
}

class AppearanceProvider extends ChangeNotifier {
  static const presets = <AppearancePreset>[
    AppearancePreset('default', 'WinDeck', Color(0xFF0078D4), Color(0xFF0C0C14)),
    AppearancePreset('violet', 'Violet', Color(0xFFA78BFA), Color(0xFF120D1D)),
    AppearancePreset('ocean', 'Ocean', Color(0xFF38BDF8), Color(0xFF07151D)),
    AppearancePreset('forest', 'Forest', Color(0xFF4ADE80), Color(0xFF081710)),
    AppearancePreset('sunset', 'Sunset', Color(0xFFFB923C), Color(0xFF1A100D)),
  ];
  static const _storageKey = 'windeck_appearance_v1';

  String _preset = 'default';
  Color _accent = presets.first.accent;
  Color _background = presets.first.background;
  int _columns = 2;
  double _tileOpacity = 0.10;
  double _tileRadius = 24;
  bool _showLabels = true;
  bool _changedBeforeLoad = false;
  bool _disposed = false;
  Future<void> _pendingSave = Future.value();
  late final Future<void> ready;

  AppearanceProvider() {
    ready = _load();
  }

  String get preset => _preset;
  Color get accent => _accent;
  Color get background => _background;
  Color get homeBackground => _preset == 'default' ? const Color(0xFF0A0A12) : _background;
  int get columns => _columns;
  double get tileOpacity => _tileOpacity;
  double get tileRadius => _tileRadius;
  bool get showLabels => _showLabels;
  Future<void> get persisted => _pendingSave;

  static bool isReadableBackground(Color color) => color.computeLuminance() <= 0.12;
  static bool isVisibleAccent(Color color) => color.computeLuminance() >= 0.08;

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    if (_changedBeforeLoad || _disposed) return;
    try {
      final raw = prefs.getString(_storageKey);
      if (raw == null) return;
      final data = jsonDecode(raw) as Map<String, dynamic>;
      final background = Color((data['background'] as int?) ?? presets.first.background.toARGB32());
      final accent = Color((data['accent'] as int?) ?? presets.first.accent.toARGB32());
      if (isReadableBackground(background) && isVisibleAccent(accent)) {
        _background = background;
        _accent = accent;
        _preset = data['preset'] is String ? data['preset'] as String : 'custom';
      }
      _columns = ((data['columns'] as int?) ?? 2).clamp(2, 4);
      _tileOpacity = ((data['tileOpacity'] as num?)?.toDouble() ?? 0.10).clamp(0.05, 0.30);
      _tileRadius = ((data['tileRadius'] as num?)?.toDouble() ?? 24).clamp(4, 32);
      _showLabels = (data['showLabels'] as bool?) ?? true;
      if (!_disposed) notifyListeners();
    } catch (_) {
      // Corrupt preferences fall back to the original WinDeck appearance.
    }
  }

  void _update() {
    _changedBeforeLoad = true;
    notifyListeners();
    final snapshot = jsonEncode({
      'preset': _preset,
      'accent': _accent.toARGB32(),
      'background': _background.toARGB32(),
      'columns': _columns,
      'tileOpacity': _tileOpacity,
      'tileRadius': _tileRadius,
      'showLabels': _showLabels,
    });
    _pendingSave = _pendingSave.then((_) async {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, snapshot);
    });
  }

  void selectPreset(AppearancePreset value) {
    _preset = value.id;
    _accent = value.accent;
    _background = value.background;
    _update();
  }

  bool setCustomColors(Color accent, Color background) {
    if (!isReadableBackground(background) || !isVisibleAccent(accent)) return false;
    _preset = 'custom';
    _accent = accent;
    _background = background;
    _update();
    return true;
  }

  void setColumns(int value) { _columns = value.clamp(2, 4); _update(); }
  void setTileOpacity(double value) { _tileOpacity = value.clamp(0.05, 0.30); _update(); }
  void setTileRadius(double value) { _tileRadius = value.clamp(4, 32); _update(); }
  void setShowLabels(bool value) { _showLabels = value; _update(); }

  void reset() {
    _preset = 'default';
    _accent = presets.first.accent;
    _background = presets.first.background;
    _columns = 2;
    _tileOpacity = 0.10;
    _tileRadius = 24;
    _showLabels = true;
    _update();
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
