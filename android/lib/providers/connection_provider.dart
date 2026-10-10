import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/socket_service.dart';

enum ConnectionState { disconnected, connecting, connected, reconnecting }

class ConnectionProvider with ChangeNotifier {
  final SocketService _socketService = SocketService();
  
  ConnectionState _state = ConnectionState.disconnected;
  String? _pcName;
  String? _authToken;
  int _cpu = 0;
  int _ram = 0;
  List<dynamic> _appList = [];

  ConnectionState get state => _state;
  String get pcName => _pcName ?? 'PC';
  int get cpu => _cpu;
  int get ram => _ram;
  List<dynamic> get appList => _appList;
  bool get isConnected => _state == ConnectionState.connected;
  String? get serverIp => _socketService.serverIp;

  Future<bool> connect(String ip, {String? otp}) async {
    final prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString('auth_token_$ip');

    _state = ConnectionState.connecting;
    notifyListeners();

    final completer = Completer<bool>();

    _socketService.connect(
      ip,
      otp: otp,
      token: _authToken,
      onConnectError: (err) {
        _state = ConnectionState.disconnected;
        notifyListeners();
        if (!completer.isCompleted) completer.complete(false);
      },
      onConnected: (data) {
        if (data['token'] != null) {
          saveToken(ip, data['token']);
        }
        _state = ConnectionState.connected;
        notifyListeners();
        _socketService.getApps();
        _socketService.getConfig();
        if (!completer.isCompleted) completer.complete(true);
      },
      onStats: (stats) {
        _cpu = stats['cpu']?.round() ?? 0;
        _ram = stats['ram']?.round() ?? 0;
        notifyListeners();
      },
      onAppList: (apps) {
        _appList = apps;
        notifyListeners();
      },
      onDisconnect: () {
        _state = ConnectionState.disconnected;
        notifyListeners();
      },
      onConfig: (config) {
        // Broadcast via event or handle locally
      },
    );

    // Timeout after 3 seconds
    Future.delayed(const Duration(seconds: 3)).then((_) {
      if (!completer.isCompleted) {
        _state = ConnectionState.disconnected;
        notifyListeners();
        completer.complete(false);
      }
    });

    return completer.future;
  }

  void setPcName(String name) {
    _pcName = name;
    notifyListeners();
  }

  void saveToken(String ip, String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token_$ip', token);
    _authToken = token;
  }

  void disconnect() {
    _socketService.disconnect();
    _state = ConnectionState.disconnected;
    notifyListeners();
  }
}
