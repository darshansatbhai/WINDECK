import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/connection_provider.dart';
import '../services/socket_service.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final conn = context.watch<ConnectionProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Connection Status: ${conn.isConnected ? "Connected" : "Disconnected"}'),
            const SizedBox(height: 8),
            Text('PC Name: ${conn.pcName}'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                if (conn.isConnected) {
                  conn.disconnect();
                } else {
                  Navigator.pushReplacementNamed(context, '/discovery');
                }
              },
              child: Text(conn.isConnected ? 'Disconnect' : 'Connect to Server'),
            ),
            const Spacer(),
            const Center(child: Text('WinDeck v1.0.0', style: TextStyle(color: Colors.grey))),
          ],
        ),
      ),
    );
  }
}
