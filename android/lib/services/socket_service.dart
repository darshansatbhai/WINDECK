import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? _socket;
  String? _serverIp;
  Timer? _reconnectTimer;

  bool get isConnected => _socket?.connected ?? false;
  String? get serverIp => _serverIp;

  void connect(String ip, {
    String? otp,
    String? token,
    Function(Map<String, dynamic>)? onConnected,
    Function(Map<String, dynamic>)? onStats,
    Function(List<dynamic>)? onAppList,
    Function(Map<String, dynamic>)? onConfig,
    Function(Map<String, dynamic>)? onStatus,
    Function(Map<String, dynamic>)? onActionResult,
    Function? onDisconnect,
    Function(dynamic)? onConnectError,
  }) {
    _serverIp = ip;
    _socket?.dispose();
    _reconnectTimer?.cancel();

    _socket = IO.io(
      'http://$ip:8765',
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .setAuth({'otp': otp, 'token': token})
        .disableAutoConnect()
        .build(),
    );

    _socket!.onConnectError((err) {
      onConnectError?.call(err);
      _socket?.disconnect();
    });

    _socket!.onConnect((_) {
      _reconnectTimer?.cancel();
    });
    
    dynamic getPayload(dynamic data) {
      if (data is List && data.isNotEmpty) return data[0];
      return data;
    }

    _socket!.on('connected', (data) {
      final payload = getPayload(data);
      if (payload is Map) onConnected?.call(Map<String, dynamic>.from(payload));
    });
    
    _socket!.on('stats', (data) {
      final payload = getPayload(data);
      if (payload is Map) onStats?.call(Map<String, dynamic>.from(payload));
    });
    
    _socket!.on('app-list', (data) {
      final payload = getPayload(data);
      if (payload is List) onAppList?.call(payload);
    });
    
    _socket!.on('config', (data) {
      final payload = getPayload(data);
      if (payload is Map) onConfig?.call(Map<String, dynamic>.from(payload));
    });
    
    _socket!.on('status', (data) {
      final payload = getPayload(data);
      if (payload is Map) onStatus?.call(Map<String, dynamic>.from(payload));
    });
    
    _socket!.on('action-result', (data) {
      final payload = getPayload(data);
      if (payload is Map) onActionResult?.call(Map<String, dynamic>.from(payload));
    });

    _socket!.onDisconnect((_) {
      onDisconnect?.call();
      // Auto-reconnect logic: wait 3 seconds then attempt reconnect
      _reconnectTimer?.cancel();
      _reconnectTimer = Timer(const Duration(seconds: 3), () {
        if (_serverIp != null && !isConnected) {
          _socket?.connect();
        }
      });
    });

    _socket!.connect();
  }

  void emit(String event, [dynamic data]) => _socket?.emit(event, data);

  void getApps()   => emit('get-apps');
  void getConfig() => emit('get-config');
  void getStatus() => emit('get-status');
  void saveConfig(Map<String, dynamic> config) => emit('save-config', config);

  void pressAction(String action, [Map<String, dynamic>? payload]) {
    if (payload != null && payload.isNotEmpty) {
      emit(action, payload);
    } else {
      emit(action);
    }
  }

  void disconnect() {
    _reconnectTimer?.cancel();
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _serverIp = null;
  }
}
