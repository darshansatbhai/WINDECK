import 'package:flutter/material.dart';
import '../models/page_model.dart';
import '../models/tile_model.dart';
import '../services/socket_service.dart';
import 'package:uuid/uuid.dart';

class PagesProvider with ChangeNotifier {
  final SocketService _socketService = SocketService();
  final _uuid = const Uuid();

  List<PageModel> _pages = [];
  int _currentPageIndex = 0;

  List<PageModel> get pages => _pages;
  int get currentPageIndex => _currentPageIndex;

  void loadConfig(Map<String, dynamic> config) {
    if (config['pages'] != null) {
      _pages = (config['pages'] as List).map((p) => PageModel.fromJson(p)).toList();
      _sortPages();
      notifyListeners();
    }
  }

  void _sortPages() {
    _pages.sort((a, b) {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0; // maintain relative order otherwise
    });
  }

  void setPageIndex(int index) {
    _currentPageIndex = index;
    notifyListeners();
  }

  void toggleFavorite(String pageId) {
    final index = _pages.indexWhere((p) => p.id == pageId);
    if (index != -1) {
      final p = _pages[index];
      _pages[index] = PageModel(
        id: p.id,
        name: p.name,
        isFavorite: !p.isFavorite,
        tiles: p.tiles,
      );
      _sortPages();
      // Adjust current index to follow the page if it moved
      _currentPageIndex = _pages.indexWhere((p) => p.id == pageId);
      _saveConfig();
      notifyListeners();
    }
  }

  void updateTile(String pageId, TileModel newTile) {
    final pageIndex = _pages.indexWhere((p) => p.id == pageId);
    if (pageIndex != -1) {
      final tileIndex = _pages[pageIndex].tiles.indexWhere((t) => t.id == newTile.id);
      if (tileIndex != -1) {
        _pages[pageIndex].tiles[tileIndex] = newTile;
        _saveConfig();
        notifyListeners();
      }
    }
  }

  void addPage(String name) {
    final newPage = PageModel(
      id: _uuid.v4(),
      name: name,
      tiles: List.generate(12, (i) => TileModel.empty(_uuid.v4())),
    );
    _pages.add(newPage);
    _sortPages();
    _currentPageIndex = _pages.indexOf(newPage);
    _saveConfig();
    notifyListeners();
  }

  void _saveConfig() {
    final config = {'pages': _pages.map((p) => p.toJson()).toList()};
    _socketService.saveConfig(config);
  }
}
