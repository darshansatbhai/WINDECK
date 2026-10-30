import 'package:flutter_test/flutter_test.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:windeck/main.dart';
import 'package:windeck/providers/connection_provider.dart';
import 'package:windeck/providers/pages_provider.dart';
import 'package:windeck/providers/appearance_provider.dart';

void main() {
  testWidgets('startup and settings do not show notification prompts', (tester) async {
    SharedPreferences.setMockInitialValues({});
    PackageInfo.setMockInitialValues(
      appName: 'WinDeck',
      packageName: 'com.example.windeck',
      version: '2.4.0',
      buildNumber: '1',
      buildSignature: '',
    );

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => ConnectionProvider(navigatorKey)),
          ChangeNotifierProvider(create: (_) => PagesProvider()),
          ChangeNotifierProvider(create: (_) => AppearanceProvider()),
        ],
        child: const WinDeckApp(),
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(seconds: 1));
    expect(find.text('Stay Connected'), findsNothing);
    expect(find.text('Enable Notifications'), findsNothing);

    navigatorKey.currentState!.pushNamed('/settings');
    await tester.pump();
    await tester.pump(const Duration(seconds: 1));
    expect(find.text('Notifications'), findsNothing);
    expect(find.text('Enable Notifications'), findsNothing);

    await tester.ensureVisible(find.text('Themes & Customization'));
    await tester.tap(find.text('Themes & Customization'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('THEMES'), findsOneWidget);
    await tester.tap(find.text('Ocean'));
    await tester.pump();
    expect(tester.element(find.text('Ocean')).read<AppearanceProvider>().preset, 'ocean');
  });
}
