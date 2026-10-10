import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/tile_model.dart';
import '../providers/pages_provider.dart';
import '../providers/connection_provider.dart';
import '../services/socket_service.dart';

class EditorScreen extends StatefulWidget {
  final String pageId;
  final TileModel tile;

  const EditorScreen({Key? key, required this.pageId, required this.tile}) : super(key: key);

  @override
  State<EditorScreen> createState() => _EditorScreenState();
}

class _EditorScreenState extends State<EditorScreen> {
  final TextEditingController _labelController = TextEditingController();
  final TextEditingController _iconController = TextEditingController();
  final TextEditingController _customCmdController = TextEditingController();
  final TextEditingController _searchController = TextEditingController();

  String _selectedAction = '';
  String _selectedType = '';
  Map<String, dynamic> _payload = {};

  Timer? _hintTimer;
  int _currentHintIndex = 0;
  final List<String> _hints = ['Search for YouTube...', 'Search for Chrome...', 'Search for Spotify...', 'Search for Excel...'];
  String get _currentHint => _hints[_currentHintIndex];

  @override
  void initState() {
    super.initState();
    _labelController.text = widget.tile.label;
    _iconController.text = widget.tile.icon;
    _selectedAction = widget.tile.action ?? '';
    _selectedType = widget.tile.type;
    _payload = widget.tile.payload;
    if (_selectedAction == 'custom-macro') {
      _customCmdController.text = _payload['command'] ?? '';
    }
    
    _hintTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      if (mounted) {
        setState(() {
          _currentHintIndex = (_currentHintIndex + 1) % _hints.length;
        });
      }
    });
  }

  @override
  void dispose() {
    _hintTimer?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  void _saveTile() {
    if (_selectedType == 'custom') {
      _payload = {'command': _customCmdController.text};
      _selectedAction = 'custom-macro';
    }

    final newTile = widget.tile.copyWith(
      label: _labelController.text,
      icon: _iconController.text,
      action: _selectedAction,
      payload: _payload,
    );
    // update type using constructor since copyWith doesn't have it
    final finalTile = TileModel(
      id: newTile.id,
      type: _selectedType,
      label: newTile.label,
      icon: newTile.icon,
      action: newTile.action,
      payload: newTile.payload,
    );
    
    context.read<PagesProvider>().updateTile(widget.pageId, finalTile);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Edit Tile'),
          actions: [
            TextButton(
              onPressed: _saveTile,
              child: const Text('Save', style: TextStyle(color: Colors.white)),
            ),
          ],
          bottom: const TabBar(
            tabs: [Tab(text: 'Controls'), Tab(text: 'Apps')],
          ),
        ),
        body: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Expanded(
                    flex: 1,
                    child: TextField(
                      controller: _iconController,
                      decoration: const InputDecoration(labelText: 'Emoji/Icon'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    flex: 3,
                    child: TextField(
                      controller: _labelController,
                      decoration: const InputDecoration(labelText: 'Label'),
                    ),
                  ),
                ],
              ),
            ),
            if (_selectedType == 'custom')
               Padding(
                 padding: const EdgeInsets.all(16.0),
                 child: TextField(
                   controller: _customCmdController,
                   decoration: const InputDecoration(labelText: 'PowerShell Command'),
                 ),
               ),
            Expanded(
              child: TabBarView(
                children: [
                  _buildControlsGrid(),
                  _buildAppsList(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlsGrid() {
    final controls = [
      {'label': 'Volume Up', 'icon': Icons.volume_up, 'action': 'volume-up'},
      {'label': 'Volume Down', 'icon': Icons.volume_down, 'action': 'volume-down'},
      {'label': 'Mute', 'icon': Icons.volume_off, 'action': 'volume-mute'},
      {'label': 'Play/Pause', 'icon': Icons.play_arrow, 'action': 'media-play-pause'},
      {'label': 'Next Track', 'icon': Icons.skip_next, 'action': 'media-next'},
      {'label': 'Prev Track', 'icon': Icons.skip_previous, 'action': 'media-prev'},
      {'label': 'Brightness Up', 'icon': Icons.brightness_high, 'action': 'brightness-up'},
      {'label': 'Brightness Down', 'icon': Icons.brightness_low, 'action': 'brightness-down'},
      {'label': 'Screenshot', 'icon': Icons.camera_alt, 'action': 'screenshot'},
      {'label': 'Lock Screen', 'icon': Icons.lock, 'action': 'lock-screen'},
      {'label': 'PC Monitor', 'icon': Icons.analytics, 'action': 'system-stats'},
      {'label': 'Custom Macro', 'icon': Icons.terminal, 'action': 'custom-macro'},
    ];

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: controls.length,
      itemBuilder: (context, index) {
        final c = controls[index];
        final isSelected = _selectedAction == c['action'];
        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedAction = c['action'] as String;
              _labelController.text = c['label'] as String;
              _iconController.text = ''; // Clear emoji
              _selectedType = c['action'] == 'custom-macro' ? 'custom' : 'system';
            });
          },
          child: Container(
            decoration: BoxDecoration(
              color: isSelected ? Colors.blue.withOpacity(0.3) : const Color(0xFF252525),
              border: Border.all(color: isSelected ? Colors.blue : Colors.transparent),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(c['icon'] as IconData, size: 28, color: Colors.white),
                const SizedBox(height: 8),
                Text(c['label'] as String, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12)),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAppsList() {
    final conn = context.watch<ConnectionProvider>();
    final apps = conn.appList;

    if (apps.isEmpty) {
      return Center(
        child: ElevatedButton(
          onPressed: () {
            SocketService().getApps();
          },
          child: const Text('Fetch Apps from PC'),
        ),
      );
    }

    final query = _searchController.text.toLowerCase();
    final filteredApps = apps.where((app) {
      final name = (app['name'] ?? '').toLowerCase();
      return name.contains(query);
    }).toList();

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            child: TextField(
              key: ValueKey(_currentHint),
              controller: _searchController,
              onChanged: (_) => setState(() {}),
              decoration: InputDecoration(
                hintText: _currentHint,
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: const Color(0xFF252525),
              ),
            ),
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: filteredApps.length,
            itemBuilder: (context, index) {
              final app = filteredApps[index];
              final targetPath = app['iconPath'] != null && app['iconPath'].toString().isNotEmpty ? app['iconPath'] : (app['path'] ?? '');
              final iconUrl = 'http://${conn.serverIp}:8765/icon?path=${Uri.encodeComponent(targetPath)}';
              
              return ListTile(
                leading: Image.network(
                  iconUrl,
                  width: 32,
                  height: 32,
                  errorBuilder: (context, error, stackTrace) => const Icon(Icons.desktop_windows, color: Colors.blue),
                ),
                title: Text(app['name'] ?? 'Unknown App'),
                subtitle: Text(app['path'] ?? '', style: const TextStyle(fontSize: 10)),
                onTap: () {
                  setState(() {
                    _selectedAction = 'launch-app';
                    _selectedType = 'app';
                    _payload = {'path': app['path'], 'iconPath': app['iconPath']};
                    _labelController.text = app['name'];
                    _iconController.text = ''; // Clear emoji so it uses network icon
                  });
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
