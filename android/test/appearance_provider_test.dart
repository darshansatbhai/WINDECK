import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:windeck/providers/appearance_provider.dart';

void main() {
  test('appearance persists locally and reset restores original defaults', () async {
    SharedPreferences.setMockInitialValues({});
    final appearance = AppearanceProvider();
    await appearance.ready;
    expect(appearance.preset, 'default');
    expect(appearance.columns, 2);
    expect(appearance.tileRadius, 24);

    appearance.selectPreset(AppearanceProvider.presets[2]);
    appearance.setColumns(3);
    appearance.setTileOpacity(0.25);
    appearance.setTileRadius(12);
    appearance.setShowLabels(false);
    await appearance.persisted;

    final restored = AppearanceProvider();
    await restored.ready;
    expect(restored.preset, 'ocean');
    expect(restored.columns, 3);
    expect(restored.tileOpacity, 0.25);
    expect(restored.tileRadius, 12);
    expect(restored.showLabels, false);
    expect(restored.setCustomColors(Colors.black, Colors.white), false);
    expect(restored.preset, 'ocean');
    expect(restored.setCustomColors(const Color(0xFFAA88FF), const Color(0xFF100D1C)), true);
    await restored.persisted;
    restored.reset();
    await restored.persisted;
    final reset = AppearanceProvider();
    await reset.ready;
    expect(reset.preset, 'default');
    expect(reset.accent, const Color(0xFF0078D4));
    expect(reset.columns, 2);
    expect(reset.showLabels, true);
    appearance.dispose();
    restored.dispose();
    reset.dispose();
  });
}
