import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/pages_provider.dart';
import '../widgets/tile_grid.dart';
import '../widgets/page_tab_bar.dart';
import '../widgets/connection_banner.dart';
import '../widgets/server_status_bar.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WinDeck'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.pushNamed(context, '/settings'),
          ),
        ],
      ),
      body: Column(
        children: [
          const ConnectionBanner(),
          const PageTabBar(),
          Expanded(
            child: Consumer<PagesProvider>(
              builder: (context, pagesProvider, _) {
                if (pagesProvider.pages.isEmpty) {
                  return const Center(child: Text('No Pages configured'));
                }
                return PageView.builder(
                  itemCount: pagesProvider.pages.length,
                  onPageChanged: (index) => pagesProvider.setPageIndex(index),
                  itemBuilder: (context, index) {
                    return TileGrid(pageId: pagesProvider.pages[index].id);
                  },
                );
              },
            ),
          ),
          const ServerStatusBar(),
        ],
      ),
    );
  }
}
