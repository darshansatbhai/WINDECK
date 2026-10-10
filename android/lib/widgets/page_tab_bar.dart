import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/pages_provider.dart';

class PageTabBar extends StatelessWidget {
  const PageTabBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<PagesProvider>(
      builder: (context, pagesProvider, _) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            children: [
              ...pagesProvider.pages.asMap().entries.map((entry) {
                final index = entry.key;
                final page = entry.value;
                final isActive = index == pagesProvider.currentPageIndex;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ChoiceChip(
                        label: Text(page.name),
                        selected: isActive,
                        selectedColor: const Color(0xFF4A9EFF),
                        backgroundColor: const Color(0xFF252525),
                        labelStyle: TextStyle(
                          color: isActive ? Colors.white : const Color(0xFF888888),
                        ),
                        onSelected: (_) => pagesProvider.setPageIndex(index),
                      ),
                      const SizedBox(width: 4),
                      IconButton(
                        icon: Icon(
                          page.isFavorite ? Icons.star : Icons.star_border,
                          color: page.isFavorite ? Colors.yellow : const Color(0xFF888888),
                          size: 20,
                        ),
                        onPressed: () => pagesProvider.toggleFavorite(page.id),
                        constraints: const BoxConstraints(),
                        padding: const EdgeInsets.all(4),
                      ),
                    ],
                  ),
                );
              }).toList(),
              ActionChip(
                label: const Icon(Icons.add, size: 18),
                backgroundColor: const Color(0xFF252525),
                onPressed: () {
                  _showAddPageDialog(context, pagesProvider);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showAddPageDialog(BuildContext context, PagesProvider provider) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('New Page'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: 'Page Name'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              if (controller.text.isNotEmpty) {
                provider.addPage(controller.text);
              }
              Navigator.pop(context);
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }
}
