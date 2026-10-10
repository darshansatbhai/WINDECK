import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/pages_provider.dart';
import 'tile_widget.dart';

class TileGrid extends StatelessWidget {
  final String pageId;

  const TileGrid({Key? key, required this.pageId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<PagesProvider>(
      builder: (context, pagesProvider, _) {
        final page = pagesProvider.pages.firstWhere((p) => p.id == pageId);

        return GridView.builder(
          padding: const EdgeInsets.all(12),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: MediaQuery.of(context).orientation == Orientation.landscape ? 4 : 3,
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            childAspectRatio: 1.0,
          ),
          itemCount: page.tiles.length,
          itemBuilder: (context, index) {
            return TileWidget(tile: page.tiles[index], pageId: pageId);
          },
        );
      },
    );
  }
}
