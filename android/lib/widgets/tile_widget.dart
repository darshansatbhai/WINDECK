import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../models/tile_model.dart';
import '../services/socket_service.dart';
import '../screens/editor_screen.dart';
import '../providers/pages_provider.dart';
import '../providers/connection_provider.dart';
import 'package:audioplayers/audioplayers.dart';

class TileWidget extends StatefulWidget {
  final TileModel tile;
  final String pageId;

  const TileWidget({Key? key, required this.tile, required this.pageId}) : super(key: key);

  @override
  State<TileWidget> createState() => _TileWidgetState();
}

class _TileWidgetState extends State<TileWidget> with SingleTickerProviderStateMixin {
  static final AudioPlayer _audioPlayer = AudioPlayer();
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isFlashing = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 150));
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.9).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTap() async {
    HapticFeedback.lightImpact();
    
    try {
      if (_audioPlayer.state == PlayerState.playing) {
        await _audioPlayer.stop();
      }
      await _audioPlayer.play(AssetSource('sounds/tap.wav'));
    } catch (e) {
      debugPrint('Error playing sound: $e');
    }

    if (widget.tile.type == 'empty') {
      _openEditor();
      return;
    }

    setState(() => _isFlashing = true);
    await _controller.forward();
    
    if (widget.tile.action != null && widget.tile.action != 'system-stats') {
      SocketService().pressAction(widget.tile.action!, widget.tile.payload);
    }

    await _controller.reverse();
    setState(() => _isFlashing = false);
  }

  void _openEditor() {
    Navigator.popUntil(context, (route) => route.isFirst || route.settings.name == '/'); // close bottom sheet if open
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => SizedBox(
        height: MediaQuery.of(context).size.height * 0.85,
        child: EditorScreen(pageId: widget.pageId, tile: widget.tile),
      ),
    );
  }

  void _removeTile() {
    HapticFeedback.mediumImpact();
    Navigator.pop(context); // close bottom sheet
    Provider.of<PagesProvider>(context, listen: false).updateTile(
      widget.pageId, 
      TileModel(id: widget.tile.id, type: 'empty', label: '', icon: '', payload: {})
    );
  }

  void _showContextMenu() {
    HapticFeedback.mediumImpact();
    
    bool isVolume = widget.tile.action?.contains('volume') ?? false;
    bool isBrightness = widget.tile.action?.contains('brightness') ?? false;
    bool showSlider = isVolume || isBrightness;
    
    double _sliderValue = 50; // Default, will act relatively
    
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1E1E),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(widget.tile.label.isEmpty ? 'Shortcut Options' : widget.tile.label, 
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  const SizedBox(height: 24),
                  
                  if (showSlider) ...[
                    Row(
                      children: [
                        Icon(isVolume ? Icons.volume_down : Icons.brightness_low, color: Colors.white54),
                        Expanded(
                          child: Slider(
                            value: _sliderValue,
                            min: 0,
                            max: 100,
                            activeColor: Colors.blue,
                            onChanged: (val) {
                              setModalState(() => _sliderValue = val);
                              if (isVolume) SocketService().emit('set-volume', val.toInt());
                              if (isBrightness) SocketService().emit('set-brightness', val.toInt());
                              HapticFeedback.selectionClick();
                            },
                          ),
                        ),
                        Icon(isVolume ? Icons.volume_up : Icons.brightness_high, color: Colors.white54),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],

                  ListTile(
                    leading: const Icon(Icons.edit, color: Colors.blue),
                    title: const Text('Edit Shortcut', style: TextStyle(color: Colors.white)),
                    onTap: _openEditor,
                  ),
                  ListTile(
                    leading: const Icon(Icons.delete_outline, color: Colors.redAccent),
                    title: const Text('Remove Shortcut', style: TextStyle(color: Colors.redAccent)),
                    onTap: _removeTile,
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            );
          }
        );
      }
    );
  }

  IconData _getSystemIcon(String action) {
    switch (action) {
      case 'volume-up': return Icons.volume_up;
      case 'volume-down': return Icons.volume_down;
      case 'volume-mute': return Icons.volume_off;
      case 'media-play-pause': return Icons.play_arrow;
      case 'media-next': return Icons.skip_next;
      case 'media-prev': return Icons.skip_previous;
      case 'brightness-up': return Icons.brightness_high;
      case 'brightness-down': return Icons.brightness_low;
      case 'screenshot': return Icons.camera_alt;
      case 'lock-screen': return Icons.lock;
      case 'custom-macro': return Icons.terminal;
      default: return Icons.widgets;
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      onLongPress: widget.tile.type != 'empty' ? _showContextMenu : _openEditor,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) => Transform.scale(
          scale: _scaleAnimation.value,
          child: Container(
            decoration: BoxDecoration(
              color: _isFlashing ? const Color(0xFF2A2A2A) : const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF333333)),
            ),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              transitionBuilder: (Widget child, Animation<double> animation) {
                return ScaleTransition(scale: animation, child: FadeTransition(opacity: animation, child: child));
              },
              child: widget.tile.type == 'empty'
                  ? const Icon(Icons.add, color: Color(0xFF333333), key: ValueKey('empty'))
                  : Column(
                      key: ValueKey(widget.tile.id),
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (widget.tile.action == 'system-stats') ...[
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.memory, size: 16, color: Colors.blue),
                              const SizedBox(width: 4),
                              Text('${context.watch<ConnectionProvider>().cpu}%', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                            ]
                          ),
                          const SizedBox(height: 4),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.storage, size: 16, color: Colors.green),
                              const SizedBox(width: 4),
                              Text('${context.watch<ConnectionProvider>().ram}%', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                            ]
                          ),
                        ] else if (widget.tile.type == 'app' && widget.tile.icon.isEmpty) ...[
                          Image.network(
                            'http://${SocketService().serverIp ?? '127.0.0.1'}:8765/icon?path=${Uri.encodeComponent(widget.tile.payload['iconPath'] ?? widget.tile.payload['path'] ?? '')}',
                            width: 36,
                            height: 36,
                            errorBuilder: (context, error, stackTrace) => const Icon(Icons.desktop_windows, color: Colors.blue, size: 36),
                          )
                        ] else if (widget.tile.type == 'system' || (widget.tile.type == 'custom' && widget.tile.icon.isEmpty)) ...[
                          Icon(_getSystemIcon(widget.tile.action ?? ''), size: 36, color: Colors.white)
                        ] else ...[
                          Text(widget.tile.icon, style: const TextStyle(fontSize: 36)),
                        ],
                        if (widget.tile.action != 'system-stats') ...[
                          const SizedBox(height: 8),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 4.0),
                            child: Text(
                              widget.tile.label,
                              style: const TextStyle(fontSize: 12, color: Colors.white),
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ],
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
