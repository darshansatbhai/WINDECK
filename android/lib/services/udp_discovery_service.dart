import 'dart:io';
import 'dart:convert';

class DiscoveredServer {
  final String pcName;
  final String ip;
  final int port;
  DiscoveredServer({ required this.pcName, required this.ip, required this.port });
}

class UdpDiscoveryService {
  RawDatagramSocket? _socket;

  // Note for Android 10+:
  // If UDP discovery doesn't work on Android 10+, you must acquire a WifiManager MulticastLock
  // via a Flutter method channel or manually enter the IP.
  Future<void> startListening(Function(DiscoveredServer) onFound) async {
    try {
      _socket = await RawDatagramSocket.bind(InternetAddress.anyIPv4, 55799);
      _socket!.broadcastEnabled = true;

      _socket!.listen((event) {
        if (event == RawSocketEvent.read) {
          final datagram = _socket!.receive();
          if (datagram != null) {
            try {
              final data = json.decode(utf8.decode(datagram.data));
              if (data['service'] == 'windeck') {
                onFound(DiscoveredServer(
                  pcName: data['pcName'],
                  ip: data['ip'],
                  port: data['port'],
                ));
              }
            } catch (_) {}
          }
        }
      });
    } catch (e) {
      print('UDP Discovery error: $e');
    }
  }

  void stop() => _socket?.close();
}
