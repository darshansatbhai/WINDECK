import 'tile_model.dart';

class PageModel {
  final String id;
  final String name;
  final bool isFavorite;
  final List<TileModel> tiles; // Always 12 tiles (4×3 grid)

  PageModel({ required this.id, required this.name, this.isFavorite = false, required this.tiles });

  factory PageModel.fromJson(Map<String, dynamic> json) => PageModel(
    id: json['id'],
    name: json['name'],
    isFavorite: json['isFavorite'] ?? false,
    tiles: (json['tiles'] as List).map((t) => TileModel.fromJson(t)).toList(),
  );

  Map<String, dynamic> toJson() => {
    'id': id, 'name': name, 'isFavorite': isFavorite, 'tiles': tiles.map((t) => t.toJson()).toList(),
  };
}
