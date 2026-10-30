import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import '../models/page_model.dart';
import '../models/tile_model.dart';

class PagesProvider extends ChangeNotifier {
  List<PageModel> _pages = [];
  int _currentPageIndex = 0;
  void Function(List<dynamic>)? _syncCallback;
  Future<void> _pendingSave = Future.value();
  bool _disposed = false;
  bool _receivedExternalBeforeLoad = false;

  List<PageModel> get pages => _pages;
  int get currentPageIndex => _currentPageIndex;
  Future<void> get persisted => _pendingSave;
  PageModel get currentPage => _pages.isNotEmpty ? _pages[_currentPageIndex] : PageModel.createDefault('Main');

  PagesProvider() {
    _loadPages();
  }

  Future<void> _loadPages() async {
    final prefs = await SharedPreferences.getInstance();
    if (_disposed || _receivedExternalBeforeLoad) return;
    final String? pagesJson = prefs.getString('windeck_pages');
    
    try {
      if (pagesJson != null) {
        final List decoded = jsonDecode(pagesJson);
        _pages = decoded.map((p) => PageModel.fromJson(Map<String, dynamic>.from(p))).toList();
      } else {
        _pages = [PageModel.createDefault('Home')];
        _savePages(sync: false);
      }
    } catch (e) {
      _pages = [PageModel.createDefault('Home')];
      _savePages(sync: false);
    }
    if (!_disposed) notifyListeners();
  }

  void setSyncCallback(void Function(List<dynamic>)? callback) => _syncCallback = callback;

  void _savePages({bool sync = true}) {
    final snapshot = jsonEncode(_pages.map((p) => p.toJson()).toList());
    _pendingSave = _pendingSave.then((_) async {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('windeck_pages', snapshot);
      if (sync && !_disposed) _syncCallback?.call(jsonDecode(snapshot) as List<dynamic>);
    });
  }

  void setPageIndex(int index) {
    if (index >= 0 && index < _pages.length) {
      _currentPageIndex = index;
      notifyListeners();
    }
  }

  void handleAutoSwitch(String activeExe, String activeTitle) {
    if (activeExe.isEmpty && activeTitle.isEmpty) return;
    for (int i = 0; i < _pages.length; i++) {
      final page = _pages[i];
      bool exeMatch = page.linkedExe != null &&
          page.linkedExe!.isNotEmpty &&
          activeExe.contains(page.linkedExe!.toLowerCase());
      bool titleMatch = page.titlePattern != null &&
          page.titlePattern!.isNotEmpty &&
          activeTitle.toLowerCase().contains(page.titlePattern!.toLowerCase());
      if (exeMatch || titleMatch) {
        if (_currentPageIndex != i) {
          _currentPageIndex = i;
          notifyListeners();
        }
        return;
      }
    }
  }

  void renamePage(int index, String newName) {
    if (index >= 0 && index < _pages.length) {
      final name = newName.trim();
      if (name.isEmpty) return;
      _pages[index].name = name;
      _savePages();
      notifyListeners();
    }
  }

  void deletePage(int index) {
    if (index >= 0 && index < _pages.length && _pages.length > 1) {
      _pages.removeAt(index);
      if (_pages.isEmpty) {
        _pages.add(PageModel.createDefault('Home'));
        _currentPageIndex = 0;
      } else {
        _currentPageIndex = _currentPageIndex.clamp(0, _pages.length - 1);
      }
      _savePages();
      notifyListeners();
    }
  }

  void reorderPage(int oldIndex, int newIndex) {
    if (oldIndex < 0 || oldIndex >= _pages.length || newIndex < 0 || newIndex > _pages.length) return;
    final selectedId = _pages[_currentPageIndex].id;
    if (newIndex > oldIndex) newIndex--;
    final page = _pages.removeAt(oldIndex);
    _pages.insert(newIndex, page);
    _currentPageIndex = _pages.indexWhere((page) => page.id == selectedId).clamp(0, _pages.length - 1);
    _savePages();
    notifyListeners();
  }

  void addPage(String name, {String template = 'blank'}) {
    final page = PageModel.createDefault(name.trim().isEmpty ? 'New Page' : name.trim());
    const presets = <String, List<(String, String)>>{
      'media': [
        ('Play/Pause', 'media-play-pause'), ('Previous', 'media-prev'), ('Next', 'media-next'),
        ('Volume Down', 'volume-down'), ('Volume Up', 'volume-up'), ('Mute', 'mute'),
      ],
      'productivity': [
        ('Copy', 'copy'), ('Paste', 'paste'), ('Undo', 'undo'),
        ('Screenshot', 'screenshot'), ('Show Desktop', 'show-desktop'),
      ],
    };
    final actions = presets[template] ?? const <(String, String)>[];
    for (var i = 0; i < actions.length; i++) {
      page.tiles[i] = TileModel(id: const Uuid().v4(), title: actions[i].$1, type: 'system', iconType: 'icon', iconValue: actions[i].$2, payload: actions[i].$2);
    }
    _pages.add(page);
    _currentPageIndex = _pages.length - 1;
    _savePages();
    notifyListeners();
  }

  void duplicatePage(int index) {
    if (index < 0 || index >= _pages.length) return;
    final original = _pages[index];
    final copy = PageModel(
      id: const Uuid().v4(),
      name: '${original.name} Copy',
      type: 'custom',
      tiles: original.tiles.map((tile) => TileModel.fromJson({...tile.toJson(), 'id': const Uuid().v4()})).toList(),
    );
    _pages.insert(index + 1, copy);
    _currentPageIndex = index + 1;
    _savePages();
    notifyListeners();
  }

  bool updateTile(String pageId, TileModel tile) {
    final pageIndex = _pages.indexWhere((page) => page.id == pageId);
    if (pageIndex < 0) return false;
    final tileIndex = _pages[pageIndex].tiles.indexWhere((item) => item.id == tile.id);
    if (tileIndex < 0) return false;
    _pages[pageIndex].tiles[tileIndex] = tile;
    _savePages();
    notifyListeners();
    return true;
  }

  void syncFromServer(List<dynamic> serverPages) {
    if (serverPages.isEmpty) return;
    try {
      _receivedExternalBeforeLoad = true;
      _pages = serverPages.map((p) => PageModel.fromJson(Map<String, dynamic>.from(p))).toList();
      if (_currentPageIndex >= _pages.length) _currentPageIndex = 0;
      _savePages(sync: false);
      notifyListeners();
    } catch (e) {
      debugPrint('Error parsing layout from server: $e');
    }
  }

  @override
  void dispose() {
    _disposed = true;
    _syncCallback = null;
    super.dispose();
  }
}
