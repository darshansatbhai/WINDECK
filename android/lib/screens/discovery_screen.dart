import 'package:flutter/material.dart' hide ConnectionState;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/udp_discovery_service.dart';
import '../providers/connection_provider.dart';

class DiscoveryScreen extends StatefulWidget {
  const DiscoveryScreen({Key? key}) : super(key: key);

  @override
  State<DiscoveryScreen> createState() => _DiscoveryScreenState();
}

class _DiscoveryScreenState extends State<DiscoveryScreen> {
  final UdpDiscoveryService _udpService = UdpDiscoveryService();
  DiscoveredServer? _foundServer;
  bool _isSearching = true;
  final TextEditingController _ipController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _startSearch();
  }

  void _startSearch() {
    setState(() {
      _isSearching = true;
      _foundServer = null;
    });

    _udpService.startListening((server) {
      if (mounted && _foundServer == null) {
        setState(() {
          _foundServer = server;
          _isSearching = false;
        });
        _udpService.stop();
      }
    });

    Future.delayed(const Duration(seconds: 10), () {
      if (mounted && _foundServer == null) {
        setState(() {
          _isSearching = false;
        });
        _udpService.stop();
      }
    });
  }

  Future<void> _connect(String ip, String pcName) async {
    final prefs = await SharedPreferences.getInstance();
    
    // Check if token already exists for this IP
    final token = prefs.getString('auth_token_$ip');
    
    if (!mounted) return;
    await prefs.setString('saved_ip', ip);
    final conn = context.read<ConnectionProvider>();
    conn.setPcName(pcName);
    
    // Connect directly without OTP
    final success = await conn.connect(ip);
    
    if (success && mounted) {
      Navigator.pushReplacementNamed(context, '/home');
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Connection failed. Are you on the same WiFi?'))
      );
    }
  }

  @override
  void dispose() {
    _udpService.stop();
    _ipController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (_isSearching) ...[
                  const CircularProgressIndicator(),
                  const SizedBox(height: 24),
                  const Text('Searching for WinDeck Server...', style: TextStyle(color: Colors.grey)),
                ] else if (_foundServer != null) ...[
                  Card(
                    color: const Color(0xFF252525),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Text('Found: ${_foundServer!.pcName}', 
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          Text(_foundServer!.ip, style: const TextStyle(color: Colors.grey)),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF22C55E)),
                            onPressed: () => _connect(_foundServer!.ip, _foundServer!.pcName),
                            child: const Text('Connect'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ] else ...[
                  const Text('No servers found. Please enter IP manually.', 
                    style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _ipController,
                    decoration: const InputDecoration(
                      labelText: 'Server IP Address',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      if (_ipController.text.isNotEmpty) {
                        _connect(_ipController.text, 'Manual PC');
                      }
                    },
                    child: const Text('Connect Manually'),
                  ),
                ],
                const SizedBox(height: 32),
                TextButton(
                  onPressed: _startSearch,
                  child: const Text('Rescan'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
