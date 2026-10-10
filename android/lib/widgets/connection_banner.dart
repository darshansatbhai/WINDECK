import 'package:flutter/material.dart' hide ConnectionState;
import 'package:provider/provider.dart';
import '../providers/connection_provider.dart';

class ConnectionBanner extends StatelessWidget {
  const ConnectionBanner({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final conn = context.watch<ConnectionProvider>();
    
    if (conn.state == ConnectionState.connected) {
      return Container(
        color: const Color(0xFF22C55E).withOpacity(0.1),
        padding: const EdgeInsets.all(8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.circle, color: Color(0xFF22C55E), size: 12),
            const SizedBox(width: 8),
            Text('Connected to ${conn.pcName}', style: const TextStyle(color: Color(0xFF22C55E))),
          ],
        ),
      );
    } else if (conn.state == ConnectionState.reconnecting) {
      return Container(
        color: Colors.orange.withOpacity(0.1),
        padding: const EdgeInsets.all(8),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.circle, color: Colors.orange, size: 12),
            SizedBox(width: 8),
            Text('Reconnecting...', style: TextStyle(color: Colors.orange)),
          ],
        ),
      );
    } else {
      return GestureDetector(
        onTap: () {
          // Could retry connecting here using saved IP if desired
          Navigator.pushReplacementNamed(context, '/discovery');
        },
        child: Container(
          color: const Color(0xFFEF4444).withOpacity(0.1),
          padding: const EdgeInsets.all(8),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.circle, color: Color(0xFFEF4444), size: 12),
              SizedBox(width: 8),
              Text('Disconnected — tap to reconnect', style: TextStyle(color: Color(0xFFEF4444))),
            ],
          ),
        ),
      );
    }
  }
}
