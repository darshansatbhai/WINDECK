import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/connection_provider.dart';

class ServerStatusBar extends StatelessWidget {
  const ServerStatusBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final conn = context.watch<ConnectionProvider>();

    return Container(
      color: const Color(0xFF252525),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Icon(
            Icons.circle,
            color: conn.isConnected ? const Color(0xFF22C55E) : const Color(0xFFEF4444),
            size: 12,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              conn.pcName.isEmpty ? 'Offline' : conn.pcName,
              style: const TextStyle(fontSize: 12, color: Colors.white),
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Text(
            'CPU: ${conn.cpu}%',
            style: const TextStyle(fontSize: 12, color: Color(0xFF888888)),
          ),
          const SizedBox(width: 16),
          Text(
            'RAM: ${conn.ram}%',
            style: const TextStyle(fontSize: 12, color: Color(0xFF888888)),
          ),
        ],
      ),
    );
  }
}
