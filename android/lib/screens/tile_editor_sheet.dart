import 'package:flutter/material.dart';
import '../models/tile_model.dart';

class TileEditorSheet extends StatefulWidget {
  final TileModel tile;
  final bool Function(TileModel) onSave;
  const TileEditorSheet({super.key, required this.tile, required this.onSave});

  @override
  State<TileEditorSheet> createState() => _TileEditorSheetState();
}

class _TileEditorSheetState extends State<TileEditorSheet> {
  static const actions = <String, String>{
    'volume-up': 'Volume Up', 'volume-down': 'Volume Down', 'mute': 'Mute',
    'media-play-pause': 'Play/Pause', 'media-prev': 'Previous', 'media-next': 'Next',
    'brightness-up': 'Brightness Up', 'brightness-down': 'Brightness Down',
    'screenshot': 'Screenshot', 'show-desktop': 'Show Desktop',
    'copy': 'Copy', 'paste': 'Paste', 'undo': 'Undo', 'lock': 'Lock PC',
  };
  late final TextEditingController _title;
  late final TextEditingController _url;
  late String _kind;
  late String _action;
  String? _error;

  @override
  void initState() {
    super.initState();
    _title = TextEditingController(text: widget.tile.title);
    _url = TextEditingController(text: widget.tile.type == 'url' ? widget.tile.payload : '');
    _kind = widget.tile.type == 'empty' ? 'system' : widget.tile.type;
    _action = widget.tile.type == 'system' && widget.tile.payload.isNotEmpty ? widget.tile.payload : 'volume-up';
  }

  @override
  void dispose() {
    _title.dispose();
    _url.dispose();
    super.dispose();
  }

  void _save() {
    final title = _title.text.trim();
    if (title.isEmpty) {
      setState(() => _error = 'Enter a shortcut name.');
      return;
    }
    var payload = widget.tile.payload;
    var icon = widget.tile.iconValue;
    var iconType = widget.tile.iconType;
    if (_kind == 'system') {
      payload = _action;
      if (widget.tile.type == 'empty' || _action != widget.tile.payload) {
        icon = _action;
        iconType = 'icon';
      }
    } else if (_kind == 'url') {
      var value = _url.text.trim();
      if (!value.contains('://')) value = 'https://$value';
      final uri = Uri.tryParse(value);
      if (uri == null || !['http', 'https'].contains(uri.scheme) || uri.host.isEmpty) {
        setState(() => _error = 'Enter a valid http or https website address.');
        return;
      }
      payload = value;
      icon = 'globe';
      iconType = 'icon';
    }
    if (!widget.onSave(TileModel(id: widget.tile.id, title: title, type: _kind, iconType: iconType, iconValue: icon, payload: payload))) {
      setState(() => _error = 'Shortcut unavailable or disconnected. Reconnect and try again.');
      return;
    }
    Navigator.pop(context);
  }

  Future<void> _remove() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remove shortcut?'),
        content: const Text('This removes the shortcut from this page.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Remove')),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    if (!widget.onSave(TileModel(id: widget.tile.id))) {
      setState(() => _error = 'Shortcut unavailable or disconnected. Reconnect and try again.');
      return;
    }
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final isNew = widget.tile.type == 'empty';
    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: Container(
        decoration: const BoxDecoration(color: Color(0xFF161622), borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(isNew ? 'Add Shortcut' : 'Edit Shortcut', style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            if (isNew) DropdownButtonFormField<String>(
              initialValue: _kind,
              decoration: const InputDecoration(labelText: 'Shortcut type'),
              items: const [DropdownMenuItem(value: 'system', child: Text('PC Control')), DropdownMenuItem(value: 'url', child: Text('Website'))],
              onChanged: (value) => setState(() { _kind = value ?? 'system'; _error = null; }),
            ),
            TextField(controller: _title, decoration: const InputDecoration(labelText: 'Name'), maxLength: 80),
            if (_kind == 'system') DropdownButtonFormField<String>(
              initialValue: _action,
              decoration: const InputDecoration(labelText: 'Action'),
              items: [
                if (!actions.containsKey(_action)) DropdownMenuItem(value: _action, child: const Text('Keep Current Action')),
                ...actions.entries.map((entry) => DropdownMenuItem(value: entry.key, child: Text(entry.value))),
              ],
              onChanged: (value) => setState(() { _action = value ?? _action; if (_title.text.trim().isEmpty) _title.text = actions[_action]!; }),
            ),
            if (_kind == 'url') TextField(controller: _url, decoration: const InputDecoration(labelText: 'Website URL'), keyboardType: TextInputType.url),
            if (!isNew && _kind != 'system' && _kind != 'url')
              const Text('The existing action and icon will stay unchanged.', style: TextStyle(color: Colors.white54, fontSize: 12)),
            if (_error != null) Padding(padding: const EdgeInsets.only(top: 12), child: Text(_error!, style: const TextStyle(color: Colors.redAccent))),
            const SizedBox(height: 20),
            Row(children: [
              if (!isNew) TextButton(onPressed: _remove, child: const Text('Remove', style: TextStyle(color: Colors.redAccent))),
              const Spacer(),
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
              const SizedBox(width: 8),
              ElevatedButton(onPressed: _save, child: const Text('Save')),
            ]),
          ]),
        ),
      ),
    );
  }
}
